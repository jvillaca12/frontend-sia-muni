export interface RedDTO {
    tipRed: string;
    direccionIP: string;
    nombreProveedor: string;
    nombreEmpleado: string;
    oficinaGerencia: string;
    piso: number;
    cantidadIncidencias: number;
    porcentajeIncidencias: number;
    infraestructuraRedDTOList: RedDTO[];
}