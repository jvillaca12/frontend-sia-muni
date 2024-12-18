export interface AuditoriaDTO {
    idAuditoria?: number;
    codigoProblema?: string;
    tipoMantenimiento?: string;
    fechaRealizada?: string;
    personal?: string;
    idMantenimiento?: number;
    fechaCambio: string;
    cambioRealizado?: string;
    fechaActual?: Date;
}