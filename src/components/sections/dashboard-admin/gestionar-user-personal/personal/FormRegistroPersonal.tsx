import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { capitalizeWords } from 'helpers/capitalizar-palabra';
import ReusableModal from 'components/common/ResuableDialog';
import { useDataRolPersonal } from 'hooks/hooks-user/useRolPersonal';
import { PersonalDTO } from 'data/interfaces/PersonalDTO';
import { PersonalService } from 'data/services/PersonalService';

// las propiedades del formulario cuando se exporta a otra clase
interface FormRegistrarPersonalProps {
  onClose: () => void;
  onSuccessRegistro?: (message?: string) => void;
}

const FormRegistroPersonal: React.FC<FormRegistrarPersonalProps> = forwardRef(
  ({ onSuccessRegistro }, _ref) => {
    // hook para obtener la data de rol
    const { optionsRol, fetchDataRol } = useDataRolPersonal();
    // para establecer el mensaje del modal, para los campos faltantes
    const [modalMessage, setModalMessage] = useState('');
    // para abrir el modal en caso los campos esten vacios
    const [openReusable, setOpenReusable] = useState(false);
    // para crear el personal con los datos del formulario
    const [formData, setFormData] = useState<PersonalDTO>({
      // inicializando la data del personal a registrar
      nombre: '',
      apellidos: '',
      rolId: 0,
      rol: '',
      estado: '',
    });
    // espacio en el eje Y en los componentes
    const spaceInputY = 3.5;
    // opciones para el solucionado
    const optionsEstado = [
      { id: 1, value: 'Activo' },
      { id: 2, value: 'Inactivo' },
    ];

    // cargando la data una sola vez
    useEffect(() => {
      const fetchData = async () => {
        await fetchDataRol();
      };
      fetchData();
    }, [fetchDataRol]);

    // memoizar las opciones de rol
    const memoizedOptionesRol = useMemo(() => optionsRol, [optionsRol]);

    // para establecer los valores obtenidos de la fila de la tabla en el formulario
    useEffect(() => {
      setFormData((prevData) => ({
        ...prevData,
        estado: optionsEstado[0].value,
        rol: memoizedOptionesRol[0]?.nombre,
        rolId: memoizedOptionesRol[0]?.id,
      }));
    }, [memoizedOptionesRol]);

    // esto es para manejar el valor del rol del personal, para obtener el nombre y id
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

    // para establecer el valor de cada input HTML del formulario, hacia la data del personal
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    };

    // esto es para manejar el estado si esta Activo o Inactivo el personal
    const handleEstadoChange = (e: SelectChangeEvent<string>) => {
      const estadoActual = optionsEstado.find((option) => option.value === e.target.value);
      if (estadoActual) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          estado: estadoActual.value,
          estadoSave: estadoActual.value === 'Activo',
        }));
      }
    };

    // para insertar un personal
    const handleInsertPersonal = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // validar si los campos estan vacios
      if (!formData.nombre || !formData.apellidos || !formData.rolId || !formData.estado) {
        setOpenReusable(true);
        setModalMessage('Todos los campos son requeridos');
        return;
      }
      try {
        // crear el objeto de datos a enviar
        const personalData = {
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          rolId: formData.rolId,
          estado: formData.estado,
        };
        // llamar al endpoint para crear el personal
        const response = await PersonalService.insertPersonal(personalData);

        if (response.statusCode !== 201) {
          setOpenReusable(true);
          setModalMessage('Error al crear el personal');
          return;
        }
        setFormData({
          nombre: '',
          apellidos: '',
          rolId: memoizedOptionesRol[0]?.id,
          rol: memoizedOptionesRol[0]?.nombre,
          estado: optionsEstado[0].value,
        });
        onSuccessRegistro?.(`Personal creado con éxito`);
      } catch (error) {
        setOpenReusable(true);
        setModalMessage(error.message);
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
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400, // Ancho adaptable
          maxWidth: 700, // Ancho máximo consistente
          height: '55vh', // Altura fija como viewport
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
          <form onSubmit={handleInsertPersonal}>
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
              Agregar Personal
            </Typography>
            {/* campo para el nombre del personal */}
            <Box marginY={spaceInputY}>
              <TextField
                label="Nombre"
                fullWidth
                variant="outlined"
                name="nombre"
                placeholder="Ingresar Nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                sx={{ ...finalStyleInput }}
              />
            </Box>
            {/* campo para los apellidos del personal */}
            <Box marginY={spaceInputY}>
              <TextField
                label="Apellidos"
                fullWidth
                variant="outlined"
                name="apellidos"
                placeholder="Ingresar Apellidos"
                value={formData.apellidos}
                onChange={handleInputChange}
                sx={{ ...finalStyleInput }}
              />
            </Box>
            {/* campo para el rol del personal */}
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
            {/* campo para el estado del personal */}
            <Box marginY={spaceInputY}>
              <FormControl fullWidth variant="outlined" sx={{ ...finalStyleSelect }}>
                <InputLabel>Estado</InputLabel>
                <Select value={formData.estado} onChange={handleEstadoChange} name="estado">
                  {optionsEstado.map((option) => (
                    <MenuItem key={option.id} value={option.value}>
                      {capitalizeWords(option.value)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Crear Personal
            </Button>
            <ReusableModal
              open={openReusable}
              onClose={() => setOpenReusable(false)}
              title="Aviso"
              message={modalMessage}
              confirmText="Cerrar"
            />
          </form>
        </Box>
      </Box>
    );
  },
);

export default React.memo(FormRegistroPersonal);