import axiosInstance from 'config/axios-config';
import { RolDTO } from 'data/interfaces/RolDTO';

export const RolService = {
  getAllRol: async () => {
    try {
      const response = await axiosInstance.get(`/admin/data-rol`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },
  getRolUser: async () => {
    try {
      const response = await axiosInstance.get(`/admin/data-rol-user`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },

  deleteRol: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/admin/rol-delete/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },

  updateRol: async (id: number, rolDTO: RolDTO) => {
    try {
      const response = await axiosInstance.put(`/admin/rol-update/${id}`, rolDTO);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },

  insertRol: async (rolDTO: RolDTO) => {
    try {
      const response = await axiosInstance.post(`/admin/rol-create`, rolDTO);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },
};
