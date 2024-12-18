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
} from '@mui/material';

import IconifyIcon from 'components/base/IconifyIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import ProveedorHistorialTable from './ProveedorHistorialTable';

const ViewTableHistorialProveedor = (): ReactElement => {
  // para el menu de exportar PDF y Excel
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  // estado para buscar en la tabla
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

  // Memorizar las funcioens wrapper de exportacion
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
          Registro de las Oficinas de la MPP
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
        <ProveedorHistorialTable
          searchText={search}
          onExportPDF={(func) => handelExportFunctionUpdate('pdf', func)}
          onExportExcel={(func) => handelExportFunctionUpdate('excel', func)}
          onFilteredRowCountChange={setFilteredRowCount}
        />
      </Box>
      <Stack direction="row" spacing={2} justifyContent="space-between" mb={3}>
        <Box sx={{ width: '100%', display: 'flex' }}>
          <Button
            variant="outlined"
            sx={{
              width: {
                xs: '100%',
                sm: '50%',
                md: '30%',
                lg: '20%',
              },
              fontSize: 17,
              padding: '5px',
              margin: '5px',
              height: {
                xs: '60px',
                sm: '45px',
                md: '50px',
                lg: '55px',
              },
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
    </Box>
  );
};

export default ViewTableHistorialProveedor;
