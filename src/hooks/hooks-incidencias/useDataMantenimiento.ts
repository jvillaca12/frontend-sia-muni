import { GridRowsProp } from '@mui/x-data-grid';
import { MantenimientoDTO } from 'data/interfaces/MantenimientoDTO';
import { UsuarioDTO } from 'data/interfaces/UserDTO';
import { MantenimientoService } from 'data/services/MantenimientoService';
import { capitalizeWords } from 'helpers/capitalizar-palabra';
import { useState, useEffect } from 'react';

export const useDataMantenimiento = (
  onFilteredRowCountChange?: (count: number) => void,
  user?: UsuarioDTO | null,
) => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fecthMantenimiento = async (): Promise<GridRowsProp> => {
    try {
      const responseMantenimiento = await MantenimientoService.getDataMantenimiento(
        user?.idUsuario || 0,
        user?.rol === 'ADMIN',
      );
      if (
        !responseMantenimiento.listaMantenimiento ||
        !Array.isArray(responseMantenimiento.listaMantenimiento)
      ) {
        throw new Error('La respuesta no es un array');
      }
      return responseMantenimiento.listaMantenimiento.map(
        (mantenimiento: MantenimientoDTO, index: number) => ({
          id: index,
          idMantenimiento: mantenimiento.idMantenimiento,
          idDetalleProblema: mantenimiento.idDetalleProblema,
          codigoProblema: mantenimiento.codigoProblema,
          nombreActivo: capitalizeWords(mantenimiento.nombreActivo || 'Vacío'),
          descripcion: mantenimiento.descripcion,
          fechaRegistro: mantenimiento.fechaRegistro,
          fechaProgramada: mantenimiento.fechaProgramada,
          fechaRealizada: mantenimiento.fechaRealizada,
          tipoMantenimiento: capitalizeWords(mantenimiento.tipoMantenimiento || ''),
          tipoMantenimientoId: mantenimiento.tipoMantenimientoId,
          notas: mantenimiento.notas,
          personal: capitalizeWords(mantenimiento.personal || ''),
          personalId: mantenimiento.personalId,
          cantidadAuditoria: mantenimiento.cantidadAuditoria,
        }),
      ) as GridRowsProp;
    } catch (error) {
      return [];
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const mappedRows = await fecthMantenimiento();

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
