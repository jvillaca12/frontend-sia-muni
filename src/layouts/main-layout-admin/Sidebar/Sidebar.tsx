import { ReactElement } from 'react';
import { List, Toolbar } from '@mui/material';
import navItemsAdmin from 'components/nav-items/nav-items-admin';
import SimpleBar from 'simplebar-react';
import NavItem from './NavItem';
import { drawerCloseWidth, drawerOpenWidth } from '..';
import Image from 'components/base/Image';
import logoWithText from '/src/assets/logo/sia-logo-texto.png';
import logo from '/src/assets/logo/sia-logo.png';
import UserService from 'data/services/UserService';
import { useEffect } from 'react';
import { rootPaths } from 'routes/paths';
import { useNavigate } from 'react-router-dom';

// esta clase es la Barra Lateral (Side Bar) del dashboard, es la barra vertical del lado izquierdo
const Sidebar = ({ open }: { open: boolean }): ReactElement => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('tokenJWT');
    if (!token) {
      // redirigir al login si no hay token
      navigate(rootPaths.homeRoot, { replace: true });
    }
  }, [navigate]);

  const handleLogout = (path: string) => {
    if(path === rootPaths.homeRoot) {
      UserService.logout(navigate);
    }
  }

  return (
    <>
      <Toolbar
        sx={{
          position: 'fixed',
          height: 98,
          zIndex: 1,
          bgcolor: 'background.default',
          p: 0,
          justifyContent: 'center',
          width: open ? drawerOpenWidth - 1 : drawerCloseWidth - 1,
        }}
      >
        <Image
          src={open ? logoWithText : logo}
          alt={open ? 'logo with text' : 'logo'}
          height={open ? 70 : 50}
        />
      </Toolbar>
      <SimpleBar style={{ maxHeight: '100vh' }}>
        {/* la lista de iconos de la navegación del dashboard ADMIN */}
        <List
          component="nav"
          sx={{ mt: 24.5, py: 2.5, height: 550, justifyContent: 'space-between' }}
        >
          {/* recorre los items de la navegación */}
          {navItemsAdmin.map((navItem) => (
                <NavItem 
                  key={navItem.id} 
                  navItem={navItem} 
                  open={open}
                  onClick={() => handleLogout(navItem.path)}
                />
              )
            ) // del map
          }
        </List>
      </SimpleBar>
    </>
  );
};

export default Sidebar;
