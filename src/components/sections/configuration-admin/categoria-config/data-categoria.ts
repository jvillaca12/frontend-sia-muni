import { GridRowsProp } from '@mui/x-data-grid';
import { CategoriaDTO } from 'data/interfaces/CategoriaDTO';
import CategoriaService from 'data/services/CategoriaService';
import { capitalizeWords } from 'helpers/capitalizar-palabra';
import { useEffect, useState } from 'react';

export const dataCategoriaAll = (onFilteredRowCountChange?: (count: number) => void) => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fecthCategoria = async (): Promise<GridRowsProp> => {
    try {
      const response = (await CategoriaService.getAllCategoria()) as CategoriaDTO;
      if (!response.listCategoria || !Array.isArray(response.listCategoria)) {
        throw new Error('La respuesta no es un array');
      }
      return response.listCategoria.map((categoria: CategoriaDTO) => ({
        id: categoria.id,
        nombre: capitalizeWords(categoria.nombre || ''),
      })) as GridRowsProp;
    } catch (error) {
      return [];
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const mappedRows = await fecthCategoria();

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