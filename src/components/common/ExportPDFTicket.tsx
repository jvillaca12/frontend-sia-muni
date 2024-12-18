import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logoBase64 from '../../../src/assets/logo/logo-base64';
import { UsuarioDTO } from 'data/interfaces/UserDTO';
import { capitalizeWords } from 'helpers/capitalizar-palabra';
import { DetalleProblemaDTO } from 'data/interfaces/DetalleProblemaDTO';
import { MantenimientoService } from 'data/services/MantenimientoService';
import { MantenimientoDTO } from 'data/interfaces/MantenimientoDTO';

// función para exportar a TICKET
export const exportToPDFTicket = async (
  fileName: string = 'incidencias',
  user: UsuarioDTO | null,
  detalleProblema: DetalleProblemaDTO,
) => {
  // crear el documento pdf (orientación, unidad, formato)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  let mantenimiento: MantenimientoDTO | null = null;

  // Generar un número de ticket aleatorio de 5 cifras
  const ticketNumber = Math.floor(10000 + Math.random() * 90000);

  // obtener el mantenimiento, si lo tiene
  mantenimiento = (await MantenimientoService.getMantenimientoDetalleProblema(
    detalleProblema.idDetalleProblema || 0,
  )) as MantenimientoDTO;

  // Calcular el tiempo estimado
  let tiempoEstimado = '1 Día';
  if (mantenimiento && mantenimiento.fechaProgramada) {
    const fechaRegistro = new Date(detalleProblema.fechaRegistro || '');
    const fechaProgramada = new Date(mantenimiento.fechaProgramada);
    const diferenciaMilisegundos = fechaProgramada.getTime() - fechaRegistro.getTime();
    const diferenciaDias = Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
    tiempoEstimado = `${diferenciaDias} Días`;
  }

  // Agregar logo de la empresa
  const logoWidth = 20; // Ajusta el ancho del logo
  const logoHeight = 20; // Ajusta el alto del logo
  const logoX = doc.internal.pageSize.width - logoWidth - 10; // Posición X del logo
  const logoY = 5; // Posición Y del logo
  doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);

  const titleDocument = `Ticket de ${capitalizeWords(detalleProblema.categoria || '')}`;
  // Agregar título
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(titleDocument, doc.internal.pageSize.width / 2, 35, {
    align: 'center',
  });

  doc.setFont('helvetica', 'normal');
  // Agregar texto debajo del logo
  doc.setFontSize(7);
  doc.text('Sistema de Incidencia de Activos', logoX - 7, logoY + logoHeight - -2);

  // Agregar información del ticket
  const textLines = [
    `Nº DE TICKET: ${ticketNumber}`,
    `CÓDIGO: ${detalleProblema.codigoProblema}`,
    `NOMBRE DE ACTIVO INFORMÁTICO: ${detalleProblema.nombreActivo}`,
    `DESCRIPCIÓN: ${detalleProblema.descripcion}`,
    `NOMBRE DEL EMPLEADO: ${detalleProblema.nombreEmpleado}`,
    `CATEGORÍA: ${detalleProblema.categoria}`,
    `PRIORIDAD: ${detalleProblema.prioridad}`,
    `FECHA DE OCURRENCIA: ${detalleProblema.fechaRegistro}`,
    `TIEMPO ESTIMADO: ${tiempoEstimado}`,
    `ENCARGADO: ${capitalizeWords(user?.nombre?.concat(' ', user?.apellidos || '') || 'Vacío')}`,
  ];

  doc.setFontSize(10);
  let yPosition = 50; // Posición inicial Y para el texto
  textLines.forEach((line) => {
    const [title, value] = line.split(': ');
    doc.setFont('helvetica', 'bold');
    doc.text(`${title}:`, 10, yPosition);
    const titleWidht = doc.getTextWidth(`${title}:`);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 10 + titleWidht + 2, yPosition);
    yPosition += 10; // Espaciado entre líneas
  });

  if (
    mantenimiento &&
    (mantenimiento.tipoMantenimiento ||
      mantenimiento.fechaProgramada ||
      mantenimiento.notas ||
      mantenimiento.personal ||
      mantenimiento.cantidadAuditoria)
  ) {
    // agregar mas espaciado
    yPosition += 10;
    // Agregar subtítulo "Mantenimiento"
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.text('MANTENIMIENTO', 10, yPosition);
    yPosition += 10;

    // Agregar información del mantenimiento
    const mantenimientoLines = [
      `TIPO MANTENIMIENTO: ${capitalizeWords(mantenimiento?.tipoMantenimiento || 'N/A')}`,
      `FECHA PROGRAMADA: ${mantenimiento?.fechaProgramada || 'N/A'}`,
      `NOTAS: ${mantenimiento?.notas || 'N/A'}`,
      `PERSONAL: ${capitalizeWords(mantenimiento?.personal || 'N/A')}`,
      `CANTIDAD AUDITORIA: ${mantenimiento?.cantidadAuditoria || '0'}`,
    ];

    doc.setFontSize(10);
    mantenimientoLines.forEach((line) => {
      const [title, value] = line.split(': ');
      doc.setFont('helvetica', 'bold');
      doc.text(`${title}:`, 10, yPosition);
      const titleWidth = doc.getTextWidth(`${title}:`);
      const splitValue = doc.splitTextToSize(
        value,
        doc.internal.pageSize.width - 10 - titleWidth - 12,
      );
      doc.setFont('helvetica', 'normal');
      doc.text(splitValue, 10 + titleWidth + 2, yPosition);
      yPosition += 10 * splitValue.length; // Espaciado entre líneas
    });
  }

  doc.save(`${fileName}.pdf`);
};
