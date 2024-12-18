import { MantenimientoDTO } from "data/interfaces/MantenimientoDTO";
import { MantenimientoService } from "data/services/MantenimientoService";
import { useCallback, useState } from "react";

export const useMantenimientoData = () => {
    const [mantenimiento, setMantenimientoData] = useState<MantenimientoDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>('');

    const fetchDataSinMantenimiento = useCallback(async () => {
      try {
        setLoading(true);
        const response = await MantenimientoService.getFISinMantenimiento();
        setMantenimientoData(response.listaMantenimiento || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }, []);

    return { mantenimiento, loading, error, fetchDataMantenimiento: fetchDataSinMantenimiento,
    };
  };