import { LinearProgressProps } from '@mui/material';

export interface EmpleadoDTO {
  idTop?: string;
  codigo?: string;
  nombreEmpleado?: string;
  cargo?: string;
  oficina?: string;
  oficinaGerencia?: string;
  porcentaje?: number;
  cantidad?: number;
  color?: LinearProgressProps['color'];
  listEmpleados?: EmpleadoDTO[];
}
