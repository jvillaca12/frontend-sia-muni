import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useUserProfile } from 'hooks/hooks-user/useProfileUser';
import { useEffect, useMemo, useState } from 'react';
import {
  faUser,
  faEnvelope,
  faUserTag,
  faUserCircle,
  faLock,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { capitalizeWords } from 'helpers/capitalizar-palabra';
import { useDataOficina } from 'hooks/hooks-ubicaciones/useOficinaData';
import { UsuarioDTO } from 'data/interfaces/UserDTO';
import UserService from 'data/services/UserService';
import ReusableModalDouble from 'components/common/ReusableDialogDouble';
import ReusableModal from 'components/common/ResuableDialog';
import { useGlobalState } from 'components/context/GlobalState';

const PageUserProfile: React.FC = () => {
  // obteniendo el hook del usuario actual (perfil)
  const { user, loading } = useUserProfile();
  // estado para el mensaje de Resusable modal para mostrar errores y confirmaciones
  const [modalMessage, setModalMessage] = useState('');
  // estado para abrir el modal de Reusable
  const [openReusable, setOpenReusable] = useState(false);
  // estado para abrir el modal de confirmacion de actualizar la incidencia
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  // hook para obtener la data de las oficinas
  const { optionsOficina, fetchDataOficina } = useDataOficina();
  // estado para ver si la contraseña es visible o no
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  // estado para manejar el estado global
  const {  dispatch } = useGlobalState();
  // Estado para forzar la actualización
  const [updateKey, setUpdateKey] = useState(0); 
  // estado para la data del usuario a actualizar
  const [formData, setUserData] = useState<UsuarioDTO>({
    // inicializando la data del usuario a actualizar
    idUsuario: 0,
    nombre: '',
    apellidos: '',
    userName: '',
    password: '',
    correo: '',
    oficinaSubgerenciaId: 0,
    oficina: '',
    rol: '',
    rolId: 0,
    estado: user?.estado
  });

  const memorizedOptionsOficina = useMemo(() => optionsOficina, [optionsOficina]); 

  // Cuando se monta el componente, se obtiene la data del usuario y de las oficinas por una unica vez
  useEffect(() => {
    const fetchData = async () => {
      await fetchDataOficina();
    };
    fetchData();
  }, [fetchDataOficina]);

  // funcion para ver si la password es de visible o no
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Esto es para que los campos del formulario se llenen con la data del usuario actual
  useEffect(() => {
    if (user) {
      setUserData((prevFormData) => ({
        ...prevFormData,
        nombre: capitalizeWords(user?.nombre || ''),
        apellidos: capitalizeWords(user?.apellidos || ''),
        userName: user?.userName || '',
        password: user?.password || '',
        correo: user?.correo || '',
        rolId: user?.rolId || 0,
        oficina: user?.oficina?.toLowerCase() || '',
        oficinaSubgerenciaId: user?.oficinaSubgerenciaId || 0,
      }));
    }
  }, [user]);

  // Obtener la data inicial del usuario en un objeto para comparar si se ha actualizado algo
  const initialUserData = useMemo(
    () => ({
      nombre: capitalizeWords(user?.nombre || ''),
      apellidos: capitalizeWords(user?.apellidos || ''),
      userName: user?.userName || '',
      password: user?.password || '',
      correo: user?.correo || '',
      rolId: user?.rolId || 0,
      oficina: user?.oficina?.toLowerCase() || '',
      oficinaSubgerenciaId: user?.oficinaSubgerenciaId || 0,
    }),
    [user],
  );

  // cerrar el modal de Reusable
  const handleModalClose = () => {
    setOpenReusable(false);
  };

  // para cambiar la oficina del usuario
  const handleOficinaChange = (e: SelectChangeEvent<string>) => {
    const selectedOficina = memorizedOptionsOficina.find((option) => option.nombreOficina === e.target.value);
    if (selectedOficina) {
      setUserData((prevFormData) => ({
        ...prevFormData,
        oficina: selectedOficina.nombreOficina,
        oficinaSubgerenciaId: selectedOficina.id,
      }));
    }
  };

  // para establecer el valor de cada input HTML del formulario, hacia la data de la incidencia
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // para actualizar el usuario
  const handleActualizarUsuario = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.userName || !formData.rolId || !formData.oficinaSubgerenciaId) {
      setOpenReusable(true);
      setModalMessage('Hay campos faltantes');
      return;
    }

    // abrir el modal de confirmacion de actualizar la incidencia
    setOpenConfirmModal(!openReusable);
  };

  // despues de las validaciones actualizar el usuario
  const handleConfirmUpdate = async () => {
    setOpenConfirmModal(false);
    // obtener la data del usuario a actualizar
    try {
      const userDataUpdate = {
        nombre: formData.nombre || 'Vacio',
        apellidos: formData.apellidos || 'Vacio',
        userName: formData.userName,
        password: formData.password,
        correo: formData.correo || 'Vacio',
        rolId: user?.rolId,
        oficinaSubgerenciaId: formData.oficinaSubgerenciaId,
      };

      // si la data del usuario a actualizar es igual a la data inicial, no se actualiza nada
      if (JSON.stringify(userDataUpdate) === JSON.stringify(initialUserData)) {
        setOpenReusable(true);
        setModalMessage('No ha actualizado nada');
        return;
      }

      // si la password a actualizar contiene espacios en blanco, no se actualiza
      if (formData.password !== undefined && formData.password.trim() === '' && formData.password.length > 0) {
        setOpenReusable(true);
        setModalMessage('La contraseña no puede contener espacios en blanco');
        setUserData((prevFormData) => ({
          ...prevFormData,
          password: '',
        }));
        return;
      }

      // obteniendo la respuesta de la actualizacion del usuario
      const response = await UserService.updateUser(user?.idUsuario || 0, userDataUpdate);
 
      // si la respuesta es exitosa, se actualiza el usuario en la base de datos
      if (response.statusCode === 201) {
        // Si el tokenJWT viene en la respuesta, se actualiza el token en el sessionStorage
        if (response.tokenJWT) {
          // Actualizar token en el sessionStorage
          sessionStorage.setItem('tokenJWT', response.tokenJWT);
          // Actualizar token en el estado global
          dispatch({
            type: 'SET_USER',
            payload: {
              user: response.user,
              tokenJWT: response.tokenJWT,
            },
          });
        }
        // Show success message
        setOpenReusable(true);
        setModalMessage(`Usuario ${capitalizeWords(formData.nombre || '')} actualizado con éxito`);
        setUpdateKey((prevKey) => prevKey + 1);
        setOpenConfirmModal(false);
        setUserData((prevFormData) => ({
          ...prevFormData,
          password: '',
        }));
      } else {
        setOpenReusable(true);
        setModalMessage(`A sucedido un error al actualizar el usuario ${response.data}`);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
  }, [updateKey]);

    // Mostrar un spinner o mensaje de carga
    if (loading) {
      return (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

  if (!user) {
    return <CircularProgress />;
  }

  return (
    <Box key={updateKey}
      sx={{
        bgcolor: 'background.default',
        width: '100%',
        height: '100vh',
        padding: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <FontAwesomeIcon icon={faUserCircle} size="7x" />
        <Typography variant="h4" color="text.primary" mt={5}>
          Perfil de Usuario
        </Typography>
      </Box>
      <form 
        onSubmit={handleActualizarUsuario}
        style={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Stack spacing={2} sx={{ width: '100%', maxWidth: 600 }}>
          <TextField
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            InputProps={{
              startAdornment: <FontAwesomeIcon icon={faUser} style={{ padding: 10 }} />,
            }}
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            label="Apellidos"
            name="apellidos"
            value={formData.apellidos}
            InputProps={{
              startAdornment: <FontAwesomeIcon icon={faUser} style={{ padding: 10 }} />,
            }}
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            label="Username"
            name="userName"
            value={formData.userName}
            InputProps={{
              startAdornment: <FontAwesomeIcon icon={faUserTag} style={{ padding: 10 }} />,
            }}
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            label="Correo"
            name="correo"
            value={formData.correo}
            InputProps={{
              startAdornment: <FontAwesomeIcon icon={faEnvelope} style={{ padding: 10 }} />,
            }}
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            label="Rol"
            defaultValue={user.rol === 'SOPORTE_TECNICO' ? 'SOPORTE TÉCNICO' : user.rol}
            disabled
            InputProps={{
              startAdornment: <FontAwesomeIcon icon={faUserTag} style={{ padding: 10 }} />,
            }}
            fullWidth
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel>Oficina</InputLabel>
            <Select
              value={formData.oficina}
              onChange={handleOficinaChange}
              name="Oficina"
              label="Oficina"
            >
              {memorizedOptionsOficina.map((option) => (
                <MenuItem key={option.id} value={option.nombreOficina}>
                  {capitalizeWords(option.nombreOficina || '')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box>
            <TextField
              label="Actualizar Contraseña"
              name="password"
              type={isPasswordVisible ? 'text' : 'password'}
              value={formData.password}
              placeholder="Desea actualizar su contraseña"
              InputProps={{
                startAdornment: <FontAwesomeIcon icon={faLock} style={{ padding: 10 }} />,
              }}
              fullWidth
              onChange={handleInputChange}
            />
            <FontAwesomeIcon
              icon={isPasswordVisible ? faEyeSlash : faEye}
              style={{
                position: 'relative',
                right: '10px',
                fontSize: '1.5em',
                cursor: 'pointer',
                top: '-40px',
                left: '90%',
              }}
              onClick={togglePasswordVisibility}
            />
          </Box>
          <Button  sx={{ mt: 4 }} variant="contained" color="primary" type="submit">
            Editar Usuario
          </Button>
          <ReusableModal
            open={openReusable}
            onClose={handleModalClose}
            title="Aviso"
            message={modalMessage}
            confirmText="Cerrar"
          />
          <ReusableModalDouble
            open={openConfirmModal}
            onClose={() => setOpenConfirmModal(false)}
            onClick={handleConfirmUpdate}
            title="Confirmar Actualización"
            message="¿Está seguro de actualizar el perfil de usuario?"
            cancelText="Cancelar"
            confirmText="Actualizar"
          />
        </Stack>
      </form>
    </Box>
  );
};

export default PageUserProfile;