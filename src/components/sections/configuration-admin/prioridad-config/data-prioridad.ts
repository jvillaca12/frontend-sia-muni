import { GridRowsProp } from '@mui/x-data-grid';
import { PrioridadDTO } from 'data/interfaces/PrioridadDTO';
import PrioridadService from 'data/services/PrioridadService';
import { capitalizeWords } from 'helpers/capitalizar-palabra';
import { useEffect, useState } from 'react';

export const dataPrioridadAll = (onFilteredRowCountChange?: (count: number) => void) => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fecthPrioridad = async (): Promise<GridRowsProp> => {
    try {
      const response = (await PrioridadService.getAllPrioridad()) as PrioridadDTO;
      if (!response.listAllPrioridad || !Array.isArray(response.listAllPrioridad)) {
        throw new Error('La respuesta no es un array');
      }
      return response.listAllPrioridad.map((prioridad: PrioridadDTO) => ({
        id: prioridad.id,
        nombre: capitalizeWords(prioridad.nombre || ''),
      })) as GridRowsProp;
    } catch (error) {
      return [];
    }
  };  

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const mappedRows = await fecthPrioridad();

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