export interface MantenimientoDTO {
    idMantenimiento?: number;
    idDetalleProblema?: number;
    codigoProblema?: string;
    fechaActual?: Date;
    fechaNext?: Date;
    fechaProgramada?: string | null;
    tipoMantenimiento?: string;
    tipoMantenimientoId?: number;
    personal?: string;
    personalId?: number;
    nombreActivo?: string;
    descripcion?: string;
    fechaRegistro?: string | null;
    fechaRealizada?: string | null;
    notas?: string | null;
    cantidadAuditoria?: number;
}