export interface UsuarioDTO { // Definir la interfaz para UsuarioDTO
    idUsuario?: number;
    nombre?: string;
    apellidos?: string;
    userName?: string;
    password?: string;
    correo?: string;
    rolId?: number;
    oficinaSubgerenciaId?: number;
    rol?: string;
    oficina?: string
    statusCode?: number;
    message?: string;
    estado?: boolean;
    cantidadProblemasRegistrados?: number;
    cantidadDetalleProblemas?: number;
    estadoText?: string;
}  