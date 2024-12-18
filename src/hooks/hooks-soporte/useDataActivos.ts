import { TableActivosSinProblemas } from 'data/interfaces/TablaFallo';
import { useCallback, useState } from 'react';
import { ActivoMaestroService } from 'data/services/ActivoMaestroService';

export const useActivosSinProblemas = () => {
  const [dataActivosSinProblemas, setDataIncidencias] = useState<TableActivosSinProblemas[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivosSinProblemas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ActivoMaestroService.getActivosSinProblemas();
      setDataIncidencias(response.activoMaestroDTOList || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { dataActivosSinProblemas, loading, error, fetchActivosSinProblemas };
};
