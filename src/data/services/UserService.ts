import axios from 'axios';
import { UsuarioDTO } from '../interfaces/UserDTO';
import { rootPaths } from 'routes/paths';
import axiosInstance from 'config/axios-config';
import { NavigateFunction } from 'react-router-dom';

export interface ApiResponse {
  statusCode: number;
  message: string;
  listUsuarioDTO: UsuarioDTO[];
}

class UserService {
  // static BASE_URL = import.meta.env.VITE_BACKEND_URL;
  
  static BASE_URL = "http://localhost:8080";
  
  // metodo para iniciar sesion
  static async login(userName: string, password: string, dispatch: React.Dispatch<any>) {
    try {
      const response = await axios.post(`${UserService.BASE_URL}/auth/login`, {
        userName,
        password,
      });

      const { tokenJWT } = response.data;
      
      // disparar la accion de login
      dispatch({ type: 'LOGIN', payload: { tokenJWT }});

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }

  // metodo para registrar un usuario
  static async register(userData: UsuarioDTO) {
    try {
      const response = await axios.post(`${UserService.BASE_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }

  // metodo para obtener todos los usuarios
  static async getAllUsers() {
    if (!this.onlyAdmin()) {
      throw new Error('Acceso denegado: Solo los administradores pueden realizar esta acción.');
    }
    try {
      const response = await axiosInstance.get(`/admin/get-all-users`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener todos los usuarios:', error);
      throw new Error(error.response?.data?.message);
    }
  }

  // metodo para obtener tu perfil
  static async getYourProfile() {
    try {
      const token = sessionStorage.getItem('tokenJWT');
      const userRole = sessionStorage.getItem('rol');

      if (!token || !userRole) {
        return null;
      }

      const response = await axiosInstance.get(`/adminuser/get-profile`);

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }

  // metodo para obtener el perfil de un usuario por medio de su id
  static async getUserById(id: number, tokenJWT: string) {
    try {
      const response = await axios.get(`${UserService.BASE_URL}/admin/get-user/${id}`, {
        headers: {
          Authorization: `Bearer ${tokenJWT}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }

  // metodo para eliminar un usuario por medio de su id
  static async deleteUser(idUsuario: number) {
    try {
      const response = await axiosInstance.delete(`/admin/delete/${idUsuario}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }

  // metodo para actualizar un usuario por medio de su id
  static async updateUser(id: number, userData: UsuarioDTO) {
    try {
      const response = await axiosInstance.put(`/adminuser/update/${id}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }

  /* CHEQUEAR AUTENTICACION */

  // metodo para cerrar sesion
  static logout(navigate: NavigateFunction, dispatch?: React.Dispatch<any>) {
    // limpiar el sessionStorage para asegurarse de que no quede nada
    sessionStorage.clear();
    // Limpiar localStorage de credenciales recordadas si existe
    localStorage.removeItem('rememberedCredentials');
    if (dispatch) {
      dispatch({ type: 'LOGOUT' });
    }
    navigate(rootPaths.homeRoot, { replace: true });
    // recargar la página para asegurarse de que todo se limpia
    window.location.reload();
  }

  // metodo para verificar si el usuario esta autenticado
  static isAuthenticated(): boolean {
    const tokenJTW = sessionStorage.getItem('tokenJWT');
    return !!tokenJTW; // Si token es null, retorna false, si no, retorna true
  }

  // metodo para verificar si el usuario es administrador
  static isAdmin() {
    const role = sessionStorage.getItem('rol');
    return role === 'ADMIN';
  }

  // metodo para verificar si el usuario es soporte tecnico
  static isTechnicalSupport() {
    const role = sessionStorage.getItem('rol');
    return role === 'SOPORTE_TECNICO';
  }

  // metodo para verificar si el usuario esta autenticado y es administrador
  static onlyAdmin() {
    return this.isAuthenticated() && this.isAdmin();
  }
}

export default UserService;
