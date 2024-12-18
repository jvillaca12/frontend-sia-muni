import totalIncidencias from 'assets/images/icons-app/fallo.png';
import totalIncidenciasHoy from 'assets/images/icons-app/total-inc-hoy.png';
import incidenciaSolved from 'assets/images/icons-app/checkList.png';
import empleadoMax from 'assets/images/icons-app/user.png';
import { useEffect, useState } from 'react';
import ItemFalloIncidenciaAdminService from './services/IncidenciaItemAdminService';
import { IncidenciaItem } from './registros-items-soporte-data';

const useIncidenciaAdminItem = () => {
  const [incidenciaItem, setIncidenciaItems] = useState<IncidenciaItem[]>([]);

  useEffect(() => {
    const fecthIncidenciasItems = async () => {
      try {
        // para obtener las incidencias del mes actual
        const pgMesCount = await ItemFalloIncidenciaAdminService.getProblemaGeneralByMonth();

        // para obtener la compracion de incidencias del mes actual con el mes anterior
        const dataComparacion =
          await ItemFalloIncidenciaAdminService.getProblemaGeneralComparacion();
        const incrementText = `${(dataComparacion.esIncremento as boolean) ? '+' : ''}${
          dataComparacion.porcentaje
        }%`;
        const incrementColor = (dataComparacion.esIncremento as boolean)
          ? 'success.main'
          : 'error.main';

        // para obtener las incidencias del dia actual
        const incidenciaDayCount = await ItemFalloIncidenciaAdminService.getProblemaGeneralByDay();

        // para obtener la compracion de incidencias del dia actual con el dia anterior
        const dataComparacionDay =
          await ItemFalloIncidenciaAdminService.getIncidenciasDayComparacion();
        const incrementTextDay = `${(dataComparacionDay.esIncremento as boolean) ? '+' : ''}${
          dataComparacionDay.porcentajeDiaActual > 0 ? dataComparacionDay.porcentajeDiaActual : '0'
        }%`;
        const incrementColorDay = (dataComparacionDay.esIncremento as boolean)
          ? 'success.main'
          : 'error.main';

        // para obtener las incidencias solucionadas actualmente registradas
        const totalIncidenciasSolucionadas =
          await ItemFalloIncidenciaAdminService.getProblemaDetalleSolucionadas();

        // para obtener el promedio de las incidencias solucionadas actualmente
        const promedioIncidenciasSolucionadas =
          await ItemFalloIncidenciaAdminService.getProblemaDetalleSolucionadasPromedio();

        // para obtener el empleado (nombre, cantidad) con mas incidencias registradas
        const empleadoMaxPG =
          await ItemFalloIncidenciaAdminService.getDetalleProblemaMaxEmpleado();

        setIncidenciaItems([
          {
            id: 1,
            icon: totalIncidencias,
            title: `${pgMesCount}`,
            subtitle: 'P. General al mes',
            increment: `${incrementText} que el mes anterior`,
            color: incrementColor,
          },
          {
            id: 2,
            icon: totalIncidenciasHoy,
            title: `${incidenciaDayCount}`,
            subtitle: 'P. General hoy',
            increment: `${incrementTextDay} que el día anterior`,
            color: incrementColorDay,
          },
          {
            id: 3,
            icon: incidenciaSolved,
            title: `${totalIncidenciasSolucionadas}`,
            subtitle: 'Problemas solucionados',
            increment: `El ${promedioIncidenciasSolucionadas} % de problemas solucionados`,
            color: 'secondary.main',
          },
          {
            id: 4,
            icon: empleadoMax,
            title: `${empleadoMaxPG.cantidad}`,
            subtitle: `${empleadoMaxPG.nombreApellidos}`,
            increment: `${empleadoMaxPG.promedio} % de problemas registrados`,
            color: 'info.main',
          },
        ]);
      } catch (error) {
        console.error('Error al obtener los items de incidencias del admin', error);
      }
    };

    fecthIncidenciasItems();
  }, []);
  return incidenciaItem;
};

export default useIncidenciaAdminItem;
