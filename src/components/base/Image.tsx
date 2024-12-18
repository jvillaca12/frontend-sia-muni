// componente de Material-UI que actúa como un contenedor flexible
import { Box, SxProps } from '@mui/material';

// incluye todas las propiedades estándar de un elemento <img> en HTML.
import { ImgHTMLAttributes } from 'react';

/* Extiende ImgHTMLAttributes<HTMLImageElement>. Esto significa que ImageProps incluye todas las 
propiedades estándar de un elemento <img>, como src, alt, width, height, etc. */
interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  sx?: SxProps; // permite aplicar estilos personalizados utilizando el sistema de estilos de Material-UI
}

// componente funcional que recibe propiedades de tipo ImageProps <img> 
const Image = ({ src, alt, sx, ...rest }: ImageProps) => (
  // retorna una caja con un elemento <img> como componente base con las propiedades recibidas
  <Box component="img" src={src} alt={alt} sx={sx} {...rest} />
);

export default Image;
