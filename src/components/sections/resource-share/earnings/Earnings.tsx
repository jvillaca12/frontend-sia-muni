import { Box, Paper, Typography } from '@mui/material';
import EarningsChart from './EarningsChart';
import { ReactElement, useEffect, useRef } from 'react';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { useIncidenciaTotalData } from 'hooks/hooks-incidencias/useIncidenciasTotal';

const Earnings = (): ReactElement => {
  const chartRef = useRef<EChartsReactCore | null>(null);
  const { incidencia, fetchDataIncidenciaTotal } = useIncidenciaTotalData();

  useEffect(() => {
    const fetchData = async () => {
      await fetchDataIncidenciaTotal();
    };
    fetchData();
  }, [fetchDataIncidenciaTotal]);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        const echartsInstance = chartRef.current.getEchartsInstance();
        echartsInstance.resize({ width: 'auto', height: 'auto' });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [chartRef]);

  return (
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
      <Typography variant="h4" color="common.white" mb={2.5}>
        En Registro
      </Typography>
      <Typography variant="body1" color="text.primary" mb={4.5}>
        Total de Problemas Registrados
      </Typography>
      <Typography
        variant="h1"
        color="primary.main"
        mb={4.5}
        fontSize={{ xs: 'h2.fontSize', sm: 'h1.fontSize' }}
      >
        {incidencia?.cantidadTotalFallo}
      </Typography>
      <Typography color="primary.main" mb={4.5} fontSize={{ xs: '15', sm: '15' }}>
        {`Cantidad Solucionadas: `}
        <Box component="span" fontWeight="bold" color="secondary.main" fontSize="inherit">
          {`${incidencia?.cantidadSolucionado}`}
        </Box>
        <br />
        {`Porcentaje Solucionadas: `}
        <Box component="span" fontWeight="bold" color="secondary.main" fontSize="inherit">
          {`${incidencia?.porcentajeSolucionado}%`}
        </Box>
      </Typography>
      <Box
        flex={1}
        sx={{
          position: 'relative',
        }}
      >
        <EarningsChart
          chartRef={chartRef}
          incidencia={incidencia}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flex: '1 1 0%',
            maxHeight: 152,
          }}
        />
        <Typography
          variant="h1"
          color="common.white"
          textAlign="center"
          mx="auto"
          position="absolute"
          left={0}
          right={0}
          bottom={0}
          top={110}
        >
          <Box component="span" display="block">
            {`${incidencia?.porcentajeMantenimiento}%`}
          </Box>
          <Box component="span" display="block" fontSize={15}>
            Mantenimiento
          </Box>
        </Typography>
      </Box>
    </Paper>
  );
};

export default Earnings;
