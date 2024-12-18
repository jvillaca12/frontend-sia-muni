import { useState, ChangeEvent, useCallback, ReactElement } from 'react';
import {
  Box,
  Paper,
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
import CustomerTable from './EmpleadosUsuariosTable';
import UserService from 'data/services/UserService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';

const EmpleadosUsuariosTable = (): ReactElement => {
  const [search, setSearch] = useState<string>('');
  const rolUser = UserService.isAdmin();
  // para el menu de exportar PDF y Excel
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  // Memorizar las funciones de exportaciones
  const [exportFunction, setExportFunction] = useState({
    pdf: null as (() => void) | null,
    excel: null as (() => void) | null,
  });

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
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={5}
        flexWrap="wrap"
        gap={3}
      >
        <Typography variant="h4" color="common.white">
          {rolUser ? 'Personal' : 'Empleados'}
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
        <CustomerTable
          searchText={search}
          onExportPDF={(func) => handelExportFunctionUpdate('pdf', func)}
          onExportExcel={(func) => handelExportFunctionUpdate('excel', func)}
        />
      </Box>
      <Box sx={{ width: '60%', display: 'flex', justifyContent: 'start' }}>
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
            padding: '10px',
            margin: '5px',
            // backgroundColor: filteredRowCount === 0 ? '#e0e0e0' : '#a9dfd8',
            color: 'black',
            '&:hover': {
              backgroundColor: 'dimgray',
            },
            '&:active': {
              backgroundColor: 'blue',
            },
          }}
          //disabled={filteredRowCount === 0}
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
    </Paper>
  );
};

export default EmpleadosUsuariosTable;
