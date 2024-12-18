import { useMemo, useEffect, ReactElement, useState, useCallback } from 'react';
import { Tooltip, CircularProgress } from '@mui/material';
import {
  GridApi,
  DataGrid,
  GridSlots,
  GridColDef,
  useGridApiRef,
  GridActionsCellItem,
  GridRowsProp,
} from '@mui/x-data-grid';
import IconifyIcon from 'components/base/IconifyIcon';
import CustomPagination from 'components/common/CustomPagination';
import CustomNoResultsOverlay from 'components/common/CustomNoResultsOverlay';
import { DetalleProblemaDTO } from 'data/interfaces/DetalleProblemaDTO';
import ModalDetalleProblema from 'components/modals/ModalIncidencia';
import { exportToPDF, exportToExcel, convertToExportColumns } from 'components/common/ExportUtils';
import ExportModal from 'components/modals/ModalExport';
import { useUserProfile } from 'hooks/hooks-user/useProfileUser';
import { useDetalleProblemaData } from 'components/sections/dashboard-soporte/detalle-problema/detalleProblema-data';

// props de la tabla de incidencias
const IncidenciaFalloTable = ({
  searchText,
  onExportPDF,
  onExportExcel,
  onFilteredRowCountChange,
}: {
  // pasando las props de la tabla de incidencias
  searchText: string;
  onExportPDF: (func: () => void) => void;
  onExportExcel: (func: () => void) => void;
  onFilteredRowCountChange: (count: number) => void;
}): ReactElement => {
  // estado de la tabla de incidencias
  const apiRef = useGridApiRef<GridApi>();
  // estado de la modal de detalles de la incidencia
  const [openDetails, setOpenDetails] = useState(false);
  // estado de la fila seleccionada
  const [selectedRow, setSelectedRow] = useState<DetalleProblemaDTO | null>(null);
  // estado del modal de exportar
  const [exportModalOpen, setExportModalOpen] = useState(false);
  // estado del tipo de exportacion
  const [exportType, setExportType] = useState<'PDF' | 'Excel'>('PDF');
  // estado del usuario
  const { user } = useUserProfile();
  // para las filas de la columna, si se busca por id del problema general o no
  const [selectedRows, setSelectedRows] = useState<GridRowsProp>([]);
  const { rows, loading } = useDetalleProblemaData(0, user);

  // columnas de la tabla de incidencias
  const columns: GridColDef<any>[] = [
    {
      field: 'id',
      headerName: 'ID',
      resizable: false,
      minWidth: 60,
    },
    {
      field: 'idFallo',
      headerName: 'ID Fallo',
      resizable: false,
      minWidth: 60,
    },
    {
      field: 'nombreUsuario',
      headerName: 'Usuario',
      resizable: false,
      minWidth: 60,
      sortable: false,
    },
    {
      field: 'codigoProblema',
      headerName: 'Código',
      flex: 5,
      minWidth: 110,
      sortable: true,
    },
    {
      field: 'descripcion',
      headerName: 'Descripcion',
      resizable: false,
      flex: 0.5,
      minWidth: 215,
      sortable: false,
    },
    {
      field: 'fechaRegistro',
      headerName: 'Fecha Registro',
      resizable: false,
      flex: 0.5,
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'medioReporte',
      headerName: 'Medio de Reporte',
      resizable: false,
      flex: 0.5,
      minWidth: 160,
      sortable: false,
    },
    {
      field: 'solucion',
      headerName: 'Solución',
      resizable: false,
      flex: 1,
      minWidth: 350,
      sortable: false,
    },
    {
      field: 'codigoBien',
      headerName: 'Código de Bien',
      resizable: false,
      flex: 1,
      minWidth: 180,
      sortable: false,
    },
    {
      field: 'nombreActivo',
      headerName: 'Activo',
      resizable: false,
      flex: 1,
      minWidth: 180,
      sortable: false,
    },
    {
      field: 'tipoActivo',
      headerName: 'Tipo Activo',
      resizable: false,
      flex: 1,
      minWidth: 110,
      sortable: false,
    },
    {
      field: 'nombreEmpleado',
      headerName: 'Empleado',
      resizable: false,
      flex: 1,
      minWidth: 200,
      sortable: false,
    },
    {
      field: 'categoria',
      headerName: 'Categoria',
      resizable: false,
      flex: 1,
      minWidth: 100,
      sortable: false,
    },
    {
      field: 'prioridad',
      headerName: 'Prioridad',
      resizable: false,
      flex: 1,
      minWidth: 100,
      sortable: false,
    },
    {
      field: 'solucionadoText',
      headerName: 'Solucionado',
      resizable: false,
      flex: 1,
      minWidth: 120,
      sortable: false,
      // funcion para renderizar el color de la solucionado
      renderCell: (params) => {
        const color = params.value === 'Si' ? 'rgba(0, 128, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)';
        return (
          <div
            style={{
              backgroundColor: color,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {params.value}
          </div>
        );
      },
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

  // para obtener las filas de la tabla de detalles de problemas, siempre y cuando el id no sea 0
  useEffect(() => {
    const fetchData = async () => {
      setSelectedRows(rows);
      // Notificar al componente padre sobre el número de filas cargadas inicialmente
      onFilteredRowCountChange(rows.length);
    };
    fetchData();
  }, [onFilteredRowCountChange, user]);;

  // filtrar las filas basándose en el texto de búsqueda
  useEffect(() => {
    const filteredRows = selectedRows.filter((row) =>
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
          column.field !== 'id' && column.field !== 'nombreUsuario' && column.field !== 'idFallo',
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
          selectedRows,
          exportColumns,
          'detalle-problema-reporte',
          type,
          'Reporte de Detalle Problemas',
          user,
          'Rerpote de toda la información de detalle problemas, de acuerdo al registro en tiempo real del sistema',
        );
      } else {
        exportToExcel(apiRef, selectedRows, exportColumns, 'incidencias-reporte', type);
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

  // para cerrar el modal de detalles de la incidencia
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

  return (
    <>
      {/* las columnas y filas de la tabla */}
      <DataGrid
        loading={loading}
        apiRef={apiRef}
        density="standard"
        columns={visibleColumns}
        rowHeight={56}
        disableColumnMenu
        disableRowSelectionOnClick
        rows={selectedRows}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 10 } },
        }}
        slots={{
          loadingOverlay: CircularProgress as GridSlots['loadingOverlay'],
          pagination: CustomPagination as GridSlots['pagination'],
          noResultsOverlay: CustomNoResultsOverlay as GridSlots['noResultsOverlay'],
        }}
        slotProps={{
          pagination: { labelRowsPerPage: selectedRows.length },
        }}
      />
      {/* modal para mostrar mas detalles de la incidencia */}
      <ModalDetalleProblema open={openDetails} onClose={handleClose} row={selectedRow} />
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

export default IncidenciaFalloTable;
