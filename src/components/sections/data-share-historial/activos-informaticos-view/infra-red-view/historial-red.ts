import { GridRowsProp } from '@mui/x-data-grid';
import { RedDTO } from 'data/interfaces/RedDTO';
import { RedService } from 'data/services/RedService';
import { capitalizeWords } from 'helpers/capitalizar-palabra';

const fecthRed = async (): Promise<GridRowsProp> => {
  try {
    const response = (await RedService.getDataRed()) as RedDTO;
    if (!response.infraestructuraRedDTOList || !Array.isArray(response.infraestructuraRedDTOList)) {
      throw new Error('La respuesta no es un array');
    }
    return response.infraestructuraRedDTOList.map((hardware: RedDTO, index: number) => ({
      id: index,
      tipRed: capitalizeWords(hardware.tipRed || ''),
      direccionIP: hardware.direccionIP || '',
      nombreProveedor: capitalizeWords(hardware.nombreProveedor || ''),
      nombreEmpleado: capitalizeWords(hardware.nombreEmpleado || ''),
      oficinaGerencia: capitalizeWords(hardware.oficinaGerencia || ''),
      piso: hardware.piso,
      cantidadIncidencias: hardware.cantidadIncidencias === 0 ? '0' : hardware.cantidadIncidencias,
      porcentajeIncidencias:
        hardware.porcentajeIncidencias === 0 ? '0%' : `${hardware.porcentajeIncidencias}%` || '',
    })) as GridRowsProp;
  } catch (error) {
    return [];
  }
};

export const rows: GridRowsProp = await fecthRed();
