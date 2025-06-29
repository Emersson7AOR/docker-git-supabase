# 🚀 Guía Definitiva de Docker: De Cero a Profesional

Este documento resume nuestro viaje de aprendizaje con Docker, cubriendo los conceptos fundamentales, las mejores prácticas y los flujos de trabajo para desarrollo y colaboración en equipo.

---

## 1. ¿Por Qué Docker? El Problema que Resolvemos

Antes de Docker, el mayor problema en el desarrollo era el famoso: **"¡En mi computadora sí funciona!"**. Esto ocurría porque el entorno de un desarrollador (su sistema operativo, las versiones de sus herramientas, etc.) era diferente al de su compañero o al del servidor de producción.

Docker soluciona esto empaquetando una aplicación y **todas sus dependencias y configuraciones** en una unidad estandarizada y portable: el **Contenedor**.

- **Consistencia:** Tu aplicación corre igual en cualquier lugar.
- **Portabilidad:** Compartes una "caja" que funciona, no una lista de instrucciones de instalación.
- **Aislamiento:** Los contenedores no interfieren entre sí ni con tu sistema operativo principal.

---

## 2. Los 3 Conceptos Clave de Docker

### A. El `Dockerfile`: La Receta 📜

Es un archivo de texto con las instrucciones paso a paso para construir una Imagen.

**Ejemplo (`Dockerfile-simple` para desarrollo):**

```dockerfile
# Usa una imagen base con Node.js ya instalado
FROM node:18-alpine

# Crea y entra a una carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copia la lista de "ingredientes" (dependencias)
COPY package.json yarn.lock ./

# Instala los ingredientes
RUN yarn install

# Copia el resto del código
COPY . .

# Expone un puerto para comunicación externa
EXPOSE 5173

# El comando que se ejecutará al iniciar el contenedor
CMD ["yarn", "dev", "--host", "0.0.0.0"]
```

### B. La Imagen: El Molde o Pastel Congelado 📦

Es el **resultado** de ejecutar un `Dockerfile`. Es un paquete **inmóvil, de solo lectura y portable** que contiene todo lo necesario para que tu aplicación corra.

- **Se construye con:** `docker build -t nombre-de-la-imagen .`
- **Es la plantilla universal** de tu aplicación.

### C. El Contenedor: La Aplicación Corriendo 🏃

Es una **instancia viva y en ejecución de una Imagen**. Es un proceso real, aislado, que consume CPU y RAM.

- **Se inicia con:** `docker run` o `docker-compose up`.
- Puedes crear **muchos contenedores idénticos** desde **una sola imagen**.

---

## 3. Nuestro Viaje de Aprendizaje: Paso a Paso

### Fase 1: Entorno de Desarrollo

Creamos un sistema para desarrollar cómodamente.

1.  **`Dockerfile-simple`:** Una receta para un entorno con Node.js y hot-reload.
2.  **`docker build -t mi-app-simple -f Dockerfile-simple .`:** Construimos la imagen para desarrollo. Pesada (~2.5GB) pero llena de herramientas útiles.
3.  **`docker-compose.yml` (inicial):** Creamos un "lanzador" para iniciar fácilmente nuestro contenedor de desarrollo, mapeando puertos y volúmenes para la sincronización de código.

### Fase 2: Optimización para Producción con Multi-Etapa

Preparamos la aplicación para el mundo real.

1.  **La Necesidad:** El entorno de desarrollo es muy grande y lento para producción. Necesitamos una versión ligera y optimizada.
2.  **`Dockerfile` (de producción):** Creamos un Dockerfile con **dos etapas**:
    - **Etapa 1 (`AS builder`):** Usa una imagen de `node` para instalar dependencias y ejecutar `yarn build`, generando la carpeta `dist`.
    - **Etapa 2 (Final):** Empieza desde una imagen nueva y limpia de `nginx` y **copia únicamente la carpeta `dist`** desde la etapa anterior.
3.  **`docker build -t mi-app-prod .`:** Construimos la imagen de producción. El resultado fue una imagen diminuta (~74MB), ¡una reducción de más del 97%!

### Fase 3: Gestión de Múltiples Entornos

Unificamos el manejo de ambos entornos.

1.  **Perfiles en `docker-compose.yml`:** Modificamos el `docker-compose.yml` para definir ambos servicios (`dev` y `prod`) y les asignamos `profiles` (`development` y `production`).
2.  **Comandos con Perfil:**
    - `docker-compose --profile development up`: Levanta solo el desarrollo.
    - `docker-compose --profile production up`: Levanta solo la producción.
3.  **Separación de Responsabilidades:** Refinamos el `docker-compose.yml` para usar `image:` en lugar de `build:`. Así, Docker Compose solo se dedica a arrancar contenedores desde las imágenes que nosotros construimos manualmente.

### Fase 4: Manejo de Configuración y Secretos

Hicimos nuestro sistema configurable sin exponer información sensible.

1.  **Archivo `.env`:** Creamos un archivo para guardar nuestras variables de entorno (como títulos, claves de API, etc.).
2.  **Archivo `.gitignore`:** Le dijimos a Git que **ignore** el archivo `.env` para nunca subirlo a un repositorio. ¡Paso de seguridad crucial!
3.  **Archivo `env.example`:** Creamos una plantilla para que otros desarrolladores sepan qué variables configurar.
4.  **`env_file` en `docker-compose.yml`:** Le indicamos a Docker Compose que inyecte las variables del archivo `.env` en el contenedor en el momento del arranque.

### Fase 5: Limpieza Definitiva

5.  `docker-compose up`: Levanta el entorno con una configuración limpia y precisa.

---

## 4. Flujo de Trabajo para Equipos (La Guía para "Juan")

