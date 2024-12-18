import React, { useEffect, useState } from 'react';
import { Modal, TextField } from '@mui/material';
import { Box, Button, Typography } from '@mui/material';
import ReusableModal from 'components/common/ResuableDialog';
import ReusableModalDouble from 'components/common/ReusableDialogDouble';
import PrioridadService from 'data/services/PrioridadService';
import { PrioridadDTO } from 'data/interfaces/PrioridadDTO';

interface FormPrioridadProps {
  openUpdateModal: boolean;
  onClose: () => void;
  row: PrioridadDTO | null;
  id: number;
  onSuccessRegistro: (message: string) => void;
}

const FormActualizarPrioridad: React.FC<FormPrioridadProps> = ({
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
  // para abrir el modal de confirmacion de actualizar la prioridad
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  // estado para ver si se ha confirmado la actualizaciond de la prioridad
  const [hasUpdate, setHasUpdated] = useState(false);
  // esto es para la data del formulario prioridad
  const [formData, setFormData] = useState<PrioridadDTO>({
    nombre: '',
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

  // para crear una Prioridad
  const handleActualizarPrioridad = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData?.nombre?.trim()) {
      setOpenReusable(true);
      setModalMessage('Por favor completar el nombre');
      return;
    }
    setOpenConfirmModal(true);
  };

  const updatePrioridad = async () => {
    try {
      // Crear el objeto de datos a enviar
      const prioridadDTO = {
        nombre: formData.nombre,
      };

      // llamar al endpoint para crear una nueva Prioridad
      const response = await PrioridadService.updatePrioridad(id, prioridadDTO);

      if (response.statusCode !== 200) {
        setOpenReusable(true);
        setModalMessage(`Ha ocurrido un problema al actualizar la prioridad`);
        return;
      }
      setHasUpdated(true);
      onSuccessRegistro?.('Prioridad actualizada con éxito');
      setOpenConfirmModal(false);
    } catch (error) {
      setOpenReusable(true);
      setModalMessage('Ha ocurrido un error al actualizar la prioridad' + error.message);
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
          <form onSubmit={handleActualizarPrioridad}>
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
              Actualizar Prioridad
            </Typography>
            {/* campo para el nombre de la prioridad */}
            <Box marginY={3.5}>
              <TextField
                label="Nombre"
                autoFocus
                fullWidth
                placeholder="Nombre de la prioridad"
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
              onClick={updatePrioridad}
              title="Confirmar Actualización"
              message="¿Está seguro de actualizar la prioridad?"
              cancelText="Cancelar"
              confirmText="Actualizar"
            />
          </form>
        </Box>
      </Box>
    </Modal>
  );
};

export default React.memo(FormActualizarPrioridad);