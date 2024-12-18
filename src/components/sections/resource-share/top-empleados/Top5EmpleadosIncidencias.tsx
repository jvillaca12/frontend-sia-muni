import { ReactElement, useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
} from '@mui/material';
import { getTOP5EmpleadosTableRows } from 'data/top-5-empleados';
import EmpleadoTop5ItemRow from './EmpleadoItemRow';
import SimpleBar from 'simplebar-react';
import { EmpleadoDTO } from 'data/interfaces/EmpleadoDTO';

const Top5EmpleadosIncidencia = (): ReactElement => {
  const [empleados, setEmpleados] = useState<EmpleadoDTO[]>([]);

  useEffect(() => {
    const fetchEmpleados = async () => {
      const empleadosData = await getTOP5EmpleadosTableRows();
      setEmpleados(empleadosData);
    };
    fetchEmpleados();
  }, []);

  return (
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
      <Typography variant="h4" color="common.white" mb={6}>
        Top 5 Empleados con más Registros
      </Typography>
      <TableContainer component={SimpleBar}>
        <Table sx={{ minWidth: 440 }}>
          <TableHead>
            <TableRow>
              <TableCell align="left">#</TableCell>
              <TableCell align="left">Nombre</TableCell>
              <TableCell align="left">Porcentaje</TableCell>
              <TableCell align="center">Cantidad</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {empleados.map((empleado) => (
              <EmpleadoTop5ItemRow key={empleado.idTop} empleadoItem={empleado} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Top5EmpleadosIncidencia;