Este es el proceso para que un nuevo desarrollador se una al proyecto.

### A. Configuración Inicial (El Primer Día)

**Requisitos:** Git y Docker Desktop.

1.  **Clonar:** `git clone <URL_DEL_PROYECTO>`
2.  **Entrar a la Carpeta:** `cd <NOMBRE_DEL_PROYECTO>`
3.  **Crear su `.env`:** `copy env.example .env` (y modificarlo si es necesario).
4.  **Construir y Levantar:** `docker-compose --profile development up --build`

### B. Añadir una Nueva Dependencia

1.  **Ejecutar `docker-compose up`:** Asegurarse de que el contenedor de desarrollo esté corriendo.
2.  **Abrir una SEGUNDA terminal.**
3.  **Instalar dentro del contenedor:** `docker-compose exec dev yarn add <nombre-dependencia>`
4.  **Subir los cambios a Git:** `git add package.json yarn.lock && git commit -m "Mensaje" && git push`

### C. Recibir una Actualización con Nuevas Dependencias

1.  **Descargar cambios:** `git pull`
2.  **Detener contenedores:** `docker-compose down` (si están corriendo).
3.  **Reconstruir la imagen** (porque la "receta" de `package.json` cambió): `docker build -f Dockerfile-simple -t mi-app-simple .`
4.  **Levantar el entorno actualizado:** `docker-compose --profile development up`

---

## 5. Hoja de Comandos Esenciales (Cheat Sheet)

- `docker build -t <nombre> .`: Construye una imagen desde un `Dockerfile`.
- `docker build -t <nombre> -f <archivo> .`: Construye una imagen desde un Dockerfile específico.
- `docker images`: Lista todas las imágenes en tu máquina.
- `docker rmi <nombre-imagen>`: Elimina una imagen.
- `docker ps`: Lista los contenedores que están corriendo.
- `docker ps -a`: Lista todos los contenedores (corriendo y detenidos).
- `docker-compose up`: Inicia los servicios definidos en `docker-compose.yml`.
- `docker-compose --profile <perfil> up`: Inicia solo los servicios de un perfil.
- `docker-compose down`: Detiene y elimina los contenedores, redes y volúmenes creados por `up`.
- `docker-compose exec <servicio> <comando>`: Ejecuta un comando dentro de un contenedor que ya está corriendo.

---

## 6. Resolución de Problemas Avanzados: El Conflicto de `node_modules`

Durante nuestro desarrollo, nos encontramos con un error persistente: `Failed to resolve import`. Este es un problema muy común y la solución revela un concepto clave sobre los volúmenes de Docker.

- **El Problema:** La directiva `volumes: - .:/app` en `docker-compose.yml` es muy conveniente, pero puede causar conflictos. Monta **toda** tu carpeta de proyecto local encima de la carpeta `/app` del contenedor. Al hacer esto, la carpeta `node_modules` de tu sistema anfitrión (Windows) "aplasta" a la carpeta `node_modules` interna y optimizada del contenedor, que fue creada durante el `docker build`. Inconsistencias entre el sistema de archivos del anfitrión y el del contenedor pueden causar que los módulos no se resuelvan correctamente.

- **La Solución Robusta:** En lugar de montar toda la carpeta, montamos **explícitamente solo los archivos y carpetas que necesitamos para el hot-reload**. De esta manera, forzamos al contenedor a usar **siempre su propia carpeta `node_modules` interna**, que está garantizado que es correcta.

**Configuración de volúmenes modificada en `docker-compose.yml`:**

```yaml
volumes:
  # Montamos explícitamente solo lo que necesitamos para el hot-reload.
  # Esto evita conflictos con la carpeta node_modules del contenedor.
  - ./src:/app/src
  - ./public:/app/public
  - ./index.html:/app/index.html
  - ./vite.config.ts:/app/vite.config.ts
  # ... y otros archivos de configuración necesarios.
```

- **El Proceso de Limpieza Definitivo (cuando las cosas van muy mal):**
  1.  `docker-compose down -v`: Detiene todo y **elimina los volúmenes anónimos** (la "mochila fantasma").
  2.  `rm -r -force node_modules` (en el host): Elimina las dependencias locales.
  3.  `yarn install` (en el host): Reinstala las dependencias de forma limpia en el host.
  4.  `docker build ...`: Reconstruye la imagen con las dependencias correctas.
  5.  `docker-compose up`: Levanta el entorno con una configuración limpia y precisa.

---

## 7. Orquestación de Múltiples Servicios (Frontend + Backend)

A medida que nuestro proyecto crece, no solo tenemos un servicio (el frontend), sino un ecosistema completo (frontend, base de datos, autenticación, etc.). Aquí es donde Docker Compose demuestra su verdadero poder como **orquestador**.

- **El Concepto (Microservicios):** En lugar de construir una sola imagen gigante con todo dentro (una mala práctica llamada monolito), creamos imágenes separadas para cada responsabilidad:

  - **Imagen del Cliente (React):** Responsable solo de la UI.
  - **Imagen de la Base de Datos (PostgreSQL):** Responsable solo del almacenamiento.
  - **Imagen de Autenticación (Supabase GoTrue):** Responsable solo de los usuarios.
  - ... y así sucesivamente.

- **El Rol de Docker Compose:** Actúa como el **director de orquesta**. El archivo `docker-compose.yml` define todos estos servicios independientes y cómo se comunican entre sí. Cuando ejecutas `docker-compose up`, levanta todo este ecosistema de contenedores, creando una réplica local y funcional de tu entorno de producción.

- **La Ventaja:** Esta arquitectura de "separación de responsabilidades" permite que los servicios se actualicen, escalen y mantengan de forma independiente, lo cual es la base de las aplicaciones modernas y robustas.
