# Guía Completa: Supabase Local con Docker

Esta guía te lleva paso a paso para levantar y usar Supabase en tu máquina local, integrarlo con tu frontend y alternar fácilmente entre entorno local y nube. Ideal para desarrollo profesional y aprendizaje profundo.

---

## 1. ¿Por qué usar Supabase local?

- **Desarrollo sin internet**: Trabaja sin depender de la nube.
- **Velocidad**: Cambios y pruebas instantáneas.
- **Seguridad**: Tus datos y claves nunca salen de tu máquina.
- **Simulación real**: Es una réplica exacta del entorno de producción.

---

## 2. Requisitos previos

- **Docker Desktop** instalado y corriendo.
- **Node.js** y **npm/yarn** instalados.
- **Supabase CLI** instalada globalmente (preferible con Scoop en Windows):

```powershell
scoop install supabase
```

---

## 3. Inicializar Supabase en tu proyecto

Desde la raíz de tu proyecto, ejecuta:

```bash
supabase init
```

Esto crea una carpeta `supabase/` con la configuración local y (opcionalmente) `.vscode/settings.json` para Deno.

---

## 4. Levantar Supabase local

Arranca todos los servicios (Postgres, Auth, Storage, Studio, etc.) con:

```bash
supabase start
```

- La **primera vez** descargará imágenes de Docker (puede tardar varios minutos).
- Te mostrará URLs y claves importantes:
  - API URL: `http://127.0.0.1:54321`
  - Studio: `http://127.0.0.1:54323` (panel de control local)
  - DB URL: `postgresql://...`
  - anon key y service_role key: para conectar tu app

---

## 5. Migraciones: Infraestructura como código

Supabase gestiona la estructura de la base de datos con archivos `.sql` en `supabase/migrations/`.

- Para aplicar migraciones a la base de datos local:

```bash
npx supabase db push --local
```

- Si la base de datos local se corrompe o quieres empezar de cero:

```bash
supabase stop --no-backup
supabase start
npx supabase db push --local
```

---

## 6. Variables de entorno para alternar entre local y nube

Crea dos archivos en la raíz del proyecto:

- `.env.local` (para Supabase local):

```env
VITE_SUPABASE_URL=http://host.docker.internal:54321
VITE_SUPABASE_ANON_KEY=<tu_anon_key_local>
```

- `.env.cloud` (para Supabase en la nube):

```env
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<tu_anon_key_nube>
```

En `docker-compose.yml`, usa:

```yaml
env_file:
  - ${ENV_FILE:-.env.local}
```

Así, por defecto usas local. Para cambiar a nube:

```powershell
set ENV_FILE=.env.cloud && docker-compose --profile development up --build
```

---

## 7. Integración con tu frontend (React, etc.)

- El frontend debe leer las variables de entorno (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
- Usa `host.docker.internal` en vez de `localhost` para que el contenedor de la app pueda comunicarse con Supabase local.

---

## 8. Panel de control local (Studio)

Abre en tu navegador:

```
http://127.0.0.1:54323
```

Aquí puedes ver y editar tablas, usuarios, políticas RLS, etc., igual que en la nube.

---

## 9. Problemas comunes y soluciones

- **No se encuentra el comando `supabase`:**
  - Cierra y abre una nueva terminal tras instalar la CLI.
  - Verifica que `scoop` esté en tu PATH.
- **Error de permisos (`Access is denied`)**:
  - Asegúrate de estar en la carpeta de tu proyecto, no en `C:\Windows\System32`.
- **Conflicto de contenedores Docker:**
  - Si ves `is already in use by container`, elimina el contenedor huérfano:
    ```bash
    docker rm -f <nombre_del_contenedor>
    ```
- **Migraciones no se aplican:**
  - Usa siempre el flag `--local` para asegurarte de que actúas sobre la base local.
- **El frontend no conecta a Supabase local:**
  - Usa `host.docker.internal` en vez de `localhost` en las variables de entorno.

---

## 10. Tips avanzados

- Puedes alternar entre entornos con scripts en `package.json`:

```json
"scripts": {
  "dev:local": "docker-compose --profile development up --build",
  "dev:cloud": "set ENV_FILE=.env.cloud && docker-compose --profile development up --build"
}
```

- Para reiniciar todo desde cero:
  1. `supabase stop --no-backup`
  2. `supabase start`
  3. `npx supabase db push --local`

---

## 11. Recursos útiles

- [Documentación oficial Supabase CLI](https://supabase.com/docs/guides/cli)
- [Solución de problemas en Windows](https://supabase.com/docs/guides/local-development/cli/getting-started?platform=windows)
- [Supabase Studio local](http://127.0.0.1:54323)

---

¡Listo! Ahora tienes un entorno Supabase local profesional, rápido y seguro para desarrollar como un pro. 🚀
