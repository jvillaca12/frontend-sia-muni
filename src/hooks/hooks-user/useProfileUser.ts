import { useGlobalState } from 'components/context/GlobalState';
import { UsuarioDTO } from 'data/interfaces/UserDTO';
import UserService from 'data/services/UserService';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import paths from 'routes/paths';

export const useUserProfile = () => {
  // para obtener el perfil del usuario
  const [user, setUser] = useState<UsuarioDTO | null>(null);
  // para establecer la carga
  const [loading, setLoading] = useState<boolean>(false);
  // para establecer el mensaje de error
  const [error, setError] = useState<string | null>('');
  const navigate = useNavigate();
  const { state, dispatch } = useGlobalState();

  const fetchUserProfile = useCallback(async () => {
    const token = sessionStorage.getItem('tokenJWT');
    const userRole = sessionStorage.getItem('rol');

    if (!token || !userRole) {
      setLoading(false);
      navigate(paths.login, { replace: true });
      return null;
    }

    try {
      setLoading(true);
      const response = await UserService.getYourProfile();
      if (response) {
        // Update global state and local state
        dispatch({
          type: 'SET_USER',
          payload: {
            user: response,
            tokenJWT: token
          }
        });
        setUser(response);
        return response;
      } else {
        // en caso haya sucedido un fallo
        sessionStorage.removeItem('tokenJWT');
        sessionStorage.removeItem('rol');
        navigate(paths.login, { replace: true });
        return null;
      }
    } catch (error) {
      setError(error.message);
      navigate(paths.login, { replace: true });
      return null;
    } finally {
      setLoading(false);
    }
  }, [navigate, dispatch]);

  // Hook para cargar automáticamente el perfil al montar el componente
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile, state.tokenJWT]);

  return { user, loading, error, fetchUserProfile };
};
