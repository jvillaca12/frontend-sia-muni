import axiosInstance from "config/axios-config";

export const DataSIAshareService = {
  // para obtener la cantidad de incidencias registradas por mes desde enero hasta diciembre
  getCantidadIncidenciasMes: async () => {
    try {
      const response = await axiosInstance.get(`/adminuser/cantidad-mes`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  getCantidadTotalIncidencias: async () => {
    try {
      const response = await axiosInstance.get(`/adminuser/total-problema`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  getTotalDetalleProblemaDiaMes: async () => {
    try {
      const response = await axiosInstance.get(`/adminuser/total-dia-mes`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  getTop5Activos: async () => {
    try {
      const response = await axiosInstance.get(`/adminuser/top-5-activos`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  getDataProfileOficina: async () => {
    try {
      const response = await axiosInstance.get(`/adminuser/profile-oficina`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

};
