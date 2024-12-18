import { GridRowsProp } from '@mui/x-data-grid';
import { SoftwareDTO } from 'data/interfaces/SoftwareDTO';
import { SoftwareService } from 'data/services/SoftwareService';
import { capitalizeWords } from 'helpers/capitalizar-palabra';

const fecthHardware = async (): Promise<GridRowsProp> => {
  try {
    const response = (await SoftwareService.getDataSoftware()) as SoftwareDTO;
    if (!response.softwareDTOList || !Array.isArray(response.softwareDTOList)) {
      throw new Error('La respuesta no es un array');
    }
    return response.softwareDTOList.map((software: SoftwareDTO, index: number) => ({
      id: index,
      nombre: capitalizeWords(software.nombre || ''),
      version: software.version || '',
      fechaInstalacion: software.fechaInstalacion || new Date().toDateString(),
      fechaVencimientoLicencia: software.fechaVencimientoLicencia || new Date().toDateString(),
      nombreProveedor: capitalizeWords(software.nombreProveedor || ''),
      nombreEmpleado: capitalizeWords(software.nombreEmpleado || ''),
      cantidadIncidencias: software.cantidadIncidencias === 0 ? '0' : software.cantidadIncidencias,
      porcentajeIncidencias:
        software.porcentajeIncidencias === 0 ? '0%' : `${software.porcentajeIncidencias}%` || '',
    })) as GridRowsProp;
  } catch (error) {
    return [];
  }
};

export const rows: GridRowsProp = await fecthHardware();
