import CustomInput from '../../components/common/CustomInput.js';
import ReusableModal from 'components/common/ResuableDialog.js';
import animationLogin from './AnimationLogin.js';
import './StyleLogin.css';
import { startTransition, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import paths from '../../routes/paths';
import loginImage from '/src/assets/images/images-load/login.svg';
import notasImage from '/src/assets/images/images-load/notas.svg';
import { SignIn } from './SignIn.js';
import { SignUp } from './SignUp.js';
import { faUser, faUserTie, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';

function LoginRegister() {
  const navigate = useNavigate();
  // estados para el login
  const {
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
  } = SignIn();
  // estados para el register
  const { formData, handleInputChange, handleSubmitRegister, openR, modalMessageR, handleCloseR } =
    SignUp();

  // rederigiendo a la pagina de registro, para crear un usuario
  const handleSignUpClick = () => {
    startTransition(() => {
      setUsername('');
      setPassword('');
      navigate(paths.register);
    });
  };

  // rederigiendo a la pagina de login, para iniciar sesion
  const handleSignInClick = () => {
    startTransition(() => {
      navigate(paths.login);
    });
  };

  useEffect(() => {
    animationLogin();
  }, []);

  return (
    <>
      <div className="container">
        <div className="forms-container">
          <div className="signin-signup">
            {/* Login */}
            <form onSubmit={handleSubmit} className="sign-in-form">
              <h2 className="title">Inicio de Sesión</h2>
              <CustomInput
                className="input-field"
                type="text"
                placeholder="Username"
                icon={faUser}
                value={userName}
                onChange={(e) => setUsername(e.target.value)}
              />
              <CustomInput
                className="input-field"
                type="password"
                placeholder="Password"
                icon={faLock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                visiblePassword={true}
              />
              <div className="form-options">
                <div className="remember-me">
                  <input
                    type="checkbox"
                    name="remember"
                    id="remember"
                    checked={formDataRecovery.remember}
                    onChange={handleInputChangeCheckBox}
                  />
                  <label htmlFor="remember">Recordar usuario</label>
                </div>
                <div className="forgot-password">
                  <a href="#" className="forgot-password-link">
                    Olvidé mi contraseña
                  </a>
                </div>
              </div>
              <input type="submit" value="Iniciar Sesión" className="btn solid" />
            </form>
            {/* Modal de MUI para mensajes en el login*/}
            <ReusableModal
              open={open}
              onClose={handleClose}
              title="Aviso"
              message={modalMessage}
              confirmText="Cerrar"
            />
            {/* Sign up */}
            <form onSubmit={handleSubmitRegister} className="sign-up-form">
              <h2 className="title">Crea una Cuenta</h2>
              <CustomInput
                className="input-field"
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Nombre"
                icon={faUser}
              />
              <CustomInput
                className="input-field"
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleInputChange}
                placeholder="Apellidos"
                icon={faUserTie}
              />
              <CustomInput
                className="input-field"
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                placeholder="Username"
                icon={faUser}
              />
              <CustomInput
                className="input-field"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                icon={faLock}
                visiblePassword={true}
              />
              <CustomInput
                className="input-field"
                type="password"
                name="passwordrepeat"
                value={formData.passwordrepeat}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                icon={faLock}
                visiblePassword={true}
              />
              <CustomInput
                className="input-field"
                type="email"
                placeholder="Email"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                icon={faEnvelope}
              />
              <input type="submit" className="btn" value="Crear Cuenta" />
            </form>
          </div>
        </div>
        <ReusableModal
          open={openR}
          onClose={handleCloseR}
          title="Aviso del Sistema"
          message={modalMessageR}
          confirmText="Cerrar"
        />

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>No tienes cuenta?</h3>
              <p>
                Crea una cuenta para empezar a usar la plataforma SIA, para el registro de fallos
                y/o incidencias!
              </p>
              <button className="btn transparent" id="sign-up-btn" onClick={handleSignUpClick}>
                Crear cuenta
              </button>
            </div>
            <img src={loginImage} className="image" alt="" />
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>¿Ya tienes cuenta?</h3>
              <p>Al crear una cuenta, por defecto el rol de usuario será de soporte técnico.</p>
              <button className="btn transparent" id="sign-in-btn" onClick={handleSignInClick}>
                Iniciar Sesión
              </button>
            </div>
            <img src={notasImage} className="image" alt="" />
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginRegister;
