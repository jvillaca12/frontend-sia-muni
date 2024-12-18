export interface HardwareDTO {
    nombre: string;
    marca: string;
    modelo: string;
    nombreProveedor: string;
    nombreEmpleado: string;
    cantidadIncidencias: number;
    porcentajeIncidencias: number;
    hardwareDTOList: HardwareDTO[];
}