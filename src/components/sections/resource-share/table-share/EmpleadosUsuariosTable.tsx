import { useMemo, useEffect, ReactElement, useCallback, useState } from 'react';
import { Stack, Avatar, Tooltip, Typography, CircularProgress } from '@mui/material';
import {
  GridApi,
  DataGrid,
  GridSlots,
  GridColDef,
  useGridApiRef,
  GridRenderCellParams,
  GridTreeNodeWithRender,
  GridRowsProp,
} from '@mui/x-data-grid';
import { stringAvatar } from 'helpers/string-avatar';
import CustomPagination from 'components/common/CustomPagination';
import CustomNoResultsOverlay from 'components/common/CustomNoResultsOverlay';
import UserService from 'data/services/UserService';
import { convertToExportColumns, exportToExcel, exportToPDF } from 'components/common/ExportUtils';
import ExportModal from 'components/modals/ModalExport';
import { useUserProfile } from 'hooks/hooks-user/useProfileUser';
import { fecthEmpleados, fetchEmpleadosSoporte } from 'data/customer-data';


const rolUser = UserService.isAdmin();

const columns: GridColDef<any>[] = [
  {
    field: 'id',
    headerName: 'ID',
    resizable: false,
    minWidth: 60,
  },
  {
    field: 'nombreApellidos',
    headerName: 'Nombre y Apellidos',
    valueGetter: (params: any) => {
      return params;
    },
    renderCell: (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
      const name = params.row.nombreApellidos || 'N/A';
      return (
        <Stack direction="row" gap={1} alignItems="center">
          <Tooltip title={name} placement="top" arrow>
            <Avatar {...stringAvatar(name)} />
          </Tooltip>
          <Typography variant="body2">{name}</Typography>
        </Stack>
      );
    },
    resizable: false,
    flex: 1,
    minWidth: 230,
  },
  {
    field: 'rol',
    headerName: 'Rol',
    resizable: false,
    flex: 1,
    minWidth: 170,
    sortable: false,
  },
  {
    field: 'cantidadMantenimiento',
    headerName: 'Total Mantenimiento',
    resizable: false,
    flex: 0.5,
    minWidth: 210,
    align: 'center',
  },
  {
    field: 'cantidadAuditoria',
    headerName: 'Total Auditoria',
    resizable: false,
    flex: 0.5,
    minWidth: 140,
    align: 'center',
  },
  {
    field: 'nombreEmpleado',
    headerName: 'Empleado',
    valueGetter: (params: any) => {
      return params;
    },
    renderCell: (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
      const name = params.row.nombreEmpleado || 'N/A';
      return (
        <Stack direction="row" gap={1} alignItems="center">
          <Tooltip title={name} placement="top" arrow>
            <Avatar {...stringAvatar(name)} />
          </Tooltip>
          <Typography variant="body2">{name}</Typography>
        </Stack>
      );
    },
    resizable: false,
    flex: 1,
    minWidth: 255,
  },
  {
    field: 'cargo',
    headerName: 'Cargo',
    resizable: false,
    flex: 0.5,
    minWidth: 255,
    sortable: false,
  },
  {
    field: 'oficina',
    headerName: 'Oficina',
    sortable: false,
    resizable: false,
    flex: 1,
    minWidth: 450,
  },
  {
    field: 'porcentaje',
    headerName: 'Porcentaje',
    resizable: false,
    flex: 0.5,
    minWidth: 110,
    align: 'center',
  },
  {
    field: 'cantidad',
    headerName: 'Cantidad',
    resizable: false,
    flex: 0.5,
    minWidth: 100,
    align: 'center',
  },
];

