import { Menu, Avatar, Button, Tooltip, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SupportAgent from '@mui/icons-material/SupportAgent';
import { useState, MouseEvent, useCallback, ReactElement, useEffect } from 'react';
import userMenuItems from 'data/usermenu-items';
import UserService from 'data/services/UserService';
import { useNavigate } from 'react-router-dom';
import { rootPaths } from 'routes/paths';

const UserDropdown = (): ReactElement => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const isAdmin = UserService.isAdmin();
  // para las rutas e historial
  const navigate = useNavigate();

  const handleUserClick = useCallback((event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleUserClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('tokenJWT');
    if (!token) {
      // redirigir al login si no hay token
      navigate(rootPaths.homeRoot, { replace: true });
    }
  }, [navigate]);

  const handleLogout = (path: string) => {
    if (path === rootPaths.homeRoot) {
      UserService.logout(navigate);
      handleUserClose();
    } else {
      // Ensure the route matches the current user's role
      const currentRole = sessionStorage.getItem('rol');
      const isAdminRoute = path.includes('/admin/');
      const isSupportRoute = path.includes('/soporte/');

      if (
        (currentRole === 'ADMIN' && isAdminRoute) ||
        (currentRole === 'SOPORTE_TECNICO' && isSupportRoute)
      ) {
        navigate(path);
      } 
      handleUserClose();
    }
  };

  return (
    <>
      <Button
        color="inherit"
        variant="text"
        id="account-dropdown-menu"
        aria-controls={menuOpen ? 'account-dropdown-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? 'true' : undefined}
        onClick={handleUserClick}
        disableRipple
        sx={{
          borderRadius: 2,
          gap: 3.75,
          px: { xs: 0, sm: 0.625 },
          py: 0.625,
          '&:hover': {
            bgcolor: 'transparent',
          },
        }}
      >
        <Tooltip title={isAdmin ? 'ADMIN' : 'SOPORTE TÉCNICO'} arrow placement="bottom">
          <Avatar sx={{ width: 44, height: 44 }}>
            {isAdmin ? <AccountCircleIcon /> : <SupportAgent />}
          </Avatar>
        </Tooltip>
        <IconifyIcon
          color="common.white"
          icon="mingcute:down-fill"
          width={22.5}
          height={22.5}
          sx={(theme) => ({
            transform: menuOpen ? `rotate(180deg)` : `rotate(0deg)`,
            transition: theme.transitions.create('all', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.short,
            }),
          })}
        />
      </Button>
      <Menu
        id="account-dropdown-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleUserClose}
        MenuListProps={{
          'aria-labelledby': 'account-dropdown-button',
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {userMenuItems.map((userMenuItem) => (
          <MenuItem key={userMenuItem.id} onClick={() => handleLogout(userMenuItem.path || '')}>
            <ListItemIcon
              sx={{
                minWidth: `0 !important`,
                color: userMenuItem.color,
                width: 14,
                height: 10,
                mb: 1.5,
              }}
            >
              <IconifyIcon icon={userMenuItem.icon || ''} color={userMenuItem.color} />
            </ListItemIcon>
            <ListItemText
              sx={(theme) => ({
                color: userMenuItem.color,
                '& .MuiListItemText-primary': {
                  fontSize: theme.typography.subtitle2.fontSize,
                  fontFamily: theme.typography.subtitle2.fontFamily,
                  fontWeight: theme.typography.subtitle2.fontWeight,
                },
              })}
            >
              {userMenuItem.title}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default UserDropdown;
