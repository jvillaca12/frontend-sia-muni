import React from 'react';
import { Modal, Box, Typography, Divider } from '@mui/material';
import { AuditoriaDTO } from 'data/interfaces/AuditoriaDTO';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  data?: AuditoriaDTO[] | [];
  restablecerData: () => void;
}

const ModalAudiMantenimientoDetail: React.FC<CustomModalProps> = ({
  open,
  onClose,
  title,
  message,
  data,
}) => {
  const detalles =
    data && data.length > 0
      ? data.flatMap((item) => [
          { label: 'ID Mantenimiento', value: `${item?.idMantenimiento}` || '' },
          { label: 'Fecha de Cambio', value: item?.fechaCambio || '' },
          { label: 'Cambio Realizado', value: item?.cambioRealizado || '' },
        ])
      : [];

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          boxShadow: 20,
          p: 4,
          borderRadius: 5,
          overflow: 'auto', // Permitir scroll si el contenido excede el tamaño del modal
        }}
      >
        <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningAmberIcon color="primary" sx={{ fontSize: 30, mr: 1 }} />
          {title}
        </Typography>
        <Typography sx={{ mt: 2 }}>{message}</Typography>
        {detalles.map((detalle, index) => (
          <React.Fragment key={index}>
            <Typography sx={{ mt: 2 }}>
              <strong>{detalle.label}:</strong> {detalle.value || 'N/A'}
            </Typography>
            {(index + 1) % 3 === 0 && index !== detalles.length - 1 && <Divider sx={{ mt: 2 }} />}
          </React.Fragment>
        ))}
      </Box>
    </Modal>
  );
};

export default ModalAudiMantenimientoDetail;