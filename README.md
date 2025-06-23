# 🚀 Practica1-Inicio - React + TypeScript + Vite

Este proyecto es parte del **Plan de Aprendizaje** para dominar Docker, Supabase, GitHub Actions y crear una integración completa.

## 📚 Plan de Aprendizaje

### 🐳 PROYECTO 1: Docker ✅

- ✅ Crear proyecto simple
- ✅ Aprender Dockerfile
- ✅ Docker Compose
- ✅ Entender contenedores

### 🔥 PROYECTO 2: Supabase (Próximo)

- [ ] Crear proyecto en Supabase Cloud
- [ ] Supabase CLI local
- [ ] Base de datos
- [ ] Autenticación

### ⚡ PROYECTO 3: GitHub Actions (Próximo)

- [ ] Repositorio simple
- [ ] Workflows básicos
- [ ] Automatización
- [ ] Secrets y variables

### 🎯 PROYECTO 4: Integración completa (Próximo)

- [ ] Volver a Covadonga
- [ ] Integrar todo lo aprendido
- [ ] Configuración profesional

## 🐳 Docker - Instrucciones de Uso

### Desarrollo Local

```bash
# Iniciar entorno de desarrollo con Docker
docker-compose --profile dev up

# La aplicación estará disponible en: http://localhost:5173
# Hot reload activado - los cambios se reflejan automáticamente
```

### Producción

```bash
# Construir y ejecutar versión de producción
docker-compose --profile prod up --build

# La aplicación estará disponible en: http://localhost:80
```

### Con Base de Datos

```bash
# Ejecutar con PostgreSQL (para futuras integraciones)
docker-compose --profile full up

# PostgreSQL estará en: localhost:5432
```

### Comandos Útiles

```bash
# Ver contenedores ejecutándose
docker ps

# Ver logs
docker-compose logs

# Parar servicios
docker-compose down

# Limpiar recursos
docker system prune
```

## 🛠️ Desarrollo Local (Sin Docker)

```bash
# Instalar dependencias
yarn install

# Iniciar servidor de desarrollo
yarn dev

# Construir para producción
yarn build

# Preview de producción
yarn preview
```

## 📁 Estructura del Proyecto

```
practica1-inicio/
├── src/                    # Código fuente React
├── public/                 # Archivos públicos
├── Dockerfile             # Docker para producción
├── Dockerfile.dev         # Docker para desarrollo
├── docker-compose.yml     # Orquestación de servicios
├── nginx.conf            # Configuración de Nginx
├── .dockerignore         # Archivos ignorados por Docker
└── docker-commands.md    # Guía de comandos Docker
```

## 🎓 Conceptos Docker Aprendidos

- ✅ **Dockerfile**: Instrucciones para crear imágenes
- ✅ **Multi-stage build**: Optimización de tamaño
- ✅ **Docker Compose**: Orquestación de servicios
- ✅ **Volumes**: Persistencia de datos
- ✅ **Ports**: Exposición de puertos
- ✅ **Profiles**: Diferentes configuraciones
- ✅ **Nginx**: Servidor web para producción

## 🚀 Próximos Pasos

1. **Practicar comandos Docker** - Usar `docker-commands.md`
2. **Experimentar con diferentes configuraciones**
3. **Probar con diferentes servicios**
4. **Avanzar al PROYECTO 2: Supabase**

---

💡 **Consejo**: Empieza con aplicaciones simples, usa `docker run` y `docker-compose up`, practica con diferentes servicios.

¡Nos vemos en el PROYECTO 2! 🎯

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
# docker-git-supabase
