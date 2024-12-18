import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DetalleProblemaDTO } from 'data/interfaces/DetalleProblemaDTO';
import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { capitalizeWords } from 'helpers/capitalizar-palabra';
import { useDataCategoria } from 'hooks/hooks-soporte/useDataCategoria';
import { usePrioridadData } from 'hooks/hooks-soporte/useDataPrioridad';
import DetalleProblemaService from 'data/services/DetalleProblemaService';
import ReusableModal from 'components/common/ResuableDialog';
import ReusableModalDouble from 'components/common/ReusableDialogDouble';

// las propiedades del formulario cuando se exporta a otra clase
interface FormActualizarDetalleProblemaProps {
  openUpdateModal: boolean;
  handleClose: () => void;
  row: DetalleProblemaDTO | null;
  idProblemaGeneral: number,
  idDetalleProblema: number;
  onSuccessRegistro: (message?: string) => void;
}

const FormActualizarDetalleProblema: React.FC<FormActualizarDetalleProblemaProps> = ({
  openUpdateModal,
  handleClose,
  row,
  idProblemaGeneral,
  idDetalleProblema,
  onSuccessRegistro,
}) => {
  // para obtener los datos de la categoria
  const { fetchDataCategorias, optionsCategoria } = useDataCategoria();
  // para obtener los datos de la prioridad
  const { fetchDataPrioridades, optionsPrioridad } = usePrioridadData();
  // para establecer el mensaje del modal, para los campos faltantes
  const [modalMessage, setModalMessage] = useState('');
  // para abrir el modal en caso los campos esten vacios
  const [openReusable, setOpenReusable] = useState(false);
  // para abrir el modal de confirmacion de actualizar el detalle problema
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  // estado para ver si se ha confirmado la actualizaciond del detalle problema
  const [hasUpdate, setHasUpdated] = useState(false);
  // para actualizar el detalle problema con los datos del formulario
  const [formData, setFormData] = useState<DetalleProblemaDTO>({
    idDetalleProblema: 0,
    descripcion: '',
    fechaRegistro: '',
    fechaActual: new Date(),
    medioReporte: '',
    solucion: '',
    categoria: '',
    prioridad: '',
    categoriaId: 0,
    prioridadId: 0,
    solucionadoText: '',
    solucionado: false,
    idProblemaGeneral: 0,
  });
  // opciones para el medio de reporte
  const optionsMedioReporte = [
    { id: 1, value: 'Correo' },
    { id: 2, value: 'Presencial' },
    { id: 3, value: 'Telefono/Whatsapp' },
  ];
  // opciones para el solucionado
  const optionsSolucion = [
    { id: 1, value: 'Si' },
    { id: 2, value: 'No' },
  ];
  // espacio en el eje Y en los componentes
  const spaceInputY = 3.5;

  // Efecto para resetear estados cuando se abre el modal con una nueva fila
  useEffect(() => {
    if (openUpdateModal) {
      setHasUpdated(false);
      setOpenReusable(false);
      setOpenConfirmModal(false);
      setModalMessage('');
    }
  }, [openUpdateModal, idDetalleProblema]);

  // cargando la data una sola vez
  useEffect(() => {
    const fetchData = async () => {
      await fetchDataCategorias();
      await fetchDataPrioridades();
    };
    fetchData();
  }, [fetchDataCategorias, fetchDataPrioridades]);

  // memorizando la data de categoria y prioridad
  const memoizedOptionsCategoria = useMemo(() => optionsCategoria, [optionsCategoria]);
  const memoizedOptionsPrioridad = useMemo(() => optionsPrioridad, [optionsPrioridad]);

  // para establecer los valores obtenidos de la fila de la tabla en el formulario
  useEffect(() => {
    if (row && openUpdateModal && !hasUpdate) {
      // buscar la categoria por el valor de la fila seleccionada
      const selectedCategoria = memoizedOptionsCategoria.find(
        (option) => option?.nombre?.toLowerCase() === row.categoria?.toLowerCase(),
      );
      // buscar la prioridad por el valor de la fila seleccionada
      const selectedPrioridad = memoizedOptionsPrioridad.find(
        (option) => option.nombre?.toLowerCase() === row.prioridad?.toLowerCase(),
      );

      // estableciendo los valores de al fila obtenida al formulario actualizar
      setFormData({
        idDetalleProblema: row.idDetalleProblema || 0,
        descripcion: row.descripcion || '',
        fechaRegistro: row.fechaRegistro || '',
        fechaActual: row.fechaRegistro ? new Date(Date.parse(row.fechaRegistro)) : new Date(),
        medioReporte: row.medioReporte || 'VACIO',
        solucion: row.solucion || '',
        categoria: selectedCategoria?.nombre,
        categoriaId: selectedCategoria?.id,
        prioridad: selectedPrioridad?.nombre,
        prioridadId: selectedPrioridad?.id,
        solucionadoText: row?.solucionadoText || '',
        solucionado: row?.solucionadoText === 'Si',
        idProblemaGeneral: idProblemaGeneral ? idProblemaGeneral :  row?.idProblemaGeneral || 1,
      });
      setOpenConfirmModal(false);
    }
  }, [row, idProblemaGeneral, memoizedOptionsCategoria, memoizedOptionsPrioridad, openUpdateModal, hasUpdate]);

  // para establecer el valor del medio reporte, si esta seleccionado
  const handleMedioReporteChange = (e: SelectChangeEvent<string>) => {
    const selectedMReporte = optionsMedioReporte.find((option) => option.value === e.target.value);
    if (selectedMReporte) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        medioReporte: selectedMReporte.value,
      }));
    }
  };

  // para establecer el valor de la fecha de ocurrencia formateada
  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd HH:mm:ss');
      setFormData((prevFormData) => ({
        ...prevFormData,
        fechaRegistro: formattedDate,
        fechaActual: date,
      }));
    }
  };

  // para establecer el valor de cada input HTML del formulario, hacia la data de detalle problema
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // esto es para manejar el valor de la categoria, para obtener el nombre y id
  const handleCategoriaChange = (e: SelectChangeEvent<string>) => {
    const selectedCategoria = memoizedOptionsCategoria.find(
      (option) => option.nombre === e.target.value,
    );
    if (selectedCategoria) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        categoria: selectedCategoria?.nombre?.toLowerCase(),
        categoriaId: selectedCategoria?.id,
      }));
    }
  };

  // esto es para manejar el valor de la prioridad, para obtener el nombre y id
  const handlePrioridadChange = (e: SelectChangeEvent<string>) => {
    const selectedPrioridad = memoizedOptionsPrioridad.find(
      (option) => option.nombre === e.target.value,
    );
    if (selectedPrioridad) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        prioridad: selectedPrioridad.nombre?.toLowerCase(),
        prioridadId: selectedPrioridad.id,
      }));
    }
  };

  // esto es para manejar el valor de si esta solucionado (NO o SI)
  const handleSolucionadoChange = (e: SelectChangeEvent<string>) => {
    const resuelto = optionsSolucion.find((option) => option.value === e.target.value);
    if (resuelto) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        solucionadoText: resuelto.value,
        solucionado: resuelto.value === 'Si',
      }));
    }
  };

  // para actualizar el detalle problema
  const handleActualizarDetalleProblema = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !formData?.descripcion?.trim() ||
      !formData?.categoriaId ||
      !formData?.prioridadId ||
      !formData?.idProblemaGeneral
    ) {
      setOpenReusable(true);
      setModalMessage('Por favor, complete los campos');
      return;
    }

    // abrir el modal de confirmacion de actualizar el detalle problema
    setOpenConfirmModal(true);
  };

  const updateConfirmDetalleProblema = async () => {
    try {
      // actualizar el objeto de datos a enviar
      const detalleProblemaData = {
        descripcion: formData.descripcion,
        fechaRegistro: formData.fechaRegistro || format(new Date(), 'yyyy-MM-dd HH:mm:ss'), // Si no hay fecha, usar la actual
        medioReporte: formData.medioReporte,
        solucion: formData.solucion || 'Solución vacía',
        categoriaId: Number(formData.categoriaId),
        prioridadId: Number(formData.prioridadId),
        solucionado: formData.solucionado,
        idProblemaGeneral: formData.idProblemaGeneral,
      };
      // llamar al metodo para actualizar el detalle problema
      const response = await DetalleProblemaService.actualizarDetalleProblema(
        idDetalleProblema,
        detalleProblemaData,
      );

      if (response.statusCode !== 201) {
        setOpenReusable(true);
        setModalMessage(
          `La fecha ingresada ${detalleProblemaData.fechaRegistro} no coincide con la fecha actual`,
        );
        return;
      }
      setHasUpdated(true);
      setOpenConfirmModal(false);
      onSuccessRegistro?.(`${capitalizeWords(formData.categoria || '')} actualizado con éxito`);
    } catch (error) {
      setOpenReusable(true);
      setModalMessage(error.message);
    }
  };

  const handleModalClose = () => {
    setOpenReusable(false);
    if (hasUpdate) {
      handleClose();
      // Resetear todos los estados
      setHasUpdated(false);
      setFormData({
        idDetalleProblema: 0,
        descripcion: '',
        fechaRegistro: '',
        fechaActual: new Date(),
        medioReporte: '',
        solucion: '',
        categoria: '',
        prioridad: '',
        categoriaId: 0,
        prioridadId: 0,
        solucionadoText: '',
        solucionado: false,
        idProblemaGeneral: 0,
      });
      idProblemaGeneral = 0;
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
          width: 450, // Ancho adaptable
          maxWidth: 700, // Ancho máximo consistente
          height: '98vh', // Altura fija como viewport
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
          <form onSubmit={handleActualizarDetalleProblema}>
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
              Actualización Detalle Problema
            </Typography>
            <Typography
              variant="subtitle1"
              component="p"
              align="left"
              sx={{
                mb: 1,
                fontWeight: 'light',
                color: 'text.secondary',
                fontSize: '0.9rem',
              }}
            >
              Código Probema: {row?.codigoProblema}
            </Typography>
            {/* text area para la descripcion */}
            <Box marginY={spaceInputY}>
              <TextField
                label="Descripción"
                fullWidth
                variant="outlined"
                name="descripcion"
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={handleInputChange}
                multiline
                rows={4}
                sx={{ ...finalStyleInput }}
              />
            </Box>
            {/* campo para la fecha ocurrencia */}
            <Box marginY={spaceInputY}>
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
            {/* campo para el medio de reporte */}
            <Box marginY={spaceInputY}>
              <FormControl fullWidth variant="outlined" sx={{ ...finalStyleSelect }}>
                <InputLabel>Medio de Reporte</InputLabel>
                <Select
                  value={formData.medioReporte}
                  onChange={handleMedioReporteChange}
                  name="medioReporte"
                  label="Medio de Reporte"
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
            <Box marginY={spaceInputY}>
              <TextField
                label="Posible solución"
                fullWidth
                variant="outlined"
                name="solucion"
                placeholder="Posible solución"
                value={formData.solucion}
                onChange={handleInputChange}
                multiline
                rows={4}
                sx={{ ...finalStyleInput }}
              />
            </Box>
            {/* campo para la categoria */}
            <Box marginY={spaceInputY}>
              <FormControl fullWidth variant="outlined" sx={{ ...finalStyleInput }}>
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={formData.categoria}
                  onChange={handleCategoriaChange}
                  name="categoria"
                  label="Categoria"
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
            <Box marginY={spaceInputY}>
              <FormControl fullWidth variant="outlined" sx={{ ...finalStyleSelect }}>
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
            <Box marginY={spaceInputY}>
              <FormControl fullWidth variant="outlined" sx={{ ...finalStyleSelect }}>
                <InputLabel>Solucionado</InputLabel>
                <Select
                  value={formData.solucionadoText}
                  onChange={handleSolucionadoChange}
                  name="solucionadoText"
                >
                  {optionsSolucion.map((option) => (
                    <MenuItem key={option.id} value={option.value}>
                      {capitalizeWords(option.value)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Actualizar Detalle Problema
            </Button>
            <ReusableModal
              open={openReusable}
              onClose={handleModalClose}
              title="Aviso"
              message={modalMessage}
              confirmText="Cerrar"
            />
            <ReusableModalDouble
              open={openConfirmModal}
              onClose={() => setOpenConfirmModal(false)}
              onClick={updateConfirmDetalleProblema}
              title="Confirmar Actualización"
              message="¿Está seguro de actualizar este detalle problema?"
              cancelText="Cancelar"
              confirmText="Actualizar"
            />
          </form>
        </Box>
      </Box>
    </Modal>
  );
};

export default React.memo(FormActualizarDetalleProblema);
