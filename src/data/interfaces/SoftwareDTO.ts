export interface SoftwareDTO {
    nombre: string;
    version: string;
    fechaInstalacion: Date;
    fechaVencimientoLicencia: Date;
    nombreProveedor: string;
    nombreEmpleado: string;
    cantidadIncidencias: number;
    porcentajeIncidencias: number;
    softwareDTOList: SoftwareDTO[];
}