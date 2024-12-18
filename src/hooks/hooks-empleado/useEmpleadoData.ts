import { EmpleadoDTO } from 'data/interfaces/EmpleadoDTO';
import { EmpleadoService } from 'data/services/EmpleadoService';
import { useCallback, useState } from 'react';

export const useEmpleadoData = () => {
  const [dataEmpleado, setDataEmpleado] = useState<EmpleadoDTO[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>('');

  const fetchDataEmpleadoMostrar = useCallback(async () => {
    try {
      setLoading(true);
      const response = await EmpleadoService.getEmpleadosTotalMostar();
      setDataEmpleado(response.listEmpleados);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { dataEmpleado, loading, error, fetchDataEmpleadoMostrar };
};
