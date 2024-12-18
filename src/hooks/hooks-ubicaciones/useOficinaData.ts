import { OficinaDTO } from 'data/interfaces/OficinaDTO';
import { DataSIAshareService } from 'data/services/DataSIAshareService';
import { useCallback, useState } from 'react';

export const useDataOficina = () => {
  // estado para cargar la data y obtener cada elemento
  const [dataOficina, setDataOficina] = useState<OficinaDTO[]>([]);
  // estado para cargar el loading
  const [loading, setLoading] = useState<boolean>(false);
  // estado para cargar el error
  const [error, setError] = useState<string | null>(null);
  const [optionsOficina, setOptionsOficina] = useState<OficinaDTO[]>([]);

  // funcion para obtener la data de las categorias
  const fetchDataOficina = useCallback(async () => {
    try {
      setLoading(true);
      const response = await DataSIAshareService.getDataProfileOficina();
      const oficinas = response.listOficinas || [];
      setDataOficina(oficinas);
      const optionsArrayOficina = oficinas.map((oficina: OficinaDTO) => ({
        id: oficina.id,
        nombreOficina: oficina.nombreOficina?.toLowerCase(),
      }));
      setOptionsOficina(optionsArrayOficina);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { dataOficina, loading, error, optionsOficina, fetchDataOficina };
};
