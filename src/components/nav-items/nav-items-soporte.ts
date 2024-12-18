import { UsuarioDTO } from 'data/interfaces/UserDTO';
import paths, { rootPaths } from 'routes/paths';

export interface NavItem {
  id: number;
  path: string;
  title: string;
  icon: string;
  active: boolean;
}

// los nombres que van lado izquierdo del toolbar Usuario SOPORTE
export const navItemsSoporte = (user: UsuarioDTO) => {
  // Valores por defecto si no hay usuario
  const idUsuario = user?.idUsuario || 0;
  const esAdmin = user?.rol === 'ADMIN';

  const navItemsSoporte: NavItem[] = [
    {
      id: 1,
      path: paths.soporte,
      title: 'Dashboard',
      icon: 'mingcute:home-1-fill',
      active: true,
    },
    {
      id: 2,
      path: paths.seguimiento
        .replace(':id', '0')
        .replace(':idUser', idUsuario.toString())
        .replace(':rol', esAdmin.toString()),
      title: 'Seguimiento',
      icon: 'mingcute:time-fill',
      active: true,
    },
    {
      id: 3,
      path: paths.detalleProblema
        .replace(':id', '0')
        .replace(':idUser', idUsuario.toString())
        .replace(':rol', esAdmin.toString()),
      title: 'Detalle Problema',
      icon: 'mdi:alert-circle-outline',
      active: true,
    },
    {
      id: 4,
      path: paths.mantenimiento
        .replace(':idUser', idUsuario.toString())
        .replace(':rol', esAdmin.toString()),
      title: 'Mantenimiento',
      icon: 'mdi:tools',
      active: true,
    },
    {
      id: 5,
      path: paths.auditoriaSoporte
        .replace(':idUser', idUsuario.toString())
        .replace(':rol', esAdmin.toString()),
      title: 'Auditoria',
      icon: 'mdi:magnify',
      active: true,
    },
    {
      id: 6,
      path: paths.historialSoporte,
      title: 'Historial',
      icon: 'mdi:history',
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

  return navItemsSoporte;
};

export default navItemsSoporte;
