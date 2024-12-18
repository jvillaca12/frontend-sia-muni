import { useState, ChangeEvent, useCallback, ReactElement } from 'react';
import {
  Box,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Modal,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import PrioridadTable from './PrioridadTable';
import FormRegistrarPrioridad from './FormRegistrarPrioridad';
import ReusableModal from 'components/common/ResuableDialog';

const ViewPrioridadData = (): ReactElement => {
  // para el menu de exportar PDF y Excel
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  // estado para actualizar la tabla
  const [refreshKey, setRefreshKey] = useState(0);
  // Estado para el mensaje de confirmación de acuerdo a las operaciones, para refresh de la tabla
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  // Estado para controlar la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Estado para controlar la busqueda
  const [search, setSearch] = useState<string>('');
  // Memorizar las funciones de exportaciones
  const [exportFunction, setExportFunction] = useState({
    pdf: null as (() => void) | null,
    excel: null as (() => void) | null,
  });
  // Estado para controlar el conteo de filas filtradas
  const [filteredRowCount, setFilteredRowCount] = useState(0);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAnchor = () => {
    setAnchorEl(null);
  };

  const handleVisibleFormulario = () => {
    setIsModalOpen(true); // Abre el modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Cierra el modal
  };

  // Memorizar las funciones wrapper de exportacion
  const handelExportFunctionUpdate = useCallback((type: 'pdf' | 'excel', func: () => void) => {
    setExportFunction((prev) => ({
      ...prev,
      [type]: func,
    }));
  }, []);

  // Nuevas funciones para manejar los clics del MenuItem
  const handlePDFClick = () => {
    if (exportFunction.pdf) {
      exportFunction.pdf();
    }
    handleCloseAnchor(); // Cerrar el menú después de hacer clic
  };

  const handleExcelClick = () => {
    if (exportFunction.excel) {
      exportFunction.excel();
    }
    handleCloseAnchor(); // Cerrar el menú después de hacer clic
  };

  // Método para forzar refresco
  const handleRefreshTable = (message?: string) => {
    setRefreshKey((prevKey) => prevKey + 1);
    if (message) {
      setConfirmationMessage(message);
      setIsConfirmationModalOpen(true);
    }
  };

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={5}
        flexWrap="wrap"
        gap={3}
      >
        <Typography variant="h4" color="common.white">
          Prioridad
        </Typography>
        <TextField
          variant="filled"
          placeholder="Buscar..."
          value={search}
          onChange={handleChange}
          sx={{
            '.MuiFilledInput-root': {
              bgcolor: 'grey.A100',
              ':hover': {
                bgcolor: 'background.default',
              },
              ':focus': {
                bgcolor: 'background.default',
              },
              ':focus-within': {
                bgcolor: 'background.default',
              },
            },
            borderRadius: 2,
            height: 40,
            width: 350,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="end">
                <IconifyIcon icon="akar-icons:search" width={13} height={13} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Box width={1} flexGrow={1} minHeight={325}>
        <PrioridadTable
          key={refreshKey}
          searchText={search}
          onExportPDF={(func) => handelExportFunctionUpdate('pdf', func)}
          onExportExcel={(func) => handelExportFunctionUpdate('excel', func)}
          onFilteredRowCountChange={setFilteredRowCount}
          onSuccessRegistro={(message) => handleRefreshTable(message)}
        />
      </Box>
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Box sx={{ width: '100%', display: 'flex' }}>
          <Button
            variant="outlined" // usar "outlined" o "text"
            sx={{
              width: {
                xs: '100%', // 100% en pantallas extra pequeñas
                sm: '50%', // 50% en pantallas pequeñas
                md: '30%', // 30% en pantallas medianas
                lg: '30%', // 20% en pantallas grandes
              },

              fontSize: 17,
              padding: '10px',
              margin: '5px',
              backgroundColor: '#a9dfd8',
              color: 'black',
              '&:hover': {
                backgroundColor: 'dimgray',
              },
              '&:active': {
                backgroundColor: 'blue',
              },
            }}
            onClick={handleVisibleFormulario}
          >
            Agregar Prioridad
          </Button>
        </Box>
        <Box sx={{ width: '60%', display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            sx={{
              width: {
                xs: '100%',
                sm: '50%',
                md: '30%',
                lg: '30%',
              },
              fontSize: 17,
              padding: '5px',
              margin: '5px',
              backgroundColor: filteredRowCount === 0 ? '#e0e0e0' : '#a9dfd8',
              color: 'black',
              '&:hover': {
                backgroundColor: 'dimgray',
              },
              '&:active': {
                backgroundColor: 'blue',
              },
            }}
            disabled={filteredRowCount === 0}
            onClick={handleClick}
          >
            Exportar
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseAnchor}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handlePDFClick}>
              <ListItemIcon>
                <FontAwesomeIcon icon={faFilePdf} style={{ color: 'orange' }} />
              </ListItemIcon>
              <ListItemText primary="PDF" />
            </MenuItem>
            <MenuItem onClick={handleExcelClick}>
              <ListItemIcon>
                <FontAwesomeIcon icon={faFileExcel} style={{ color: 'green' }} />
              </ListItemIcon>
              <ListItemText primary="Excel" />
            </MenuItem>
          </Menu>
        </Box>
      </Stack>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <FormRegistrarPrioridad onClose={handleCloseModal} onSuccessRegistro={handleRefreshTable} />
      </Modal>
      <ReusableModal
        open={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        title="Mensaje"
        message={confirmationMessage}
      />
    </Box>
  );
};

export default ViewPrioridadData;
