import React, { forwardRef, useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';
import { Box, Button, Typography } from '@mui/material';
import ReusableModal from 'components/common/ResuableDialog';
import { format } from 'date-fns';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AuditoriaDTO } from 'data/interfaces/AuditoriaDTO';
import { MantenimientoDTO } from 'data/interfaces/MantenimientoDTO';
import { AuditoriaService } from 'data/services/AuditoriaService';

interface FormAuditoriaProps {
  onClose: () => void;
  row: MantenimientoDTO | null;
  onSuccessRegistro?: (message?: string) => void;
}

const FormRegistroAuditoria: React.FC<FormAuditoriaProps> = forwardRef(({ row, onSuccessRegistro }, _ref) => {
  // para los modales
  const [modalMessage, setModalMessage] = useState('');
  const [openR, setOpen] = useState(false);
  // esto es para la data del formulario Auditoria
  const [formData, setFormData] = useState<AuditoriaDTO>({
    fechaCambio: '',
    cambioRealizado: '',
    idMantenimiento: 0,
    fechaActual: new Date(),
  });
  // obteniendo el formato en string de la fecha actual
  const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

  // para establecer los valores iniciales al formulario
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      fechaCambio: currentDate,
      idMantenimiento: row?.idMantenimiento,
    }));
  }, []);

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

  // esto es para establecer la fecha programada
  const handleDateChangeCambio = (date: Date | null) => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd HH:mm:ss');
      setFormData((prevFormData) => ({
        ...prevFormData,
        fechaCambio: formattedDate,
      }));
    }
  };

  // para crear una auditoria
  const handleInsertAuditoria = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fechaCambioDate = new Date(formData?.fechaCambio); // para obtener la fecha de cambio
    const currentNow = new Date(currentDate); // para obtener la fecha actual

    if (!formData?.idMantenimiento || !formData.cambioRealizado) {
      setOpen(true);
      setModalMessage('Por favor completar todos los campos');
      return;
    }
    // validacion para verificar si la fecha de cambio es menor a la fecha actual
    if (fechaCambioDate < currentNow) {
      setOpen(true);
      setModalMessage('La fecha de cambio no debe ser anterior a la fecha actual');
      return;
    }

    try {
      // Crear el objeto de datos a enviar
      const auditoriaDTO = {
        fechaCambio: formData.fechaCambio
          ? formData.fechaCambio
          : format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        cambioRealizado: formData.cambioRealizado,
        idMantenimiento: Number(formData.idMantenimiento),
      };

      // llamar al endpoint para crear una nueva auditoria
      const response = await AuditoriaService.insertAuditoria(auditoriaDTO);

      if (response.statusCode !== 201) {
        setOpen(true);
        setModalMessage(`${response.message}`);
        return;
      }
      // limpiar los campos
      setFormData({
        fechaActual: new Date(),
        fechaCambio: '',
        cambioRealizado: '',
        idMantenimiento: 0,
      });
      onSuccessRegistro?.('Auditoria creado con éxito');
    } catch (error) {
      setOpen(true);
      setModalMessage('Ha ocurrido un error al crear la auditoria' + error.message);
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
        <form onSubmit={handleInsertAuditoria}>
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
            Crear Auditoria
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
            Se creará una auditoría para el activo: <strong>{row?.nombreActivo}</strong>
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
                onChange={handleDateChangeCambio}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Box>
          {/* texta area para los cambios a realizar */}
          <Box marginY={3.5}>
            <TextField
              label="Cambio a Realizar"
              autoFocus
              fullWidth
              variant="outlined"
              name="cambioRealizado"
              placeholder="Ingresar el cambio que se realizará"
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
            Crear Auditoria
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
});

export default React.memo(FormRegistroAuditoria);
