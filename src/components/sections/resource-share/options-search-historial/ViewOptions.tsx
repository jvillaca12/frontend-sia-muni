import { Box, Paper, Typography } from '@mui/material';
import OptionsHistorial from './OptionsHistorial';
import ViewTableHistorial from 'components/sections/data-share-historial/incidencias-fallos-view/ViewTableHistorialFI';
import { useState } from 'react';
import ViewTableHistorialEmpleado from 'components/sections/data-share-historial/empleados-view/ViewTableHistorialEmpleado';
import ViewTableHistorialOficina from 'components/sections/data-share-historial/oficina-view/ViewTableHistorialOficina';
import ViewTableHistorialProveedor from 'components/sections/data-share-historial/proveedor-view/ViewTableHistorialProveedor';
import DynamicRadioGroup from 'components/common/RadioButtonDinamicos';
import ViewTableHistorialHardware from 'components/sections/data-share-historial/activos-informaticos-view/hardware-view/ViewTableHistorialHardware';
import ViewTableHistorialSoftware from 'components/sections/data-share-historial/activos-informaticos-view/software-view/ViewTableHistorialSoftware';
import ViewTableHistorialRed from 'components/sections/data-share-historial/activos-informaticos-view/infra-red-view/ViewTableHistorialRed';
import ViewSeguimientoProblema from 'components/sections/dashboard-soporte/seguimiento-problema/ViewSeguimientoProblema';

const ViewOptions: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>('Activos');
  const [selectedOptionRadio, setSelectedOptionRadio] = useState('hardware');

  const optionsActivo = [
    { name: 'hardware', label: 'Hardware' },
    { name: 'software', label: 'Software' },
    { name: 'red', label: 'Infraestructura de red' },
  ];

  return (
    <Box>
      <Typography fontSize={'20px'} fontWeight={'bold'}>
        Para ver el historial sobre{' '}
        <strong color="green"> las incidencias y/o fallos sobre los activos informáticos </strong> u
        otros aspectos seleccione alguna opción
      </Typography>
      <OptionsHistorial setSelectedOption={setSelectedOption} />
      {selectedOption === 'Activos' ? (
        <DynamicRadioGroup
          options={optionsActivo}
          selectedValue={selectedOptionRadio}
          onChange={setSelectedOptionRadio}
          defaultValue="hardware"
        />
      ) : null}
      <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
        {selectedOption === 'Detalle Problemas' && <ViewTableHistorial />}
        {selectedOption === 'Empleados' && <ViewTableHistorialEmpleado />}
        {selectedOption === 'Oficina' && <ViewTableHistorialOficina />}
        {selectedOption === 'Proveedor' && <ViewTableHistorialProveedor />}
        {selectedOption === 'Activos' && selectedOptionRadio === 'hardware' && (
          <ViewTableHistorialHardware />
        )}
        {selectedOption === 'Activos' && selectedOptionRadio === 'software' && (
          <ViewTableHistorialSoftware />
        )}
                {selectedOption === 'Activos' && selectedOptionRadio === 'red' && (
          <ViewTableHistorialRed />
        )}
      </Paper>
      {selectedOption === 'Problema General' &&<ViewSeguimientoProblema />}
    </Box>
  );
};

export default ViewOptions;
