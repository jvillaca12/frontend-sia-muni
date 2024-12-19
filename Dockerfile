# Etapa 1: Construcción del proyecto
FROM node:20-alpine AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración y dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Generar el build de producción
RUN npm run build

# Etapa 2: Servir la aplicación con un servidor ligero
FROM nginx:stable-alpine

# Copiar los archivos del build al servidor de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando por defecto para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]