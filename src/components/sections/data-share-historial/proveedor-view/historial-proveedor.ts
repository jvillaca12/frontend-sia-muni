import { GridRowsProp } from '@mui/x-data-grid';
import { ProveedorDTO } from 'data/interfaces/ProveedorDTO';
import { ProveedorService } from 'data/services/ProveedorService';
import { capitalizeWords } from 'helpers/capitalizar-palabra';

const fetchProveedorData = async (): Promise<GridRowsProp> => {
  try {
    const response = (await ProveedorService.getDataProveedor()) as ProveedorDTO;
    if (!response.proveedorDTOList || !Array.isArray(response.proveedorDTOList)) {
      throw new Error('La respuesta no es un array');
    }
    return response.proveedorDTOList.map((proveedor: ProveedorDTO, index: number) => ({
      id: index,
      nombre: capitalizeWords(proveedor.nombre || ''),
      contacto: capitalizeWords(proveedor.contacto || ''),
      telefono: proveedor.telefono || '',
      cantidadIncidencias:
        proveedor.cantidadIncidencias === 0 ? '0' : proveedor.cantidadIncidencias,
      porcentajeIncidencia:
        proveedor.porcentajeIncidencia === 0 ? '0%' : `${proveedor.porcentajeIncidencia}%` || '',
    })) as GridRowsProp;
  } catch (error) {
    return [];
  }
};

export const rows: GridRowsProp = await fetchProveedorData();