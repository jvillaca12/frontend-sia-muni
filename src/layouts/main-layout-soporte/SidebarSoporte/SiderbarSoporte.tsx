import { ReactElement, useMemo } from 'react';
import { List, Toolbar } from '@mui/material';
import navItemsSoporte from 'components/nav-items/nav-items-soporte';
import SimpleBar from 'simplebar-react';
import NavItemSoporte from './NavItemSoporte';
import { drawerCloseWidth, drawerOpenWidth } from '..';
import Image from 'components/base/Image';
import logoWithText from '/src/assets/logo/sia-logo-texto.png';
import logo from '/src/assets/logo/sia-logo.png';
import UserService from 'data/services/UserService';
import { useEffect } from 'react';
import { rootPaths } from 'routes/paths';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from 'hooks/hooks-user/useProfileUser';

// esta clase es la Barra Lateral (Side Bar) del dashboard, es la barra vertical del lado izquierdo
const Sidebar = ({ open }: { open: boolean }): ReactElement => {

  const navigate = useNavigate();

  const { user } = useUserProfile();

  // Genera los nav-items basados en el usuario
  const navItems = useMemo(() => 
    user ? navItemsSoporte(user) : [], 
    [user]
  );

  useEffect(() => {
    const token = sessionStorage.getItem('tokenJWT');
    if (!token) {
      // redirigir al login si no hay token
      window.location.href = rootPaths.homeRoot;
    }
  }, []);

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
        {/* la lista de iconos de la navegación del dashboard SOPORTE */}
        <List
          component="nav"
          sx={{ mt: 24.5, py: 2.5, height: 500, justifyContent: 'space-between' }}
        >
          {/* recorre los items de la navegación */}
          {navItems.map((navItem) => (
                <NavItemSoporte 
                  key={navItem.id} 
                  navItem={navItem} open={open}
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
