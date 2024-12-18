import { Box, Modal, Typography } from '@mui/material';
import { DetalleProblemaDTO } from 'data/interfaces/DetalleProblemaDTO';
import { useEffect, useState } from 'react';
import InfoIcon from '@mui/icons-material/Info';

interface ModalDetalleProblemaProps {
  open: boolean;
  onClose: () => void;
  row: DetalleProblemaDTO | null;
}

const ModalDetalleProblema: React.FC<ModalDetalleProblemaProps> = ({ open, onClose, row }) => {
  const [selectedRow, setSelectedRow] = useState<DetalleProblemaDTO | null>(null);

  useEffect(() => {
    setSelectedRow(row);
  }, [row]);

  const handleClose = () => {
    onClose();
    setSelectedRow(null);
  };

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
        <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center'}}>
          <InfoIcon color="primary" sx={{ fontSize: 30, mr: 1}} /> Detalles de la Incidencia
        </Typography>
        {selectedRow && (
          <>
            <Typography sx={{ mt: 2 }}>
              <strong>Descripción:</strong> {selectedRow?.descripcion}
            </Typography>
            <Typography sx={{ mt: 2 }}>
              <strong>Solución:</strong> {selectedRow?.solucion || 'Solución vacía'}
            </Typography>
            <Typography sx={{ mt: 2 }}>
              <strong>Empleado:</strong> {selectedRow.nombreEmpleado}
            </Typography>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default ModalDetalleProblema;
