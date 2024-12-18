import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { MantenimientoDTO } from 'data/interfaces/MantenimientoDTO';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { capitalizeWords } from 'helpers/capitalizar-palabra';

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  data?: MantenimientoDTO | null;
  restablecerData: () => void;
}

const ModalDetalleProblemaPorMantenimiento: React.FC<CustomModalProps> = ({
  open,
  onClose,
  title,
  message,
  data,
}) => {
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
        }}
      >
        <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningAmberIcon color="primary" sx={{ fontSize: 30, mr: 1 }} />
          {title}
        </Typography>
        <Typography sx={{ mt: 2 }}>{message}</Typography>
        {data && (
          <>
            <Typography sx={{ mt: 2 }}>
              <strong style={{ color: 'green' }}>ID Mantenimiento:</strong> {data?.idMantenimiento}
            </Typography>
            <Typography sx={{ mt: 2 }}>
              <strong style={{ color: 'green' }}>Código Incidencia:</strong> {data?.codigoProblema}
            </Typography>
            <Typography sx={{ mt: 2 }}>
              <strong style={{ color: 'green' }}>Fecha Programada:</strong> {data?.fechaProgramada}
            </Typography>
            <Typography sx={{ mt: 2 }}>
              <strong style={{ color: 'green' }}>Tipo Mantenimiento:</strong>{' '}
              {data?.tipoMantenimiento}
            </Typography>
            <Typography sx={{ mt: 2 }}>
              <strong style={{ color: 'green' }}>Personal:</strong>{' '}
              {capitalizeWords(data?.personal || ' ')}
            </Typography>
            <Box sx={{ marginY: 3 }}>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  width: 150,
                  height: 30,
                  fontSize: 12,
                }}
              >
                Más detalles
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default React.memo(ModalDetalleProblemaPorMantenimiento);
