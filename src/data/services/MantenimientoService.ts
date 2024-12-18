import axiosInstance from 'config/axios-config';
import { MantenimientoDTO } from 'data/interfaces/MantenimientoDTO';

export const MantenimientoService = {
  deleteMantenimiento: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/adminuser/delete-mantenimiento/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },

  insertMantenimiento: async (mantenimientoDTO: MantenimientoDTO) => {
    try {
      const response = await axiosInstance.post(
        `/adminuser/insert-mantenimiento`,
        mantenimientoDTO,
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },

  updateMantenimiento: async (idMantenimiento: number, mantenimientoDTO: MantenimientoDTO) => {
    try {
      const response = await axiosInstance.put(
        `/adminuser/update-mantenimiento/${idMantenimiento}`,
        mantenimientoDTO,
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },

  getMantenimientoDetalleProblema: async (idDetalleProblema: number) => {
    try {
      const response = await axiosInstance.get(
        `/soporte-tecnico/verificar-dp/${idDetalleProblema}`,
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },

  getDataMantenimiento: async (idUsuario: number, esAdmin: boolean) => {
    try {
      // Si no se proporciona idUsuario, se usa el valor 0
      const userId = idUsuario || 0;
      // Si no se proporciona esAdmin, se usa el valor falso
      const adminStatus = esAdmin ?? false;
      const response = await axiosInstance.get(
        `/adminuser/all-mantenimiento/${userId}/${adminStatus}`,
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },

  getFISinMantenimiento: async () => {
    try {
      const response = await axiosInstance.get(`/adminuser/sin-mantenimiento`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },

  getMantenimientoTotalVencidas: async () => {
    try {
      const response = await axiosInstance.get(`/soporte-tecnico/mantenimiento-total-vencida`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },
};
