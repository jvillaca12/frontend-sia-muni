export interface ActivoGeneralDTO {
    id?: number;
    codigoBien?: string;
    nombreActivo?: string;
    tipoActivo?: string;
    proveedor?: string;
    cantidadFI?: number;
    porcentajeFI?: number;
    activoMaestroDTOList?: ActivoGeneralDTO[];
}