import axiosInstance from 'config/axios-config';

export const EmpleadoService = {

  getTop5EmpleadosFallos: async () => {
    try {
      const response = await axiosInstance.get(`/adminuser/top-5-empleados`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  getEmpleadosTotalMostar: async () => {
    try {
      const response = await axiosInstance.get(`/soporte-tecnico/all-empleados-cantidad`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  getEmpleadosData: async () => {
    try {
      const response = await axiosInstance.get(`/adminuser/empleado-data`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  
};
