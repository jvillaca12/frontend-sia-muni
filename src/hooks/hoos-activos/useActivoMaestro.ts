import { ActivoGeneralDTO } from "data/interfaces/ActivoGeneralDTO";
import { DataSIAshareService } from "data/services/DataSIAshareService";
import { useCallback, useState } from "react";

export const useActivoMaestro = () => {
    // para obtener el perfil del usuario
  const [activoMaestro, setUser] = useState<ActivoGeneralDTO | null>(null);
  // para establecer la carga
  const [loading, setLoading] = useState<boolean>(false);
  // para establecer el mensaje de error
  const [error, setError] = useState<string | null>('');

  const fetchTop5ActivosFI = useCallback(async () => {
    try {
      setLoading(true);
      const response = await DataSIAshareService.getTop5Activos();
      setUser(response.user);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {activoMaestro, loading, error, fetchTop5ActivosFI};
}