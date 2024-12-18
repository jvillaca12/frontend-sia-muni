import axiosInstance from 'config/axios-config';

export const ProveedorService = {
  getDataProveedor: async () => {
    try {
      const response = await axiosInstance.get(`/adminuser/data-proveedor`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },
};
