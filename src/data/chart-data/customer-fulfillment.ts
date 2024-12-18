import { FalloCompartidoDTO } from 'data/interfaces/FalloCompartidoDTO';
import { DataSIAshareService } from 'data/services/DataSIAshareService';

export interface FalloMesActualAnteriorProps {
  'Este Mes': number[];
  'Ultimo Mes': number[];
}

const fetchCantidadIncidenciaMes = async (): Promise<FalloCompartidoDTO[]> => {
  try {
    const response = await DataSIAshareService.getTotalDetalleProblemaDiaMes();
    if (
      !response.detalleProblemaDTOList ||
      !Array.isArray(response.detalleProblemaDTOList)
    ) {
      throw new Error('La respuesta no es un array');
    }
    return response.detalleProblemaDTOList.map((fallo: FalloCompartidoDTO) => ({
      cantidadMesAnterior: fallo.cantidadMesAnterior,
      cantidadMesActual: fallo.cantidadMesActual,
    }));
  } catch (error) {
    console.error('Error al obtener los items de incidencias de soporte', error);
    throw new Error(error.message);
  }
};

export const customerFulfillmentData = async (): Promise<FalloMesActualAnteriorProps> => {
  const falloMes = await fetchCantidadIncidenciaMes();
  return {
    'Este Mes': [
      falloMes[0].cantidadMesActual,
      falloMes[1].cantidadMesActual,
      falloMes[2].cantidadMesActual,
      falloMes[3].cantidadMesActual,
      falloMes[4].cantidadMesActual,
      falloMes[5].cantidadMesActual,
      falloMes[6].cantidadMesActual,
    ],
    'Ultimo Mes': [
      falloMes[0].cantidadMesAnterior,
      falloMes[1].cantidadMesAnterior,
      falloMes[2].cantidadMesAnterior,
      falloMes[3].cantidadMesAnterior,
      falloMes[4].cantidadMesAnterior,
      falloMes[5].cantidadMesAnterior,
      falloMes[6].cantidadMesAnterior,
    ],
  };
};
