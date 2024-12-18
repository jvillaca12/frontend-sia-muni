import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { Box, Button, Typography } from '@mui/material';
import { capitalizeWords } from 'helpers/capitalizar-palabra';
import DetalleProblemaService from 'data/services/DetalleProblemaService';
import { DetalleProblemaDTO } from 'data/interfaces/DetalleProblemaDTO';
import ReusableModal from 'components/common/ResuableDialog';
import { format } from 'date-fns';
import { usePrioridadData } from 'hooks/hooks-soporte/useDataPrioridad';
import { useDataCategoria } from 'hooks/hooks-soporte/useDataCategoria';
import { DateTimePicker } from '@mui/x-date-pickers';
import { ProblemaGeneralDTO } from 'data/interfaces/ProblemaGeneralDTO';

interface FormDetalleProblemaProps {
  onClose: () => void;
  row: ProblemaGeneralDTO | null;
  onSuccessRegistro?: (message?: string) => void;
}

const FormRegistroDetalleProblema: React.FC<FormDetalleProblemaProps> = forwardRef(
  ({ row, onSuccessRegistro }, _ref) => {
    // para los modales de error y exito
    const [modalMessage, setModalMessage] = useState('');
    // para el modal de error y exito
    const [openR, setOpen] = useState(false);
    // para la data de la prioridad
    const { dataPrioridad, fetchDataPrioridades, optionsPrioridad } = usePrioridadData();
    // para la data de la categoria
    const { dataCategoria, fetchDataCategorias, optionsCategoria } = useDataCategoria();
    // esto es para la data del formulario de detalle de problema
    const [formData, setFormData] = useState<DetalleProblemaDTO>({
      descripcion: '',
      fechaRegistro: null,
      fechaActual: new Date(),
      medioReporte: '',
      solucion: '',
      categoriaId: 0,
      prioridadId: 0,
      categoria: '',
      prioridad: '',
      idProblemaGeneral: 0,
    });
    const optionsMedioReporte = [
      { id: 1, value: 'Correo' },
      { id: 2, value: 'Presencial' },
      { id: 3, value: 'Telefono/Whatsapp' },
    ];
    const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    // cargando la data una sola vez
    useEffect(() => {
      const fetchData = async () => {
        await fetchDataCategorias();
        await fetchDataPrioridades();
      };

      fetchData();
    }, [fetchDataCategorias, fetchDataPrioridades]);

    const memoizedOptionsPrioridad = useMemo(() => optionsPrioridad, [optionsPrioridad]);
    const memoizedOptionsCategoria = useMemo(() => optionsCategoria, [optionsCategoria]);

    // para establecer los valores iniciales al formulario
    useEffect(() => {
      setFormData((prevData) => ({
        ...prevData,
        fechaRegistro: currentDate,
        medioReporte: optionsMedioReporte[0]?.value || '',
        categoria: optionsCategoria[0]?.nombre || '',
        categoriaId: optionsCategoria[0]?.id || 0,
        prioridad: optionsPrioridad[0]?.nombre || '',
        prioridadId: optionsPrioridad[0]?.id || 0,
        idProblemaGeneral: row?.idProblemaGeneral,
      }));
    }, [optionsCategoria, optionsPrioridad]);

    // para cerrar el modal del dialogo
    const handleClose = () => {
      setOpen(false);
    };

    // esto es para obtener el valor del cada campo del formulario HTML
    const handleChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name as string]: value,
      }));
    };

    // esto es para manejar el valor de la categoria
    const handleCategoriaChange = (e: SelectChangeEvent<string>) => {
      const selectedCategoria = dataCategoria.find((option) => option.nombre === e.target.value);
      if (selectedCategoria) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          categoria: selectedCategoria.nombre,
          categoriaId: selectedCategoria.id,
        }));
      }
    };

    // esto es para manejar el valor de la prioridad
    const handlePrioridadChange = (e: SelectChangeEvent<string>) => {
      const selectedPrioridad = dataPrioridad.find((option) => option.nombre === e.target.value);
      if (selectedPrioridad) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          prioridad: selectedPrioridad.nombre,
          prioridadId: selectedPrioridad.id,
        }));
      }
    };

    const handleMedioReporteChange = (e: SelectChangeEvent<string>) => {
      const selectedMReporte = optionsMedioReporte.find(
        (option) => option.value === e.target.value,
      );
      if (selectedMReporte) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          medioReporte: selectedMReporte.value,
        }));
      }
    };

    // esto es para establecer la fecha actual
    const handleDateChange = (date: Date | null) => {
      if (date) {
        const formattedDate = format(date, 'yyyy-MM-dd HH:mm:ss');
        setFormData((prevFormData) => ({
          ...prevFormData,
          fechaRegistro: formattedDate,
        }));
      }
    };

    // para crear una detalle de problema
    const handleInsertDetalleProblema = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (
        !formData?.descripcion?.trim() ||
        !formData?.categoriaId ||
        !formData?.prioridadId ||
        !formData?.idProblemaGeneral
      ) {
        setOpen(true);
        setModalMessage('Por favor completar los campos');
        return;
      }

      const dateOcurrencia = format(new Date(formData.fechaRegistro || ''), 'yyyy-MM-dd HH:mm:ss');

      if (dateOcurrencia > currentDate) {
        setOpen(true);
        setModalMessage('La fecha de registro no debe de ser mayor a la fecha actual');
        return;
      }

      try {
        // Crear el objeto de datos a enviar
        const detalleProblemaData = {
          descripcion: formData.descripcion,
          fechaRegistro: formData.fechaActual
            ? formData.fechaRegistro
            : format(new Date(), 'yyyy-MM-dd HH:mm:ss'), // Si no hay fecha, usar la actual
          medioReporte: formData.medioReporte,
          solucion: formData.solucion || '',
          categoriaId: Number(formData.categoriaId),
          prioridadId: Number(formData.prioridadId),
          idProblemaGeneral: Number(formData.idProblemaGeneral),
        };

        // llamar al metodo para crear el detalle problema
        const response = await DetalleProblemaService.insertarDetalleProblema(detalleProblemaData);

        if (response.statusCode !== 201) {
          setOpen(true);
          setModalMessage(`La fecha ingresada ${formData.fechaRegistro} no debe de ser futura`);
          return;
        }
        // limpiar los campos
        setFormData({
          descripcion: '',
          fechaRegistro: '',
          fechaActual: new Date(),
          medioReporte: optionsMedioReporte[0]?.value || '',
          solucion: '',
          categoria: optionsCategoria[0]?.nombre || '',
          prioridad: optionsPrioridad[0]?.nombre || '',
          categoriaId: optionsCategoria[0]?.id,
          prioridadId: optionsPrioridad[0]?.id,
          idProblemaGeneral: 0,
        });
        // refrescar la tabla
        onSuccessRegistro?.(`Detalle de Problema creada con éxito para el código de bien ${row?.codigoBien}`);
      } catch (error) {
        setOpen(true);
        setModalMessage('Ha ocurrido un error al registrar el de' + error.message);
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
          width: 450, // Ancho adaptable
          maxWidth: 700, // Ancho máximo consistente
          height: '93vh', // Altura fija como viewport
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
          <form onSubmit={handleInsertDetalleProblema}>
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
              Registro de Detalle de Problema
            </Typography>
            <Typography
              fontSize={13}
              align="left"
              sx={{
                mb: 3,
                fontWeight: 'bold',
                color: 'text.primary',
              }}
            >
              Se generará un detalle de problema para el activo{' '}
              <strong color="green"> {row?.nombreActivo} </strong>
            </Typography>
            {/* texta area para la descripcion */}
            <Box marginY={3.5}>
              <TextField
                label="Descripción"
                autoFocus
                fullWidth
                variant="outlined"
                name="descripcion"
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={handleChange}
                multiline
                rows={4}
                sx={{
                  ...finalStyleInput,
                }}
              />
            </Box>
            {/* campo para la fecha registro */}
            <Box marginY={3.5}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Fecha de Registro"
                  format="dd-MM-yyyy HH:mm:ss"
                  value={formData.fechaActual}
                  onChange={handleDateChange}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Box>
            {/* campo para el medio de reporte */}
            <Box marginY={3.5}>
              <FormControl
                fullWidth
                variant="outlined"
                sx={{
                  ...finalStyleSelect,
                }}
              >
                <InputLabel>Medio de Reporte</InputLabel>
                <Select
                  value={formData.medioReporte}
                  onChange={handleMedioReporteChange}
                  name="medioReporte"
                >
                  {optionsMedioReporte.map((option) => (
                    <MenuItem key={option.id} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {/* campo para la posible solución */}
            <Box marginY={3.5}>
              <TextField
                label="Posible solución"
                fullWidth
                variant="outlined"
                name="solucion"
                placeholder="Ingresar la posible solución si es necesario"
                value={formData.solucion}
                onChange={handleChange}
                multiline
                rows={4}
                sx={{
                  ...finalStyleInput,
                }}
              />
            </Box>
            {/* campo para la categoria */}
            <Box marginY={3.5}>
              <FormControl
                fullWidth
                variant="outlined"
                sx={{
                  ...finalStyleSelect,
                }}
              >
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={formData.categoria}
                  onChange={handleCategoriaChange}
                  name="categoria"
                >
                  {memoizedOptionsCategoria.map((option) => (
                    <MenuItem key={option.id} value={option.nombre}>
                      {capitalizeWords(option.nombre || '')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {/* campo para la prioridad */}
            <Box marginY={3.5}>
              <FormControl
                fullWidth
                variant="outlined"
                sx={{
                  ...finalStyleSelect,
                }}
              >
                <InputLabel>Prioridad</InputLabel>
                <Select
                  value={formData.prioridad}
                  onChange={handlePrioridadChange}
                  name="prioridad"
                >
                  {memoizedOptionsPrioridad.map((option) => (
                    <MenuItem key={option.id} value={option.nombre}>
                      {capitalizeWords(option.nombre || '')}
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
              Crear Detalle de Problema
            </Button>
            <ReusableModal
              open={openR}
              onClose={handleClose}
              title="Mensaje"
              message={modalMessage}
              confirmText="Cerrar"
            />
          </form>
        </Box>
      </Box>
    );
  },
);

export default React.memo(FormRegistroDetalleProblema);
