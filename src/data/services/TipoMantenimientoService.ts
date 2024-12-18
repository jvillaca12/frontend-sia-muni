import axiosInstance from 'config/axios-config';
import { TipoMantenimientoDTO } from 'data/interfaces/TipoMantenimientoDTO';

export const TipoMantenimientoService = {
  getDataShortTypeMantenimiento: async () => {
    try {
      const response = await axiosInstance.get(`/adminuser/short-tp`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },

  getDataTP: async () => {
    try {
      const response = await axiosInstance.get(`/admin/tp-data`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },

  updateTP: async (id: number, tipoMantenimientoDTO: TipoMantenimientoDTO) => {
    try {
      const response = await axiosInstance.put(`/admin/tp-update/${id}`, tipoMantenimientoDTO);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },

  deleteTP: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/admin/tp-delete/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },

  insertTP: async (tipoMantenimientoDTO: TipoMantenimientoDTO) => {
    try {
      const response = await axiosInstance.post(`/admin/tp-create`, tipoMantenimientoDTO);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },
};

export default TipoMantenimientoService;
