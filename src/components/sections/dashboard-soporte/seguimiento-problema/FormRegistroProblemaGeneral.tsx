import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField, Autocomplete } from '@mui/material';
import { Box, Button, Typography } from '@mui/material';
import { TableActivosSinProblemas } from 'data/interfaces/TablaFallo';
import ReusableModal from 'components/common/ResuableDialog';
import { format } from 'date-fns';
import { useActivosSinProblemas } from 'hooks/hooks-soporte/useDataActivos';
import { useUserProfile } from 'hooks/hooks-user/useProfileUser';
import { DateTimePicker } from '@mui/x-date-pickers';
import { ProblemaGeneralDTO } from 'data/interfaces/ProblemaGeneralDTO';
import { ProblemaGeneralService } from 'data/services/ProblemaGeneralService';

interface FormProblemaGeneralProps {
  onClose: () => void;
  onSuccessRegistro?: (message?: string) => void;
}

const FormRegistroProblemaGeneral: React.FC<FormProblemaGeneralProps> = forwardRef(
  ({ onClose, onSuccessRegistro }, _ref) => {
    // para los modales de errores y mensajes
    const [modalMessage, setModalMessage] = useState('');
    // para hacer visible el modal de errores y mensajes
    const [openR, setOpen] = useState(false);
    // esto es para la data del formulario problema general
    const [formData, setFormData] = useState<ProblemaGeneralDTO>({
      idActivoMaestro: 0,
      idUsuario: 0,
      fechaOcurrencia: null,
      fechaActual: new Date(),
    });
    // para usar el hook de activos sin problemas
    const { dataActivosSinProblemas, fetchActivosSinProblemas } = useActivosSinProblemas();
    // hook que obtiene el perfil actual del usuario
    const { user, fetchUserProfile } = useUserProfile();
    // array de sugerencias de la tabla de activos sin problemas
    const [suggestions, setSuggestions] = useState<TableActivosSinProblemas[]>([]);
    // el valor del input al seleccionar un activo de las sugerencias
    const [inputValue, setInputValue] = useState('');
    // el activo seleccionado de las sugerencias
    const [selectedOption, setSelectedOption] = useState<TableActivosSinProblemas | null>(null);
    // formateando la fecha actual
    const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    // cargando la data una sola vez
    useEffect(() => {
      const fetchData = async () => {
        await fetchActivosSinProblemas();
        await fetchUserProfile();
      };
      fetchData();
    }, [fetchActivosSinProblemas, fetchUserProfile]);

    // memorizar la data de los activos y el usuario actual
    const memoizedOptionsActivos = useMemo(
      () => dataActivosSinProblemas,
      [dataActivosSinProblemas],
    );
    const memoizedUser = useMemo(() => user, [user]);

    // para establecer los valores iniciales al formulario
    useEffect(() => {
      setFormData((prevData) => ({
        ...prevData,
        idUsuario: memoizedUser?.idUsuario || 0,
        fechaOcurrencia: currentDate,
      }));
    }, [user]);

    useEffect(() => {
      // para obtener el filtrado de los activos que no tienen asociados un problema general
      if (inputValue.length >= 4) {
        const filteredSuggestions = (memoizedOptionsActivos || []).filter((item) =>
          item.codigoBien?.includes(inputValue),
        );
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
    }, [memoizedOptionsActivos, inputValue]);

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

    // esto es para establecer la fecha actual
    const handleDateChange = (date: Date | null) => {
      if (date) {
        const formattedDate = format(date, 'yyyy-MM-dd HH:mm:ss');
        setFormData((prevFormData) => ({
          ...prevFormData,
          fechaOcurrencia: formattedDate,
        }));
      }
    };

    // para crear un nuevo problema
    const handleInsertProblemaGeneral = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!formData?.idUsuario || !formData?.idActivoMaestro) {
        setOpen(true);
        setModalMessage('Por favor completar los campos');
        return;
      }

      const dateOcurrencia = format(
        new Date(formData.fechaOcurrencia || ''),
        'yyyy-MM-dd HH:mm:ss',
      );

      if (dateOcurrencia > currentDate) {
        setOpen(true);
        setModalMessage('La fecha ocurrencia no debe de ser mayor a la fecha actual');
        return;
      }

      try {
        const existsActivoMaestroId = memoizedOptionsActivos.some(
          (option) => option.activoMaestroId === formData.idActivoMaestro,
        );

        if (!existsActivoMaestroId) {
          setOpen(true);
          setModalMessage('El código de bien no existe');
          return;
        }
        // Crear el objeto de datos a enviar
        const problemaGeneralData = {
          idActivoMaestro: Number(formData.idActivoMaestro),
          idUsuario: Number(formData.idUsuario),
          fechaOcurrencia: formData.fechaActual
            ? formData.fechaOcurrencia
            : format(new Date(), 'yyyy-MM-dd HH:mm:ss'), // Si no hay fecha, usar la actual
        };

        // llamar al metodo para crear un nuevo problema
        const response = await ProblemaGeneralService.insertProblemaGeneral(problemaGeneralData);

        if (response.statusCode !== 201) {
          setOpen(true);
          setModalMessage(
            `La fecha ingresada ${problemaGeneralData.fechaOcurrencia} no coincide con la fecha actual`,
          );
          return;
        }
        // limpiar los campos
        setFormData({
          idActivoMaestro: 0,
          idUsuario: user?.idUsuario || 0,
          fechaOcurrencia: '',
          fechaActual: new Date(),
        });
        setInputValue('');
        setSelectedOption(null);
        onSuccessRegistro?.('Problema General creado con éxito');
        onClose();
      } catch (error) {
        setOpen(true);
        setModalMessage('Ha ocurrido un error al registrar el Problema General' + error.message);
      }
    };

    const handleInputChange = (_event: React.ChangeEvent<{}>, newInputValue: string) => {
      setInputValue(newInputValue);
    };

    const handleOptionChange = (
      event: React.SyntheticEvent<Element, Event>,
      newValue: string | TableActivosSinProblemas | null,
    ) => {
      event.preventDefault();
      if (typeof newValue === 'string') {
        setSelectedOption(null);
      } else {
        setSelectedOption(newValue as TableActivosSinProblemas);
        setFormData((prevFormData) => ({
          ...prevFormData,
          idActivoMaestro: newValue ? newValue.activoMaestroId : 0,
        }));
      }
    };

    const getOptionLabel = (option: string | TableActivosSinProblemas) => {
      if (typeof option === 'string') {
        return option;
      }
      return `${option.codigoBien} - ${option.nombreActivo} - ${option.nombreEmpleado}`;
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
          width: 400, // Ancho adaptable
          maxWidth: 700, // Ancho máximo consistente
          height: '37vh', // Altura fija como viewport
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
          <form onSubmit={handleInsertProblemaGeneral}>
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
              Registrar Problema General
            </Typography>
            {/* campo para el id del activo maestro */}
            <Box marginY={3.5}>
              <Autocomplete
                freeSolo
                options={suggestions}
                getOptionLabel={getOptionLabel}
                inputValue={inputValue}
                onInputChange={handleInputChange}
                value={
                  selectedOption
                    ? `${selectedOption?.codigoBien} - ${selectedOption?.nombreActivo}`
                    : ''
                }
                onChange={handleOptionChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Código de Bien"
                    fullWidth
                    autoFocus
                    variant="outlined"
                    name="activoMaestroId"
                    placeholder="Ingresar código de bien"
                    value={formData.idActivoMaestro}
                    onChange={handleChange}
                    sx={{
                      ...finalStyleInput,
                    }}
                  />
                )}
              />
            </Box>
            {/* campo para la fecha ocurrencia */}
            <Box marginY={3.5}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Fecha de la ocurrencia"
                  format="dd-MM-yyyy HH:mm:ss"
                  value={formData.fechaActual}
                  onChange={handleDateChange}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
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
              Crear Problema General
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
  },
);

export default React.memo(FormRegistroProblemaGeneral);
