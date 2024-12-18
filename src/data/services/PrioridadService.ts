import axiosInstance from 'config/axios-config';
import { PrioridadDTO } from 'data/interfaces/PrioridadDTO';

export const PrioridadService = {

  getAllPrioridad: async () => {
    try {
      const response = await axiosInstance.get(`/adminuser/all-prioridad`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },

  getCantidadPrioridadByMes: async () => {
    try {
      const response = await axiosInstance.get(`/adminuser/total-prioridad-mes`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },

  insertPrioridad: async (prioridadDTO: PrioridadDTO) => {
    try {
      const response = await axiosInstance.post(`/admin/prioridad-create`, prioridadDTO);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },

  updatePrioridad: async (id: number, prioridadDTO: PrioridadDTO) => {
    try {
      const response = await axiosInstance.put(`/admin/prioridad-update/${id}`, prioridadDTO);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },

  deletePrioridad: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/admin/prioridad-delete/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },


};

export default PrioridadService;
