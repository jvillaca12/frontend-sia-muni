import { Box, Button, Divider, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { ReactElement, useEffect, useRef, useState } from 'react';
import LevelChart from './ComparacionFIChart';
import { prioridadDataMes as fetchCantidadPrioridadMes, PrioridadMesProps } from 'data/chart-data/level';

const ComparacionFI = (): ReactElement => {
  const theme = useTheme();
  const chartRef = useRef<EChartsReactCore | null>(null);
  const [prioridadDataMes, setPrioridadData] = useState<PrioridadMesProps | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.getEchartsInstance().resize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [chartRef]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCantidadPrioridadMes();
      setPrioridadData(data);
    };
    fetchData();
  }, []);

  if(!prioridadDataMes) {
    return <div>Loading data...</div>;
  }

  return (
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
      <Typography variant="h4" color="common.white">
        Por Prioridad y Categoria
      </Typography>
      <LevelChart
        chartRef={chartRef}
        data={prioridadDataMes}
        sx={{ height: '181px !important', flexGrow: 1 }}
      />
      <Stack
        direction="row"
        justifyContent="space-around"
        divider={
          <Divider
            orientation="vertical"
            flexItem
            sx={{ borderColor: alpha(theme.palette.common.white, 0.06), height: 1 }}
          />
        }
        px={2}
        pt={3}
      >
        <Button
          variant="text"
          sx={{
            justifyContent: 'flex-start',
            p: 0.5,
            borderRadius: 1,
            gap: 2.5,
            color: 'text.disabled',
            fontSize: 'body2.fontSize',
            alignItems: 'baseline',
            '&:hover': {
              bgcolor: 'transparent',
            },
            '& .MuiButton-startIcon': {
              mx: 0,
            },
          }}
          disableRipple
          startIcon={
            <Box
              sx={{
                width: 8,
                height: 8,
                mb: 1,
                bgcolor: 'primary.main',
                borderRadius: 400,
              }}
            />
          }
        >
          Fallo
        </Button>
        <Button
          variant="text"
          sx={{
            justifyContent: 'flex-start',
            p: 0.5,
            borderRadius: 1,
            gap: 2.5,
            color: 'text.disabled',
            fontSize: 'body2.fontSize',
            alignItems: 'baseline',
            '&:hover': {
              bgcolor: 'transparent',
            },
            '& .MuiButton-startIcon': {
              mx: 0,
            },
          }}
          disableRipple
          startIcon={
            <Box
              sx={{
                width: 8,
                height: 8,
                mb: 1,
                bgcolor: 'grey.800',
                borderRadius: 400,
              }}
            />
          }
        >
          Incidencia
        </Button>
      </Stack>
    </Paper>
  );
};

export default ComparacionFI;
