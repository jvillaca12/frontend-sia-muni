import { Box, Paper } from '@mui/material';
import DynamicRadioGroup from 'components/common/RadioButtonDinamicos';
import { ReactElement, useState } from 'react';
import ViewUserData from './user/ViewUserData';
import ViewPersonalData from './personal/ViewPersonalData';

const ViewDataUsuarioPersonal = (): ReactElement => {
  const [selectedOption, setSelectedOption] = useState('usuario');

  const options = [
    { name: 'usuario', label: 'Usuarios', defaultChecked: true },
    { name: 'personal', label: 'Personal' },
  ];

  return (
    <Box>
      <DynamicRadioGroup
        options={options}
        selectedValue={selectedOption}
        onChange={setSelectedOption}
        defaultValue="usuario"
      />
      <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
        {selectedOption === 'usuario' && <ViewUserData />}
        {selectedOption === 'personal' && <ViewPersonalData />}
      </Paper>
    </Box>
  );
};

export default ViewDataUsuarioPersonal;
