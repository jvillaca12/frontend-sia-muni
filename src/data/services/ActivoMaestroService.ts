import axiosInstance from "config/axios-config";

export const ActivoMaestroService = {
  // obteniendo los activos que no estan asociados a ningun problema
  getActivosSinProblemas: async () => {
    try {
      const response = await axiosInstance.get(`/adminuser/activos-sin-problema`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};
