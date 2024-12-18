import { GridRowsProp } from '@mui/x-data-grid';
import { EmpleadoDTO } from 'data/interfaces/EmpleadoDTO';
import { EmpleadoService } from 'data/services/EmpleadoService';
import { capitalizeWords } from 'helpers/capitalizar-palabra';

const fectEmpleados = async (): Promise<GridRowsProp> => {
  try {
    const response = await EmpleadoService.getEmpleadosData();
    if (
      !response.listEmpleados ||
      !Array.isArray(response.listEmpleados)
    ) {
      throw new Error('La respuesta no es un array');
    }
    return response.listEmpleados.map(
      (empleado: EmpleadoDTO, index: number) => ({
        id: index,
        codigo: empleado.codigo,
        nombreEmpleado: capitalizeWords(empleado.nombreEmpleado || ''),
        cargo: capitalizeWords(empleado.cargo || ''),
        oficina: capitalizeWords(empleado.oficina || ''),
        oficinaGerencia: capitalizeWords(empleado.oficinaGerencia || ''),
        porcentaje: `${empleado.porcentaje}%`,
        cantidad: empleado.cantidad === 0 ? '0' : empleado.cantidad,
      }),
    ) as GridRowsProp;
  } catch (error) {
    return [];
  }
};

export const rows: GridRowsProp = await fectEmpleados();
