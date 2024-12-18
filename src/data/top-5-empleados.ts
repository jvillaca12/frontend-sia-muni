import { EmpleadoDTO } from './interfaces/EmpleadoDTO';
import { EmpleadoService } from './services/EmpleadoService';

const fecthTOP5Empleados = async (): Promise<EmpleadoDTO[]> => {
  try {
    const responseEmpleados = await EmpleadoService.getTop5EmpleadosFallos();
    if (!responseEmpleados.listTop5Empleados || !Array.isArray(responseEmpleados.listTop5Empleados)) {
      throw new Error('La respuesta no es un array');
    }
    return responseEmpleados.listTop5Empleados.map((empleado: EmpleadoDTO) => ({
      nombreEmpleado: empleado.nombreEmpleado,
      porcentaje: empleado.porcentaje,
      cantidad: empleado.cantidad,
    }));
  } catch (error) {
    console.error('Error al obtener los items de incidencias de soporte', error);
    throw new Error(error.message);
  }
};

export const getTOP5EmpleadosTableRows = async (): Promise<EmpleadoDTO[]> => {
  const empleados = await fecthTOP5Empleados();
  return [
    {
      idTop: '01',
      nombreEmpleado: empleados[0].nombreEmpleado,
      porcentaje: empleados[0].porcentaje,
      cantidad: empleados[0].cantidad,
      color: 'warning',
    },
    {
      idTop: '02',
      nombreEmpleado: empleados[1].nombreEmpleado,
      porcentaje: empleados[1].porcentaje,
      cantidad: empleados[1].cantidad,
      color: 'primary',
    },
    {
      idTop: '03',
      nombreEmpleado: empleados[2].nombreEmpleado,
      porcentaje: empleados[2].porcentaje,
      cantidad: empleados[2].cantidad,
      color: 'info',
    },
    {
      idTop: '04',
      nombreEmpleado: empleados[3].nombreEmpleado,
      porcentaje: empleados[3].porcentaje,
      cantidad: empleados[3].cantidad,
      color: 'secondary',
    },
    {
      idTop: '05',
      nombreEmpleado: empleados[4].nombreEmpleado,
      porcentaje: empleados[4].porcentaje,
      cantidad: empleados[4].cantidad,
      color: 'success',
    },
  ];
};
