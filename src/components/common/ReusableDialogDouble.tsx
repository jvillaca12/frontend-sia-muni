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
  onClick: () => void; // Se agrega un nuevo evento onClick
  title: string;
  message: string;
  cancelText?: string | null;
  confirmText?: string | null;
  additionalContent?: React.ReactNode;
}

const ReusableModalDouble: React.FC<ReusableModalProps> = ({
  open,
  onClose,
  onClick,
  title,
  message,
  cancelText,
  confirmText,
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
            margin: 5,
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
          {cancelText}
        </Button>
        {confirmText && (
          <Button
            style={{
              margin: 5,
              background: 'red',
              border: '2px solid #fff',
              width: '130px',
              height: '41px',
              fontWeight: 600,
              fontSize: '0.8rem',
            }}
            onClick={onClick}
            color="primary"
          >
            {confirmText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ReusableModalDouble;