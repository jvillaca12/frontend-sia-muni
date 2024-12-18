import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../data/services/UserService';
import paths from '../../routes/paths';

export const SignUp = () =>{
  const navigate = useNavigate();
  const [modalMessageR, setModalMessage] = useState('');
  const [openR, setOpen] = useState(false);

  // para cerrar el modal del dialogo
  const handleCloseR = () => setOpen(false);

  // estados para el registro de usuario
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    userName: '',
    password: '',
    correo: '',
    passwordrepeat: '',
    rolId: 0,
    areaId: 0,
  });

  // metodo para manejar el cambio de los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // metodo para registrar un usuario
  const handleSubmitRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // validar si las contraseñas coinciden
    if (formData.password !== formData.passwordrepeat) {
      setOpen(true);
      setModalMessage('Las contraseñas no coinciden');
      return;
    }

    try {
      // llamar al metodo de registro para registrar un usuario y enviar el token
      await UserService.register(formData);
      // limpiar los campos despues de crear el usuario
      setFormData({
        nombre: '',
        apellidos: '',
        userName: '',
        password: '',
        correo: '',
        passwordrepeat: '',
        rolId: 0,
        areaId: 0,
      });
      setOpen(true);
      setModalMessage('Usuario registrado con éxito');
      // redirigir a la pagina de inicio
      navigate(paths.login);
    } catch (error) {
      console.error('Error al registrar el usuario: ', error);
      setOpen(true);
      setModalMessage('Ha ocurrido un error al registrar el usuario ' + error.message);
    }
  };

  return {
    formData,
    handleInputChange,
    handleSubmitRegister,
    openR,
    modalMessageR,
    handleCloseR
  };
}
