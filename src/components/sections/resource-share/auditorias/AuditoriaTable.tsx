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
import ModalDetalles from 'components/modals/ModalDetalles';
import { AuditoriaDTO } from 'data/interfaces/AuditoriaDTO';
import { capitalizeWords } from 'helpers/capitalizar-palabra';
import FormActualizarAuditoria from './FormActualizarAuditoria';
import ModalEliminarAuditoria from './ModalEliminarAuditoria';
import { useDataAuditoria } from 'hooks/hooks-incidencias/useDataAuditoria';

// props de la tabla de auditoria
const AuditoriaTable = ({
  searchText,
  onExportPDF,
  onExportExcel,
  onFilteredRowCountChange,
  onSuccessRegistro
}: {
  // pasando las props de la tabla de auditoria
  searchText: string;
  onExportPDF: (func: () => void) => void;
  onExportExcel: (func: () => void) => void;
  onFilteredRowCountChange: (count: number) => void;
  onSuccessRegistro: (message?: string) => void;
}): ReactElement => {
  // estado de la tabla de auditoria
  const apiRef = useGridApiRef<GridApi>();
  // estado del modal de detalles de la auditoria
  const [openDetails, setOpenDetails] = useState(false);
  // estado de la fila seleccionada
  const [rowDetails, setSelectedRowDetails] = useState<AuditoriaDTO | null>(null);
  // estado de la fila seleccionada para actualizar
  const [selectedRowUpdate, setSelectedRowUpdate] = useState<AuditoriaDTO | null>(null);
  // estado del id de la fila seleccionada para actualizar
  const [selectedIdAuditoria, setSelectedIdAuditoria] = useState<number>(0);
  // estado del mensaje de la modal de eliminar
  const [modalMessage, setModalMessage] = useState('');
  // estado de la modal de eliminar
  const [openModalDelete, setOpenModalDelete] = useState(false);
  // estado de la fila seleccionada para eliminar
  const [isDeleted, setIsDeleted] = useState(false);
  // estado del modal de actualizar auditorias
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  // estado del modal de exportar
  const [exportModalOpen, setExportModalOpen] = useState(false);
  // estado del tipo de exportacion
  const [exportType, setExportType] = useState<'PDF' | 'Excel'>('PDF');
  // estado del usuario
  const { user, fetchUserProfile } = useUserProfile();
  // Usa el hook, pasando onFilteredRowCountChange
  const { rows, isLoading } = useDataAuditoria(onFilteredRowCountChange, user);
  
  // columnas de la tabla de auditoria
  const baseColumns: GridColDef<any>[] = [
    { field: 'id', headerName: 'ID', resizable: false, minWidth: 60 },
    { field: 'idAuditoria', headerName: 'ID Auditoria', resizable: false, minWidth: 150, align: 'center' },
    { field: 'codigoProblema', headerName: 'Código Problema', minWidth: 180, sortable: true, align: 'center' },
    { field: 'tipoMantenimiento', headerName: 'Tipo Mantenimiento', resizable: false, minWidth: 200, sortable: false },
    { field: 'fechaRealizada', headerName: 'Fecha Realizada', resizable: false, minWidth: 180, sortable: true },
    { field: 'personal', headerName: 'Personal', resizable: false, minWidth: 200, sortable: false },
    { field: 'fechaCambio', headerName: 'Fecha Cambio', resizable: false, minWidth: 180, sortable: true },
    { field: 'cambioRealizado', headerName: 'Cambio Realizado', resizable: false, flex: 1, minWidth: 400, sortable: false },
  ];

  const actionColumn: GridColDef<any> = {
    field: 'acciones',
    type: 'actions',
    headerName: 'Acciones',
    resizable: false,
    flex: 1,
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
          onClick={() => handleOpenUpdate(params.row, params.row.idAuditoria)}
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
          onClick={() => handleOpenModalDelete(params.row, params.row.idAuditoria)}
        />
      </Tooltip>,
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
          onClick={() => handleOpenDetalles(params.row)}
        />
      </Tooltip>,
    ],
  };

  const actionColumnAdmin: GridColDef<any> = {
    field: 'acciones',
    type: 'actions',
    headerName: 'Acciones',
    resizable: false,
    flex: 1,
    minWidth: 100,
    renderCell: (params) => [
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
          onClick={() => handleOpenDetalles(params.row)}
        />
      </Tooltip>,
    ],
  };

  const columns =
    user?.rol === 'ADMIN' ? [...baseColumns, actionColumnAdmin] : [...baseColumns, actionColumn];

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
        visibleColumns.filter((col) => col.field !== 'id' && col.field !== 'acciones'),
      );
      // si el tipo de exportacion es PDF
      if (exportType === 'PDF') {
        exportToPDF(
          apiRef,
          rows,
          exportColumns,
          'auditorias-reporte',
          type,
          'Reporte de Auditorias',
          user,
          'Reporte de auditoria generada para los mantenimientos que tienen auditoria',
        );
      } else {
        exportToExcel(apiRef, rows, exportColumns, 'auditorias-reporte', type);
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

  // para abrir el modal de eliminar auditoria
  const handleOpenModalDelete = (row: any, id: number) => {
    setSelectedRowDetails(row);
    setModalMessage(`Esta seguro de eliminar la auditoria con el id: ${id}`);
    setOpenModalDelete(true);
    setIsDeleted(false);
  };

  // para cerrar el modal de detalles de la auditoria
  const handleClose = () => {
    setOpenDetails(false);
    setSelectedRowDetails(null);
    setIsDeleted(false);
  };

  // para abrir el modal de actualizar auditoria
  const handleOpenUpdate = (row: any, idAuditoria: number) => {
    setSelectedRowUpdate(row);
    setSelectedIdAuditoria(idAuditoria);
    setOpenUpdateModal(true);
  };

  // para cerrar el modal de actualizar auditoria
  const handleCloseUpdate = () => {
    setSelectedRowUpdate(null);
    setSelectedIdAuditoria(0);
    setOpenUpdateModal(false);
  };

  // para seleccionar una fila y abrir el modal de detalles
  const handleOpenDetalles = (row: any) => {
    setSelectedRowDetails(row);
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

  // para mostrar mas detalles de cada auditoria
  const detalles = [
    { label: 'Tipo Mantenimiento', value: capitalizeWords(rowDetails?.tipoMantenimiento || '') },
    { label: 'Personal', value: capitalizeWords(rowDetails?.personal || '') },
    { label: 'Cambio Realizado', value: rowDetails?.cambioRealizado || '' },
  ];

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
      {/* modal para mostrar mas detalles de la auditoria */}
      <ModalDetalles open={openDetails} onClose={handleClose} detalles={detalles} />
      {/* para eliminar una auditoria */}
      <ModalEliminarAuditoria
        selectedRow={rowDetails}
        modalMessage={modalMessage}
        openModal={openModalDelete}
        isDeleted={isDeleted}
        setModalMessage={setModalMessage}
        setOpenModal={setOpenModalDelete}
        setIsDeleted={setIsDeleted}
        onSuccessRegistro={(message) => onSuccessRegistro(message)}
      />
      {/* para actualizar una auditoria */}
      <FormActualizarAuditoria
        openUpdateModal={openUpdateModal}
        onClose={handleCloseUpdate}
        row={selectedRowUpdate}
        idAuditoria={selectedIdAuditoria}
        onSuccessRegistro={(message) => onSuccessRegistro(message)}
      />
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

export default AuditoriaTable;