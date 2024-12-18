import { GridRowsProp } from '@mui/x-data-grid';
import { EmpleadoDTO } from 'data/interfaces/EmpleadoDTO';
import { EmpleadoService } from 'data/services/EmpleadoService';
import { capitalizeWords } from 'helpers/capitalizar-palabra';

const fetchEmpleadosSoporte = async (): Promise<GridRowsProp> => {
  try {
    const dataEmpleado = (await EmpleadoService.getEmpleadosTotalMostar()) as EmpleadoDTO;

    if (!dataEmpleado.listEmpleados || !Array.isArray(dataEmpleado.listEmpleados)) {
      throw new Error('La respuesta no es un array');
    }

    return dataEmpleado?.listEmpleados.map((empleado: EmpleadoDTO, index: number) => ({
      id: index,
      nombreEmpleado: capitalizeWords(empleado.nombreEmpleado || ''),
      cargo: capitalizeWords(empleado.cargo || ''),
      oficina: capitalizeWords(empleado.oficina || ''),
      porcentaje: `${empleado.porcentaje}%`,
      cantidad: empleado.cantidad,
    })) as GridRowsProp;
  } catch (error) {
    return [];
  }
};

export const rowsSoporte: GridRowsProp = await fetchEmpleadosSoporte();
