# Protocolo Multi-Agente - Campuslands API REST Videojuegos

Este repositorio forma parte de los proyectos de formación de Campuslands y utiliza el protocolo de sincronización continua con Obsidian Vault y Graphify para colaboración entre agentes (Antigravity, Codex y Claude Code).

---

## 1. Arquitectura y Tecnologías
- **Entorno:** Node.js 20+ con ES Modules (`"type": "module"` en `package.json`).
- **Framework & Librerías:**
  - Express 5.x para enrutamiento y middleware.
  - Mongoose 8.x para modelado de datos y persistencia en MongoDB.
  - express-validator 7.x para validación y sanitización de entrada en peticiones HTTP.
  - cookie-parser para lectura y escritura de cookies HTTP.
  - SemVer mediante encabezado `X-API-Version` y diagnóstico `/health`.
  - Node.js test runner nativo (`node:test` y `node:assert/strict`) para pruebas sin librerías externas pesadas.
- **Frontend Educativo:**
  - Guía web estática interactiva (`index.html`, `styles.css`, `app.js`) compatible con GitHub Pages.
  - Simulador de peticiones HTTP en vivo, cronómetro de 30 minutos y control de checkpoints.
- **Estructura:**
  - `api/src/app.js`: Configuración de Express, middlewares y rutas.
  - `api/src/server.js`: Conexión a MongoDB y escucha en puerto 3000.
  - `api/src/dtos/`: DTOs para creación y actualización con filtrado seguro.
  - `api/src/validators/`: Reglas de validación con express-validator.
  - `api/src/models/`: Modelos de Mongoose (`videojuego`).
  - `api/src/services/`: Operaciones de persistencia y consultas.
  - `api/src/controllers/`: Coordinación de peticiones, respuestas y cookies.
  - `api/src/routes/`: Declaración de endpoints RESTful.
  - `api/src/middlewares/`: Middleware de errores centralizado y 404.

---

## 2. Protocolo de Memoria Continua (Obsidian + Graphify)
Al realizar cambios en este repositorio, los agentes deben cumplir estrictamente:

1. **Inspección Previa:**
   - Ejecutar `git status --short` antes de modificar archivos.
2. **Actualización de Grafo y Memoria:**
   - Actualizar el grafo: `graphify update .` o `graphify .`.
   - Exportar a Obsidian:
     ```bash
     graphify export obsidian --dir "$HOME/Documents/OBSIDIAN/PROGRAMACION/Graphify/campuslands-api-rest-videojuegos"
     ```
   - Sincronizar memoria: `memoria refresh`.
   - Registrar validaciones o decisiones:
     ```bash
     memoria registrar campuslands-api-rest-videojuegos --tipo [aprendizaje|decision|cambio|validacion] --titulo "..." --texto "..."
     ```
3. **Flujo de Ramas Git:**
   - Trabajo estructurado en ramas `dev` y `main`.
   - Ramas de características (`feature/*`) integradas a `dev`.
   - La rama `main` conserva la versión estable sincronizada y lista para despliegue.
