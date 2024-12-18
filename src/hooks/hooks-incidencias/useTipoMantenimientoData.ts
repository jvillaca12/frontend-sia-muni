import { TipoMantenimientoDTO } from 'data/interfaces/TipoMantenimientoDTO';
import TipoMantenimientoService from 'data/services/TipoMantenimientoService';
import { useCallback, useState } from 'react';

export const useTipoMantenimientoData = () => {
  // estado para cargar la data y obtener cada elemento
  const [dataTP, setTP] = useState<TipoMantenimientoDTO[]>([]);
  // estado para cargar el loading
  const [loading, setLoading] = useState<boolean>(false);
  // estado para cargar el error
  const [error, setError] = useState<string | null>(null);
  // estado para las opciones
  const [optionsTP, setOptionsTP] = useState<TipoMantenimientoDTO[]>([]);

  // funcion para obtener la data de las prioridades
  const fetchDataTP = useCallback(async () => {
    try {
      setLoading(true);
      const response = await TipoMantenimientoService.getDataShortTypeMantenimiento();
      const tp = response.tipoMantenimientoDTOList || [];
      setTP(response.tipoMantenimientoDTOList || []);
      // estableciendo las opciones para el select
      const optionsArray = tp.map((tp: TipoMantenimientoDTO) => ({
        id: tp.id,
        nombre: tp.nombre,
      }));
      setOptionsTP(optionsArray);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { dataTP, loading, error, optionsTP, fetchDataTP };
};
