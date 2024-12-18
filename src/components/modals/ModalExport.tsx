import { faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  onExportCurrentPage: () => void;
  onExportAll: () => void;
  onExportFiltered: () => void;
  type: 'PDF' | 'Excel';
  hasFilters: boolean;
}

const ExportModal = ({
  open,
  onClose,
  onExportCurrentPage,
  onExportAll,
  onExportFiltered,
  type,
  hasFilters,
}: ExportModalProps) => {
  const iconExcel = <FontAwesomeIcon icon={faFileExcel} style={{ color: 'green' }} />;
  const iconPDF = <FontAwesomeIcon icon={faFilePdf} style={{ color: 'orange' }} />;
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
      <DialogTitle>Exportar a {type}</DialogTitle>
      <DialogContent>
        <p>Seleccione el rango de datos a exportar:</p>
      </DialogContent>
      <DialogActions>
        <Button style={styleButton('primary')} onClick={onClose}>
          Cancelar
        </Button>
        {hasFilters ? (
          <Button
            startIcon={type === 'Excel' ? iconExcel : iconPDF}
            style={styleButton(type === 'Excel' ? '#02884b' : '#db0433')}
            onClick={onExportFiltered}
          >
            Exportar datos filtrados
          </Button>
        ) : (
          <Button
            startIcon={type === 'Excel' ? iconExcel : iconPDF}
            style={styleButton(type === 'Excel' ? '#02884b' : '#db0433')}
            onClick={onExportCurrentPage}
          >
            Exportar página actual
          </Button>
        )}

        <Button
          startIcon={type === 'Excel' ? iconExcel : iconPDF}
          style={styleButton(type === 'Excel' ? '#02884b' : '#db0433')}
          onClick={onExportAll}
        >
          Exportar todos los datos
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportModal;