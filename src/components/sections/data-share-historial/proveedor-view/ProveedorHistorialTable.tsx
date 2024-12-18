import { useMemo, useEffect, ReactElement, useState, useCallback } from 'react';
import { CircularProgress } from '@mui/material';
import {
  GridApi,
  DataGrid,
  GridSlots,
  GridColDef,
  useGridApiRef,
} from '@mui/x-data-grid';
import CustomPagination from 'components/common/CustomPagination';
import CustomNoResultsOverlay from 'components/common/CustomNoResultsOverlay';
import { rows } from './historial-proveedor';
import { exportToPDF, exportToExcel, convertToExportColumns } from 'components/common/ExportUtils';
import ExportModal from 'components/modals/ModalExport';
import { useUserProfile } from 'hooks/hooks-user/useProfileUser';

// props de la tabla de ProveedorHistorialTable
const ProveedorHistorialTable = ({
  searchText,
  onExportPDF,
  onExportExcel,
  onFilteredRowCountChange,
}: {
  // pasando las props de la tabla de ProveedorHistorialTable
  searchText: string;
  onExportPDF: (func: () => void) => void;
  onExportExcel: (func: () => void) => void;
  onFilteredRowCountChange: (count: number) => void;
}): ReactElement => {
  // estado de la tabla de ProveedorHistorialTable
  const apiRef = useGridApiRef<GridApi>();
  // estado del modal de exportar
  const [exportModalOpen, setExportModalOpen] = useState(false);
  // estado del tipo de exportacion
  const [exportType, setExportType] = useState<'PDF' | 'Excel'>('PDF');
  // estado del usuario
  const { user, fetchUserProfile } = useUserProfile();
  // columnas de la tabla de ProveedorHistorialTable
  const columns: GridColDef<any>[] = [
    {
      field: 'id',
      headerName: 'ID',
      resizable: false,
      minWidth: 60,
    },
    {
      field: 'nombre',
      headerName: 'Nombre',
      resizable: false,
      minWidth: 300,
      sortable: false,
    },
    {
      field: 'contacto',
      headerName: 'Contacto',
      minWidth: 350,
      sortable: false,
    },
    {
      field: 'telefono',
      headerName: 'Teléfono',
      resizable: false,
      minWidth: 200,
      sortable: false,
    },
    {
      field: 'cantidadIncidencias',
      headerName: 'Cantidad de Registros',
      headerAlign: 'center',
      align: 'center',
      resizable: false,
      minWidth: 350,
      sortable: true,
    },
    {
      field: 'porcentajeIncidencia',
      headerName: 'Porcentaje de Registros',
      headerAlign: 'center',
      align: 'center',
      resizable: false,
      minWidth: 350,
      sortable: true,
    },
  ];

  // cargar el perfil del usuario
  useEffect(() => {
    const fetchData = async () => {
      await fetchUserProfile();
    };
    fetchData();
  }, [fetchUserProfile]);

  // filtrar las filas basándose en el texto de búsqueda
  useEffect(() => {
    const filteredRows = rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchText.toLowerCase()),
      ),
    );
    // Notificar al componente padre sobre el número de filas filtradas
    onFilteredRowCountChange(filteredRows.length);
  }, [searchText, onFilteredRowCountChange]);

  // Filtrar las columnas que no se deben mostrar en la exportación
  const visibleColumns = useMemo(
    () => columns.filter((column) => column.field !== 'id'),
    [columns],
  );

  // funcion para exportar el documento
  const handleExportDocument = useCallback(
    (type: 'current' | 'filtered' | 'all') => {
      // Filtrar las filas a exportar
      const exportColumns = convertToExportColumns(
        visibleColumns.filter(
          (col) => col.field !== 'acciones' && col.field !== 'id' && col.field !== 'idFallo',
        ),
      );
      // si el tipo de exportacion es PDF
      if (exportType === 'PDF') {
        exportToPDF(
          apiRef,
          rows,
          exportColumns,
          'proveedor-reporte',
          type,
          'Reporte de los Proveedores de los activos informáticos de la MPP',
          user,
          'Reporte de toda la información de los proveedores, de acuerdo al registro en tiempo real del sistema',
        );
      } else {
        exportToExcel(apiRef, rows, exportColumns, 'proveedor-reporte', type);
      }
      // cerrar el modal de exportar
      setExportModalOpen(false);
    },
    [apiRef, exportType, visibleColumns],
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

  // Efecto para aplicar el filtro de búsqueda en la tabla
  useEffect(() => {
    apiRef.current.setQuickFilterValues(
      searchText.split(/\b\W+\b/).filter((word: string) => word !== ''),
    );
  }, [searchText]);

  // Efecto para redimensionar la tabla al cambiar el tamaño de la ventana
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
      {/* las columnas y filas de la tabla */}
      <DataGrid
        apiRef={apiRef}
        density="standard"
        columns={visibleColumns}
        rowHeight={56}
        disableColumnMenu
        disableRowSelectionOnClick
        rows={rows}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 10 } },
        }}
        slots={{
          loadingOverlay: CircularProgress as GridSlots['loadingOverlay'],
          pagination: CustomPagination as GridSlots['pagination'],
          noResultsOverlay: CustomNoResultsOverlay as GridSlots['noResultsOverlay'],
        }}
        slotProps={{
          pagination: { labelRowsPerPage: rows.length },
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

export default ProveedorHistorialTable;