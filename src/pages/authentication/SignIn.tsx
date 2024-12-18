import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../data/services/UserService';
import paths from '../../routes/paths';
import { useGlobalState } from 'components/context/GlobalState';

export const SignIn = () => {
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorLogin, setError] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useGlobalState();

  // para obtener y recordar el usuario
  const [formDataRecovery, setFormDataRecovery] = useState({
    nombre: '',
    apellidos: '',
    password: '',
    remember: false,
  });

  // para guardar y recuperar el usuario
  useEffect(() => {
    // Cargar credenciales desde el sessionStorage si existen
    const savedCredentials = sessionStorage.getItem('credentials');
    if (savedCredentials) {
      const { nombre, apellidos, password } = JSON.parse(savedCredentials);
      setFormDataRecovery({ nombre, apellidos, password, remember: true });
    }
  }, []);

  const handleInputChangeCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormDataRecovery({
      ...formDataRecovery,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // para cerrar el modal del dialogo
  const handleClose = () => setOpen(false);

  // metodo para iniciar sesion
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formDataRecovery.remember) {
      // Guardar credenciales en el sessionStorage
      sessionStorage.setItem(
        'credentials',
        JSON.stringify({
          nombre: formDataRecovery.nombre,
          apellidos: formDataRecovery.apellidos,
          password: formDataRecovery.password,
        }),
      );
    } else {
      // Eliminar credenciales de sessionStorage
      sessionStorage.removeItem('credentials');
    }

    try {
      const response = await UserService.login(userName, password, dispatch);
      if (response.statusCode !== 200) {
        setOpen(true);
        setModalMessage(`El usuario ${userName} esta inactivo del sistema`);
        return;
      }
      if (response.tokenJWT) {
        // Usar sessionStorage
        sessionStorage.setItem('tokenJWT', response.tokenJWT);
        sessionStorage.setItem('refreshTokenJWT', response.refreshTokenJWT);
        sessionStorage.setItem('rol', response.rol);
        sessionStorage.setItem('userName', userName);
        switch (response.rol) {
          case 'ADMIN':
            navigate(paths.admin); // redirigir a la pagina admin
            break;
          case 'SOPORTE_TECNICO':
            navigate(paths.soporte); // redirigir a la pagina soporte
            break;
          default:
            navigate(paths.home);
            break;
        }

        // Recargar la página después de iniciar sesión
        window.location.reload();
      } else {
        setError(response.message);
        setOpen(true);
        setModalMessage('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      setError(error.message);
      setOpen(true);
      setModalMessage('Error en el servidor: ' + errorLogin);
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };

  return {
    userName,
    password,
    setUsername,
    setPassword,
    handleSubmit,
    open,
    modalMessage,
    handleClose,
    handleInputChangeCheckBox,
    formDataRecovery,
  };
};
