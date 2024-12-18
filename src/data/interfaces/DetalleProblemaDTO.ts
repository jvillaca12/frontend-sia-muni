export interface DetalleProblemaDTO {
  idDetalleProblema?: number;
  idProblemaGeneral?: number;
  codigoProblema?: string;
  codigoProblemaGeneral?: string;
  descripcion?: string;
  fechaRegistro?: string | null;
  fechaActual?: Date | null;
  medioReporte?: string;
  solucion?: string;
  codigoBien?: string;
  nombreActivo?: string;
  tipoActivo?: string;
  nombreEmpleado?: string;
  categoriaId?: number;
  categoria?: string;
  prioridadId?: number;
  prioridad?: string;
  usuarioId?: number;
  solucionado?: boolean;
  solucionadoText?: string;
  nombreUsuario?: string;
}
