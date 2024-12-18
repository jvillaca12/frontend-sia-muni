import { useMemo, useEffect, ReactElement, useState, useCallback } from 'react';
import { Tooltip, CircularProgress, Modal } from '@mui/material';
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
import { MantenimientoDTO } from 'data/interfaces/MantenimientoDTO';
import ModalEliminarMantenimiento from './ModalEliminarMantenimiento';
import FormActualizarMantenimiento from './FormActualizarMantenimiento';
import FormRegistroAuditoria from 'components/sections/resource-share/auditorias/FormRegistroAuditoria';
import { OnSuccessRegistroType } from 'data/interfaces/UpdateComponentes';
import { useDataMantenimiento } from 'hooks/hooks-incidencias/useDataMantenimiento';
import { format } from 'date-fns';

// props de la tabla mantenimiento
const MantenimientoTable = ({
  searchText,
  onExportPDF,
  onExportExcel,
  onFilteredRowCountChange,
  onSuccessRegistro,
}: {
  searchText: string;
  onExportPDF: (func: () => void) => void;
  onExportExcel: (func: () => void) => void;
  onFilteredRowCountChange: (count: number) => void;
  onSuccessRegistro: OnSuccessRegistroType;
}): ReactElement => {
  // estado de la tabla de mantenimiento
  const apiRef = useGridApiRef<GridApi>();
  // estado de la modal de detalles del mantenimiento
  const [openDetails, setOpenDetails] = useState(false);
  // estado de la fila seleccionada en la tabla
  const [rowDetails, setSelectedRowDetails] = useState<MantenimientoDTO | null>(null);
  // estado de la fila seleccionada para actualizar
  const [selectedRowUpdate, setSelectedRowUpdate] = useState<MantenimientoDTO | null>(null);
  // estado del id de la fila seleccionada para actualizar
  const [selectedIdMantenimiento, setSelectedIdMantenimiento] = useState<number>(0);
  // estado de la fila seleccionada para crear una auditoria
  const [selectedRowAuditoria, setSelectedRowAuditoria] = useState<MantenimientoDTO | null>(null);
  // estado del mensaje de la modal de eliminar
  const [modalMessage, setModalMessage] = useState('');
  // estado de la modal de eliminar
  const [openModalDelete, setOpenModalDelete] = useState(false);
  // estado de la fila seleccionada para eliminar
  const [isDeleted, setIsDeleted] = useState(false);
  // estado del modal de actualizar un mantenimiento
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  // estado del modal de crear una auditoria
  const [openAuditoriaModal, setOpenAuditoriaModal] = useState(false);
  // estado del modal de exportar
  const [exportModalOpen, setExportModalOpen] = useState(false);
  // estado del tipo de exportacion
  const [exportType, setExportType] = useState<'PDF' | 'Excel'>('PDF');
  // estado del usuario
  const { user, fetchUserProfile } = useUserProfile();
  // Usa el hook, pasando onFilteredRowCountChange
  const { rows, isLoading } = useDataMantenimiento(onFilteredRowCountChange, user);

  // funcion para verificar si la fecha es menor a la fecha actual
  const isPastDueDate = (date: string | Date) => {
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    return format(new Date(date), 'yyyy-MM-dd') < currentDate;
  };

  // columnas de la tabla de mantenimiento
  const basedColumns: GridColDef<any>[] = [
    { field: 'id', headerName: 'ID', resizable: false, minWidth: 60 },
    { field: 'idMantenimiento', headerName: 'ID', resizable: false, minWidth: 60 },
    { field: 'idDetalleProblema', headerName: 'ID Fallo', resizable: false, minWidth: 60 },
    { field: 'codigoProblema', headerName: 'Código', flex: 5, minWidth: 110, sortable: true },
    {
      field: 'nombreActivo',
      headerName: 'Activo',
      resizable: false,
      flex: 1,
      minWidth: 110,
      sortable: false,
    },
    {
      field: 'descripcion',
      headerName: 'Descripción',
      resizable: false,
      flex: 0.5,
      minWidth: 225,
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
      field: 'fechaProgramada',
      headerName: 'Fecha Programada',
      resizable: false,
      flex: 0.5,
      minWidth: 180,
      sortable: true,
      // funcion para renderizar el color de la solucionado
      renderCell: (params) => {
        const isPastDue = isPastDueDate(params.value);
        const color = isPastDue ? 'rgba(255, 0, 0, 0.2)' : '';
        return (
          <Tooltip title={isPastDue ? 'Fecha Vencida' : ''}>
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
          </Tooltip>
        );
      },
    },
    {
      field: 'fechaRealizada',
      headerName: 'Fecha Realizada',
      resizable: false,
      flex: 0.5,
      minWidth: 180,
      sortable: true,
      // funcion para renderizar el color de la solucionado
      renderCell: (params) => {
        const isPastDue = isPastDueDate(params.value);
        const color = isPastDue ? 'rgba(255, 0, 0, 0.2)' : '';
        return (
          <Tooltip title={isPastDue ? 'Fecha Vencida' : ''}>
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
          </Tooltip>
        );
      },
    },
    {
      field: 'tipoMantenimiento',
      headerName: 'Tipo Mantenimiento',
      resizable: false,
      minWidth: 200,
      sortable: false,
    },
    {
      field: 'tipoMantenimientoId',
      headerName: 'Tipo Mantenimiento',
      resizable: false,
      minWidth: 200,
      sortable: false,
    },
    {
      field: 'notas',
      headerName: 'Notas',
      resizable: false,
      flex: 0.5,
      minWidth: 225,
      sortable: false,
    },
    {
      field: 'personal',
      headerName: 'Personal',
      resizable: false,
      flex: 1,
      minWidth: 150,
      sortable: false,
    },
    {
      field: 'personalId',
      headerName: 'Personal',
      resizable: false,
      flex: 1,
      minWidth: 150,
      sortable: false,
    },
    {
      field: 'cantidadAuditoria',
      headerName: 'Cantidad Auditoria',
      resizable: false,
      flex: 1,
      minWidth: 180,
      sortable: true,
      align: 'center',
    },
  ];

  const actionColumnAdmin: GridColDef<any> = {
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
            onClick={() => handleOpenDetalles(params.row)}
          />
        </Tooltip>,
      ];
    },
  };

  const actionColumn: GridColDef<any> = {
    field: 'acciones',
    type: 'actions',
    headerName: 'Acciones',
    resizable: false,
    flex: 1,
    minWidth: 100,
    // funcion para renderizar las acciones de la tabla
    renderCell: (params) => {
      return [
        // accion editar
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
            onClick={() => handleOpenUpdate(params.row, params.row.idMantenimiento)}
          />
          {/* accion eliminar */}
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
            onClick={() => handleOpenModalDelete(params.row, params.row.idMantenimiento)}
          />
          {/* accion detalles */}
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
          {/* accion de auditoria*/}
        </Tooltip>,
        <Tooltip key={`auditoria-${params.id}`} title="Crear Auditoria">
          <GridActionsCellItem
            icon={
              <IconifyIcon
                icon="mdi:clipboard-text"
                color="primary.main"
                sx={{ fontSize: 'body1.fontSize', pointerEvents: 'none' }}
              />
            }
            label="Auditoria"
            size="small"
            onClick={() => handleOpenForAuditoria(params.row)}
          />
        </Tooltip>,
      ];
    },
  };

  const columns =
    user?.rol === 'ADMIN' ? [...basedColumns, actionColumnAdmin] : [...basedColumns, actionColumn];

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
          column.field !== 'id' &&
          column.field !== 'idDetalleProblema' &&
          column.field !== 'personalId' &&
          column.field !== 'tipoMantenimientoId',
      ),
    [columns],
  );

  // funcion para exportar el documento
  const handleExportDocument = useCallback(
    (type: 'current' | 'filtered' | 'all') => {
      // Filtrar las filas a exportar
      const exportColumns = convertToExportColumns(
        visibleColumns.filter(
          (col) =>
            col.field !== 'acciones' &&
            col.field !== 'id' &&
            col.field !== 'personalId' &&
            col.field !== 'tipoMantenimientoId',
        ),
      );
      // si el tipo de exportacion es PDF
      if (exportType === 'PDF') {
        exportToPDF(
          apiRef,
          rows,
          exportColumns,
          'mantenimiento-reporte',
          type,
          'Reporte de Mantenimiento de los Activos Informáticos',
          user,
          'Reporte de los mantenimientos asociados a las incidencias y/o fallos registrados en el sistema',
        );
      } else {
        exportToExcel(apiRef, rows, exportColumns, 'mantenimiento-reporte', type);
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

  // para abrir el modal de eliminar mantenimiento
  const handleOpenModalDelete = (row: any, id: number) => {
    setSelectedRowDetails(row);
    setModalMessage(`Esta seguro de eliminar el mantenimiento con el id: ${id}`);
    setOpenModalDelete(true);
    setIsDeleted(false);
  };

  // para cerrar el modal de detalles de la mantenimiento
  const handleClose = () => {
    setOpenDetails(false);
    setSelectedRowDetails(null);
    setIsDeleted(false);
  };

  // para abrir el modal de actualizar mantenimiento
  const handleOpenUpdate = (row: any, idMantenimiento: number) => {
    setSelectedRowUpdate(row);
    setSelectedIdMantenimiento(idMantenimiento);
    setOpenUpdateModal(true);
  };

  // para obtener la fila seleccionada para la auditoria
  const handleOpenForAuditoria = (row: any) => {
    setSelectedRowAuditoria(row);
    setOpenAuditoriaModal(true);
  };

  // para cerrar el modal de crear auditoria
  const handleCloseAuditoria = () => {
    setSelectedRowAuditoria(null);
    setOpenAuditoriaModal(false);
  };

  // para cerrar el modal de actualizar inciencias
  const handleCloseUpdate = () => {
    setSelectedRowUpdate(null);
    setSelectedIdMantenimiento(0);
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

  // para mostrar mas detalles de cada mantenimiento
  const detalles = [
    { label: 'Activo', value: rowDetails?.nombreActivo || '' },
    { label: 'Descripción', value: rowDetails?.descripcion || '' },
    { label: 'Tipo Mantenimiento', value: rowDetails?.tipoMantenimiento || '' },
    { label: 'Notas', value: rowDetails?.notas || '' },
    { label: 'Personal', value: rowDetails?.personal || '' },
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
      {/* modal para mostrar mas detalles del mantenimiento */}
      <ModalDetalles open={openDetails} onClose={handleClose} detalles={detalles} />
      {/* para eliminar un mantenimiento */}
      <ModalEliminarMantenimiento
        selectedRow={rowDetails}
        modalMessage={modalMessage}
        openModal={openModalDelete}
        isDeleted={isDeleted}
        setModalMessage={setModalMessage}
        setOpenModal={setOpenModalDelete}
        setIsDeleted={setIsDeleted}
        onSuccessRegistro={(message) => onSuccessRegistro(message)}
      />
      {/* para actualizar un mantenimiento */}
      <FormActualizarMantenimiento
        openUpdateModal={openUpdateModal}
        handleClose={handleCloseUpdate}
        row={selectedRowUpdate}
        idMantenimiento={selectedIdMantenimiento}
        onSuccessRegistro={(message) => onSuccessRegistro(message)}
      />
      <Modal open={openAuditoriaModal} onClose={handleCloseAuditoria}>
        <FormRegistroAuditoria
          onClose={handleCloseAuditoria}
          row={selectedRowAuditoria}
          onSuccessRegistro={(message) => onSuccessRegistro(message)}
        />
      </Modal>
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

export default MantenimientoTable;
