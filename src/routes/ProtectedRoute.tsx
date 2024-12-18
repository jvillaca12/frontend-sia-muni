import UserService from 'data/services/UserService';
import paths from './paths';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles = [] }) => {
  const isAuthenticated = UserService.isAuthenticated();
  const userRole = sessionStorage.getItem('rol');

  // si no esta autenticado, rederigir al login
  if (!isAuthenticated) {
    return <Navigate to={paths.login} replace />;
  }

  // si hay roles especificados y el usuario no tiene uno de esos roles, redirigir al home
  if (allowedRoles.length > 0 && !allowedRoles.some(role => userRole?.includes(role))) {
    return <Navigate to={paths.home} replace />;
  }

  // si todo esta bien, renderizar las rutas hijas
  return <Outlet />;
};

export default ProtectedRoute;
