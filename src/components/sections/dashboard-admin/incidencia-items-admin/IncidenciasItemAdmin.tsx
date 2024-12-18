import { ReactElement, useEffect } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import useIncidenciaAdminItem from 'data/incidencia-items-admin-data';
import IncidenciaItemCard from './IncidenciaItemCard';
import { capitalizeWords } from 'helpers/capitalizar-palabra';
import { useUserProfile } from 'hooks/hooks-user/useProfileUser';

const IncidenciasItemsAdmin = (): ReactElement => {
  const { user, fetchUserProfile } = useUserProfile();
  //ejecutar el hock para guardar el resultado
  const incidenciaItems = useIncidenciaAdminItem();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
      <Typography variant="h4" color="common.white" mb={1.25}>
        Bienvenido {capitalizeWords(user?.nombre || '')}
      </Typography>
      <Typography variant="subtitle2" color="text.disabled" mb={6}>
        Resumen de Incidencias
      </Typography>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={{ xs: 4, sm: 6 }}>
        {incidenciaItems.map((saleItem) => (
          <Box key={saleItem.id} gridColumn={{ xs: 'span 12', sm: 'span 6', lg: 'span 3' }}>
            <IncidenciaItemCard incidenciaItem={saleItem} />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default IncidenciasItemsAdmin;