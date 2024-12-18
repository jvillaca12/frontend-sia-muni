export interface ProveedorDTO {
    nombre: string;
    contacto: string;
    telefono: string;
    cantidadIncidencias: number;
    porcentajeIncidencia: number;
    proveedorDTOList: ProveedorDTO[];
}