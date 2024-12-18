import axiosInstance from 'config/axios-config';

export const OficinaService = {
  getDataOficina: async () => {
    try {
      const response = await axiosInstance.get(`/adminuser/oficina-data`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },
};
