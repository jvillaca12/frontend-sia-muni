import axiosInstance from 'config/axios-config';
import { AuditoriaDTO } from 'data/interfaces/AuditoriaDTO';

export const AuditoriaService = {
  insertAuditoria: async (data: AuditoriaDTO) => {
    try {
      const response = await axiosInstance.post(`adminuser/insert-auditoria`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  deleteAuditoria: async (idAuditoria: number) => {
    try {
      const response = await axiosInstance.delete(`adminuser/delete-auditoria/${idAuditoria}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  updateAuditoria: async (idAuditoria: number, data: AuditoriaDTO) => {
    try {
      const response = await axiosInstance.put(`adminuser/update-auditoria/${idAuditoria}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  getDataFullAuditoria: async (idUsuario: number, esAdmin: boolean) => {
    try {
      // Si no se proporciona idUsuario, se usa el valor 0
      const userId = idUsuario || 0;
      // Si no se proporciona esAdmin, se usa el valor falso
      const adminStatus = esAdmin ?? false;
      const response = await axiosInstance.get(`adminuser/auditoria-full/${userId}/${adminStatus}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  getAudiMantenimiento: async (idMantenimiento: number) => {
    try {
      const response = await axiosInstance.get(`adminuser/audi-mante/${idMantenimiento}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  },
};
