import { PrioridadDTO } from 'data/interfaces/PrioridadDTO';
import PrioridadService from 'data/services/PrioridadService';
import { useCallback, useState } from 'react';

export const usePrioridadData = () => {
  // estado para cargar la data y obtener cada elemento
  const [dataPrioridad, setPrioridades] = useState<PrioridadDTO[]>([]);
  // estado para cargar el loading
  const [loading, setLoading] = useState<boolean>(false);
  // estado para cargar el error
  const [error, setError] = useState<string | null>(null);
  // estado para las opciones
  const [optionsPrioridad, setOptionsPrioridad] = useState<PrioridadDTO[]>([]);

  // funcion para obtener la data de las prioridades
  const fetchDataPrioridades = useCallback(async () => {
    try {
      setLoading(true);
      const response = await PrioridadService.getAllPrioridad();
      const prioridades = response.listAllPrioridad || [];
      setPrioridades(response.listAllPrioridad || []);
      // estableciendo las opciones para el select
      const optionsArray = prioridades.map((prioridad: PrioridadDTO) => ({
        id: prioridad.id,
        nombre: prioridad.nombre,
      }));
      setOptionsPrioridad(optionsArray);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {dataPrioridad, loading, error, optionsPrioridad, fetchDataPrioridades};
};
