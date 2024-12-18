export interface IncidenciaActualizarDTO {
  idFallo?: number;
  codigoProblema?: string;
  descripcion?: string;
  fechaOcurrencia?: string | null;
  fechaActual?: Date | null;
  medioReporte?: string;
  solucion?: string;
  activoMaestroId?: number;
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
  nombreUsuario?: string;
  cantidadTotalFallo: number;
}
