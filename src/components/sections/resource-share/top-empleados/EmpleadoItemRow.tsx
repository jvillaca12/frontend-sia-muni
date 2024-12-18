import { Box, Chip, LinearProgress, TableCell, TableRow, Typography } from '@mui/material';
import { EmpleadoDTO } from 'data/interfaces/EmpleadoDTO';
import { capitalizeWords } from 'helpers/capitalizar-palabra';
import { ReactElement } from 'react';

const EmpleadoTop5ItemRow = ({ empleadoItem }: { empleadoItem: EmpleadoDTO }): ReactElement => {
  return (
    <TableRow>
      <TableCell
        align="left"
        component="th"
        variant="head"
        scope="row"
        sx={{
          color: 'common.white',
          fontSize: 'body1.fontSize',
        }}
      >
        {empleadoItem.idTop}
      </TableCell>
      <TableCell
        align="left"
        sx={{
          whiteSpace: 'nowrap',
        }}
      >
        {capitalizeWords(empleadoItem.nombreEmpleado || '')}
      </TableCell>
      <TableCell align="left">
        <Box position="relative" display="inline-flex" width="100%">
          <LinearProgress
            variant="determinate"
            color={empleadoItem.color}
            value={empleadoItem.porcentaje}
            sx={{
              bgcolor: 'grey.900',
              width: '100%',
            }}
          />
          <Box
            top={0}
            left={0}
            bottom={0}
            right={0}
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              width: `${empleadoItem.porcentaje}%`,
            }}
          >
            <Typography
              bgcolor="background.default"
              variant="body2"
              color="textSecondary"
            >{`${empleadoItem.porcentaje}%`}</Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell align="center">
        <Chip
          label={`${empleadoItem.cantidad}`}
          color={empleadoItem.color as any}
          variant="outlined"
          size="medium"
        />
      </TableCell>
    </TableRow>
  );
};

export default EmpleadoTop5ItemRow;
