import axiosInstance from 'config/axios-config';
import { ProblemaGeneralDTO } from 'data/interfaces/ProblemaGeneralDTO';

export const ProblemaGeneralService = {
  getDataProblemaGeneral: async (
    idProblemaGeneral: number,
    idUsuario?: number,
    esAdmin?: boolean,
  ) => {
    try {
      // Si no se proporciona idUsuario, se usa el valor 0
      const userId = idUsuario || 0;
      // Si no se proporciona esAdmin, se usa el valor falso
      const adminStatus = esAdmin ?? false;
      const response = await axiosInstance.get(
        `/adminuser/data-problema-general/${idProblemaGeneral}/${userId}/${adminStatus}`,
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  deleteProblemaGeneral: async (idProblemaGeneral: number) => {
    try {
      const response = await axiosInstance.delete(
        `/soporte-tecnico/delete-problema-general/${idProblemaGeneral}`,
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  insertProblemaGeneral: async (problemaGeneral: ProblemaGeneralDTO) => {
    try {
      const response = await axiosInstance.post(
        `/soporte-tecnico/create-problema-general`,
        problemaGeneral,
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  // obtener la cantidad total de problemas generales registrados del dia actual
  getProblemaGeneralByDay: async () => {
    try {
      const response = await axiosInstance.get(`/adminuser/countday-problema`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  // obtener el porcentaje de problemas generales registrados del dia actual con respecto al dia anterior
  getAmountProbGenByDayActualAnterior: async () => {
    try {
      const response = await axiosInstance.get(`/adminuser/compareday-problema`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};
