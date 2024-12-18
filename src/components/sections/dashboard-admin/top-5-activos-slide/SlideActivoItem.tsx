import { ReactElement } from 'react';
import { Card, Stack, Typography, CardContent, LinearProgress } from '@mui/material';
import { ActivoGeneralDTO } from 'data/interfaces/ActivoGeneralDTO';
import { capitalizeWords } from 'helpers/capitalizar-palabra';

const SlideActivoItem = ({ activoItem }: { activoItem: ActivoGeneralDTO }): ReactElement => {
  return (
    <Card
      sx={{
        bgcolor: 'background.default',
        height: 1,
      }}
    >
      <Typography
        variant="h4"
        color="text.secondary"
        mb={2}
        sx={{ textAlign: 'center', padding: 2 }}
      >
        {capitalizeWords(activoItem.nombreActivo || '')}
      </Typography>
      <CardContent
        sx={{
          height: 110,
          padding: 2
        }}
      >
        <Typography variant="body1" color="text.secondary" mb={1}>
          {`Código de bien: ${activoItem.codigoBien}`}
        </Typography>
        <Typography color="text.secondary" mb={2}>
          {`Proveedor: ${capitalizeWords(activoItem.proveedor || '')}`}
        </Typography>
        <Typography color="text.secondary" mb={2}>
          {`Tipo de activo: ${capitalizeWords(activoItem.tipoActivo || '')}`}
        </Typography>
        <Stack direction="row" justifyContent="space-between" color="text.primary" mb={1}>
          <Typography variant="body2">Cantidad</Typography>
          <Typography variant="body2">{activoItem.cantidadFI}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" color="text.primary" mb={1}>
          <Typography variant="body2">Porcentaje</Typography>
          <Typography variant="body2">{activoItem.porcentajeFI}%</Typography>
        </Stack>
        <Stack gap={1}>
          <LinearProgress variant="determinate" color="info" value={activoItem.porcentajeFI} />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SlideActivoItem;