const CustomerTable = ({
  searchText,
  onExportPDF,
  onExportExcel,
}: {
  searchText: string;
  onExportPDF: (func: () => void) => void;
  onExportExcel: (func: () => void) => void;
}): ReactElement => {
  // estado del usuario
  const { user, fetchUserProfile } = useUserProfile();
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  const apiRef = useGridApiRef<GridApi>();
  const adminColumns = ['nombreApellidos', 'rol', 'cantidadMantenimiento', 'cantidadAuditoria'];
  const soporteColumns = ['nombreEmpleado', 'cargo', 'oficina', 'porcentaje', 'cantidad'];
  // estado del tipo de exportacion
  const [exportType, setExportType] = useState<'PDF' | 'Excel'>('PDF');
  // estado del modal de exportar
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [rows, setRows] = useState<GridRowsProp>([]);

  // funcion para cargar las filas de la tabla de acuerdo al rol del usuario
  const loadRows = async () => {
    const token = sessionStorage.getItem('tokenJWT');
    const rol = sessionStorage.getItem('rol');
    const isAuthenticated = UserService.isAuthenticated();
    if(token && rol) {
      const data = isAuthenticated && UserService.onlyAdmin() ? await fecthEmpleados() : await fetchEmpleadosSoporte();
      setRows(data);
    } else {
      setRows([]);
    }
  };

  // cargar las filas al montar el componente
  useEffect(() => {
    loadRows();
  }, []);

  // para cargar las filas al cambiar el storage
  useEffect(() => {
    const handleStorageChange = () => {
      loadRows();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  // Para cargar el perfil del usuario
  useEffect(() => {
    const loadUserProfile = async () => {
      await fetchUserProfile();
      setIsUserLoaded(true);
    };

    // si no se ha cargado el usuario, cargarlo
    if (!isUserLoaded) {
      // volver a cargar el perfil del usuario
      loadUserProfile();
    }
  }, [isUserLoaded, fetchUserProfile]);

  // para mostrar las columnas segun el rol del usuario, y no mostrar la columna id
  const visibleColumns = useMemo(() => {
    if (rolUser) {
      return columns.filter(
        (column) => column.field !== 'id' && adminColumns.includes(column.field),
      );
    } else {
      return columns.filter(
        (column) => column.field !== 'id' && soporteColumns.includes(column.field),
      );
    }
  }, []);

  // funcion para exportar el documento
  const handleExportDocument = useCallback(
    async (type: 'current' | 'filtered' | 'all') => {
      if (!isUserLoaded) {
        await fetchUserProfile();
        setIsUserLoaded(true);
      }
      // para el nombre de archivo de PDF y Excel
      const nameFile = rolUser ? 'personal-reporte' : 'empleados-reporte';
      // para el titulo del documento para PDF
      const titleDocument = rolUser
        ? 'Reporte de Personal de Soporte Técnico'
        : 'Reporte de TOP 10 Empleados';
      // para el asunto del reporte
      const asunto = rolUser
        ? 'Rendimiento del Personal de Soporte Técnico'
        : 'Los 10 empleados con más incidencias y/o fallos actualmente';
      // Filtrar las filas a exportar
      const exportColumns = convertToExportColumns(
        visibleColumns.filter(
          (col) => col.field !== 'acciones' && col.field !== 'id' && col.field !== 'idFallo',
        ),
      );
      // si el tipo de exportacion es PDF
      if (exportType === 'PDF') {
        exportToPDF(apiRef, rows, exportColumns, nameFile, type, titleDocument, user, asunto);
      } else {
        exportToExcel(apiRef, rows, exportColumns, nameFile, type);
      }
      // cerrar el modal de exportar
      setExportModalOpen(false);
    },
    [apiRef, exportType, visibleColumns, isUserLoaded, user],
  );

  // crear las funciones de exportacion estables con useCallback
  // para pdf
  const exportPDFFunction = useCallback(() => {
    setExportType('PDF');
    setExportModalOpen(true);
  }, []);

  // para excel
  const exportExcelFunction = useCallback(() => {
    setExportType('Excel');
    setExportModalOpen(true);
  }, []);

  // Efecto para asignar las funciones de exportación a las props
  useEffect(() => {
    // Sobrescribir las funciones de exportación del padre con las locales
    onExportPDF(exportPDFFunction);
    onExportExcel(exportExcelFunction);
  }, []);

  useEffect(() => {
    apiRef.current.setQuickFilterValues(
      searchText.split(/\b\W+\b/).filter((word: string) => word !== ''),
    );
  }, [searchText]);

  useEffect(() => {
    const handleResize = () => {
      if (apiRef.current) {
        apiRef.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [apiRef]);

  return (
    <>
      <DataGrid
        apiRef={apiRef}
        density="standard"
        columns={visibleColumns}
        rowHeight={56}
        checkboxSelection
        disableColumnMenu
        disableRowSelectionOnClick
        rows={rows}
        onResize={() => {
          apiRef.current.autosizeColumns({
            includeOutliers: true,
            expand: true,
            columns: rolUser ? adminColumns : soporteColumns,
          });
        }}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 5 } },
        }}
        slots={{
          loadingOverlay: CircularProgress as GridSlots['loadingOverlay'],
          pagination: CustomPagination as GridSlots['pagination'],
          noResultsOverlay: CustomNoResultsOverlay as GridSlots['noResultsOverlay'],
        }}
        slotProps={{
          pagination: { labelRowsPerPage: rows.length },
        }}
        sx={{
          height: 1,
          width: 1,
          tableLayout: 'fixed',
          scrollbarWidth: 'thin',
        }}
      />
      {/* modal de exportar */}
      <ExportModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExportCurrentPage={() => handleExportDocument('current')}
        onExportAll={() => handleExportDocument('all')}
        onExportFiltered={() => handleExportDocument('filtered')}
        type={exportType}
        hasFilters={
          (apiRef.current?.state?.filter?.filterModel?.quickFilterValues ?? []).length > 0
        }
      />
    </>
  );
};

export default CustomerTable;
