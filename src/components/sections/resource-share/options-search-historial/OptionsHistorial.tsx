import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from '@mui/material';
import UserService from 'data/services/UserService';
import { useState } from 'react';

interface OptionsHistorialProps {
  setSelectedOption: (option: string) => void;
}

const OptionsHistorial: React.FC<OptionsHistorialProps> = ({ setSelectedOption }) => {
  const rol = UserService.isAdmin();
  const [optionSelect, setOptionSelect] = useState('Activos');
  const optionsAdmin = [
    { id: 1, value: 'Activos' },
    { id: 2, value: 'Empleados' },
    { id: 4, value: 'Problema General' },
    { id: 5, value: 'Detalle Problemas' },
    { id: 6, value: 'Oficina' },
    { id: 7, value: 'Proveedor' },
  ];
  const optionsSoporte = [
    { id: 1, value: 'Activos' },
    { id: 2, value: 'Empleados' },
    { id: 3, value: 'Oficina' },
    { id: 4, value: 'Proveedor' },
  ];
  
  const handleChangeOption = (e: SelectChangeEvent<string>) => {
    setOptionSelect(e.target.value);
    setSelectedOption(e.target.value);
  };

  const finalStyleSelect = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'primary',
      transition: 'none',
    },
  };
  
  return (
    <Box marginY={3.5}>
      <Stack direction="row" alignItems="center" spacing={5}>
        <FormControl
          sx={{
            width: {
              xs: '50%',
              sm: '30%',
              md: '25%',
              lg: '20%',
            },
            ...finalStyleSelect,
          }}
          variant="outlined"
        >
          <InputLabel>Opciones</InputLabel>
          <Select value={optionSelect} onChange={handleChangeOption} name="optionSelect">
            {rol
              ? optionsAdmin.map((option) => (
                  <MenuItem
                    defaultChecked
                    defaultValue={optionsAdmin[0].value}
                    key={option.id}
                    value={option.value}
                  >
                    {option.value}
                  </MenuItem>
                ))
              : optionsSoporte.map((option) => (
                  <MenuItem
                    defaultValue={optionsSoporte[0].value}
                    key={option.id}
                    value={option.value}
                  >
                    {option.value}
                  </MenuItem>
                ))}
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
};

export default OptionsHistorial;
