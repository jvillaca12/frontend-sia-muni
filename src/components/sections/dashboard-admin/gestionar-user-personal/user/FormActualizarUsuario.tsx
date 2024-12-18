import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { capitalizeWords } from 'helpers/capitalizar-palabra';
import ReusableModal from 'components/common/ResuableDialog';
import ReusableModalDouble from 'components/common/ReusableDialogDouble';
import { UsuarioDTO } from 'data/interfaces/UserDTO';
import { useDataOficina } from 'hooks/hooks-ubicaciones/useOficinaData';
import UserService from 'data/services/UserService';
import { useDataRolUser } from 'hooks/hooks-user/useRolUser';

// las propiedades del formulario cuando se exporta a otra clase
interface FormActualizarUsuarioProps {
  openUpdateModal: boolean;
  handleClose: () => void;
  row: UsuarioDTO | null;
  idUsuario: number;
  onSuccessRegistro: (message?: string) => void;
}

const FormActualizarUsuario: React.FC<FormActualizarUsuarioProps> = ({
  openUpdateModal,
  handleClose,
  row,
  idUsuario,
  onSuccessRegistro
}) => {
  // hook para obtener la data de las oficinas
  const { optionsOficina, fetchDataOficina } = useDataOficina();
  // hook para obtener la data de rol
  const { optionsRol, fetchDataRol } = useDataRolUser();
  // para establecer el mensaje del modal, para los campos faltantes
  const [modalMessage, setModalMessage] = useState('');
  // para abrir el modal en caso los campos esten vacios
  const [openReusable, setOpenReusable] = useState(false);
  // para abrir el modal de confirmacion de actualizar usuario
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  // const [updateKeyActualizar, setUpdateKeyActualizar] = useState(0);
  // para actualizar el usuario con los datos del formulario
  const [formData, setFormData] = useState<UsuarioDTO>({
    // inicializando la data del usuario a actualizar
    oficinaSubgerenciaId: 0,
    oficina: '',
    estadoText: '',
    estado: false,
    rolId: 0,
    rol: '',
  });
  // espacio en el eje Y en los componentes
  const spaceInputY = 3.5;
  // estado para ver si se ha confirmado la actualizacion del usuario
  const [hasUpdate, setHasUpdated] = useState(false);

  // opciones para el solucionado
  const optionsEstado = [
    { id: 1, value: 'Activo' },
    { id: 2, value: 'Inactivo' },
  ];

  // memorizando las opciones de oficina y rol
  const memoizedOptionsOficina = useMemo(() => optionsOficina, [optionsOficina]);
  const memoizedOptionesRol = useMemo(() => optionsRol, [optionsRol]);

  // Efecto para resetear estados cuando se abre el modal con una nueva fila
  useEffect(() => {
    if (openUpdateModal) {
      setHasUpdated(false);
      setOpenReusable(false);
      setOpenConfirmModal(false);
      setModalMessage('');
    }
  }, [openUpdateModal, idUsuario]);

  // cargando la data una sola vez
  useEffect(() => {
    const fetchData = async () => {
      await fetchDataOficina();
      await fetchDataRol();
    };
    fetchData();
  }, [fetchDataOficina, fetchDataRol]);

  // para establecer los valores obtenidos de la fila de la tabla en el formulario
  useEffect(() => {
    if (row && openUpdateModal && !hasUpdate) {
      setFormData({
        oficinaSubgerenciaId: row.oficinaSubgerenciaId,
        oficina: row.oficina?.toLowerCase(),
        estadoText: row.estadoText,
        estado: row.estadoText === 'Activo',
        rolId: row.rolId,
        rol: row.rol,
      });
    }
  }, [row, openUpdateModal, hasUpdate]);

  // para cambiar la oficina del usuario
  const handleOficinaChange = (e: SelectChangeEvent<string>) => {
    const selectedOficina = memoizedOptionsOficina.find(
      (option) => option.nombreOficina === e.target.value,
    );
    if (selectedOficina) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        oficina: selectedOficina.nombreOficina,
        oficinaSubgerenciaId: selectedOficina.id,
      }));
    }
  };

  // esto es para manejar el valor del rol del usuario, para obtener el nombre y id
  const handleRolChange = (e: SelectChangeEvent<string>) => {
    const selectedRol = memoizedOptionesRol.find((option) => option.nombre === e.target.value);
    if (selectedRol) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        rol: selectedRol.nombre === 'SOPORTE_TECNICO' ? 'SOPORTE TÉCNICO' : selectedRol.nombre,
        rolId: selectedRol.id,
      }));
    }
  };

  // esto es para manejar el estado si esta Activo o Inactivo el usuario
  const handleEstadoChange = (e: SelectChangeEvent<string>) => {
    const estadoActual = optionsEstado.find((option) => option.value === e.target.value);
    if (estadoActual) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        estadoText: estadoActual.value,
        estado: estadoActual.value === 'Activo',
      }));
    }
  };

  // para crear un usuario
  const handleActualizarUsuario = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData?.oficinaSubgerenciaId || !formData?.rolId) {
      setOpenReusable(true);
      setModalMessage('Hay campos faltantes');
      return;
    }
    // abrir el modal de confirmacion de actualizar el usuario
    setOpenConfirmModal(true);
  };

  const updateConfirmUsuario = async () => {
    try {
      // actualizar el objeto de datos a enviar
      const usuarioData = {
        oficinaSubgerenciaId: Number(formData.oficinaSubgerenciaId),
        rolId: Number(formData.rolId),
        estado: formData.estado,
      };
      // llamar al metodo para actualizar el usuario
      const response = await UserService.updateUser(idUsuario, usuarioData);

      if (response.statusCode !== 201) {
        setOpenReusable(true);
        setModalMessage(response.message);
        return;
      }
      setHasUpdated(true);
      onSuccessRegistro?.(`Usuario actualizado con éxito`);
      setOpenConfirmModal(false);
    } catch (error) {
      setOpenReusable(true);
      setModalMessage(error.message);
    }
  };

  const handleModalClose = () => {
    setOpenReusable(false);
    if (hasUpdate) {
      handleClose();
      // Resetear todos los estados
      setHasUpdated(false);
      setFormData({
        oficinaSubgerenciaId: 0,
        oficina: '',
        rol: '',
        estado: false,
        rolId: 0,
        estadoText: '',
      });
      setModalMessage('');
    }
  };

  const finalStyleInput = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'background.paper',
      transition: 'none',
      '& fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.23)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.23)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'primary.main',
      },
    },
  };

  const finalStyleSelect = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'background.paper',
      transition: 'none',
    },
  };

  return (
    <Modal open={openUpdateModal} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400, // Ancho adaptable
          maxWidth: 700, // Ancho máximo consistente
          height: '50vh', // Altura fija como viewport
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            overflow: 'auto',
            flex: 1,
            px: 3,
            py: 2,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#555',
            },
            padding: '20px',
          }}
        >
          {/* Aquí va el formulario */}
          <form onSubmit={handleActualizarUsuario}>
            <Typography
              variant="h5"
              component="h2"
              align="center"
              sx={{
                mb: 3,
                fontWeight: 'medium',
                color: 'text.primary',
              }}
            >
              Actualización de Usuario
            </Typography>
            <Typography
              variant="subtitle1"
              component="p"
              align="left"
              sx={{
                mb: 1,
                fontWeight: 'light',
                color: 'text.secondary',
                fontSize: '0.9rem',
              }}
            >
              Se actualizará al usuario: <strong>{row?.nombre}</strong>
            </Typography>
            {/* campo para la oficina */}
            <Box marginY={spaceInputY}>
              <FormControl fullWidth variant="outlined" sx={{ ...finalStyleInput }}>
                <InputLabel>Oficina</InputLabel>
                <Select
                  value={formData.oficina?.toLowerCase()}
                  onChange={handleOficinaChange}
                  name="oficina"
                  label="Oficina"
                  sx={{ width: '100%' }}
                >
                  {memoizedOptionsOficina.map((option) => (
                    <MenuItem
                      key={option.id}
                      value={option.nombreOficina}
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {capitalizeWords(option.nombreOficina || '')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {/* campo para el rol */}
            <Box marginY={spaceInputY}>
              <FormControl fullWidth variant="outlined" sx={{ ...finalStyleSelect }}>
                <InputLabel>Rol</InputLabel>
                <Select value={formData.rol} onChange={handleRolChange} name="rol">
                  {memoizedOptionesRol.map((option) => (
                    <MenuItem key={option.id} value={option.nombre}>
                      {option.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box marginY={spaceInputY}>
              <FormControl fullWidth variant="outlined" sx={{ ...finalStyleSelect }}>
                <InputLabel>Estado</InputLabel>
                <Select value={formData.estadoText} onChange={handleEstadoChange} name="estadoText">
                  {optionsEstado.map((option) => (
                    <MenuItem key={option.id} value={option.value}>
                      {capitalizeWords(option.value)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Actualizar Usuario
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
              onClick={updateConfirmUsuario}
              title="Confirmar Actualización"
              message="¿Está seguro de actualizar esta usuario?"
              cancelText="Cancelar"
              confirmText="Actualizar"
            />
          </form>
        </Box>
      </Box>
    </Modal>
  );
};

export default React.memo(FormActualizarUsuario);