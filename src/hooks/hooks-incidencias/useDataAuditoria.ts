// hooks/useProblemaGeneralData.ts
import { GridRowsProp } from '@mui/x-data-grid';
import { AuditoriaDTO } from 'data/interfaces/AuditoriaDTO';
import { UsuarioDTO } from 'data/interfaces/UserDTO';
import { AuditoriaService } from 'data/services/AuditoriaService';
import { capitalizeWords } from 'helpers/capitalizar-palabra';
import { useState, useEffect } from 'react';

export const useDataAuditoria = (
  onFilteredRowCountChange?: (count: number) => void,
  user?: UsuarioDTO | null,
) => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fecthDataAuditoria = async (): Promise<GridRowsProp> => {
    try {
      const response = await AuditoriaService.getDataFullAuditoria(user?.idUsuario || 0, user?.rol === 'ADMIN');
      if (!response.auditoriaDTOList || !Array.isArray(response.auditoriaDTOList)) {
        throw new Error('La respuesta no es un array');
      }

      return response.auditoriaDTOList.map((auditoria: AuditoriaDTO, index: number) => ({
        id: index,
        idAuditoria: auditoria.idAuditoria,
        codigoProblema: auditoria.codigoProblema,
        tipoMantenimiento: capitalizeWords(auditoria.tipoMantenimiento || ''),
        fechaRealizada: auditoria.fechaRealizada,
        personal: capitalizeWords(auditoria.personal || 'Vacío'),
        idMantenimiento: auditoria.idMantenimiento,
        fechaCambio: auditoria.fechaCambio,
        cambioRealizado: auditoria.cambioRealizado,
      })) as GridRowsProp;
    } catch (error) {
      return [];
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const mappedRows = await fecthDataAuditoria();

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
