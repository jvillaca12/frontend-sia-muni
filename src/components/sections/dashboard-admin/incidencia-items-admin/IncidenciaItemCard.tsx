import { ReactElement } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import Image from 'components/base/Image';
import { IncidenciaItem } from './IncidenciaItem';

const IncidenciaItemCard = ({ incidenciaItem: item }: { incidenciaItem: IncidenciaItem }): ReactElement => {
  return (
    <Stack gap={6} p={5} borderRadius={4} height={1} bgcolor="background.default">
      <Image src={item.icon} alt={item.subtitle} width={26} height={26} />
      <Box>
        <Typography variant="h4" color="common.white" mb={4}>
          {item.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={2}>
          {item.subtitle}
        </Typography>
        <Typography variant="body2" color={item.color} lineHeight={1.25}>
          {item.increment}
        </Typography>
      </Box>
    </Stack>
  );
};

export default IncidenciaItemCard;