# 🚀 Guía de Supabase: De la Nube al Desarrollo Local

Este documento resume nuestro viaje de aprendizaje con Supabase, cubriendo la configuración inicial, la gestión de la base de datos con migraciones y la conexión con un frontend de React.

---

## 1. ¿Qué es Supabase?

Supabase es una plataforma de **Backend como Servicio (BaaS)** de código abierto, una alternativa a Firebase. Nos proporciona instantáneamente:

- Una base de datos **PostgreSQL**.
- Un sistema de **Autenticación**.
- APIs automáticas.
- Almacenamiento de archivos.

Esto nos permite construir un backend robusto sin tener que escribir el código del servidor desde cero.

---

## 2. Arquitectura: Frontend y Backend Separados

Un concepto clave que establecimos es la **Separación de Responsabilidades**.

- **Frontend (Nuestra app en Docker):** Se encarga de la interfaz de usuario.
- **Backend (Supabase):** Se encarga de los datos y la lógica de negocio.

Ambos viven en **repositorios de código juntos (Monorepo)** para facilitar el desarrollo sincronizado, pero se despliegan en **servicios y contenedores separados** en producción para garantizar escalabilidad, seguridad y flexibilidad.

---

## 3. Nuestro Viaje de Aprendizaje: Paso a Paso

### Fase 1: Configuración del Proyecto en la Nube

1.  **Creación:** Creamos un nuevo proyecto en **supabase.com** desde el dashboard.
2.  **Credenciales:** Guardamos de forma segura la **contraseña de la base de datos** generada durante la creación.
3.  **Instalación de la CLI:** Instalamos la Command Line Interface (CLI) como una dependencia de desarrollo en nuestro proyecto para poder gestionarlo desde la terminal:
    ```bash
    npm install supabase --save-dev
    ```

### Fase 2: Conexión Local-Nube

Conectamos nuestra carpeta local con el proyecto remoto de Supabase.

1.  **Login:** Autenticamos la CLI con nuestra cuenta de Supabase.
    ```bash
    npx supabase login
    ```
2.  **Link:** Enlazamos la carpeta actual con el proyecto remoto usando su ID de referencia.
    ```bash
    npx supabase link --project-ref <ID_DE_TU_PROYECTO>
    ```
    - Esto crea la carpeta `supabase/` en nuestro proyecto, que debe ser versionada con Git.

### Fase 3: Gestión de la Base de Datos con Migraciones

Aprendimos a modificar la estructura de nuestra base de datos de forma profesional.

1.  **¿Por qué migraciones?** En lugar de hacer cambios con clics en la web, las migraciones son archivos de código SQL que actúan como un `git commit` para la base de datos. Son versionables, compartibles y reproducibles.
2.  **Crear una nueva migración:**
    ```bash
    npx supabase migrations new <nombre_descriptivo_del_cambio>
    ```
    - Ejemplo: `npx supabase migrations new create_notes_table`
    - Esto crea un archivo `.sql` en la carpeta `supabase/migrations/`.
3.  **Escribir la migración:** Editamos el archivo `.sql` para definir los cambios. En nuestro caso, para crear la tabla `notes`:
    ```sql
    create table public.notes (
        id bigserial primary key,
        created_at timestamp with time zone default now() not null,
        title text
    );
    ```
4.  **Aplicar la migración:** "Empujamos" los cambios a la base de datos remota.
    ```bash
    npx supabase db push
    ```

### Fase 4: Conexión del Frontend con Supabase

Hicimos que nuestra aplicación React pudiera leer y escribir en la base de datos.

1.  **Instalar el Cliente JS:** Añadimos la librería cliente de Supabase al proyecto.
    ```bash
    yarn add @supabase/supabase-js
    ```
2.  **Obtener Credenciales de API:** Desde el dashboard de Supabase (Settings > API), obtuvimos la **URL del Proyecto** y la **Clave Pública Anónima (`anon key`)**.
3.  **Guardar Credenciales de Forma Segura:** Añadimos estas claves a nuestro archivo `.env`, que está ignorado por Git.
    ```
    VITE_SUPABASE_URL="URL_AQUI"
    VITE_SUPABASE_ANON_KEY="ANON_KEY_AQUI"
    ```
4.  **Crear el Cliente Centralizado:** Creamos un archivo (`src/lib/supabaseClient.ts`) para inicializar y exportar el cliente de Supabase, leyéndolo desde las variables de entorno.
5.  **Interactuar desde React:** Usamos el cliente importado en nuestro componente `App.tsx` para:
    - **Leer datos:** `const { data, error } = await supabase.from('notes').select('*')`
    - **Escribir datos:** `const { error } = await supabase.from('notes').insert({ title: 'Nueva nota' })`

¡Y con esto, logramos una aplicación full-stack básica y bien arquitecturada!

---

## 5. Flujo de Desarrollo "Local-First" con Docker

Una vez que entendemos los conceptos básicos, el siguiente paso es adoptar un flujo de trabajo profesional que no dependa de la nube para el desarrollo diario.

- **El Concepto "Local-First":** En lugar de que nuestra aplicación de desarrollo apunte a la base de datos remota de Supabase, recreamos todo el stack de Supabase (Base de Datos, Autenticación, etc.) en nuestra máquina local usando **contenedores de Docker**.

- **¿Cómo funciona?**

  1.  La **Supabase CLI** tiene la capacidad de usar Docker para levantar una versión local de la plataforma.
  2.  Nuestro `docker-compose.yml` se actualiza para incluir no solo nuestro servicio de frontend, sino también todos los servicios que componen Supabase (PostgreSQL, GoTrue, Kong, etc.).
  3.  El desarrollador trabaja en un entorno **100% local, offline y aislado**.

- **Ventajas:**

  - **Velocidad:** Los cambios y pruebas son instantáneos.
  - **Aislamiento:** No hay miedo de "romper" la base de datos compartida en la nube.
  - **Desarrollo Offline:** No se necesita conexión a internet.
  - **Costo Cero:** No se utilizan los recursos del plan en la nube durante el desarrollo.

- **El Flujo:**
  1.  Se desarrollan nuevas características y se crean migraciones contra la base de datos local de Docker.
  2.  Una vez que la característica está completa y probada localmente, se "empujan" las nuevas migraciones a la base de datos remota con `npx supabase db push`.
