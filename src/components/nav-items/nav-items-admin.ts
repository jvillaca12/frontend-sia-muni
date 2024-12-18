import paths, { rootPaths } from "routes/paths";

export interface NavItem {
  id: number;
  path: string;
  title: string;
  icon: string;
  active: boolean;
}

// los nombres que van lado izquierdo del toolbar Admin
const navItemsAdmin: NavItem[] = [
  {
    id: 1,
    path: paths.admin,
    title: 'Dashboard',
    icon: 'mingcute:home-1-fill',
    active: true,
  },
  {
    id: 2,
    path: paths.historialAdmin,
    title: 'Historial',
    icon: 'mdi:history',
    active: true,
  },
  {
    id: 3,
    path: paths.chatbotiaAdmin,
    title: 'IA',
    icon: 'mdi:robot',
    active: true,
  },
  {
    id: 4,
    path: paths.mantenimientoAdmin,
    title: 'Mantenimiento',
    icon: 'mdi:tools',
    active: true,
  },
  {
    id: 5,
    path: paths.auditoriaAdmin,
    title: 'Auditoria',
    icon: 'mdi:magnify',
    active: true,
  },
  {
    id: 6,
    path: paths.gestionar,
    title: 'Gestionar',
    icon: 'tdesign:user-add',
    active: true,
  },
  {
    id: 7,
    path: rootPaths.homeRoot,
    title: 'Login',
    icon: 'tabler:login',
    active: true,
  },
];

export default navItemsAdmin;
