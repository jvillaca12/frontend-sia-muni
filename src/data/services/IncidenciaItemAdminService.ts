import axiosInstance from 'config/axios-config';

class ItemFalloIncidenciaAdminService {
  // obtener la cantidad total de incidencias del mes actual
  static async getProblemaGeneralByMonth() {
    try {
      const response = await axiosInstance.get(`/admin/pg-total-mes`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }

  // obtener el porcentaje de incidencias si incremento o no al mes anterior
  static async getProblemaGeneralComparacion() {
    try {
      const response = await axiosInstance.get(`/admin/comparemes-problema`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }

  // obtener la cantidad total de incidencias del dia actual
  static async getProblemaGeneralByDay() {
    try {
      const response = await axiosInstance.get(`/adminuser/countday-problema`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }

  // obtener el porcentaje de incidencias si incremento o no al day anterior
  static async getIncidenciasDayComparacion() {
    try {
      const response = await axiosInstance.get(`/adminuser/compareday-problema`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }

  // obtener el porcentaje de incidencias si incremento o no al day anterior
  static async getProblemaDetalleSolucionadas() {
    try {
      const response = await axiosInstance.get(`/admin/problema-solution`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }

  // obtener el porcentaje de incidencias si incremento o no al day anterior
  static async getProblemaDetalleSolucionadasPromedio() {
    try {
      const response = await axiosInstance.get(`/admin/problema-resueltas-promedio`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }

  // obtener el porcentaje de incidencias si incremento o no al day anterior
  static async getDetalleProblemaMaxEmpleado() {
    try {
      const response = await axiosInstance.get(`/admin/problema-max-empleado-promedio`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }

}

export default ItemFalloIncidenciaAdminService;
