import React from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import '../styles/ModalPersonalizado.css';

// Definir el tipo de cada campo de entrada opcional
interface Field {
  label: string;
  name: string;
}

// Definir las propiedades del componente ModalPersonalizado
interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  fields?: Field[];
  onSubmit?: (data: Record<string, string>) => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onClose,
  title = "Mensaje",
  message,
  fields = [],
  onSubmit,
}) => {
  const [fieldValues, setFieldValues] = React.useState<Record<string, string>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFieldValues({ ...fieldValues, [name]: value });
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(fieldValues);
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          {message}
        </Typography>

        {fields.map((field, index) => (
          <TextField
            key={index}
            margin="normal"
            fullWidth
            label={field.label}
            name={field.name}
            value={fieldValues[field.name] || ""}
            onChange={handleInputChange}
          />
        ))}

        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button onClick={onClose} color="secondary" sx={{ mr: 1 }}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Aceptar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CustomModal;