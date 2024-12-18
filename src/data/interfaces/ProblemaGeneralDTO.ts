export interface ProblemaGeneralDTO {
    idProblemaGeneral?: number;
    idActivoMaestro?: number;
    codigoProblemaGeneral?: string;
    codigoBien?: string;
    nombreActivo?: string;
    tipoActivo?: string;
    nombreEmpleado?: string;
    nombreUsuario?: string;
    idUsuario?: number;
    fechaOcurrencia?: string | null;
    fechaActual?: Date | null;
    cantidadDetalleProblema?: string;
    problemaGeneralDTOList?: ProblemaGeneralDTO[];
}