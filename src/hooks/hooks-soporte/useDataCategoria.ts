import { CategoriaDTO } from "data/interfaces/CategoriaDTO";
import CategoriaService from "data/services/CategoriaService";
import { useCallback, useState } from "react";

export const useDataCategoria = () => {
  // estado para cargar la data y obtener cada elemento
  const [dataCategoria, setCategorias] = useState<CategoriaDTO[]>([]);
  // estado para cargar el loading
  const [loading, setLoading] = useState<boolean>(false);
  // estado para cargar el error
  const [error, setError] = useState<string | null>(null);
  const [optionsCategoria, setOptionsC] = useState<CategoriaDTO[]>([]);

  // funcion para obtener la data de las categorias
  const fetchDataCategorias = useCallback(async () => {
    try {
      setLoading(true);
      const response = await CategoriaService.getAllCategoria();
      const categorias = response.listCategoria || [];
      setCategorias(categorias);
      const optionsArrayC = categorias.map((categoria: CategoriaDTO) => ({
        id: categoria.id,
        nombre: categoria.nombre,
      }));
      setOptionsC(optionsArrayC);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { dataCategoria, loading, error, optionsCategoria, fetchDataCategorias };
};
