import React, { forwardRef, useState } from 'react';
import { TextField } from '@mui/material';
import { Box, Button, Typography } from '@mui/material';
import ReusableModal from 'components/common/ResuableDialog';
import { RolDTO } from 'data/interfaces/RolDTO';
import { RolService } from 'data/services/RolService';

interface FormRolProps {
  onClose: () => void;
  onSuccessRegistro: (message: string) => void;
}

const FormRegistroRol: React.FC<FormRolProps> = React.memo(
  forwardRef(({onSuccessRegistro}, _ref) => {
    // para los modales
    const [modalMessage, setModalMessage] = useState('');
    const [openR, setOpen] = useState(false);
    // esto es para la data del formulario rol
    const [formData, setFormData] = useState<RolDTO>({
      nombre: '',
    });

    // para cerrar el modal del dialogo
    const handleClose = () => setOpen(false);

    // esto es para obtener el valor del cada campo del formulario HTML
    const handleChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name as string]: value,
      }));
    };

    // para crear una rol
    const handleInsertRol = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!formData?.nombre?.trim()) {
        setOpen(true);
        setModalMessage('Por favor completar el nombre');
        return;
      }

      try {
        // Crear el objeto de datos a enviar
        const rolDTO = {
          nombre: formData.nombre,
        };

        // llamar al endpoint para crear una nuevo rol
        const response = await RolService.insertRol(rolDTO);

        if (response.statusCode !== 201) {
          setOpen(true);
          setModalMessage(`${response.message}`);
          return;
        }
        // limpiar los campos
        setFormData({
          nombre: '',
        });
        onSuccessRegistro('Rol creado con éxito');
      } catch (error) {
        setOpen(true);
        setModalMessage('Ha ocurrido un error al crear el rol' + error.message);
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

    return (
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '85%', // Ancho adaptable
          maxWidth: 400, // Ancho máximo consistente
          height: '27vh', // Altura fija como viewport
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
          <form onSubmit={handleInsertRol}>
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
              Crear Rol
            </Typography>
            {/* campo para el nombre del rol */}
            <Box marginY={3.5}>
              <TextField
                label="Nombre"
                autoFocus
                fullWidth
                placeholder='Nombre del rol'
                variant="outlined"
                value={formData.nombre}
                name="nombre"
                onChange={handleChange}
                sx={{
                  ...finalStyleInput,
                }}
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Crear Rol
            </Button>
            <ReusableModal
              open={openR}
              onClose={handleClose}
              title="Aviso"
              message={modalMessage}
              confirmText="Cerrar"
            />
          </form>
        </Box>
      </Box>
    );
  }),
);

export default FormRegistroRol;