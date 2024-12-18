import { PrioridadDTO } from 'data/interfaces/PrioridadDTO';
import PrioridadService from 'data/services/PrioridadService';

export interface PrioridadMesProps {
  MesActual: number[];
  MesAnterior: number[];
}

const fetchCantidadPrioridadMes = async (): Promise<PrioridadDTO[]> => {
  try {
    const response = await PrioridadService.getCantidadPrioridadByMes();
    if (!response.listPrioridadDTO || !Array.isArray(response.listPrioridadDTO)) {
      throw new Error('La respuesta no es un array');
    }
    return response.listPrioridadDTO.map((prioridad: PrioridadDTO) => ({
      cantidadLeve: prioridad.cantidadLeve,
      cantidadGrave: prioridad.cantidadGrave,
      cantidadCritico: prioridad.cantidadCritico,
    }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const prioridadDataMes = async (): Promise<PrioridadMesProps> => {
  const prioridadMes = await fetchCantidadPrioridadMes();
  return {
    MesActual: [
      prioridadMes[0].cantidadLeve || 0,
      prioridadMes[0].cantidadGrave || 0,
      prioridadMes[0].cantidadCritico || 0,
      prioridadMes[2].cantidadLeve || 0,
      prioridadMes[2].cantidadGrave || 0,
      prioridadMes[2].cantidadCritico || 0,
    ],
    MesAnterior: [
      prioridadMes[1].cantidadLeve || 0,
      prioridadMes[1].cantidadGrave || 0,
      prioridadMes[1].cantidadCritico || 0,
      prioridadMes[3].cantidadLeve || 0,
      prioridadMes[3].cantidadGrave || 0,
      prioridadMes[3].cantidadCritico || 0,
    ],
  };
};
