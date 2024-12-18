
import { ProblemaGeneralDTO } from 'data/interfaces/ProblemaGeneralDTO';
import { UsuarioDTO } from 'data/interfaces/UserDTO';
import { ProblemaGeneralService } from 'data/services/ProblemaGeneralService';

export const fetchDataProblemaGeneralById = async (
  idProblemaGeneral?: number,
  user?: UsuarioDTO | null,
): Promise<ProblemaGeneralDTO | undefined> => {
  try {
    const response = await ProblemaGeneralService.getDataProblemaGeneral(
      idProblemaGeneral || 0,
      user?.idUsuario,
      user?.rol === 'ADMIN',
    );
    if (!response.problemaGeneralDTOList || !Array.isArray(response.problemaGeneralDTOList)) {
      throw new Error('La respuesta no es un array');
    }
    // Devuelve el primer elemento de la lista
    return response.problemaGeneralDTOList[0];
  } catch (error) {
    return undefined;
  }
};

