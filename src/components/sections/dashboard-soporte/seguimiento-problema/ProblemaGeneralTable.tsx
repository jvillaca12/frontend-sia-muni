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
import ModalEliminarProblemaGeneral from './ModalEliminarProblemaGeneral';
import { ProblemaGeneralDTO } from 'data/interfaces/ProblemaGeneralDTO';
import FormRegistroDetalleProblema from '../detalle-problema/FormRegistroDetalleProblema';
import { useNavigate } from 'react-router-dom';
import paths from 'routes/paths';
import ReusableModal from 'components/common/ResuableDialog';
import { useProblemaGeneralData } from 'hooks/hooks-incidencias/useProblemaGeneral';

// Tipo de mensaje
type OnSuccessRegistroType = (message?: string) => void;

// props de la tabla problema general
const ProblemaGeneralTable = ({
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
  // estado de la tabla de problema general
  const apiRef = useGridApiRef<GridApi>();
  // estado de la fila seleccionada en la tabla
  const [rowDetails, setSelectedRowDetails] = useState<ProblemaGeneralDTO | null>(null);
  // estado de la fila seleccionada para crear una auditoria
  const [selectedRowPG, setSelectedRowPG] = useState<ProblemaGeneralDTO | null>(null);
  // estado del mensaje de la modal de eliminar
  const [modalMessage, setModalMessage] = useState('');
  // estado de la modal de eliminar
  const [openModalDelete, setOpenModalDelete] = useState(false);
  // estado de la fila seleccionada para eliminar
  const [isDeleted, setIsDeleted] = useState(false);
  // estado del modal de crear una auditoria
  const [isModalOpenRegister, setOpenRegisterModal] = useState(false);
  // estado del modal de exportar
  const [exportModalOpen, setExportModalOpen] = useState(false);
  // estado del tipo de exportacion
  const [exportType, setExportType] = useState<'PDF' | 'Excel'>('PDF');
  // estado del usuario
  const { user } = useUserProfile();
  const [modalMessageM, setModalMessageM] = useState('');
  const [openModalM, setOpenModalM] = useState(false);
  // hook para navegar a una ruta
  const navigate = useNavigate();
  // Usa el hook, pasando onFilteredRowCountChange
  const { rows, isLoading } = useProblemaGeneralData(onFilteredRowCountChange, user);

  // columnas de la tabla de problema general
  const baseColumns: GridColDef<any>[] = [
    { field: 'id', headerName: 'ID', resizable: false, minWidth: 60 },
    {
      field: 'idProblemaGeneral',
      headerName: 'ID',
      resizable: false,
      minWidth: 10,
      sortable: false,
    },
    {
      field: 'codigoProblemaGeneral',
      headerName: 'Código de Seguimiento',
      resizable: false,
      minWidth: 230,
      sortable: false,
    },
    { field: 'codigoBien', headerName: 'Código de Bien', minWidth: 180, sortable: false },
    {
      field: 'nombreActivo',
      headerName: 'Activo',
      resizable: false,
      minWidth: 150,
      sortable: false,
    },
    {
      field: 'tipoActivo',
      headerName: 'Tipo Activo',
      resizable: false,
      minWidth: 150,
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
      field: 'nombreUsuario',
      headerName: 'Usuario',
      resizable: false,
      minWidth: 200,
      sortable: false,
    },
    {
      field: 'fechaOcurrencia',
      headerName: 'Fecha Ocurrencia',
      resizable: false,
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'cantidadDetalleProblema',
      headerName: 'Cantidad Detalle Problema',
      headerAlign: 'center',
      align: 'center',
      resizable: false,
      minWidth: 270,
      sortable: true,
    },
  ];

  const actionColumn: GridColDef<any> = {
    field: 'acciones',
    type: 'actions',
    headerName: 'Acciones',
    resizable: false,
    minWidth: 100,
    // funcion para renderizar las acciones de la tabla
    renderCell: (params) => {
      return [
        <Tooltip key={`delete-${params.id}`} title="Eliminar">
          {/* accion eliminar */}
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
            onClick={() => handleOpenModalDelete(params.row, params.row.idProblemaGeneral)}
          />
        </Tooltip>,
        <Tooltip key={`dp-${params.id}`} title="Crear Detalle Problema">
          {/* accion de crear detalle problema*/}
          <GridActionsCellItem
            icon={
              <IconifyIcon
                icon="mdi:alert-circle-outline"
                color="primary.main"
                sx={{ fontSize: 'body1.fontSize', pointerEvents: 'none' }}
              />
            }
            label="Crear Detalle Problema"
            size="small"
            onClick={() => handleOpenForRegister(params.row)}
          />
        </Tooltip>,
        <Tooltip key={`view-${params.id}`} title="Ver Detalle Problema">
          {/* accion de crear detalle problema*/}
          <GridActionsCellItem
            icon={
              <IconifyIcon
                icon="mdi:eye-outline"
                color="secondary.main"
                sx={{ fontSize: 'body1.fontSize', pointerEvents: 'none' }}
              />
            }
            label="Ver Detalle Problema"
            size="small"
            onClick={() =>
              handleOpenForDetalleProblema(
                params.row.idProblemaGeneral,
                params.row.cantidadDetalleProblema,
              )
            }
          />
        </Tooltip>,
      ];
    },
  };

  const columns = user?.rol === 'ADMIN' ? [...baseColumns] : [...baseColumns, actionColumn];

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
        visibleColumns.filter((col) => col.field !== 'acciones' && col.field !== 'id'),
      );
      // si el tipo de exportacion es PDF
      if (exportType === 'PDF') {
        exportToPDF(
          apiRef,
          rows,
          exportColumns,
          'problema-general-reporte',
          type,
          'Reporte de los Problemas General asociados a los Activos Informáticos',
          user,
          'Reporte de los activos informáticos con su problema general asociado registrados en el sistema',
        );
      } else {
        exportToExcel(apiRef, rows, exportColumns, 'problema-general-reporte', type);
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

  // para abrir el modal de eliminar un problema general
  const handleOpenModalDelete = (row: any, id: number) => {
    setSelectedRowDetails(row);
    setModalMessage(
      `¿Esta seguro de eliminar el seguimiento a este activo informático con el id: ${id}?`,
    );
    setOpenModalDelete(true);
    setIsDeleted(false);
  };

  // para abrir el formulario de registro y crear un detalle problema asociado a la fila seleccionada
  const handleOpenForRegister = (row: any) => {
    setSelectedRowPG(row);
    setOpenRegisterModal(true);
  };

  // para obtener el id del problema general seleccionado para la vista detalle problema
  const handleOpenForDetalleProblema = (
    idProbleGeneral: number,
    cantidadDetalleProblema: number,
  ) => {
    if (cantidadDetalleProblema === 0) {
      setModalMessageM('El activo informático no tiene detalles de problemas');
      setOpenModalM(true);
      return;
    }
    navigate(paths.detalleProblema.replace(':id', idProbleGeneral.toString()));
  };

  // para cerrar el modal de crear auditoria
  const handleCloseModalRegister = () => {
    setSelectedRowPG(null);
    setOpenRegisterModal(false);
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
      {/* para eliminar un problema general */}
      <ModalEliminarProblemaGeneral
        selectedRow={rowDetails}
        modalMessage={modalMessage}
        openModal={openModalDelete}
        isDeleted={isDeleted}
        setOpenModal={setOpenModalDelete}
        setIsDeleted={setIsDeleted}
        onSuccessRegistro={onSuccessRegistro}
      />
      <Modal open={isModalOpenRegister} onClose={handleCloseModalRegister}>
        <FormRegistroDetalleProblema
          onClose={handleCloseModalRegister}
          row={selectedRowPG}
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
      <ReusableModal
        open={openModalM}
        onClose={() => setOpenModalM(false)}
        title="Mensaje"
        message={modalMessageM}
      />
    </>
  );
};

export default ProblemaGeneralTable;
