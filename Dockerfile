# ==================================
# ETAPA 1: El Constructor (Builder)
# ==================================
# Usamos una imagen de Node completa para tener todas las herramientas (yarn, etc.)
FROM node:18-alpine AS builder

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos primero la lista de dependencias para aprovechar la caché de Docker
COPY package.json yarn.lock ./

# Instalamos las dependencias
RUN yarn install --frozen-lockfile

# Ahora copiamos todo el resto del código fuente
COPY . .

# ¡El paso clave! Construimos la aplicación para producción.
# Esto crea la carpeta /app/dist con los archivos optimizados.
RUN yarn build


# ===================================
# ETAPA 2: El Servidor Final (Server)
# ===================================
# Empezamos desde una base completamente nueva y súper ligera de Nginx
FROM nginx:alpine

# ¡LA MAGIA! Copiamos solo la carpeta 'dist' desde la etapa 'builder'
# al directorio donde Nginx sirve los archivos.
COPY --from=builder /app/dist /usr/share/nginx/html

# Le decimos a Docker que el contenedor usará el puerto 80
EXPOSE 80

# El comando por defecto que inicia el servidor Nginx
CMD ["nginx", "-g", "daemon off;"] 