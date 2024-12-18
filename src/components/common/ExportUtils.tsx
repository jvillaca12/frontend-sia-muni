import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { GridRowsProp, GridApi, GridColDef } from '@mui/x-data-grid';
import logoBase64 from '../../../src/assets/logo/logo-base64';
import { UsuarioDTO } from 'data/interfaces/UserDTO';
import { capitalizeWords } from 'helpers/capitalizar-palabra';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// interface para la columna: cabezera y campo
export interface ExportColumn {
  field: string;
  headerName: string;
}

// Tipos de exportación
export type ExportType = 'current' | 'filtered' | 'all';

// Función para convertir GridColDef a ExportColumn
export const convertToExportColumns = (columns: GridColDef[]): ExportColumn[] => {
  return columns.map((col) => ({
    field: col.field,
    headerName: col.headerName || col.field, // Si headerName es undefined, usa el field como header
  }));
};

// Funcion axuliar (helper) para obtener las filas de la pagina actual
const getCurrentPageRows = (
  apiRef: React.MutableRefObject<GridApi>,
  allRows: GridRowsProp,
): GridRowsProp => {
  const paginationModel = apiRef.current.state.pagination.paginationModel;
  const startIndex = paginationModel.page * paginationModel.pageSize;
  const endIndex = startIndex + paginationModel.pageSize;
  return allRows.slice(startIndex, endIndex);
};

// Función auxiliar para obtener las filas filtradas
const getFilteredRows = (
  apiRef: React.MutableRefObject<GridApi>,
  allRows: GridRowsProp,
): GridRowsProp => {
  // obtener el filtro rapido
  const filteredModel = apiRef.current?.state?.filter?.filterModel?.quickFilterValues;
  const quickFilterValues = filteredModel ? filteredModel : [];
  if (quickFilterValues.length === 0) {
    return allRows;
  }

  // Función para aplicar los filtros manualmente
  return allRows.filter((row) => {
    const rowValues = Object.values(row).map(String).join(' ').toLowerCase();
    return quickFilterValues.every((value: string) => rowValues.includes(value.toLowerCase()));
  });
};

// funcion para obtener las filas a exportar de acuerdo al tipo de exportacion
const getRowsToExport = (
  apiRef: React.MutableRefObject<GridApi>,
  allRows: GridRowsProp,
  exportType: ExportType,
): GridRowsProp => {
  switch (exportType) {
    case 'current':
      return getCurrentPageRows(apiRef, allRows);
    case 'filtered':
      return getFilteredRows(apiRef, allRows);
    case 'all':
    default:
      return allRows;
  }
};

function generateReportNumber() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let result = '';

  // Generar 3 letras
  for (let i = 0; i < 3; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // Generar 4 números
  for (let i = 0; i < 4; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  // Mezclar el resultado
  result = result.split('').sort(() => 0.5 - Math.random()).join('');

  return result;
}

// funcion para exportar a PDF
export const exportToPDF = (
  apiRef: React.MutableRefObject<GridApi>,
  allRows: GridRowsProp,
  columns: ExportColumn[],
  fileName: string = 'detalle-problema',
  exportType: ExportType = 'all',
  titleDocument: string,
  user: UsuarioDTO | null,
  asunto: string,
) => {
  // Obtener las filas según el filtro
  const rowsToExport = getRowsToExport(apiRef, allRows, exportType);

  // crear el documento pdf (orientación, unidad, formato)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Preparar los datos para la tabla
  const tableData = rowsToExport.map((row) =>
    columns.map((column) => {
      const value = row[column.field];
      // Manejo especial para el campo solucionadoText
      if (column.field === 'solucionadoText') {
        return value === 'Si' ? 'Si' : 'No';
      }
      // manejo especial para campo de numero si es 0
      else if(column.field === 'cantidadAuditoria') {
        return value === 0 ? '0' : value;
      }
      return String(value || '');
    }),
  );

  // Configurar la tabla
  doc.autoTable({
    head: [columns.map((column) => column.headerName)],
    body: tableData,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [63, 81, 181],
      textColor: 255,
      fontSize: 8,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 80, left: 5 },

    didDrawPage: (data: any) => {
      if (data.pageNumber === 1) {
        // Agregar logo de la empresa
        const logoWidth = 20; // Ajusta el ancho del logo
        const logoHeight = 20; // Ajusta el alto del logo
        const logoX = doc.internal.pageSize.width - logoWidth - 10; // Posición X del logo
        const logoY = 10; // Posición Y del logo
        doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
        // Agregar título
        doc.setFontSize(15);
        doc.text(titleDocument, doc.internal.pageSize.width / 2, 45, {
          align: 'center',
        });
        // Agregar texto debajo del logo
        doc.setFontSize(7);
        doc.text('Sistema de Incidencia de Activos', logoX - 7, logoY + logoHeight + 3);
        // Agregar el N de reporte
        doc.setFontSize(8);
        doc.text(`Nº DE REPORTE: ${generateReportNumber()}`, 5, 55);
        // Agregar fecha de exportación
        const fecha = new Date().toLocaleString();
        doc.setFontSize(8);
        doc.text(`FECHA DE EXPORTACIÓN: ${fecha}`, 5, 60);
        // Agregar la area encargada
        doc.setFontSize(8);
        doc.text(`OFICINA: ${capitalizeWords(user?.oficina || 'Vacío')}`, 5, 65);
        // Agregar fecha de exportación
        doc.setFontSize(8);
        doc.text(
          `ENCARGADO: ${capitalizeWords(user?.nombre?.concat(' ', user?.apellidos || '') || 'Vacío')}`,
          5,
          70,
        );
        // Agregar fecha de exportación
        doc.setFontSize(8);
        doc.text(`ASUNTO: ${asunto}`, 5, 75);
      } else {
        // Ajustar el margen superior para las páginas siguientes
        data.settings.margin.top = 10;
      }
    },
    startY: 80, // Ajustar el inicio de la tabla
  });

  doc.save(`${fileName}.pdf`);
};

// función para exportar a excel
export const exportToExcel = (
  apiRef: React.MutableRefObject<GridApi>,
  allRows: GridRowsProp,
  columns: ExportColumn[],
  fileName: string = 'incidencias',
  exportType: ExportType = 'all',
) => {
  // Obtener las filas según el filtro
  const rowsToExport = getRowsToExport(apiRef, allRows, exportType);
  // Crear el objeto de libro de trabajo
  const wb = XLSX.utils.book_new();

  // Preparar los datos para Excel
  const excelData = [
    columns.map((col) => col.headerName),
    ...rowsToExport.map((row) =>
      columns.map((col) => {
        const value = row[col.field];
        // Manejo especial para el campo solucionadoText
        if (col.field === 'solucionadoText') {
          return value === 'Si' ? 'Si' : 'No';
        }
        return value;
      }),
    ),
  ];

  // Crear la hoja de trabajo
  const ws = XLSX.utils.aoa_to_sheet(excelData);

  // Ajustar el ancho de las columnas basado en el contenido
  const colWidths = columns.map(() => ({ wch: 15 }));
  ws['!cols'] = colWidths;

  // Agregar la hoja al libro
  XLSX.utils.book_append_sheet(wb, ws, 'Incidencias');

  // Guardar el archivo
  XLSX.writeFile(wb, `${fileName}-${new Date().toISOString().split('T')[0]}.xlsx`);
};
