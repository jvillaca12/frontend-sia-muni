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
import { PersonalDTO } from 'data/interfaces/PersonalDTO';
import FormActualizarPersonal from './FormActualizarPersonal';
import ModalEliminarPersonal from './ModalEliminarPersonal';
import { useDataFullPersonal } from 'hooks/hooks-empleado/useDataFullPersonal';

// props de la tabla de personal
const PersonalTable = ({
  searchText,
  onExportPDF,
  onExportExcel,
  onFilteredRowCountChange,
  onSuccessRegistro
}: {
  // pasando las props de la tabla personal
  searchText: string;
  onExportPDF: (func: () => void) => void;
  onExportExcel: (func: () => void) => void;
  onFilteredRowCountChange: (count: number) => void;
  onSuccessRegistro: (message?: string) => void;
}): ReactElement => {
  // estado de la tabla de personal
  const apiRef = useGridApiRef<GridApi>();
  // estado de la fila seleccionada para el modal de detalle del personal
  const [rowDetalle, setSelectedRowDetalle] = useState<PersonalDTO | null>(null);
  // estado de la fila seleccionada para actualizar el personal
  const [selectedRowUpdate, setSelectedRowUpdate] = useState<PersonalDTO | null>(null);
  // estado del id de la fila seleccionada para actualizar
  const [selectedIdPersonal, setSelectedIdPersonal] = useState<number>(0);
  // estado del mensaje del modal de eliminar
  const [modalMessageDelete, setModalMessageDelete] = useState('');
  // estado del modal de eliminar
  const [openModalDelete, setOpenModalDelete] = useState(false);
  // estado de la fila seleccionada para eliminar
  const [isDeleted, setIsDeleted] = useState(false);
  // estado del modal de actualizar personal
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  // estado del modal de exportar
  const [exportModalOpen, setExportModalOpen] = useState(false);
  // estado del tipo de exportacion
  const [exportType, setExportType] = useState<'PDF' | 'Excel'>('PDF');
  // estado del usuario
  const { user, fetchUserProfile } = useUserProfile();
  // para obtener la data de empleado
  const { rows, isLoading } = useDataFullPersonal(onFilteredRowCountChange);

  // columnas de la tabla de personal
  const columns: GridColDef<any>[] = [
    { field: 'id', headerName: 'ID', resizable: false, minWidth: 60 },
    {
      field: 'idPersonal',
      headerName: 'ID Personal',
      headerAlign: 'center',
      resizable: false,
      minWidth: 150,
      align: 'center',
    },
    { field: 'nombre', headerName: 'Nombres', resizable: false, minWidth: 150, sortable: false },
    {
      field: 'apellidos',
      headerName: 'Apellidos',
      resizable: false,
      minWidth: 180,
      sortable: false,
    },
    { field: 'rolId', headerName: 'ID Rol', resizable: false, minWidth: 10, sortable: false },
    { field: 'rol', headerName: 'Rol', resizable: false, minWidth: 200, sortable: false },
    {
      field: 'estado',
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
      field: 'cantidadMantenimiento',
      headerName: 'Cantidad Mantenimiento',
      headerAlign: 'center',
      resizable: false,
      minWidth: 220,
      sortable: true,
      flex: 1,
      align: 'center',
    },
    {
      field: 'cantidadAuditoria',
      headerName: 'Cantidad Auditoria',
      headerAlign: 'center',
      flex: 1,
      resizable: false,
      minWidth: 220,
      sortable: true,
      align: 'center',
    },
    {
      field: 'acciones',
      type: 'actions',
      flex: 1,
      headerName: 'Acciones',
      resizable: false,
      minWidth: 200,
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
              onClick={() => handleOpenUpdate(params.row, params.row.idPersonal)}
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
              onClick={() => handleOpenModal(params.row, params.row.idPersonal)}
            />
            {/* accion detalles */}
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
    () => columns.filter((column) => column.field !== 'id' && column.field !== 'rolId'),
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
          'personal-reporte',
          type,
          'Reporte del Personal de Soporte Técnico',
          user,
          'Reporte del personal de soporte técnico con su información requerida con la cantidad de mantenimientos y auditorias asociados',
        );
      } else {
        exportToExcel(apiRef, rows, exportColumns, 'personal-reporte', type);
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

  // para abrir el modal de eliminar personal
  const handleOpenModal = (row: any, idPersonal: number) => {
    setSelectedRowDetalle(row);
    setModalMessageDelete(`Esta seguro de eliminar al personal con el id: ${idPersonal}`);
    setOpenModalDelete(true);
    setIsDeleted(false);
  };

  // para abrir el modal de actualizar personal
  const handleOpenUpdate = (row: any, idPersonal: number) => {
    setSelectedRowUpdate(row);
    setSelectedIdPersonal(idPersonal);
    setOpenUpdateModal(true);
  };

  // para cerrar el modal de actualizar personal
  const handleCloseUpdate = () => {
    setSelectedRowUpdate(null);
    setSelectedIdPersonal(0);
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
      {/* para eliminar un personal */}
      <ModalEliminarPersonal
        selectedRow={rowDetalle}
        modalMessage={modalMessageDelete}
        openModal={openModalDelete}
        isDeleted={isDeleted}
        setOpenModal={setOpenModalDelete}
        setIsDeleted={setIsDeleted}
        onSuccessRegistro={onSuccessRegistro}
      />
      {/* para actualizar un personal */}
      <FormActualizarPersonal
        openUpdateModal={openUpdateModal}
        handleClose={handleCloseUpdate}
        row={selectedRowUpdate}
        idPersonal={selectedIdPersonal}
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

export default PersonalTable;
