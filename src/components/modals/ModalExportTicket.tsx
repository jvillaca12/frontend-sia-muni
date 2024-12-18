import { faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { DetalleProblemaDTO } from 'data/interfaces/DetalleProblemaDTO';
import { capitalizeWords } from 'helpers/capitalizar-palabra';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  onGenerateTicket: () => void;
  fallo: DetalleProblemaDTO | null;
}

const ExportModalTicket = ({ open, onClose, onGenerateTicket, fallo }: ExportModalProps) => {
  const iconTicket = <FontAwesomeIcon icon={faTicket} style={{ color: 'green' }} />;
  const styleButton = (color?: string) => ({
    margin: 5,
    background: 'none',
    border: '2px solid #fff',
    width: '250px',
    height: '41px',
    fontWeight: 600,
    fontSize: '0.8rem',
    backgroundColor: color,
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Generar Ticket a {capitalizeWords(fallo?.nombreEmpleado || '')}</DialogTitle>
      <DialogContent>
        <p>
          Se va a generar un ticket como evidencia de {capitalizeWords(fallo?.categoria || '')}{' '}
          registrado
        </p>
      </DialogContent>
      <DialogActions>
        <Button style={styleButton('primary')} onClick={onClose}>
          Cancelar
        </Button>
        <Button startIcon={iconTicket} style={styleButton('#02884b')} onClick={onGenerateTicket}>
          Generar Ticket
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportModalTicket;