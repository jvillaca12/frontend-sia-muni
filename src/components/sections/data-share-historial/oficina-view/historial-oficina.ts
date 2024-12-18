import { GridRowsProp } from '@mui/x-data-grid';
import { OficinaDTO } from 'data/interfaces/OficinaDTO';
import { OficinaService } from 'data/services/OficinaService';
import { capitalizeWords } from 'helpers/capitalizar-palabra';

const fectOficina = async (): Promise<GridRowsProp> => {
  try {
    const response = await OficinaService.getDataOficina();
    if (
      !response.listOficinas ||
      !Array.isArray(response.listOficinas)
    ) {
      throw new Error('La respuesta no es un array');
    }
    return response.listOficinas.map(
      (oficina: OficinaDTO, index: number) => ({
        id: index,
        nombreOficina: capitalizeWords(oficina.nombreOficina || ''),
        oficinaGeren: capitalizeWords(oficina.oficinaGeren || ''),
        oficinaMayor: capitalizeWords(oficina.oficinaMayor || ''),
        ubicacion: capitalizeWords(oficina.ubicacion || ''),
        cantidadIncidencias: oficina.cantidadIncidencias === 0 ? '0' : oficina.cantidadIncidencias,
      }),
    ) as GridRowsProp;
  } catch (error) {
    return [];
  }
};

export const rows: GridRowsProp = await fectOficina();
