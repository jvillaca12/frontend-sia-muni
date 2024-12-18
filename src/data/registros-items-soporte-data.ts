import totalIncidencias from 'assets/images/icons-app/fallo.png';
import totalIncidenciasHoy from 'assets/images/icons-app/total-inc-hoy.png';
import incidenciaSolved from 'assets/images/icons-app/checkList.png';
import empleadoMax from 'assets/images/icons-app/user.png';
import { useEffect, useState } from 'react';
import DetalleProblemaService from './services/DetalleProblemaService';
import { ProblemaGeneralService } from './services/ProblemaGeneralService';
import { MantenimientoService } from './services/MantenimientoService';

export interface IncidenciaItem {
  id?: number;
  icon: string;
  title: string;
  subtitle: string;
  increment: string;
  color: string;
}

const useRegistrosSoporteItem = () => {
  const [incidenciaItem, setIncidenciaItems] = useState<IncidenciaItem[]>([]);

  useEffect(() => {
    const fecthRegistrosItemsSoporte = async () => {
      try {
        /* PARA LA PRIMERA TARJETA PROBLEMA GENERAL */
        // para obtener las incidencias registradas del dia actual
        const incidenciaDayCount = await ProblemaGeneralService.getProblemaGeneralByDay();

        // para obtener la compracion de incidencias del dia actual con el dia anterior
        const porcentajePG = await ProblemaGeneralService.getAmountProbGenByDayActualAnterior();
        const incrementTextDay = `${porcentajePG.porcentajeDiaActual > 0 ? '+' : ''}${
          porcentajePG.porcentajeDiaActual
        }%`;
        const incrementColorDay =
          porcentajePG.porcentajeDiaActual > 0 ? 'success.main' : 'error.main';

        /* PARA LA SEGUNDA TARJETA PROBLEMA GENERAL*/
        const amountAnterior = `${porcentajePG.porcentajeDiaAnterior > 0 ? '+' : ''}${
          porcentajePG.porcentajeDiaAnterior
        }%`;
        const amountAnteriorColor =
          porcentajePG.porcentajeDiaAnterior > 0 ? 'success.main' : 'error.main';

        /* PARA LA TERCERA TARJETA PROBLEMA DETALLE */
        const totalIncidenciaAyer = await DetalleProblemaService.getIncidenciasTotalesAyer();
        const promedioDP = await DetalleProblemaService.getPromedioDetalleProAyerHoy();
        const promedioHoyDP = `${
          promedioDP.porcentajeHoy > 0
            ? `+${promedioDP.porcentajeHoy}`
            : `${promedioDP.porcentajeHoy}`
        }%`;
        const incrementColorHoyDP =
          (promedioDP.porcentajeHoy as number) > 0 ? 'success.main' : 'error.main';

        /* PARA LA CUARTA TARJETA PROBLEMA DETALLE */
        const promedioAyerDP = `${
          promedioDP.porcentajeAyer > 0
            ? `+${promedioDP.porcentajeAyer}`
            : `${promedioDP.porcentajeAyer}`
        }%`;
        const incrementColorAyerDP =
          (promedioDP.porcentajeAyer as number) > 0 ? 'success.main' : 'error.main';

        /* PARA LA QUINTA TARJETA */
        const totalMantenimiento = await DetalleProblemaService.getTotalManenimientoHoyAyer();
        const manteHoy = `${
          promedioDP.porcentajeAyer > 0
            ? `+${totalMantenimiento.porcentajeHoy}`
            : `${totalMantenimiento.porcentajeHoy}`
        }%`;
        const incrementColorManteHoy =
          (promedioDP.porcentajeHoy as number) > 0 ? 'success.main' : 'error.main';

        /* PARA LA SEXTA TARJETA */
        const manteAyer = `${
          promedioDP.porcentajeAyer > 0
            ? `+${totalMantenimiento.porcentajeAyer}`
            : `${totalMantenimiento.porcentajeAyer}`
        }%`;
        const incrementColorManteAyer =
          (promedioDP.porcentajeAyer as number) > 0 ? 'success.main' : 'error.main';

        /* PARA LA SÉPTIMA TARJETA */
        const totalAuditoria = await DetalleProblemaService.getTotalAuditoriaHoyTotal();

        /* PARA LA OCTAVA TARJETA */
        const manteTotalVencida = await MantenimientoService.getMantenimientoTotalVencidas();

        setIncidenciaItems([
          {
            id: 1,
            icon: totalIncidencias,
            title: `${incidenciaDayCount}`,
            subtitle: 'Problema General hoy',
            increment: `${incrementTextDay} que el día anterior`,
            color: incrementColorDay,
          },
          {
            id: 2,
            icon: totalIncidenciasHoy,
            title: `${porcentajePG.diaAnterior}`,
            subtitle: 'Problema General ayer',
            increment: `${amountAnterior} que el dia de hoy`,
            color: amountAnteriorColor,
          },
          {
            id: 3,
            icon: totalIncidenciasHoy,
            title: `${promedioDP.totalDPHoy}`,
            subtitle: 'Problema Detalles hoy',
            increment: `${promedioHoyDP} que el dia de ayer`,
            color: incrementColorHoyDP,
          },
          {
            id: 4,
            icon: totalIncidenciasHoy,
            title: `${totalIncidenciaAyer}`,
            subtitle: 'Problemas Detalles ayer',
            increment: `${promedioAyerDP} que el dia de hoy`,
            color: incrementColorAyerDP,
          },
          {
            id: 5,
            icon: incidenciaSolved,
            title: `${totalMantenimiento.totalManteHoy}`,
            subtitle: 'Mantenimiento hoy',
            increment: `${manteHoy} mantenimiento ayer`,
            color: incrementColorManteHoy,
          },
          {
            id: 6,
            icon: incidenciaSolved,
            title: `${totalMantenimiento.totalManteAyer}`,
            subtitle: 'Mantenimiento ayer',
            increment: `${manteAyer} mantenimiento hoy`,
            color: incrementColorManteAyer,
          },
          {
            id: 7,
            icon: empleadoMax,
            title: `${totalAuditoria.totalHoy}`,
            subtitle: 'Auditorias hoy',
            increment: `${totalAuditoria.total} auditorias en total`,
            color: 'info.main',
          },
          {
            id: 8,
            icon: empleadoMax,
            title: `${manteTotalVencida.totalVencida}`,
            subtitle: 'Mantenimientos vencidos',
            increment: `${manteTotalVencida.total} mantenimientos en total`,
            color: 'info.main',
          },
        ]);
      } catch (error) {
        throw Error('Error al obtener los items de soporte ' + error);
      }
    };

    fecthRegistrosItemsSoporte();
  }, []);
  return incidenciaItem;
};

export default useRegistrosSoporteItem;