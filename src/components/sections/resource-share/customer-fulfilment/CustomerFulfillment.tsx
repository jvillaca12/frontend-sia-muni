import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, Divider, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import EChartsReactCore from 'echarts-for-react/lib/core';
import CustomerFulfillmentChart from './CustomerFulfillmentChart';
import { customerFulfillmentData as fetchCustomerFulfillmentData, FalloMesActualAnteriorProps } from 'data/chart-data/customer-fulfillment';

const CustomerFulfillment = (): ReactElement => {
  const theme = useTheme();
  const chartRef = useRef<EChartsReactCore | null>(null);
  const [customerFulfillmentData, setCustomerFulfillmentData] = useState<FalloMesActualAnteriorProps | null>(null);

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
      const data = await fetchCustomerFulfillmentData();
      setCustomerFulfillmentData(data);
    };
    fetchData();
  }, []);

  const getTotalFulfillment = useCallback(
    (chartData: number[]) => {
      return chartData.reduce((prev, current) => prev + current, 0);
    },
    [],
  );

  if (!customerFulfillmentData) {
    return <div>Loading error...</div>;
  }

  return (
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
      <Typography variant="h4" color="common.white">
        Comparación por Mes
      </Typography>
      <CustomerFulfillmentChart
        chartRef={chartRef}
        sx={{ height: '220px !important', flexGrow: 1 }}
        data={customerFulfillmentData}
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
        sx={{
          transitionProperty: 'all',
          transitionDelay: '1s',
        }}
      >
        <Stack gap={1.25} alignItems="center">
          <Button
            variant="text"
            sx={{
              p: 0.5,
              borderRadius: 1,
              fontSize: 'body2.fontSize',
              color: 'text.disabled',
              '&:hover': {
                bgcolor: 'transparent',
              },
              '& .MuiButton-startIcon': {
                mx: 0,
                mr: 1,
              },
            }}
            disableRipple
            startIcon={
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  bgcolor: 'secondary.main',
                  borderRadius: 400,
                }}
              />
            }
          >
            Este Mes
          </Button>
          <Typography variant="body2" color="common.white">
            {getTotalFulfillment(customerFulfillmentData['Este Mes'])}
          </Typography>
        </Stack>
        <Stack gap={1.25} alignItems="center">
          <Button
            variant="text"
            sx={{
              p: 0.5,
              borderRadius: 1,
              fontSize: 'body2.fontSize',
              color: 'text.disabled',
              '&:hover': {
                bgcolor: 'transparent',
              },
              '& .MuiButton-startIcon': {
                mx: 0,
                mr: 1,
              },
            }}
            disableRipple
            startIcon={
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  bgcolor: 'primary.main',
                  borderRadius: 400,
                }}
              />
            }
          >
            Último Mes
          </Button>
          <Typography variant="body2" color="common.white">
            {getTotalFulfillment(customerFulfillmentData['Ultimo Mes'])}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default CustomerFulfillment;
