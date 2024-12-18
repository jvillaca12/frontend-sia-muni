import { SxProps, useTheme } from '@mui/material';
import ReactEChart from 'components/base/ReactEChart';
import * as echarts from 'echarts/core';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { LineSeriesOption } from 'echarts/charts';
import {
  GridComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
} from 'echarts/components';
import { ReactElement, useMemo } from 'react';

type FalloMesChartProps = {
  chartRef: React.MutableRefObject<EChartsReactCore | null>;
  data?: any;
  sx?: SxProps;
};

type FalloMesChartOptions = echarts.ComposeOption<
  LineSeriesOption | LegendComponentOption | TooltipComponentOption | GridComponentOption
>;

const VisorIncidenciaMesChart = ({
  chartRef,
  data,
  ...rest
}: FalloMesChartProps): ReactElement => {
  const theme = useTheme();
  const option: FalloMesChartOptions = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: theme.palette.warning.main,
          },
          label: {
            backgroundColor: theme.palette.warning.main,
          },
        },
      },
      legend: {
        show: false,
        data: ['Incidencias por Mes'],
      },
      grid: {
        top: '5%',
        right: '1%',
        bottom: '2.5%',
        left: '1.25%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: [
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Setiembre',
            'Octubre',
            'Noviembre',
            'Deciembre',
          ],
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            formatter: (value: string) => value.substring(0, 3),
            padding: [7, 25, 7, 15],
            fontSize: theme.typography.body2.fontSize,
            fontWeight: theme.typography.fontWeightMedium as number,
            color: theme.palette.common.white,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          min: 0,
          max: 500,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            padding: [0, 10, 0, 0],
            fontSize: theme.typography.body2.fontSize,
            fontWeight: theme.typography.fontWeightMedium as number,
            color: theme.palette.common.white,
          },
        },
      ],
      series: [
        {
          id: 1,
          name: 'Incidencias por Mes',
          type: 'line',
          stack: 'Total',
          smooth: false,
          color: theme.palette.primary.main,
          lineStyle: {
            width: 2,
            color: theme.palette.primary.main,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 1,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 1,
                color: theme.palette.grey.A100,
              },
              {
                offset: 0,
                color: theme.palette.primary.main,
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: data?.['Incidencias por Mes'],
        },
      ],
    }),
    [],
  );
  return <ReactEChart ref={chartRef} echarts={echarts} option={option} {...rest} />;
};

export default VisorIncidenciaMesChart;
