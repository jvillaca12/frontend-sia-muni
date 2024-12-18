import { GridRowsProp } from '@mui/x-data-grid';
import { TipoMantenimientoDTO } from 'data/interfaces/TipoMantenimientoDTO';
import TipoMantenimientoService from 'data/services/TipoMantenimientoService';
import { capitalizeWords } from 'helpers/capitalizar-palabra';
import { useEffect, useState } from 'react';

export const dataTipoMantAll = (onFilteredRowCountChange?: (count: number) => void) => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fecthTP = async (): Promise<GridRowsProp> => {
    try {
      const response = (await TipoMantenimientoService.getDataTP()) as TipoMantenimientoDTO;
      if (!response.tipoMantenimientoDTOList || !Array.isArray(response.tipoMantenimientoDTOList)) {
        throw new Error('La respuesta no es un array');
      }
      return response.tipoMantenimientoDTOList.map((prioridad: TipoMantenimientoDTO) => ({
        id: prioridad.id,
        nombre: capitalizeWords(prioridad.nombre || ''),
        descripcion: prioridad.descripcion || 'Vacío',
      })) as GridRowsProp;
    } catch (error) {
      return [];
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const mappedRows = await fecthTP();

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
