export interface PrioridadDTO {
    id?: number;
    nombre?: string; 
    cantidadLeve?: number;
    cantidadGrave?: number;
    cantidadCritico?: number;
    listAllPrioridad?: PrioridadDTO[];
 }