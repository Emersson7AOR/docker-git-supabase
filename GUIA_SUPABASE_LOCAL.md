# Guía Completa: Supabase Local con Docker

Esta guía te lleva paso a paso para levantar y usar Supabase en tu máquina local, integrarlo con tu frontend y alternar fácilmente entre entorno local y nube. Ideal para desarrollo profesional y aprendizaje profunda.

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

## 6. Seguridad: RLS y Políticas como migraciones

**¡Clave para entornos profesionales!**

- Las políticas de seguridad (RLS) que configuras en la nube NO se aplican automáticamente en local.
- Para que tu entorno local y la nube sean idénticos y seguros, debes agregar las políticas como migraciones SQL.

### Ejemplo de migración para RLS y políticas de usuario

Crea un archivo `.sql` en `supabase/migrations/` (por ejemplo, `20250701_enable_rls_and_policies.sql`):

```sql
-- Activa RLS en la tabla notes
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Permite que cada usuario solo vea sus propias notas
CREATE POLICY "Solo ver mis notas"
  ON notes
  FOR SELECT
  USING (user_id = auth.uid());

-- Permite que cada usuario solo inserte/actualice/borré sus propias notas
CREATE POLICY "Solo modificar mis notas"
  ON notes
  FOR ALL
  USING (user_id = auth.uid());
```

Luego aplica la migración:

```bash
npx supabase db push --local
```

**¡Así te aseguras de que la seguridad es igual en todos los entornos!**

---

## 7. Variables de entorno para alternar entre local y nube

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

## 8. Automatización con scripts en package.json

Agrega estos scripts para automatizar el flujo:

```json
"scripts": {
  "dev:local": "docker-compose --profile development up --build",
  "dev:cloud": "set ENV_FILE=.env.cloud && docker-compose --profile development up --build",
  "stop": "docker-compose down"
}
```

### ¿Qué hace cada script?

- **dev:local**: Levanta la app usando Supabase local (por defecto).
- **dev:cloud**: Cambia a entorno nube y levanta la app.
- **stop**: Detiene y elimina los contenedores de Docker Compose.

**¿Cómo los usas?**

- Para local: `yarn dev:local`
- Para nube: `yarn dev:cloud`
- Para detener: `yarn stop`

---

## 9. Integración con tu frontend (React, etc.)

- El frontend debe leer las variables de entorno (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
- Usa `host.docker.internal` en vez de `localhost` para que el contenedor de la app pueda comunicarse con Supabase local.

---

## 10. Panel de control local (Studio)

Abre en tu navegador:

```
http://127.0.0.1:54323
```

Aquí puedes ver y editar tablas, usuarios, políticas RLS, etc., igual que en la nube.

---

## 11. Problemas comunes y soluciones

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
- **RLS/políticas no aplicadas:**
  - Asegúrate de tener las políticas como migraciones SQL y de aplicar las migraciones tras reiniciar la base de datos.

---

## 12. Buenas prácticas y checklist final

- **Siempre versiona tus migraciones y políticas.**
- **Automatiza el flujo con scripts.**
- **Verifica la seguridad en local antes de desplegar.**
- **Usa Studio local para depurar y probar.**
- **Alterna entre entornos solo con scripts, nunca editando archivos a mano.**

---

## 13. Recursos útiles

- [Documentación oficial Supabase CLI](https://supabase.com/docs/guides/cli)
- [Solución de problemas en Windows](https://supabase.com/docs/guides/local-development/cli/getting-started?platform=windows)
- [Supabase Studio local](http://127.0.0.1:54323)

---

¡Listo! Ahora tienes un entorno Supabase local profesional, seguro, automatizado y reproducible. 🚀
