import axiosInstance from "config/axios-config";

export const RedService = {
  getDataRed: async () => {
    try {
      const response = await axiosInstance.get(`/adminuser/red-data`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },
};
