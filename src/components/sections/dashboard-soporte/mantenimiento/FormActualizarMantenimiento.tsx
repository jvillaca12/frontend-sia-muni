import React, { useEffect, useMemo, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Modal,
} from '@mui/material';
import { Box, Button, Typography } from '@mui/material';
import ReusableModal from 'components/common/ResuableDialog';
import { addDays, format } from 'date-fns';
import { DateTimePicker } from '@mui/x-date-pickers';
import { MantenimientoDTO } from 'data/interfaces/MantenimientoDTO';
import { useTipoMantenimientoData } from 'hooks/hooks-incidencias/useTipoMantenimientoData';
import { usePersonalData } from 'hooks/hooks-empleado/usePersonalData';
import { capitalizeWords } from 'helpers/capitalizar-palabra';
import { MantenimientoService } from 'data/services/MantenimientoService';
import ReusableModalDouble from 'components/common/ReusableDialogDouble';

interface FormMantenimientoProps {
  openUpdateModal: boolean;
  handleClose: () => void;
  row: MantenimientoDTO | null;
  idMantenimiento: number;
  onSuccessRegistro: (message?: string) => void;
}

const FormActualizarMantenimiento: React.FC<FormMantenimientoProps> = ({
  openUpdateModal,
  handleClose,
  row,
  idMantenimiento,
  onSuccessRegistro,
}) => {
  const { fetchDataTP, optionsTP } = useTipoMantenimientoData();
  const { fetchDataPersonal, optionsPersonal } = usePersonalData();
  // para establecer el mensaje del modal, para los campos faltantes
  const [modalMessage, setModalMessage] = useState('');
  // para abrir el modal en caso los campos esten vacios
  const [openReusable, setOpenReusable] = useState(false);
  // para abrir el modal de confirmacion de actualizar mantenimiento
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  // estado para ver si se ha confirmado la actualizaciond del mantenimiento
  const [hasUpdate, setHasUpdated] = useState(false);
  // esto es para la data del formulario Mantenimiento
  const [formData, setFormData] = useState<MantenimientoDTO>({
    idMantenimiento: 0,
    idDetalleProblema: 0,
    fechaProgramada: '',
    fechaRealizada: '',
    fechaActual: new Date(),
    fechaNext: addDays(new Date(), 1),
    tipoMantenimiento: '',
    tipoMantenimientoId: 0,
    notas: '',
    personal: '',
    personalId: 0,
    codigoProblema: '',
  });

  // Efecto para resetear estados cuando se abre el modal con una nueva fila
  useEffect(() => {
    if (openUpdateModal) {
      setHasUpdated(false);
      setOpenReusable(false);
      setOpenConfirmModal(false);
      setModalMessage('');
    }
  }, [openUpdateModal, idMantenimiento]);

  // cargando la data una sola vez
  useEffect(() => {
    const fetchData = async () => {
      await fetchDataPersonal();
      await fetchDataTP();
    };
    fetchData();
  }, [fetchDataPersonal, fetchDataTP]);

  const memoizedOptionsTP = useMemo(() => optionsTP, [optionsTP]);
  const memoizedOptionsPersonal = useMemo(() => optionsPersonal, [optionsPersonal]);

  // para establecer los valores obtenidos de la fila de la tabla en el formulario
  useEffect(() => {
    if (row && openUpdateModal && !hasUpdate) {
      // para obtener la data del tipo de mantenimiento
      const selectedTP = memoizedOptionsTP.find((option) => option.id === row.tipoMantenimientoId);
      // para obener la data del personal
      const selectedPersonal = memoizedOptionsPersonal.find(
        (option) => option.idPersonal === row.personalId,
      );

      setFormData((prevData) => ({
        ...prevData,
        codigoProblema: row.codigoProblema,
        idDetalleProblema: row?.idDetalleProblema,
        fechaProgramada: row?.fechaProgramada,
        fechaActual: row?.fechaProgramada ? new Date(Date.parse(row?.fechaProgramada)) : new Date(),
        fechaRealizada: row?.fechaRealizada,
        fechaNext: row?.fechaRealizada ? new Date(Date.parse(row?.fechaRealizada)) : new Date(),
        tipoMantenimiento: selectedTP?.nombre || '',
        tipoMantenimientoId: selectedTP?.id || 0,
        notas: row.notas,
        personal: selectedPersonal?.personal || '',
        personalId: selectedPersonal?.idPersonal || 0,
      }));
      setOpenConfirmModal(false);
    }
  }, [row, memoizedOptionsTP, memoizedOptionsPersonal, openUpdateModal, hasUpdate]);

  // esto es para obtener el valor del cada campo del formulario HTML
  const handleChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name as string]: value,
    }));
  };

  // esto es para manejar el valor del tipo de mantenimiento
  const handleTipoMantenimientoChange = (e: SelectChangeEvent<string>) => {
    const selectedTP = memoizedOptionsTP.find((option) => option.nombre === e.target.value);
    if (selectedTP) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        tipoMantenimiento: selectedTP.nombre?.toLowerCase(),
        tipoMantenimientoId: selectedTP.id,
      }));
    }
  };

  // esto es para manejar el valor de la prioridad
  const handlePersonalChange = (e: SelectChangeEvent<string>) => {
    const selectedPersonal = memoizedOptionsPersonal.find(
      (option) => option.personal === e.target.value,
    );
    if (selectedPersonal) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        personal: selectedPersonal.personal,
        personalId: selectedPersonal.idPersonal,
      }));
    }
  };

  // esto es para establecer la fecha programada
  const handleDateChangeProgramada = (date: Date | null) => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd HH:mm:ss');
      setFormData((prevFormData) => ({
        ...prevFormData,
        fechaProgramada: formattedDate,
        fechaActual: date,
      }));
    }
  };

  // esto es para establecer la fecha programada
  const handleDateChangeRealizada = (date: Date | null) => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd HH:mm:ss');
      setFormData((prevFormData) => ({
        ...prevFormData,
        fechaRealizada: formattedDate,
        fechaNext: date,
      }));
    }
  };

  // para crear un mantenimiento
  const handleUpdateMantenimiento = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData?.idDetalleProblema || !formData.personalId || !formData.tipoMantenimientoId) {
      setOpenReusable(true);
      setModalMessage('Por favor, complete los campos obligatorios');
      return;
    }
    setOpenConfirmModal(true);
  };

  const updateMantenimiento = async () => {
    try {
      // Crear el objeto de datos a enviar
      const mantenimientoDTO = {
        idDetalleProblema: Number(formData.idDetalleProblema),
        fechaProgramada: formData.fechaActual
          ? formData.fechaProgramada
          : format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        fechaRealizada: formData.fechaActual
          ? formData.fechaRealizada
          : format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        tipoMantenimientoId: Number(formData.tipoMantenimientoId),
        notas: formData.notas || 'No hay notas adicionales',
        personalId: Number(formData.personalId),
      };

      // llamar al metodo para crear el mantenimiento
      const response = await MantenimientoService.updateMantenimiento(
        idMantenimiento,
        mantenimientoDTO,
      );

      if (response.statusCode !== 200) {
        setOpenReusable(true);
        setModalMessage(
          `La fecha realizada ${mantenimientoDTO.fechaRealizada} 
           no debe de ser menor a la fecha programada`,
        );
        return;
      }
      setHasUpdated(true);
      setOpenConfirmModal(false);
      onSuccessRegistro?.('Mantenimiento actualizado con éxito');
    } catch (error) {
      setOpenReusable(true);
      setModalMessage('Ha ocurrido un error al registrar el mantenimiento' + error.message);
    }
  };

  const handleCloseModal = () => {
    setOpenReusable(false);
    if (hasUpdate) {
      handleClose();
      setHasUpdated(false);
      // limpiar los campos
      setFormData({
        idMantenimiento: 0,
        idDetalleProblema: 0,
        fechaProgramada: '',
        fechaRealizada: '',
        fechaActual: new Date(),
        fechaNext: addDays(new Date(), 1),
        tipoMantenimientoId: optionsTP[0]?.id,
        tipoMantenimiento: optionsTP[0]?.nombre || '',
        notas: '',
        personalId: optionsPersonal[0]?.idPersonal,
        personal: optionsPersonal[0]?.personal || '',
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
          width: '55%', // Ancho adaptable
          maxWidth: 400, // Ancho máximo consistente
          height: '85vh', // Altura fija como viewport
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
          <form onSubmit={handleUpdateMantenimiento}>
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
              Actualización de Mantenimiento
            </Typography>
            {/* campo para el id del fallo_incidencia */}
            <Box marginY={3.5}>
              <TextField
                label="Código de Problema"
                fullWidth
                disabled
                variant="outlined"
                name="idFallo"
                placeholder="Ingresar código de Problema"
                value={formData.codigoProblema}
                onChange={handleChange}
                sx={{ ...finalStyleInput }}
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
            {/* campo para la fecha realizada */}
            <Box marginY={3.5}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Fecha de la Realización"
                  format="dd-MM-yyyy HH:mm:ss"
                  value={formData.fechaNext}
                  onChange={handleDateChangeRealizada}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Box>
            {/* campo para el tipo de mantenimiento */}
            <Box marginY={3.5}>
              <FormControl
                fullWidth
                variant="outlined"
                sx={{
                  ...finalStyleSelect,
                }}
              >
                <InputLabel>Tipo de Mantenimiento</InputLabel>
                <Select
                  value={formData.tipoMantenimiento}
                  onChange={handleTipoMantenimientoChange}
                  name="tipoMantenimiento"
                >
                  {memoizedOptionsTP.map((option) => (
                    <MenuItem key={option.id} value={option.nombre}>
                      {capitalizeWords(option.nombre || '')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {/* texta area para las notas */}
            <Box marginY={3.5}>
              <TextField
                label="Notas adicionales"
                autoFocus
                fullWidth
                variant="outlined"
                name="notas"
                placeholder="Ingresar notas adicionales si fuera necesario"
                value={formData.notas}
                onChange={handleChange}
                multiline
                rows={4}
                sx={{
                  ...finalStyleInput,
                }}
              />
            </Box>
            {/* campo para el personal */}
            <Box marginY={3.5}>
              <FormControl
                fullWidth
                variant="outlined"
                sx={{
                  ...finalStyleSelect,
                }}
              >
                <InputLabel>Personal</InputLabel>
                <Select value={formData.personal} onChange={handlePersonalChange} name="personal">
                  {memoizedOptionsPersonal.map((option) => (
                    <MenuItem key={option.idPersonal} value={option.personal || ''}>
                      {option.personal}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
              Actualizar Mantenimiento
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
              onClick={updateMantenimiento}
              title="Confirmar Actualización"
              message="¿Está seguro de actualizar el mantenimiento?"
              cancelText="Cancelar"
              confirmText="Actualizar"
            />
          </form>
        </Box>
      </Box>
    </Modal>
  );
};

export default React.memo(FormActualizarMantenimiento);
