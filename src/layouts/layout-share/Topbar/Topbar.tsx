import {
  Stack,
  AppBar,
  Toolbar,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { ReactElement, useState } from 'react';
import { drawerCloseWidth, drawerOpenWidth } from '../../main-layout-admin';
import UserDropdown from './UserDropdown';
import { useBreakpoints } from 'providers/BreakpointsProvider';

const Topbar = ({
  open,
  handleDrawerToggle,
}: {
  open: boolean;
  handleDrawerToggle: () => void;
}): ReactElement => {
  const { down } = useBreakpoints();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const isMobileScreen = down('sm');

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Aquí puedes agregar la lógica para cambiar el tema de tu aplicación
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        left: 0,
        ml: isMobileScreen ? 0 : open ? 60 : 27.5,
        width: isMobileScreen
          ? 1
          : open
          ? `calc(100% - ${drawerOpenWidth}px)`
          : `calc(100% - ${drawerCloseWidth}px)`,
        paddingRight: '0 !important',
      }}
    >
      <Toolbar
        component={Stack}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          bgcolor: 'background.default',
          height: 116,
        }}
      >
        <Stack direction="row" gap={2} alignItems="center" ml={2.5} flex="1 1 52.5%">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
          >
            <IconifyIcon
              icon={open ? 'ri:menu-unfold-4-line' : 'ri:menu-unfold-3-line'}
              color="common.white"
            />
          </IconButton>
          <IconButton
            color="inherit"
            sx={{
              display: { xs: 'flex', sm: 'none' },
            }}
          >
            <IconifyIcon icon="mdi:search" />
          </IconButton>
          <TextField
            variant="filled"
            fullWidth
            placeholder="Buscar aquí..."
            sx={{
              display: { xs: 'none', sm: 'flex' },
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
        <Stack
          direction="row"
          gap={3.75}
          alignItems="center"
          justifyContent="flex-end"
          mr={3.75}
          flex="1 1 20%"
        >
          <Typography>
            {isDarkMode ? 'Oscuro' : 'Claro'}
          </Typography>
          <IconButton
            sx={{
              padding: 1,
            }}
            onClick={toggleTheme}
            title={isDarkMode ? 'Oscuro' : 'Claro'}
          >
            <IconifyIcon
              icon={isDarkMode ? 'mdi:weather-night' : 'mdi:weather-sunny'}
              width={29}
              height={32}
            />
          </IconButton>
          <UserDropdown />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
