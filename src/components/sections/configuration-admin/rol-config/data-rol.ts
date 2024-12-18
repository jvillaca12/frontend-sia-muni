import { GridRowsProp } from '@mui/x-data-grid';
import { RolDTO } from 'data/interfaces/RolDTO';
import { RolService } from 'data/services/RolService';
import { capitalizeWords } from 'helpers/capitalizar-palabra';
import { useEffect, useState } from 'react';

export const dataRolAll = (onFilteredRowCountChange?: (count: number) => void) => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fecthRol = async (): Promise<GridRowsProp> => {
    try {
      const response = (await RolService.getAllRol()) as RolDTO;
      if (!response.listRol || !Array.isArray(response.listRol)) {
        throw new Error('La respuesta no es un array');
      }
      return response.listRol?.map((rol: RolDTO) => ({
        id: rol.id,
        nombre: capitalizeWords(rol.nombre || ''),
      })) as GridRowsProp;
    } catch (error) {
      return [];
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const mappedRows = await fecthRol();

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
