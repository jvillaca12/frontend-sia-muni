import axiosInstance from 'config/axios-config';
import { DetalleProblemaDTO } from 'data/interfaces/DetalleProblemaDTO';

export const DetalleProblemaService = {
  // obtener la cantidad de incidencias registradas ayer
  getIncidenciasTotalesAyer: async () => {
    try {
      const response = await axiosInstance.get(`/soporte-tecnico/total-incidencia-ayer`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  // obtener el promedio de incidencias registradas ayer con respecto al hoy dia
  getPromedioDetalleProAyerHoy: async () => {
    try {
      const response = await axiosInstance.get(`/soporte-tecnico/promedio-dp-ayer-hoy`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  // obtener el promedio de incidencias registradas ayer con respecto al hoy dia
  getTotalManenimientoHoyAyer: async () => {
    try {
      const response = await axiosInstance.get(
        `/soporte-tecnico/mantenimiento-hoy-ayer`,
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  // obtener el promedio de incidencias registradas ayer con respecto al hoy dia
  getTotalAuditoriaHoyTotal: async () => {
    try {
      const response = await axiosInstance.get(`/soporte-tecnico/auditoria-incidencia-hoy-total`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  // obtener el promedio de incidencias registradas ayer con respecto al hoy dia
  getAllDataDetalleProblema: async (
    idProblemaGeneral: number,
    idUsuario: number,
    esAdmin: boolean,
  ) => {
    try {
      // Si no se proporciona idUsuario, se usa el valor 0
      const userId = idUsuario || 0;
      // Si no se proporciona esAdmin, se usa el valor falso
      const adminStatus = esAdmin ?? false;
      const response = await axiosInstance.get(
        `/adminuser/all-detalle-problema/${idProblemaGeneral}/${userId}/${adminStatus}`,
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  // para crear la incidencia
  insertarDetalleProblema: async (incidenciaData: DetalleProblemaDTO) => {
    try {
      const response = await axiosInstance.post(`/soporte-tecnico/create-dp`, incidenciaData);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  // para actualizar una incidencia
  actualizarDetalleProblema: async (
    idDetalleProblema: number,
    incidenciaData: DetalleProblemaDTO,
  ) => {
    try {
      const response = await axiosInstance.put(
        `/soporte-tecnico/update-detalle-problema/${idDetalleProblema}`,
        incidenciaData,
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

  // para eliminar una incidencia
  eliminarDetalleProblema: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`soporte-tecnico/delete-dp/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};

export default DetalleProblemaService;
