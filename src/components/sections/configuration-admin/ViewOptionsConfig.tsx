import { Box, Paper, Typography } from '@mui/material';
import React, { useState } from 'react';
import OptionsConfig from './OptionsConfig';
import ViewCategoriaData from './categoria-config/ViewTableCategoria';
import ViewPrioridadData from './prioridad-config/ViewTablePrioridad';
import ViewTipoManData from './tp-config/ViewTableTipoMan';
import ViewTableRol from './rol-config/ViewTableRol';

const ViewOptionsConfig: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>('Categoria');

  return (
    <Box>
      <Typography fontSize={'20px'} fontWeight={'bold'}>
        En configuración puede auditar 
        <strong color="green" className='font-bold'> Categoria, Prioridad, Rol y Tipo de Mantenimiento</strong>, 
        para ello seleccione alguna opción
      </Typography>
      <OptionsConfig setSelectedOption={setSelectedOption} />
      <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
        {selectedOption === 'Categoria' && <ViewCategoriaData />}
        {selectedOption === 'Prioridad' && <ViewPrioridadData />}
        {selectedOption === 'Tipo Mantenimiento' && <ViewTipoManData />}
        {selectedOption === 'Rol' && <ViewTableRol />}
      </Paper>
    </Box>
  );
};

export default React.memo(ViewOptionsConfig);