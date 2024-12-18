import { GridRowsProp } from '@mui/x-data-grid';
import { PersonalDTO } from 'data/interfaces/PersonalDTO';
import { PersonalService } from 'data/services/PersonalService';
import { capitalizeWords } from 'helpers/capitalizar-palabra';
import { useState, useEffect } from 'react';

export const useDataFullPersonal = (onFilteredRowCountChange?: (count: number) => void) => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fecthPersonalData = async (): Promise<GridRowsProp> => {
    try {
      const responsePersonal = await PersonalService.getDataFullPersonal();
      if (!responsePersonal.personalDTOList || !Array.isArray(responsePersonal.personalDTOList)) {
        throw new Error('La respuesta no es un array');
      }
      return responsePersonal.personalDTOList.map((personal: PersonalDTO, index: number) => ({
        id: index,
        idPersonal: personal.idPersonal,
        nombre: capitalizeWords(personal.nombre || ''),
        apellidos: capitalizeWords(personal.apellidos || ''),
        rolId: personal.rolId,
        rol: personal.rol === 'SOPORTE_TECNICO' ? 'SOPORTE TÉCNICO' : personal.rol,
        estado: personal.estado,
        cantidadMantenimiento: personal.cantidadMantenimiento ? personal.cantidadMantenimiento : '0',
        cantidadAuditoria: personal.cantidadAuditoria ? personal.cantidadAuditoria : '0',
      })) as GridRowsProp;
    } catch (error) {
      return [];
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const mappedRows = await fecthPersonalData();

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
