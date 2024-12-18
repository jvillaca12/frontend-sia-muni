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
import { exportToPDF, exportToExcel, convertToExportColumns } from 'components/common/ExportUtils';
import ExportModal from 'components/modals/ModalExport';
import { useUserProfile } from 'hooks/hooks-user/useProfileUser';
import FormActualizarTP from './FormActualizarTP';
import ModalEliminarTP from './ModalEliminarTP';
import { TipoMantenimientoDTO } from 'data/interfaces/TipoMantenimientoDTO';
import { dataTipoMantAll } from './data-tp';

// props de la tabla de TipoMantenimiento
const TipoMantenimientoTable = ({
  searchText,
  onExportPDF,
  onExportExcel,
  onFilteredRowCountChange,
  onSuccessRegistro
}: {
  // pasando las props de la tabla de TipoMantenimiento
  searchText: string;
  onExportPDF: (func: () => void) => void;
  onExportExcel: (func: () => void) => void;
  onFilteredRowCountChange: (count: number) => void;
  onSuccessRegistro: (message: string) => void;
}): ReactElement => {
  // estado de la tabla de TipoMantenimiento
  const apiRef = useGridApiRef<GridApi>();
  // estado de la fila seleccionada para actualizar
  const [selectedRowUpdate, setSelectedRowUpdate] = useState<TipoMantenimientoDTO | null>(null);
  // estado del id de la fila seleccionada para actualizar
  const [selectedIdTipoMan, setSelectedIdTipoMan] = useState<number>(0);
  // estado del modal de actualizar TipoMantenimiento
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  // estado del modal de exportar
  const [exportModalOpen, setExportModalOpen] = useState(false);
  // estado del tipo de exportacion
  const [exportType, setExportType] = useState<'PDF' | 'Excel'>('PDF');
  // estado del usuario
  const { user, fetchUserProfile } = useUserProfile();
  // estado de la fila seleccionada
  const [selectedRow, setSelectedRow] = useState<TipoMantenimientoDTO | null>(null);
  // estado del mensaje de la modal de eliminar
  const [modalMessage, setModalMessage] = useState('');
  // estado del modal de eliminar
  const [openModal, setOpenModal] = useState(false);
  // estado de la fila seleccionada para eliminar
  const [isDeleted, setIsDeleted] = useState(false);
  // para la data de tipo de mantenimiento
  const { rows, isLoading } = dataTipoMantAll(onFilteredRowCountChange);

  // columnas de la tabla de TipoMantenimiento
  const columns: GridColDef<any>[] = [
    { field: 'id', headerName: 'ID', resizable: false, minWidth: 150, sortable: true },
    { field: 'nombre', headerName: 'Nombre', resizable: false, minWidth: 250, sortable: false },
    { field: 'descripcion', headerName: 'Descripcion', resizable: false, minWidth: 500, sortable: false },
    {
      field: 'acciones',
      type: 'actions',
      headerName: 'Acciones',
      resizable: false,
      minWidth: 100,
      renderCell: (params) => [
        <Tooltip key={`edit-${params.id}`} title="Editar">
          <GridActionsCellItem
            icon={
              <IconifyIcon
                icon="fluent:edit-32-filled"
                color="text.secondary"
                sx={{ fontSize: 'body1.fontSize', pointerEvents: 'none' }}
              />
            }
            label="Editar"
            size="small"
            onClick={() => handleOpenUpdate(params.row, params.row.id)}
          />
        </Tooltip>,
        <Tooltip key={`delete-${params.id}`} title="Eliminar">
          <GridActionsCellItem
            icon={
              <IconifyIcon
                icon="mingcute:delete-3-fill"
                color="error.main"
                sx={{ fontSize: 'body1.fontSize', pointerEvents: 'none' }}
              />
            }
            label="Eliminar"
            size="small"
            onClick={() => handleOpenModal(params.row, params.row.id)}
          />
          {/* accion detalles */}
        </Tooltip>,
      ],
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
    () => columns.filter((column) => column.field !== 'id1'),
    [columns],
  );

  // para abrir el modal de eliminar incidencias
  const handleOpenModal = (row: any, id: number) => {
    setSelectedRow(row);
    setModalMessage(`Esta seguro de eliminar este tipo de mantenimiento con el id: ${id}`);
    setOpenModal(true);
    setIsDeleted(false);
  };

  // funcion para exportar el documento
  const handleExportDocument = useCallback(
    (type: 'current' | 'filtered' | 'all') => {
      // Filtrar las filas a exportar
      const exportColumns = convertToExportColumns(
        visibleColumns.filter((col) => col.field !== 'acciones'),
      );
      // si el tipo de exportacion es PDF
      if (exportType === 'PDF') {
        exportToPDF(
          apiRef,
          rows,
          exportColumns,
          'tp-reporte',
          type,
          'Reporte de los Tipos de Mantenimiento que tiene los Fallos/Incidencias',
          user,
          'Reporte de las Tipos de Mantenimiento, de acuerdo al registro del sistema actual',
        );
      } else {
        exportToExcel(apiRef, rows, exportColumns, 'tp-reporte', type);
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

  // para abrir el modal de actualizar tipomantenimiento
  const handleOpenUpdate = (row: any, id: number) => {
    setSelectedRowUpdate(row);
    setSelectedIdTipoMan(id);
    setOpenUpdateModal(true);
  };

  // para cerrar el modal de actualizar tipomantenimiento
  const handleCloseUpdate = () => {
    setSelectedRowUpdate(null);
    setSelectedIdTipoMan(0);
    setOpenUpdateModal(false);
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
        loading={isLoading}
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
      {/* para actualizar el TipoMantenimiento */}
      <FormActualizarTP
        openUpdateModal={openUpdateModal}
        onClose={handleCloseUpdate}
        row={selectedRowUpdate}
        id={selectedIdTipoMan}
        onSuccessRegistro={onSuccessRegistro}
      />
      {/* para eliminar el TipoMantenimiento */}
      <ModalEliminarTP
        selectedRow={selectedRow}
        modalMessage={modalMessage}
        openModal={openModal}
        isDeleted={isDeleted}
        setOpenModal={setOpenModal}
        setIsDeleted={setIsDeleted}
        onSuccessRegistro={onSuccessRegistro}
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

export default TipoMantenimientoTable;