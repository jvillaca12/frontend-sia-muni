import { PersonalDTO } from 'data/interfaces/PersonalDTO';
import { PersonalService } from 'data/services/PersonalService';
import { useCallback, useState } from 'react';

export const usePersonalData = () => {
  // estado para cargar la data y obtener cada elemento
  const [dataPersonal, setPersonal] = useState<PersonalDTO[]>([]);
  // estado para cargar el loading
  const [loading, setLoading] = useState<boolean>(false);
  // estado para cargar el error
  const [error, setError] = useState<string | null>(null);
  // estado para las opciones
  const [optionsPersonal, setOptionsPersonal] = useState<PersonalDTO[]>([]);

  // funcion para obtener la data de las prioridades
  const fetchDataPersonal = useCallback(async () => {
    try {
      setLoading(true);
      const response = await PersonalService.getDataShortPersonal();
      const arrayPersonal = response.personalDTOList || [];
      setPersonal(response.personalDTOList || []);
      // estableciendo las opciones para el select
      const optionsArray = arrayPersonal.map((personal: PersonalDTO) => ({
        idPersonal: personal.idPersonal,
        personal: personal.personal,
      }));
      setOptionsPersonal(optionsArray);  
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { dataPersonal, loading, error, optionsPersonal, fetchDataPersonal };
};
