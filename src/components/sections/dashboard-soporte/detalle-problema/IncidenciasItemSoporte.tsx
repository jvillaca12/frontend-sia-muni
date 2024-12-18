import { ReactElement, useEffect } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import IncidenciaItemCard from '../../dashboard-admin/incidencia-items-admin/IncidenciaItemCard';
import { capitalizeWords } from 'helpers/capitalizar-palabra';
import useRegistrosSoporteItem from 'data/registros-items-soporte-data';
import { useUserProfile } from 'hooks/hooks-user/useProfileUser';

const IncidenciasItemsSoporte = (): ReactElement => {
  const { user, fetchUserProfile } = useUserProfile();

  //ejecutar el hock para guardar el resultado
  const incidenciaItemsSoporte = useRegistrosSoporteItem();

  // cargando la data una sola vez
  useEffect(() => {
    const fetchData = async () => {
      await fetchUserProfile();
    };
    fetchData();
  }, [fetchUserProfile]);

  return (
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
      <Typography variant="h4" color="common.white" mb={1.25}>
        Bienvenido {capitalizeWords(user?.nombre || '')}
      </Typography>
      <Typography variant="subtitle2" color="text.disabled" mb={6}>
        Resumen y Conteo de Registros del Sistema
      </Typography>
      <Box display="flex" flexWrap="nowrap" gap={{ xs: 4, sm: 6 }} sx={{ overflowX: 'auto' }}>
        {incidenciaItemsSoporte.map((problemaItem) => (
          <Box key={problemaItem.id} flex="0 0 auto" width={{ xs: '100%', sm: '50%', lg: '25%' }}>
            <IncidenciaItemCard incidenciaItem={problemaItem} />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default IncidenciasItemsSoporte;
