import axiosInstance from 'config/axios-config';
import { CategoriaDTO } from 'data/interfaces/CategoriaDTO';

export const CategoriaService = {
  getAllCategoria: async () => {
    try {
      const response = await axiosInstance.get(`/adminuser/all-categoria`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener todos las categorias:', error);
      throw new Error(error.response?.data?.message);
    }
  },

  insertCategoria: async (categoriaDTO: CategoriaDTO) => {
    try {
      const response = await axiosInstance.post(`/admin/categoria-create`, categoriaDTO);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },

  updateCategoria: async (id: number, categoriaDTO: CategoriaDTO) => {
    try {
      const response = await axiosInstance.put(`/admin/categoria-update/${id}`, categoriaDTO);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },

  deleteCategoria: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/admin/categoria-delete/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },
};

export default CategoriaService;
