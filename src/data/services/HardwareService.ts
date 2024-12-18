import axiosInstance from 'config/axios-config';

export const HardwareService = {
  getAllHardware: async () => {
    try {
      const response = await axiosInstance.get(`/adminuser/hardware-data`);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
