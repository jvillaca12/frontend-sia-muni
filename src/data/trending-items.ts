
import { ActivoGeneralDTO } from './interfaces/ActivoGeneralDTO';
import { DataSIAshareService } from './services/DataSIAshareService';

export interface TrendingItem {
  id?: number;
  name: string;
  imgsrc: string;
  popularity: number;
  users: string[];
}

const fecthTOP5ActivosMaestro = async (): Promise<ActivoGeneralDTO[]> => {
  try {
    const responseActivo = await DataSIAshareService.getTop5Activos();
    if (!responseActivo.activoMaestroDTOList || !Array.isArray(responseActivo.activoMaestroDTOList)) {
      throw new Error('La respuesta no es un array');
    }
    return responseActivo.activoMaestroDTOList.map((activoMaestro: ActivoGeneralDTO) => ({
      codigoBien: activoMaestro.codigoBien,
      nombreActivo: activoMaestro.nombreActivo,
      tipoActivo: activoMaestro.tipoActivo,
      proveedor: activoMaestro.proveedor,
      cantidadFI: activoMaestro.cantidadFI,
      porcentajeFI: activoMaestro.porcentajeFI,
    }));
  } catch (error) {
    console.error('Error al obtener los items de incidencias de soporte', error);
    throw new Error(error.message);
  }
};

export const top5ActivoMaestroItems = async (): Promise<ActivoGeneralDTO[]> => {
  const activoMaestro = await fecthTOP5ActivosMaestro();
  return activoMaestro.slice(0, 5).map((item) => ({
    id: activoMaestro.indexOf(item),
    codigoBien: item.codigoBien,
    nombreActivo: item.nombreActivo,
    tipoActivo: item.tipoActivo,
    proveedor: item.proveedor,
    cantidadFI: item.cantidadFI,
    porcentajeFI: item.porcentajeFI,
  }));
};
