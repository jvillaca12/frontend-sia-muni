import { GridRowsProp } from '@mui/x-data-grid';
import { DetalleProblemaDTO } from 'data/interfaces/DetalleProblemaDTO';
import { UsuarioDTO } from 'data/interfaces/UserDTO';
import DetalleProblemaService from 'data/services/DetalleProblemaService';
import { capitalizeWords } from 'helpers/capitalizar-palabra';
import { useEffect, useState } from 'react';

export const useDetalleProblemaData = (
  idProblemaGeneral?: number,
  user?: UsuarioDTO | null
) => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseIncidencias = await DetalleProblemaService.getAllDataDetalleProblema(
          idProblemaGeneral || 0,
          user?.idUsuario || 0,
          user?.rol === 'ADMIN'
        );

        if (
          !responseIncidencias.detalleProblemaDTOList ||
          !Array.isArray(responseIncidencias.detalleProblemaDTOList)
        ) {
          throw new Error('La respuesta no es un array');
        }

        const processedRows = responseIncidencias.detalleProblemaDTOList.map(
          (detalleProblema: DetalleProblemaDTO, index: number) => ({
            id: index,
            idDetalleProblema: detalleProblema.idDetalleProblema,
            codigoProblema: detalleProblema.codigoProblema,
            descripcion: detalleProblema.descripcion,
            fechaRegistro: detalleProblema.fechaRegistro,
            medioReporte: capitalizeWords(detalleProblema.medioReporte || ''),
            solucion: detalleProblema.solucion,
            codigoBien: detalleProblema.codigoBien,
            nombreActivo: capitalizeWords(detalleProblema.nombreActivo || ''),
            tipoActivo: capitalizeWords(detalleProblema.tipoActivo || ''),
            nombreEmpleado: capitalizeWords(detalleProblema.nombreEmpleado || ''),
            prioridad: capitalizeWords(detalleProblema.prioridad || ''),
            categoria: capitalizeWords(detalleProblema.categoria || ''),
            solucionadoText: detalleProblema.solucionado ? 'Si' : 'No',
          })
        ) as GridRowsProp;

        setRows(processedRows);
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Error desconocido'));
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idProblemaGeneral, user]);

  return { rows, loading, error };
};
