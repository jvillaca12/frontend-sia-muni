import paths, { rootPaths } from 'routes/paths';
import UserService from './services/UserService';

interface UserMenuItem {
  id: number;
  title: string;
  icon: string;
  color?: string;
  path?: string;
}

const userMenuItems: UserMenuItem[] = [
  {
    id: 1,
    title: 'Ver Perfil',
    icon: 'mingcute:user-2-fill',
    color: 'text.primary',
    path: UserService.isAdmin()
      ? paths.profileAdmin
      : UserService.isTechnicalSupport()
      ? paths.profileSoporte
      : rootPaths.homeRoot,
  },
  UserService.isAdmin() ? 
  {
    id: 2,
    title: 'Configuración',
    icon: 'material-symbols:settings-account-box-rounded',
    color: 'text.primary',
    path: paths.configAdmin,
  } : null,
  {
    id: 3,
    title: 'Logout',
    icon: 'material-symbols:logout',
    color: 'error.main',
    path: rootPaths.homeRoot,
  },
].filter(item => item !== null);

export default userMenuItems;

/*{
    id: 2,
    title: 'Configuración',
    icon: 'material-symbols:settings-account-box-rounded',
    color: 'text.primary',
  },
  {
    id: 3,
    title: 'Notifications',
    icon: 'ion:notifications',
    color: 'text.primary',
  },
  {
    id: 4,
    title: 'Switch Account',
    icon: 'material-symbols:switch-account',
    color: 'text.primary',
  },
  {
    id: 5,
    title: 'Help Center',
    icon: 'material-symbols:live-help',
    color: 'text.primary',
  },*/
