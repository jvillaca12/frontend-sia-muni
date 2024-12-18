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
import ModalIncidencia from 'components/modals/ModalIncidencia';
import ModalEliminarDetalleProblema from './ModalEliminarDetalleProblema';
import FormActualizarDetalleProblema from './FormActualizarDetalleProblema';
import { exportToPDF, exportToExcel, convertToExportColumns } from 'components/common/ExportUtils';
import ExportModal from 'components/modals/ModalExport';
import { useUserProfile } from 'hooks/hooks-user/useProfileUser';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ExportModalTicket from 'components/modals/ModalExportTicket';
import { exportToPDFTicket } from 'components/common/ExportPDFTicket';
import { ProblemaGeneralDTO } from 'data/interfaces/ProblemaGeneralDTO';
import { fetchDataProblemaGeneralById } from '../seguimiento-problema/seguimiento-data';
import { useDetalleProblemaData } from './detalleProblema-data';

// props de la tabla de detalle problema
const DetalleProblemaTable = ({
  searchText,
  onExportPDF,
  onExportExcel,
  onFilteredRowCountChange,
  idProblemaGeneral,
  onSuccessRegistro,
}: {
  // pasando las props de la tabla de detalle problema
  searchText: string;
  onExportPDF: (func: () => void) => void;
  onExportExcel: (func: () => void) => void;
  onFilteredRowCountChange: (count: number) => void;
  idProblemaGeneral?: number;
  onSuccessRegistro: (message?: string) => void;
}): ReactElement => {
  // estado de la tabla de detalle problema
  const apiRef = useGridApiRef<GridApi>();
  // estado de la modal de detalles de detalle problema
  const [openDetails, setOpenDetails] = useState(false);
  // estado de la fila seleccionada
  const [selectedRow, setSelectedRow] = useState<DetalleProblemaDTO | null>(null);
  // estado de la fila seleccionada para el ticket
  const [selectedRowTicket, setSelectedRowTicket] = useState<DetalleProblemaDTO | null>(null);
  // estado de la fila seleccionada para actualizar
  const [selectedRowUpdate, setSelectedRowUpdate] = useState<DetalleProblemaDTO | null>(null);
  // estado del id de la fila seleccionada para actualizar
  const [selectedIdDetalleProblema, setSelectedIdDetalleProblema] = useState<number>(0);
  // estado del mensaje de la modal de eliminar
  const [modalMessage, setModalMessage] = useState('');
  // estado del modal de eliminar
  const [openModal, setOpenModal] = useState(false);
  // estado de la fila seleccionada para eliminar
  const [isDeleted, setIsDeleted] = useState(false);
  // estado del modal de actualizar detalle problema
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  // estado del modal de exportar
  const [exportModalOpen, setExportModalOpen] = useState(false);
  // estado del modal de exportar ticket
  const [exportModalOpenTicket, setExportModalOpenTicket] = useState(false);
  // estado del tipo de exportacion
  const [exportType, setExportType] = useState<'PDF' | 'Excel'>('PDF');
  // estado del usuario
  const { user } = useUserProfile();
  // para las filas de la columna, si se busca por id del problema general o no
  const [selectedRows, setSelectedRows] = useState<GridRowsProp>([]);
  // para obtener el problema general por id
  const [rowPG, setRowPG] = useState<ProblemaGeneralDTO>();
  const { rows, loading } = useDetalleProblemaData(idProblemaGeneral, user);

  // columnas de la tabla de detalle problema
  const columns: GridColDef<any>[] = [
    {
      field: 'id',
      headerName: 'ID',
      resizable: false,
      minWidth: 60,
    },
    {
      field: 'idDetalleProblema',
      headerName: 'ID Detalle Problema',
      resizable: false,
      minWidth: 60,
    },
    {
      field: 'codigoProblema',
      headerName: 'Código',
      flex: 1,
      minWidth: 110,
      sortable: true,
    },
    {
      field: 'descripcion',
      headerName: 'Descripcion',
      resizable: false,
      flex: 1,
      minWidth: 320,
      sortable: false,
    },
    {
      field: 'fechaRegistro',
      headerName: 'Fecha Registro',
      resizable: false,
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'medioReporte',
      headerName: 'Medio de Reporte',
      resizable: false,
      flex: 0.5,
      minWidth: 170,
      sortable: false,
    },
    {
      field: 'solucion',
      headerName: 'Solución',
      resizable: false,
      flex: 0.5,
      minWidth: 430,
      sortable: false,
    },
    {
      field: 'codigoBien',
      headerName: 'Código de Bien',
      resizable: false,
      minWidth: 150,
      sortable: false,
    },
    {
      field: 'nombreActivo',
      headerName: 'Activo',
      resizable: false,
      minWidth: 120,
      sortable: false,
    },
    {
      field: 'tipoActivo',
      headerName: 'Tipo Activo',
      resizable: false,
      flex: 1,
      minWidth: 120,
      sortable: false,
    },
    {
      field: 'nombreEmpleado',
      headerName: 'Empleado',
      resizable: false,
      minWidth: 170,
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
      field: 'categoria',
      headerName: 'Categoria',
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
              onClick={() => handleOpenUpdate(params.row, params.row.idDetalleProblema)}
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
              onClick={() => handleOpenModal(params.row, params.row.idDetalleProblema)}
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
              onClick={() => handleOpen(params.row)}
            />
          </Tooltip>,
          <Tooltip key={`ticket-${params.id}`} title="Generar Ticket">
            <GridActionsCellItem
              icon={
                <ConfirmationNumberIcon
                  color="primary"
                  sx={{ fontSize: 'body1.fontSize', pointerEvents: 'none' }}
                />
              }
              label="Generar Ticket"
              size="small"
              onClick={() => handleOpenForTicket(params.row)}
            />
          </Tooltip>,
        ];
      },
    },
  ];

  // para obtener el problema general por id, siempre y cuando el id no sea 0
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDataProblemaGeneralById(idProblemaGeneral, user);
      setRowPG(data);
    };
    fetchData();
  }, [idProblemaGeneral, user]);

  // para obtener las filas de la tabla de detalles de problemas, siempre y cuando el id no sea 0
  useEffect(() => {
    const fetchData = async () => {
      setSelectedRows(rows);
      // Notificar al componente padre sobre el número de filas cargadas inicialmente
      onFilteredRowCountChange(rows.length);
    };
    fetchData();
  }, [idProblemaGeneral, onFilteredRowCountChange, user]);

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
          column.field !== 'id' &&
          column.field !== 'nombreUsuario' &&
          column.field !== 'idDetalleProblema',
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
          idProblemaGeneral
            ? 'Reporte de los Detalles de Problema del código de seguimiento '.concat(
                rowPG?.codigoProblemaGeneral || '',
              )
            : 'Reporte de los Detalles de Problemas Registrados',
          user,
          idProblemaGeneral
            ? 'Reporte de toda la información de los detalles de problemas del activo con código de bien '.concat(
                rowPG?.codigoBien || '',
              )
            : 'Reporte de toda la información de los detalles de problemas, de acuerdo al registro en tiempo real del sistema',
        );
      } else {
        exportToExcel(apiRef, selectedRows, exportColumns, 'detalle-problema-reporte', type);
      }
      // cerrar el modal de exportar
      setExportModalOpen(false);
    },
    [apiRef, exportType, visibleColumns, rowPG, selectedRows, idProblemaGeneral],
  );

  const exportPDFTicketFunction = useCallback(() => {
    if (selectedRowTicket && user) {
      exportToPDFTicket('ticket-generar', user, selectedRowTicket);
    }
    setExportModalOpenTicket(false);
  }, [selectedRowTicket, user]);

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

  // para abrir el modal de eliminar detalle problema
  const handleOpenModal = (row: any, id: number) => {
    setSelectedRow(row);
    setModalMessage(`Esta seguro de eliminar el detalle problema con el id: ${id}`);
    setOpenModal(true);
    setIsDeleted(false);
  };

  // para cerrar el modal de detalles de detalle problema
  const handleClose = () => {
    setOpenDetails(false);
    setSelectedRow(null);
    setIsDeleted(false);
  };

  // para abrir el modal de actualizar detalle problema
  const handleOpenUpdate = (row: any, idFallo: number) => {
    setSelectedRowUpdate(row);
    setSelectedIdDetalleProblema(idFallo);
    setOpenUpdateModal(true);
  };

  // para cerrar el modal de actualizar inciencias
  const handleCloseUpdate = () => {
    setSelectedRowUpdate(null);
    setSelectedIdDetalleProblema(0);
    setOpenUpdateModal(false);
  };

  // para seleccionar una fila y abrir el modal de detalles
  const handleOpen = (row: any) => {
    setSelectedRow(row);
    setOpenDetails(true);
  };

  // para seleccionar una fila y abrir el modal de detalles
  const handleOpenForTicket = useCallback((row: any) => {
    setSelectedRowTicket(row);
    setExportModalOpenTicket(true);
  }, []);

  const handleCloseForTicket = useCallback(() => {
    setSelectedRowTicket(null);
    setExportModalOpenTicket(false);
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
      {/* modal para mostrar mas detalles de detalle problema */}
      <ModalIncidencia open={openDetails} onClose={handleClose} row={selectedRow} />
      {/* para eliminar un detalle problema */}
      <ModalEliminarDetalleProblema
        selectedRow={selectedRow}
        modalMessage={modalMessage}
        openModal={openModal}
        isDeleted={isDeleted}
        setModalMessage={setModalMessage}
        setOpenModal={setOpenModal}
        setIsDeleted={setIsDeleted}
        onSuccessRegistro={(message) => onSuccessRegistro(message)}
      />
      {/* para actualizar un */}
      <FormActualizarDetalleProblema
        openUpdateModal={openUpdateModal}
        handleClose={handleCloseUpdate}
        row={selectedRowUpdate}
        idProblemaGeneral={idProblemaGeneral || 0}
        idDetalleProblema={selectedIdDetalleProblema}
        onSuccessRegistro={(message) => onSuccessRegistro(message)}
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
      <ExportModalTicket
        open={exportModalOpenTicket}
        onClose={handleCloseForTicket}
        onGenerateTicket={exportPDFTicketFunction}
        fallo={selectedRowTicket}
      />
    </>
  );
};

export default DetalleProblemaTable;
