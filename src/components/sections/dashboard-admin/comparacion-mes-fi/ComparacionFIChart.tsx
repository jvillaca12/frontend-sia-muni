import { alpha, Box, SxProps, Typography, useTheme } from '@mui/material';
import ReactEChart from 'components/base/ReactEChart';
import { BarSeriesOption } from 'echarts';
import * as echarts from 'echarts/core';
import EChartsReactCore from 'echarts-for-react/lib/core';
import {
  GridComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
} from 'echarts/components';
import React, { ReactElement, useMemo } from 'react';

type LevelChartProps = {
  chartRef: React.MutableRefObject<EChartsReactCore | null>;
  data: any;
  sx?: SxProps;
};

type LevelChartOptions = echarts.ComposeOption<
  BarSeriesOption | LegendComponentOption | TooltipComponentOption | GridComponentOption
>;

const LevelChart = ({ chartRef, data, ...rest }: LevelChartProps): ReactElement => {
  const theme = useTheme();
  const option: LevelChartOptions = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        show: false,
        data: ['MesActual', 'MesAnterior'],
      },
      xAxis: {
        type: 'category',
        show: true,
        axisTick: { show: false },
        data: ['Leve', 'Grave', 'Crítico', 'Leve', 'Grave', 'Crítico'],
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: alpha(theme.palette.common.white, 0.06),
            width: 1,
          },
        },
      },
      yAxis: {
        type: 'value',
        show: false,
      },
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 1,
      },
      series: [
        {
          id: 1,
          name: 'Fallo',
          type: 'bar',
          stack: 'Incidencia',
          barWidth: 25,
          emphasis: {
            focus: 'series',
          },
          data: data.MesActual,
          color: theme.palette.primary.main,
          itemStyle: {
            borderRadius: 1,
          },
        },
        {
          id: 2,
          name: 'Incidencia',
          type: 'bar',
          stack: 'Incidencia',
          barWidth: 25,
          emphasis: {
            focus: 'series',
          },
          data: data.MesAnterior,
          color: theme.palette.grey[800],
          itemStyle: {
            borderRadius: 1,
          },
        },
      ],
    }),
    [theme, data],
  );

  return (
    <Box position="relative">
      <Typography
        variant="h6"
        component="div"
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          color: theme.palette.primary.main,
          zIndex: 1,
        }}
      >
        Mes Actual
      </Typography>
      <Typography
        variant="h6"
        component="div"
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          color: theme.palette.grey[800],
          zIndex: 1,
        }}
      >
        Mes Anterior
      </Typography>
      <ReactEChart ref={chartRef} option={option} echarts={echarts} {...rest} />
    </Box>
  );
};

export default LevelChart;