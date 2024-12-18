import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from '@mui/material';
import { useState } from 'react';

interface OptionsConfigProps {
  setSelectedOption: (option: string) => void;
}

const OptionsConfig: React.FC<OptionsConfigProps> = ({ setSelectedOption }) => {
  const [optionSelect, setOptionSelect] = useState('Categoria');
  const optionsConfig = [
    { id: 1, value: 'Categoria' },
    { id: 2, value: 'Prioridad' },
    { id: 3, value: 'Tipo Mantenimiento' },
    { id: 4, value: 'Rol' },
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
            {optionsConfig.map((option) => (
              <MenuItem
                defaultChecked
                defaultValue={optionsConfig[0].value}
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

export default OptionsConfig;