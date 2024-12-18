import { GridRowsProp } from '@mui/x-data-grid';
import { UsuarioDTO } from 'data/interfaces/UserDTO';
import UserService from 'data/services/UserService';
import { capitalizeWords } from 'helpers/capitalizar-palabra';
import { useState, useEffect } from 'react';

export const useDataUser = (onFilteredRowCountChange?: (count: number) => void) => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
        cantidadDetalleProblemas: usuario.cantidadDetalleProblemas,
      })) as GridRowsProp;
    } catch (error) {
      return [];
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const mappedRows = await fecthUsuarioData();

      setRows(mappedRows);

      // Si se proporciona el callback, actualizar el conteo de filas filtradas
      if (onFilteredRowCountChange) {
        onFilteredRowCountChange(mappedRows.length);
      }
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Error desconocido'));
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos inicialmente
  useEffect(() => {
    fetchData();
  }, []);

  // Metodo para recargar manualmente si es necesario
  const reloadData = () => {
    fetchData();
  };

  return {
    rows,
    isLoading,
    error,
    reloadData,
  };
};
