import React, { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField, Modal } from '@mui/material';
import { Box, Button, Typography } from '@mui/material';
import ReusableModal from 'components/common/ResuableDialog';
import { format } from 'date-fns';
import { DateTimePicker } from '@mui/x-date-pickers';
import ReusableModalDouble from 'components/common/ReusableDialogDouble';
import { AuditoriaDTO } from 'data/interfaces/AuditoriaDTO';
import { AuditoriaService } from 'data/services/AuditoriaService';

interface FormAuditoriaProps {
  openUpdateModal: boolean;
  onClose: () => void;
  row: AuditoriaDTO | null;
  idAuditoria: number;
  onSuccessRegistro: (message?: string) => void;
}

const FormActualizarAuditoria: React.FC<FormAuditoriaProps> = ({
  openUpdateModal,
  onClose,
  row,
  idAuditoria,
  onSuccessRegistro
}) => {
  // para establecer el mensaje del modal, para los campos faltantes
  const [modalMessage, setModalMessage] = useState('');
  // para abrir el modal en caso los campos esten vacios
  const [openReusable, setOpenReusable] = useState(false);
  // para abrir el modal de confirmacion de actualizar la auditoria
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  // estado para ver si se ha confirmado la actualizaciond de la auditoria
  const [hasUpdate, setHasUpdated] = useState(false);
  // esto es para la data del formulario de la auditoria
  const [formData, setFormData] = useState<AuditoriaDTO>({
    fechaCambio: '',
    cambioRealizado: '',
    fechaActual: new Date(),
    idMantenimiento: 0,
  });

  // Efecto para resetear estados cuando se abre el modal con una nueva fila
  useEffect(() => {
    if (openUpdateModal) {
      setHasUpdated(false);
      setOpenReusable(false);
      setOpenConfirmModal(false);
      setModalMessage('');
    }
  }, [openUpdateModal, idAuditoria]);

  // para establecer los valores obtenidos de la fila de la tabla en el formulario
  useEffect(() => {
    if (row && openUpdateModal && !hasUpdate) {
      setFormData((prevData) => ({
        ...prevData,
        idMantenimiento: row.idMantenimiento,
        fechaCambio: row.fechaCambio,
        fechaActual: row.fechaCambio ? new Date(row.fechaCambio) : new Date(),
        cambioRealizado: row.cambioRealizado,
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

  // esto es para establecer la fecha programada
  const handleDateChangeProgramada = (date: Date | null) => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd HH:mm:ss');
      setFormData((prevFormData) => ({
        ...prevFormData,
        fechaCambio: formattedDate,
        fechaActual: date,
      }));
    }
  };

  // para crear una auditoria
  const handleUpdateAuditoria = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // validar que los campos esten completos
    if (!formData.idMantenimiento || !formData.cambioRealizado) {
      setOpenReusable(true);
      setModalMessage('Por favor, rellene todos los campos');
      return;
    }
    setOpenConfirmModal(true);
  };

  const updateAuditoria = async () => {
    try {
      // Crear el objeto de datos a enviar
      const auditoriaDTO = {
        fechaCambio: formData.fechaActual
          ? formData.fechaCambio
          : format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        cambioRealizado: formData.cambioRealizado,
        idMantenimiento: formData.idMantenimiento,
      };
      // llamar al endpoint para actualizar la auditoria
      const response = await AuditoriaService.updateAuditoria(idAuditoria, auditoriaDTO);

      if (response.statusCode !== 201) {
        setOpenReusable(true);
        setModalMessage(`La fecha de cambio no puede ser anterior o igual a la fecha actual`);
        return;
      }
      setHasUpdated(true);
      setOpenConfirmModal(false);
      onSuccessRegistro?.('Auditoria actualizada con éxito');
    } catch (error) {
      setOpenReusable(true);
      setModalMessage('Ha ocurrido un error al registrar el auditoria' + error.message);
    }
  };

  const handleCloseModal = () => {
    setOpenReusable(false);
    if (hasUpdate) {
      onClose();
      setHasUpdated(false);
      // limpiar los campos
      setFormData({
        idMantenimiento: 0,
        fechaCambio: '',
        cambioRealizado: '',
        fechaActual: new Date(),
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
          width: '55%', // Ancho adaptable
          maxWidth: 400, // Ancho máximo consistente
          height: '57vh', // Altura fija como viewport
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
          <form onSubmit={handleUpdateAuditoria}>
            <Typography
              variant="h5"
              component="h2"
              align="center"
              sx={{
                mb: 3,
                fontWeight: 'bold',
                fontSize: 22,
                color: 'text.primary',
              }}
            >
              Actualización de Auditoria
            </Typography>
            <Typography
              variant="subtitle1"
              component="p"
              align="left"
              sx={{
                mb: 1,
                fontWeight: 'light',
                color: 'text.secondary',
                fontSize: '0.8rem',
              }}
            >
              Se actualizará una auditoría para el mantenimiento:{' '}
              <strong>{row?.idMantenimiento}</strong>
            </Typography>
            {/* campo para el id del fallo_incidencia, que es el codigo problema */}
            <Box marginY={3.5}>
              <TextField
                label="Código de Problema"
                autoFocus
                fullWidth
                variant="outlined"
                defaultValue={row?.codigoProblema}
                disabled
                onChange={handleChange}
                sx={{
                  ...finalStyleInput,
                }}
              />
            </Box>
            {/* campo para la fecha programada */}
            <Box marginY={3.5}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Fecha Programada"
                  format="dd-MM-yyyy HH:mm:ss"
                  value={formData.fechaActual}
                  onChange={handleDateChangeProgramada}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Box>
            {/* texta area para los cambios a realizar */}
            <Box marginY={3.5}>
              <TextField
                label="Cambio Realizado"
                autoFocus
                fullWidth
                variant="outlined"
                name="cambioRealizado"
                placeholder="Ingresar que cambios se realizaran"
                value={formData.cambioRealizado}
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
              Actualizar Auditoria
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
              onClick={updateAuditoria}
              title="Confirmar Actualización"
              message="¿Está seguro de actualizar la auditoria?"
              cancelText="Cancelar"
              confirmText="Actualizar"
            />
          </form>
        </Box>
      </Box>
    </Modal>
  );
};

export default FormActualizarAuditoria;
