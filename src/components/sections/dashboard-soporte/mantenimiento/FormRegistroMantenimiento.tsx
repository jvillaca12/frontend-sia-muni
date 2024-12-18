import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  SelectChangeEvent,
} from '@mui/material';
import { Box, Button, Typography } from '@mui/material';
import ReusableModal from 'components/common/ResuableDialog';
import { addDays, format } from 'date-fns';
import { DateTimePicker } from '@mui/x-date-pickers';
import { MantenimientoDTO } from 'data/interfaces/MantenimientoDTO';
import { useMantenimientoData } from 'hooks/hooks-incidencias/useMantenimientoData';
import { useTipoMantenimientoData } from 'hooks/hooks-incidencias/useTipoMantenimientoData';
import { usePersonalData } from 'hooks/hooks-empleado/usePersonalData';
import { capitalizeWords } from 'helpers/capitalizar-palabra';
import { MantenimientoService } from 'data/services/MantenimientoService';

interface FormMantenimientoProps {
  onClose: () => void;
  onSuccessRegistro: (message: string) => void;
}

const FormRegistroMantenimiento: React.FC<FormMantenimientoProps> = forwardRef( 
  ({ onClose, onSuccessRegistro }, _ref) => {
  // para los modales
  const [modalMessage, setModalMessage] = useState('');
  const [openR, setOpen] = useState(false);
  // esto es para la data del formulario Mantenimiento
  const [formData, setFormData] = useState<MantenimientoDTO>({
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
  });
  const { mantenimiento, fetchDataMantenimiento } = useMantenimientoData();
  const { dataTP, fetchDataTP, optionsTP } = useTipoMantenimientoData();
  const { dataPersonal, fetchDataPersonal, optionsPersonal } = usePersonalData();
  const [suggestions, setSuggestions] = useState<MantenimientoDTO[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<MantenimientoDTO | null>(null);
  const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  const nextDate = format(addDays(new Date(), 1), 'yyyy-MM-dd HH:mm:ss');

  // cargando la data una sola vez
  useEffect(() => {
    const fetchData = async () => {
      await fetchDataMantenimiento();
      await fetchDataPersonal();
      await fetchDataTP();
    };
    fetchData();
  }, [fetchDataPersonal, fetchDataMantenimiento, fetchDataTP]);

  const memoizedOptionsTP = useMemo(() => optionsTP, [optionsTP]);
  const memoizedOptionsPersonal = useMemo(() => optionsPersonal, [optionsPersonal]);

  // para establecer los valores iniciales al formulario
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      fechaProgramada: currentDate,
      fechaRealizada: nextDate,
      fechaActual: new Date(),
      tipoMantenimiento: memoizedOptionsTP[0]?.nombre || '',
      tipoMantenimientoId: memoizedOptionsTP[0]?.id || 0,
      personal: memoizedOptionsPersonal[0]?.personal || '',
      personalId: memoizedOptionsPersonal[0]?.idPersonal || 0,
    }));
  }, [memoizedOptionsTP, memoizedOptionsPersonal]);

  useEffect(() => {
    // para obtener el filtrado de la data de mantenimiento en el autocompletado
    if (inputValue.length >= 2) {
      const filteredSuggestions = (mantenimiento || []).filter((item) =>
        item.codigoProblema?.includes(inputValue),
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [mantenimiento, inputValue]);

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

  // esto es para manejar el valor del tipo de mantenimiento
  const handleTipoMantenimientoChange = (e: SelectChangeEvent<string>) => {
    const selectedTP = dataTP.find((option) => option.nombre === e.target.value);
    if (selectedTP) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        tipoMantenimiento: selectedTP.nombre,
        tipoMantenimientoId: selectedTP.id,
      }));
    }
  };

  // esto es para manejar el valor del personal
  const handlePersonalChange = (e: SelectChangeEvent<string>) => {
    const selectedPersonal = dataPersonal.find((option) => option.personal === e.target.value);
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
      }));
    }
  };

  // esto es para establecer la fecha realizada
  const handleDateChangeRealizada = (date: Date | null) => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd HH:mm:ss');
      setFormData((prevFormData) => ({
        ...prevFormData,
        fechaRealizada: formattedDate,
      }));
    }
  };

  // para crear un mantenimiento
  const handleInsertMantenimiento = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData?.idDetalleProblema || !formData.personalId || !formData.tipoMantenimientoId) {
      setOpen(true);
      setModalMessage('Hay campos faltantes');
      return;
    }

    try {
      // verificar si el codigo problema ingresado existe para obtener el idFallo
      const existsIdFallo = mantenimiento.some((option) => option.idDetalleProblema === formData.idDetalleProblema);

      if (!existsIdFallo) {
        setOpen(true);
        setModalMessage('El código de bien no existe');
        return;
      }
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
      const response = await MantenimientoService.insertMantenimiento(mantenimientoDTO);

      if (response.statusCode !== 201) {
        setOpen(true);
        setModalMessage(
          `La fecha realizada ${mantenimientoDTO.fechaRealizada} no debe de ser menor a la 
          fecha programada`,
        );
        return;
      }
      // limpiar los campos
      setFormData({
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
      setInputValue('');
      setSelectedOption(null);
      onSuccessRegistro?.('Mantenimiento creado con éxito');
      onClose();
    } catch (error) {
      setOpen(true);
      setModalMessage('Ha ocurrido un error al registrar el mantenimiento' + error.message);
    }
  };

  const handleInputChange = (_event: React.ChangeEvent<{}>, newInputValue: string) => {
    setInputValue(newInputValue);
  };

  // esto es del autocompletado, para obtener la seleccion y establecer el idFallo
  const handleOptionChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: string | MantenimientoDTO | null,
  ) => {
    event.preventDefault();
    if (typeof newValue === 'string') {
      setSelectedOption(null);
    } else {
      setSelectedOption(newValue as MantenimientoDTO);
      setFormData((prevFormData) => ({
        ...prevFormData,
        idDetalleProblema: newValue ? newValue.idDetalleProblema : 0,
      }));
    }
  };

  // para obtener el codigoProblema seleccionado de las sugerencias
  const getOptionLabel = (option: string | MantenimientoDTO) => {
    if (typeof option === 'string') {
      return option;
    }
    return `${option.codigoProblema}`;
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
        width: '95%', // Ancho adaptable
        maxWidth: 400, // Ancho máximo consistente
        height: '83vh', // Altura fija como viewport
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
        <form onSubmit={handleInsertMantenimiento}>
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
            Registro de Mantenimiento
          </Typography>
          {/* campo para el id del fallo_incidencia, que es el codigo problema */}
          <Box marginY={3.5}>
            <Autocomplete
              freeSolo
              options={suggestions}
              getOptionLabel={getOptionLabel}
              inputValue={inputValue}
              onInputChange={handleInputChange}
              value={selectedOption ? `${selectedOption?.codigoProblema}` : ''}
              onChange={handleOptionChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  autoFocus
                  label="Código de Problema"
                  fullWidth
                  variant="outlined"
                  name="idFallo"
                  placeholder="Ingresar código de Problema"
                  value={formData.idDetalleProblema}
                  onChange={handleChange}
                  sx={{ ...finalStyleInput }}
                />
              )}
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
                  <MenuItem key={option.idPersonal} value={option.personal}>
                    {capitalizeWords(option.personal || '')}
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
            Crear Mantenimiento
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

export default React.memo(FormRegistroMantenimiento);
