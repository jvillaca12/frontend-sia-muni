// componente de Material-UI que actúa como un contenedor flexible.
import { Box, BoxProps } from '@mui/material';

// componente que permite renderizar iconos de la biblioteca Iconify.
import { Icon, IconProps } from '@iconify/react';

// se define una interface que extiende de BoxProps, siginfica que hereda todas las propieades y metodos
interface IconifyProps extends BoxProps {
  icon: IconProps['icon']; // adicionalmente agrega una nueva propiedad de tipo icon
}

// creado un componete que recibe los parametros de un icono, ancho, alto y el resto de propiedades (...)
const IconifyIcon = ({ icon, width, height, ...rest }: IconifyProps) => {
  // retorna un componente de tipo Box que recibe un componente de tipo Icon, con las propiedades del icono, ancho y alto
  return <Box component={Icon as React.ElementType} icon={icon} width={width} height={height} {...rest} />;
};

// exporta el componente IconifyIcon
export default IconifyIcon;
