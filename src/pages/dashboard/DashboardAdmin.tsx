import { ReactElement } from 'react';
import { Box } from '@mui/material';

import CustomerFulfillment from 'components/sections/resource-share/customer-fulfilment/CustomerFulfillment';
import VisorIncidenciaPorMes from 'components/sections/resource-share/visor-fallo-por-mes/VisorFalloMes';
import IncidenciasItemsAdmin from 'components/sections/dashboard-admin/incidencia-items-admin/IncidenciasItemAdmin';
import Top5EmpleadosIncidencia from 'components/sections/resource-share/top-empleados/Top5EmpleadosIncidencias';
import TOP5ActivosAhora from 'components/sections/dashboard-admin/top-5-activos-slide/Top5ActivosConcurridos';
import EmpleadosUsuariosTable from 'components/sections/resource-share/table-share/EmpleadosUsuariosData';
import Earnings from 'components/sections/resource-share/earnings/Earnings';
import ComparacionFI from 'components/sections/dashboard-admin/comparacion-mes-fi/ComparacionFIMes';

const DashboardAdmin = (): ReactElement => {
  return (
    <>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={3.5}>
        <Box gridColumn={{ xs: 'span 12', '2xl': 'span 8' }} order={{ xs: 0 }}>
          <IncidenciasItemsAdmin />
        </Box>
        <Box gridColumn={{ xs: 'span 12', lg: 'span 4' }} order={{ xs: 1, '2xl': 1 }}>
          <ComparacionFI />
        </Box>
        <Box gridColumn={{ xs: 'span 12', lg: 'span 8' }} order={{ xs: 2, '2xl': 2 }}>
          <Top5EmpleadosIncidencia />
        </Box>
        <Box
          gridColumn={{ xs: 'span 12', md: 'span 6', xl: 'span 4' }}
          order={{ xs: 3, xl: 3, '2xl': 3 }}
        >
          <CustomerFulfillment />
        </Box>
        <Box
          gridColumn={{ xs: 'span 12', md: 'span 6', xl: 'span 4' }}
          order={{ xs: 4, xl: 5, '2xl': 4 }}
        >
          <Earnings />
        </Box>
        <Box gridColumn={{ xs: 'span 12', xl: 'span 8' }} order={{ xs: 5, xl: 4, '2xl': 5 }}>
          <VisorIncidenciaPorMes />
        </Box>
        <Box
          gridColumn={{ xs: 'span 12', xl: 'span 8', '2xl': 'span 6' }}
          order={{ xs: 6, '2xl': 6 }}
        >
          <TOP5ActivosAhora />
        </Box>
        <Box gridColumn={{ xs: 'span 12', '2xl': 'span 6' }} order={{ xs: 7 }} sx={{p: 2}}>
          <EmpleadosUsuariosTable />
        </Box>
      </Box>
    </>
  );
};

export default DashboardAdmin;
