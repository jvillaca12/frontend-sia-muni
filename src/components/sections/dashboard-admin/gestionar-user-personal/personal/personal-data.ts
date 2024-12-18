import { GridRowsProp } from '@mui/x-data-grid';
import { PersonalDTO } from 'data/interfaces/PersonalDTO';
import { PersonalService } from 'data/services/PersonalService';
import { capitalizeWords } from 'helpers/capitalizar-palabra';

const fecthPersonalData = async (): Promise<GridRowsProp> => {
  try {
    const responsePersonal = await PersonalService.getDataFullPersonal();
    if (!responsePersonal.personalDTOList || !Array.isArray(responsePersonal.personalDTOList)) {
      throw new Error('La respuesta no es un array');
    }
    return responsePersonal.personalDTOList.map((personal: PersonalDTO, index: number) => ({
      id: index,
      idPersonal: personal.idPersonal,
      nombre: capitalizeWords(personal.nombre || ''),
      apellidos: capitalizeWords(personal.apellidos || ''),
      rolId: personal.rolId,
      rol: personal.rol === 'SOPORTE_TECNICO' ? 'SOPORTE TÉCNICO' : personal.rol,
      estado: personal.estado,
      cantidadMantenimiento: personal.cantidadMantenimiento,
      cantidadAuditoria: personal.cantidadAuditoria,
    })) as GridRowsProp;
  } catch (error) {
    return [];
  }
};

export const rows: GridRowsProp = await fecthPersonalData();