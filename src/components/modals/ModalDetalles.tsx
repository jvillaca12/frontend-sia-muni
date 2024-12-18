import { Box, Modal, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import InfoIcon from '@mui/icons-material/Info';

interface Detalle {
  label: string;
  value: string;
}

interface ModalDetallesProps {
  open: boolean;
  onClose: () => void;
  detalles: Detalle[];
  restablecerData?: () => void;
}

const ModalDetalles: React.FC<ModalDetallesProps> = ({ open, onClose, detalles }) => {
  const [selectedDetalles, setSelectedDetalles] = useState<Detalle[]>([]);

  // para montar los detalles
  useEffect(() => {
    setSelectedDetalles(detalles);
  }, [detalles]);

  // para cerrar el modal detalles
  const handleClose = () => {
    onClose();
    setSelectedDetalles([]);
  };

  // retornando el modal con los detalles
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 5,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center' }}>
          <InfoIcon color="primary" sx={{ fontSize: 30, mr: 1 }} /> Detalles
        </Typography>
        {selectedDetalles.map((detalle, index) => (
          <Typography key={index} sx={{ mt: 2 }}>
            <strong>{detalle.label}:</strong> {detalle.value || 'N/A'}
          </Typography>
        ))}
      </Box>
    </Modal>
  );
};

export default ModalDetalles;
