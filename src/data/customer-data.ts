import { GridRowsProp } from '@mui/x-data-grid';
import { capitalizeWords } from 'helpers/capitalizar-palabra';
import { EmpleadoService } from './services/EmpleadoService';
import { EmpleadoDTO } from './interfaces/EmpleadoDTO';
import { PersonalService } from './services/PersonalService';
import { PersonalDTO } from './interfaces/PersonalDTO';

export const fecthEmpleados = async (): Promise<GridRowsProp> => {
  try {
    const responsePersonal = await PersonalService.getPersonalMantenimiento();
    
    if (!responsePersonal.personalDTOList || !Array.isArray(responsePersonal.personalDTOList)) {
      throw new Error('La respuesta no es un array');1
    }

    return responsePersonal.personalDTOList.map((personal: PersonalDTO, index: number) => ({
      id: index,
      nombreApellidos: capitalizeWords(personal.personal || ''),
      rol: capitalizeWords(personal.rol?.replace("_", " ") || ""),
      cantidadMantenimiento: personal.cantidadMantenimiento,
      cantidadAuditoria: personal.cantidadAuditoria,
    })) as GridRowsProp;
  } catch (error) {
    return [];
  }
};

export const fetchEmpleadosSoporte = async (): Promise<GridRowsProp> => {
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
    throw new Error(error);
    return [];
  }
};
