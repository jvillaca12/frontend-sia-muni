import { useMemo, useEffect, ReactElement, useState, useCallback } from 'react';
import { Tooltip, CircularProgress } from '@mui/material';
import {
  GridApi,
  DataGrid,
  GridSlots,
  GridColDef,
  useGridApiRef,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import IconifyIcon from 'components/base/IconifyIcon';
import CustomPagination from 'components/common/CustomPagination';
import CustomNoResultsOverlay from 'components/common/CustomNoResultsOverlay';
import { rows } from './historial-empleado';
import { exportToPDF, exportToExcel, convertToExportColumns } from 'components/common/ExportUtils';
import ExportModal from 'components/modals/ModalExport';
import { useUserProfile } from 'hooks/hooks-user/useProfileUser';
import ModalDetalles from 'components/modals/ModalDetalles';
import { EmpleadoDTO } from 'data/interfaces/EmpleadoDTO';

// props de la tabla de EmpleadoHistorialTable
const EmpleadoHistorialTable = ({
  searchText,
  onExportPDF,
  onExportExcel,
  onFilteredRowCountChange,
}: {
  // pasando las props de la tabla de EmpleadoHistorialTable
  searchText: string;
  onExportPDF: (func: () => void) => void;
  onExportExcel: (func: () => void) => void;
  onFilteredRowCountChange: (count: number) => void;
}): ReactElement => {
  // estado de la tabla de EmpleadoHistorialTable
  const apiRef = useGridApiRef<GridApi>();
  // estado de la modal de detalles de la EmpleadoHistorialTable
  const [openDetails, setOpenDetails] = useState(false);
  // estado de la fila seleccionada
  const [selectedRow, setSelectedRow] = useState<EmpleadoDTO | null>(null);
  // estado del modal de exportar
  const [exportModalOpen, setExportModalOpen] = useState(false);
  // estado del tipo de exportacion
  const [exportType, setExportType] = useState<'PDF' | 'Excel'>('PDF');
  // estado del usuario
  const { user, fetchUserProfile } = useUserProfile();
  // columnas de la tabla de EmpleadoHistorialTable
  const columns: GridColDef<any>[] = [
    {
      field: 'id',
      headerName: 'ID',
      resizable: false,
      minWidth: 60,
    },
    {
      field: 'codigo',
      headerName: 'Código',
      resizable: false,
      minWidth: 120,
      sortable: false,
    },
    {
      field: 'nombreEmpleado',
      headerName: 'Empleado',
      resizable: false,
      minWidth: 200,
      sortable: false,
    },
    {
      field: 'cargo',
      headerName: 'Cargo',
      flex: 1,
      minWidth: 270,
      sortable: false,
    },
    {
      field: 'oficina',
      headerName: 'Oficina',
      resizable: false,
      minWidth: 300,
      sortable: false,
    },
    {
      field: 'oficinaGerencia',
      headerName: 'Oficina Gerencia',
      resizable: false,
      minWidth: 400,
      sortable: false,
    },
    {
      field: 'porcentaje',
      headerName: 'Porcentaje',
      headerAlign: 'center',
      align: 'center',
      resizable: false,
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'cantidad',
      headerName: 'Cantidad de Registros',
      headerAlign: 'center',
      align: 'center',
      resizable: false,
      flex: 1,
      minWidth: 230,
      sortable: true,
    },
    {
      field: 'acciones',
      type: 'actions',
      headerName: 'Acciones',
      resizable: false,
      flex: 1,
      minWidth: 100,
      // funcion para renderizar las acciones de la tabla
      renderCell: (params) => {
        return [
          <Tooltip key={`details-${params.id}`} title="Detalles">
            <GridActionsCellItem
              icon={
                <IconifyIcon
                  icon="mingcute:information-fill"
                  color="warning.main"
                  sx={{ fontSize: 'body1.fontSize', pointerEvents: 'none' }}
                />
              }
              label="Detalles"
              size="small"
              onClick={() => handleOpen(params.row)}
            />
          </Tooltip>,
        ];
      },
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
    () =>
      columns.filter(
        (column) =>
          column.field !== 'id',
      ),
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
          'empleados-reporte',
          type,
          'Reporte de Empleados',
          user,
          'Reporte de toda la información de empleados, de acuerdo al registro en tiempo real del sistema',
        );
      } else {
        exportToExcel(apiRef, rows, exportColumns, 'empleados-reporte', type);
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

  // para cerrar el modal de detalles de la EmpleadoHistorialTable
  const handleClose = () => {
    setOpenDetails(false);
    setSelectedRow(null);
  };

  // para seleccionar una fila y abrir el modal de detalles
  const handleOpen = (row: any) => {
    setSelectedRow(row);
    setOpenDetails(true);
  };

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

    // para mostrar mas detalles de cada mantenimiento
    const detalles = [
        { label: 'Empleado', value: selectedRow?.nombreEmpleado || '' },
        { label: 'Cargo', value: selectedRow?.cargo || '' },
        { label: 'Oficina', value: selectedRow?.oficina || '' },
        { label: 'Gerencia', value: selectedRow?.oficinaGerencia || '' },
      ];

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
      {/* modal para mostrar mas detalles del mantenimiento */}
      <ModalDetalles open={openDetails} onClose={handleClose} detalles={detalles} />
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

export default EmpleadoHistorialTable;
