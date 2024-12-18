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
import ModalEliminarUsuario from './ModalEliminarUsuario';
import { UsuarioDTO } from 'data/interfaces/UserDTO';
import FormActualizarUsuario from './FormActualizarUsuario';
import ModalDetalles from 'components/modals/ModalDetalles';
import { useDataUser } from 'hooks/hooks-user/useUserData';

// props de la tabla de usuarios
const UsuarioTable = ({
  searchText,
  onExportPDF,
  onExportExcel,
  onFilteredRowCountChange,
  onSuccessRegistro
}: {
  // pasando las props de la tabla usuario
  searchText: string;
  onExportPDF: (func: () => void) => void;
  onExportExcel: (func: () => void) => void;
  onFilteredRowCountChange: (count: number) => void;
  onSuccessRegistro: (message?: string) => void;
}): ReactElement => {
  // estado de la tabla de usuario
  const apiRef = useGridApiRef<GridApi>();
  // estado de la modal de detalles de usuario
  const [openDetails, setOpenDetails] = useState(false);
  // estado de la fila seleccionada
  const [rowDetalle, setSelectedRowDetalle] = useState<UsuarioDTO | null>(null);
  // estado de la fila seleccionada para actualizar
  const [selectedRowUpdate, setSelectedRowUpdate] = useState<UsuarioDTO | null>(null);
  // estado del id de la fila seleccionada para actualizar
  const [selectedIdUsuario, setSelectedIdUsuario] = useState<number>(0);
  // estado del mensaje del modal de eliminar
  const [modalMessageDelete, setModalMessageDelete] = useState('');
  // estado del modal de eliminar
  const [openModalDelete, setOpenModalDelete] = useState(false);
  // estado de la fila seleccionada para eliminar
  const [isDeleted, setIsDeleted] = useState(false);
  // estado del modal de actualizar usuario
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  // estado del modal de exportar
  const [exportModalOpen, setExportModalOpen] = useState(false);
  // estado del tipo de exportacion
  const [exportType, setExportType] = useState<'PDF' | 'Excel'>('PDF');
  // estado del usuario
  const { user, fetchUserProfile } = useUserProfile();
  const { rows, isLoading } = useDataUser(onFilteredRowCountChange);

  // columnas de la tabla de usuario
  const columns: GridColDef<any>[] = [
    {
      field: 'id',
      headerName: 'ID',
      resizable: false,
      minWidth: 60,
    },

    {
      field: 'idUsuario',
      headerName: 'ID Usuario',
      headerAlign: 'center',
      resizable: false,
      minWidth: 130,
      align: 'center',
    },
    {
      field: 'nombre',
      headerName: 'Nombres',
      resizable: false,
      minWidth: 125,
      sortable: false,
    },
    {
      field: 'apellidos',
      headerName: 'Apellidos',
      resizable: false,
      minWidth: 170,
      sortable: false,
    },
    {
      field: 'userName',
      headerName: 'Username',
      minWidth: 120,
      sortable: false,
    },
    {
      field: 'correo',
      headerName: 'Correo',
      resizable: false,
      minWidth: 170,
      sortable: false,
    },
    {
      field: 'rolId',
      headerName: 'Rol Id',
      resizable: false,
      minWidth: 10,
      sortable: false,
    },
    {
      field: 'oficinaSubgerenciaId',
      headerName: 'Rol Id',
      resizable: false,
      minWidth: 10,
      sortable: false,
    },
    {
      field: 'rol',
      headerName: 'Rol',
      resizable: false,
      minWidth: 140,
      sortable: false,
    },
    {
      field: 'oficina',
      headerName: 'Oficina',
      resizable: false,
      minWidth: 260,
      sortable: false,
    },
    {
      field: 'estadoText',
      headerName: 'Estado',
      headerAlign: 'center',
      resizable: false,
      minWidth: 120,
      sortable: false,
      // funcion para renderizar el color de la solucionado
      renderCell: (params) => {
        const color = params.value === 'Activo' ? 'rgba(0, 128, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)';
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
      field: 'cantidadProblemasRegistrados',
      headerName: 'Cantidad P. General',
      resizable: false,
      minWidth: 220,
      sortable: true,
      align: 'center',
    },
    {
      field: 'cantidadDetalleProblemas',
      headerName: 'Cantidad P. Detalles',
      resizable: false,
      minWidth: 220,
      sortable: true,
      align: 'center',
    },
    {
      field: 'acciones',
      type: 'actions',
      headerName: 'Acciones',
      resizable: false,
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
              onClick={() => handleOpenUpdate(params.row, params.row.idUsuario)}
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
              onClick={() => handleOpenModal(params.row, params.row.idUsuario)}
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
          column.field !== 'id' &&
          column.field !== 'oficinaSubgerenciaId' &&
          column.field !== 'rolId',
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
          'usuarios-reporte',
          type,
          'Reporte de Usuarios',
          user,
          'Reporte de los usuarios con su información requerida y la cantidad de incidencias asociadas',
        );
      } else {
        exportToExcel(apiRef, rows, exportColumns, 'usuarios-reporte', type);
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

  // para abrir el modal de eliminar usuario
  const handleOpenModal = (row: any, id: number) => {
    setSelectedRowDetalle(row);
    setModalMessageDelete(`Esta seguro de eliminar el usuario con el id: ${id}`);
    setOpenModalDelete(true);
    setIsDeleted(false);
  };

  // para cerrar el modal de detalles de usuario
  const handleCloseDetalle = () => {
    setOpenDetails(false);
    setSelectedRowDetalle(null);
    setIsDeleted(false);
  };

  // para abrir el modal de actualizar usuario
  const handleOpenUpdate = (row: any, idUsuario: number) => {
    setSelectedRowUpdate(row);
    setSelectedIdUsuario(idUsuario);
    setOpenUpdateModal(true);
  };

  // para cerrar el modal de actualizar inciencias
  const handleCloseUpdate = () => {
    setSelectedRowUpdate(null);
    setSelectedIdUsuario(0);
    setOpenUpdateModal(false);
  };

  // para seleccionar una fila y abrir el modal de detalles
  const handleOpenDetalles = (row: any) => {
    setSelectedRowDetalle(row);
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

  const detalles = [
    { label: 'Oficina', value: rowDetalle?.oficina || '' },
    { label: 'Correo', value: rowDetalle?.correo || '' },
    { label: 'Rol', value: rowDetalle?.rol || '' },
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
      {/* modal para mostrar mas detalles del usuario */}
      <ModalDetalles open={openDetails} onClose={handleCloseDetalle} detalles={detalles} />
      {/* para eliminar un usuario */}
      <ModalEliminarUsuario
        selectedRow={rowDetalle}
        modalMessage={modalMessageDelete}
        openModal={openModalDelete}
        isDeleted={isDeleted}
        setOpenModal={setOpenModalDelete}
        setIsDeleted={setIsDeleted}
        onSuccessRegistro={onSuccessRegistro}
      />
      {/* para actualizar un usuario */}
      <FormActualizarUsuario
        openUpdateModal={openUpdateModal}
        handleClose={handleCloseUpdate}
        row={selectedRowUpdate}
        idUsuario={selectedIdUsuario}
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

export default UsuarioTable;
