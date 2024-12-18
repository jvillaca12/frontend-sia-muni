import axiosInstance from 'config/axios-config';
import { PersonalDTO } from 'data/interfaces/PersonalDTO';

export const PersonalService = {
  getPersonalMantenimiento: async () => {
    try {
      const response = await axiosInstance.get(`/admin/personal-mantenimiento`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },

  getDataShortPersonal: async () => {
    try {
      const response = await axiosInstance.get(`/adminuser/personal-short`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },

  getDataFullPersonal: async () => {
    try {
      const response = await axiosInstance.get(`/admin/personal-full`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },

  updatePersonal: async (idPersonal: number, personalData: PersonalDTO) => {
    try {
      const response = await axiosInstance.put(
        `/admin/personal-update/${idPersonal}`,
        personalData,
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },

  deletePersonal: async (idPersonal: number) => {
    try {
      const response = await axiosInstance.delete(`/admin/personal-delete/${idPersonal}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },

  insertPersonal: async (personalDTO: PersonalDTO) => {
    try {
      const response = await axiosInstance.post(`/admin/personal-insert`, personalDTO);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },
};
