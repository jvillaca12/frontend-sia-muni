import { RolDTO } from 'data/interfaces/RolDTO';
import { RolService } from 'data/services/RolService';
import { useCallback, useState } from 'react';

export const useDataRolUser = () => {
  // estado para cargar la data y obtener cada elemento
  const [rolData, setDataRol] = useState<RolDTO[]>([]);
  // estado para cargar el loading
  const [loading, setLoading] = useState<boolean>(false);
  // estado para cargar el error
  const [error, setError] = useState<string | null>(null);
  const [optionsRol, setOptionsRol] = useState<RolDTO[]>([]);

  // funcion para obtener la data de los roles
  const fetchDataRol = useCallback(async () => {
    // mapear los roles para soporte tecnico
    const roleNameMap: { [key: string]: string } = {
      SOPORTE_TECNICO: 'SOPORTE TÉCNICO',
    };
    try {
      setLoading(true);
      const response = await RolService.getRolUser();
      const roles = response.listRol || [];
      setDataRol(roles);
      const optionsArrayRol = roles.map((rol: RolDTO) => ({
        id: rol.id,
        nombre: roleNameMap[rol.nombre || ''] || rol.nombre,
      }));
      setOptionsRol(optionsArrayRol);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { rolData, loading, error, optionsRol, fetchDataRol };
};
