import { FalloCompartidoDTO } from 'data/interfaces/FalloCompartidoDTO';
import { DataSIAshareService } from 'data/services/DataSIAshareService';
import { useCallback, useState } from 'react';

export const useIncidenciaTotalData = () => {
  const [incidencia, setIncidenciaData] = useState<FalloCompartidoDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>('');
  const [incidenciaDiaMes, setIncidenciaDataDiaMes] = useState<FalloCompartidoDTO | null>(null);
  const [loadingDiaMes, setLoadingDiaMes] = useState(false);
  const [errorDiaMes, setErrorDiaMes] = useState<string | null>('');

  const fetchDataIncidenciaTotal = useCallback(async () => {
    try {
      setLoading(true);
      const response = await DataSIAshareService.getCantidadTotalIncidencias();
      setIncidenciaData(response.detalleProblemaDTO);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDataTotalDiaMes = useCallback(async () => {
    try {
      setLoadingDiaMes(true);
      const response = await DataSIAshareService.getCantidadTotalIncidencias();
      setIncidenciaDataDiaMes(response.incidenciaFalloDTO);
    } catch (error) {
      setErrorDiaMes(error.message);
    } finally {
      setLoadingDiaMes(false);
    }
  }, []);

  return { incidencia, loading, error, fetchDataIncidenciaTotal,
    incidenciaDiaMes, loadingDiaMes, errorDiaMes, fetchDataTotalDiaMes,
  };
};
