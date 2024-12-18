import { GridRowsProp } from '@mui/x-data-grid';
import { HardwareDTO } from 'data/interfaces/HardwareDTO';
import { HardwareService } from 'data/services/HardwareService';
import { capitalizeWords } from 'helpers/capitalizar-palabra';

const fecthHardware = async (): Promise<GridRowsProp> => {
  try {
    const response = (await HardwareService.getAllHardware()) as HardwareDTO;
    if (!response.hardwareDTOList || !Array.isArray(response.hardwareDTOList)) {
      throw new Error('La respuesta no es un array');
    }
    return response.hardwareDTOList.map((hardware: HardwareDTO, index: number) => ({
      id: index,
      nombre: capitalizeWords(hardware.nombre || ''),
      marca: capitalizeWords(hardware.marca || ''),
      modelo: capitalizeWords(hardware.modelo || ''),
      nombreProveedor: capitalizeWords(hardware.nombreProveedor || ''),
      nombreEmpleado: capitalizeWords(hardware.nombreEmpleado || ''),
      cantidadIncidencias: hardware.cantidadIncidencias === 0 ? '0' : hardware.cantidadIncidencias,
      porcentajeIncidencias:
        hardware.porcentajeIncidencias === 0 ? '0%' : `${hardware.porcentajeIncidencias}%` || '',
    })) as GridRowsProp;
  } catch (error) {
    return [];
  }
};

export const rows: GridRowsProp = await fecthHardware();
