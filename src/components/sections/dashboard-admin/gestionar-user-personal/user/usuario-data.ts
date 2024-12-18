import { GridRowsProp } from '@mui/x-data-grid';
import { UsuarioDTO } from 'data/interfaces/UserDTO';
import UserService from 'data/services/UserService';
import { capitalizeWords } from 'helpers/capitalizar-palabra';

const fecthUsuarioData = async (): Promise<GridRowsProp> => {
  try {
    const responseUsuario = await UserService.getAllUsers();
    if (!responseUsuario.listUsuarioDTO || !Array.isArray(responseUsuario.listUsuarioDTO)) {
      throw new Error('La respuesta no es un array');
    }
    return responseUsuario.listUsuarioDTO.map((usuario: UsuarioDTO, index: number) => ({
      id: index,
      idUsuario: usuario.idUsuario,
      nombre: capitalizeWords(usuario.nombre || ''),
      apellidos: capitalizeWords(usuario.apellidos || ''),
      userName: usuario.userName,
      correo: usuario.correo,
      rolId: usuario.rolId,
      oficinaSubgerenciaId: usuario.oficinaSubgerenciaId,
      estadoText: usuario.estado ? 'Activo' : 'Inactivo',
      rol: usuario.rol === 'SOPORTE_TECNICO' ? 'SOPORTE TÉCNICO' : usuario.rol,
      oficina: capitalizeWords(usuario.oficina || ''),
      cantidadProblemasRegistrados: usuario.cantidadProblemasRegistrados,
    })) as GridRowsProp;
  } catch (error) {
    return [];
  }
};

export const rows: GridRowsProp = await fecthUsuarioData();
