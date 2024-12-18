import React, { useEffect, useState } from 'react';
import { Modal, TextField } from '@mui/material';
import { Box, Button, Typography } from '@mui/material';
import ReusableModal from 'components/common/ResuableDialog';
import ReusableModalDouble from 'components/common/ReusableDialogDouble';
import { TipoMantenimientoDTO } from 'data/interfaces/TipoMantenimientoDTO';
import TipoMantenimientoService from 'data/services/TipoMantenimientoService';

interface FormTPProps {
  openUpdateModal: boolean;
  onClose: () => void;
  row: TipoMantenimientoDTO | null;
  id: number;
  onSuccessRegistro: (message: string) => void;
}

const FormActualizarTP: React.FC<FormTPProps> = ({
  openUpdateModal,
  onClose,
  row,
  id,
  onSuccessRegistro
}) => {
  // para establecer el mensaje del modal, para los campos faltantes
  const [modalMessage, setModalMessage] = useState('');
  // para abrir el modal en caso los campos esten vacios
  const [openReusable, setOpenReusable] = useState(false);
  // para abrir el modal de confirmacion de actualizar el tipo de mantenimiento
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  // estado para ver si se ha confirmado la actualizaciond de el tipo de mantenimiento
  const [hasUpdate, setHasUpdated] = useState(false);
  // esto es para la data del formulario el tipo de mantenimiento
  const [formData, setFormData] = useState<TipoMantenimientoDTO>({
    nombre: '',
    descripcion: '',
  });

  // Efecto para resetear estados cuando se abre el modal con una nueva fila
  useEffect(() => {
    if (openUpdateModal) {
      setHasUpdated(false);
      setOpenReusable(false);
      setOpenConfirmModal(false);
      setModalMessage('');
    }
  }, [openUpdateModal, id]);

  // para establecer los valores obtenidos de la fila de la tabla en el formulario
  useEffect(() => {
    if (row && openUpdateModal && !hasUpdate) {
      setFormData((prevData) => ({
        ...prevData,
        nombre: row.nombre,
        descripcion: row.descripcion,
      }));

      setOpenConfirmModal(false);
    }
  }, [row, openUpdateModal, hasUpdate]);

  // esto es para obtener el valor del cada campo del formulario HTML
  const handleChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name as string]: value,
    }));
  };

  // para crear un tipo de mantenimiento
  const handleActualizarTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData?.nombre?.trim() || !formData?.descripcion?.trim()) {
      setOpenReusable(true);
      setModalMessage('Por favor completar los campos');
      return;
    }
    setOpenConfirmModal(true);
  };

  const updateTP = async () => {
    try {
      // Crear el objeto de datos a enviar
      const tipoMantenimientoDTO = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
      };

      // llamar al endpoint para crear una nuevo tipo de mantenimiento
      const response = await TipoMantenimientoService.updateTP(id, tipoMantenimientoDTO);

      if (response.statusCode !== 200) {
        setOpenReusable(true);
        setModalMessage(`Ha ocurrido un problema al actualizar el tipo de mantenimiento`);
        return;
      }
      setHasUpdated(true);
      onSuccessRegistro?.('Tipo de mantenimiento actualizada con éxito');
      setOpenConfirmModal(false);
    } catch (error) {
      setOpenReusable(true);
      setModalMessage('Ha ocurrido un error al actualizar el tipo de mantenimiento' + error.message);
    }
  };

  const handleCloseModal = () => {
    setOpenReusable(false);
    if (hasUpdate) {
      onClose();
      setHasUpdated(false);
      // limpiar los campos
      setFormData({
        nombre: '',
        descripcion: '',
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

  return (
    <Modal open={openUpdateModal} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '85%', // Ancho adaptable
          maxWidth: 400, // Ancho máximo consistente
          height: '47vh', // Altura fija como viewport
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
          <form onSubmit={handleActualizarTP}>
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
              Actualizar Tipo de Mantenimiento
            </Typography>
            {/* campo para el nombre del tipo de mantenimiento */}
            <Box marginY={3.5}>
              <TextField
                label="Nombre"
                autoFocus
                fullWidth
                placeholder="Ingresar nombre"
                variant="outlined"
                value={formData.nombre}
                name="nombre"
                onChange={handleChange}
                sx={{
                  ...finalStyleInput,
                }}
              />
            </Box>
            <Box marginY={3.5}>
              <TextField
                label="Descripcion"
                fullWidth
                placeholder="Ingresar Descripcion"
                variant="outlined"
                value={formData.descripcion}
                name="descripcion"
                onChange={handleChange}
                multiline
                rows={4}
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
              Actualizar
            </Button>
            <ReusableModal
              open={openReusable}
              onClose={handleCloseModal}
              title="Aviso"
              message={modalMessage}
              confirmText="Cerrar"
            />
            <ReusableModalDouble
              open={openConfirmModal}
              onClose={() => setOpenConfirmModal(false)}
              onClick={updateTP}
              title="Confirmar Actualización"
              message="¿Está seguro de actualizar el tipo de mantenimiento?"
              cancelText="Cancelar"
              confirmText="Actualizar"
            />
          </form>
        </Box>
      </Box>
    </Modal>
  );
};

export default React.memo(FormActualizarTP);