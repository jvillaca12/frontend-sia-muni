// components/common/ReusableModal.tsx
import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';

interface ReusableModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
}

const ReusableModal: React.FC<ReusableModalProps> = ({
  open,
  onClose,
  title,
  message,
  confirmText = 'Cerrar',
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          style={{
            margin: 0,
            background: 'none',
            border: '2px solid #fff',
            width: '130px',
            height: '41px',
            fontWeight: 600,
            fontSize: '0.8rem',
          }}
          onClick={onClose}
          color="primary"
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReusableModal;
