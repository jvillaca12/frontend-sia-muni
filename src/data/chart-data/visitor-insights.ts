import { DataSIAshareService } from "data/services/DataSIAshareService";

interface VisitorIncidenciaMesProps {
  'Incidencias por Mes': number[];
}

const fecthCantidadIncidenciaMes = async (): Promise<number[]> => {
  const response = await DataSIAshareService.getCantidadIncidenciasMes();

  if (response.detalleProblemaDTOList) {
    return response.detalleProblemaDTOList.map((item: { cantidadMes: number }) => item.cantidadMes);
  } else {
    return [];
  }
}

export const visitorIncidenciaMesData: VisitorIncidenciaMesProps = {

  'Incidencias por Mes': await fecthCantidadIncidenciaMes(),
};
