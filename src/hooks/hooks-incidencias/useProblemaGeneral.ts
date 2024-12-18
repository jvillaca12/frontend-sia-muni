// hooks/useProblemaGeneralData.ts
import { GridRowsProp } from '@mui/x-data-grid';
import { ProblemaGeneralDTO } from 'data/interfaces/ProblemaGeneralDTO';
import { UsuarioDTO } from 'data/interfaces/UserDTO';
import { ProblemaGeneralService } from 'data/services/ProblemaGeneralService';
import { capitalizeWords } from 'helpers/capitalizar-palabra';
import { useState, useEffect } from 'react';

export const useProblemaGeneralData = (
  onFilteredRowCountChange?: (count: number) => void,
  user?: UsuarioDTO | null,
) => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProblemaGeneral = async (): Promise<GridRowsProp> => {
    try {
      const response = (await ProblemaGeneralService.getDataProblemaGeneral(
        0,
        user?.idUsuario,
        user?.rol === 'ADMIN',
      )) as ProblemaGeneralDTO;
      if (!response.problemaGeneralDTOList || !Array.isArray(response.problemaGeneralDTOList)) {
        throw new Error('La respuesta no es un array');
      }
      const mappedRows = response.problemaGeneralDTOList.map(
        (problemaGeneral: ProblemaGeneralDTO, index: number) => ({
          id: index,
          idProblemaGeneral: problemaGeneral.idProblemaGeneral,
          codigoProblemaGeneral: problemaGeneral.codigoProblemaGeneral,
          codigoBien: problemaGeneral.codigoBien,
          nombreActivo: capitalizeWords(problemaGeneral.nombreActivo || 'Vacío'),
          tipoActivo: capitalizeWords(problemaGeneral.tipoActivo || 'Vacío'),
          nombreEmpleado: capitalizeWords(problemaGeneral.nombreEmpleado || 'Vacío'),
          nombreUsuario: capitalizeWords(problemaGeneral.nombreUsuario || 'Vacío'),
          fechaOcurrencia: problemaGeneral.fechaOcurrencia,
          cantidadDetalleProblema: problemaGeneral.cantidadDetalleProblema,
        }),
      ) as GridRowsProp;
      return mappedRows;
    } catch (error) {
      return [];
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const mappedRows = await fetchProblemaGeneral();

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
  }, [user]);

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
