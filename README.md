# Campuslands · API REST de Videojuegos (Game Vault)

Ejercicio visual y guiado de **30 minutos** para reforzar los fundamentos de Node.js y Express mediante la construcción de un CRUD completo de videojuegos con arquitectura MVC, DTOs, validaciones con `express-validator`, persistencia en MongoDB con Mongoose, cookies HTTP y versionado SemVer.

**Autor:** Andre Lopez

**Guía publicada:** [anndreloopez012.github.io/campuslands-api-rest-videojuegos](https://anndreloopez012.github.io/campuslands-api-rest-videojuegos/)

---

## 🎮 ¿Qué incluye este repositorio?

- **Guía web interactiva responsive** con estética Gamer / Cyber y soporte para modo proyector en clase.
- **Flujo aditivo optimizado (30 min)**: los archivos se crean directamente en su versión definitiva, evitando que los estudiantes se queden sin tiempo por reescribir `app.js` o `server.js` múltiples veces.
- **API REST funcional** con operaciones completas: Crear, Listar, Detalle por ID, Actualizar parcialmente y Eliminar.
- **DTOs de seguridad**: filtrado y descarte automático de campos no autorizados (como `cheatCode` o `esAdmin`).
- **Validaciones declarativas** con `express-validator` para tipo de datos, longitudes y enums permitidos.
- **Arquitectura MVC desacoplada** (Rutas, Controladores, Servicios, Modelos, DTOs y Middlewares).
- **Persistencia en MongoDB** mediante esquemas de Mongoose con timestamps automáticos.
- **Cookies HTTP seguras** (`HttpOnly`, `SameSite=Lax`) para registrar la última plataforma jugada.
- **Versionado SemVer** comunicado a través del encabezado `X-API-Version` y ruta `/health`.
- **Simulador visual interactivo** integrado en la web para probar peticiones y respuestas en vivo sin salir del navegador.
- **10 pruebas automatizadas** nativas con `node:test` (sin dependencias externas pesadas).

---

## 🎯 Objetivo del Ejercicio

Al finalizar la sesión, el estudiante comprenderá y podrá explicar el ciclo de vida completo de una petición HTTP en una API backend:

```text
Cliente → Ruta → Validación → Controlador → DTO → Servicio → Modelo → MongoDB
```

La respuesta realiza el camino inverso hasta llegar al cliente como un documento JSON con los headers correspondientes (`X-API-Version`, `Set-Cookie`).

---

## ⏱️ Ruta de Aprendizaje de 30 Minutos

| Checkpoint | Tema | Resultado |
|---|---|---|
| **00** | Misión y Setup | Reconocer la estructura de carpetas y `package.json` |
| **01** | Express & SemVer | Servidor Express, header `X-API-Version` y `/health` |
| **02** | DTO Gamer | Filtrado seguro y sanitización con `CrearJuegoDTO` y `ActualizarJuegoDTO` |
| **03** | Validaciones | Detener peticiones incorrectas con `express-validator` (400 Bad Request) |
| **04** | Modelo & Servicio | Schema de Mongoose y operaciones CRUD centralizadas |
| **05** | Controlador, Rutas y Cookies | Ensamblar endpoints RESTful y escribir cookie de última plataforma |
| **06** | Pruebas & Terminal | Suite de 10 pruebas automatizadas (`node --test`) y cURL |

El cronómetro interactivo de 30 minutos se encuentra disponible en la barra superior de la guía web.

---

## 📂 Estructura del Repositorio

```text
campuslands-api-rest-videojuegos/
├── index.html                      # Guía web interactiva para el estudiante
├── styles.css                      # Estilos con diseño gamer/cyber y modo enfoque
├── app.js                          # Lógica del simulador, cronómetro y persistencia
├── README.md                       # Documentación principal del laboratorio
├── LICENSE                         # Licencia MIT
├── .gitignore                      # Exclusiones de Git
├── .nojekyll                       # Despliegue en GitHub Pages
├── AGENTS.md                       # Reglas multi-agente (Graphify/Obsidian)
├── CLAUDE.md                       # Instrucciones para Claude Code
└── api/
    ├── package.json                # Dependencias y scripts de Node.js
    ├── README.md                   # Documentación técnica de la API y cURL
    ├── src/
    │   ├── app.js                  # Configuración de Express, middlewares y rutas
    │   ├── server.js               # Conexión a MongoDB y arranque del servidor
    │   ├── controllers/
    │   │   └── juego.controller.js # Controlador HTTP (req, res, cookie)
    │   ├── dtos/
    │   │   └── juego.dto.js        # DTOs con filtrado estricto
    │   ├── middlewares/
    │   │   └── error.middleware.js # Manejador centralizado de errores y 404
    │   ├── models/
    │   │   └── juego.model.js      # Modelo Mongoose (Schema de Videojuego)
    │   ├── routes/
    │   │   └── juego.routes.js     # Definición de rutas RESTful
    │   ├── services/
    │   │   └── juego.service.js    # Lógica de persistencia con Mongoose
    │   └── validators/
    │       └── juego.validator.js  # Validaciones con express-validator
    └── test/
        └── api.test.js             # 10 pruebas automatizadas con mocks
```

---

## 🏛️ Responsabilidad de cada Capa

| Capa | Responsabilidad |
|---|---|
| **Routes** | Asocia método HTTP y URL con sus validaciones y controlador |
| **Validators** | Comprueba formatos, longitudes y enums permitidos (`express-validator`) |
| **Controllers** | Recibe `req`, coordina el flujo, escribe cookies y entrega `res` |
| **DTO** | Extrae y sanitiza únicamente los campos autorizados del body |
| **Services** | Centraliza las consultas a la base de datos |
| **Models** | Define el esquema y tipos de la colección en MongoDB (`Mongoose`) |
| **Middlewares** | Captura errores no controlados y rutas 404 de manera consistente |

En esta API REST, la **Vista** del patrón MVC es el documento JSON enviado al cliente.

---

## 💻 Requisitos

- **Node.js:** 20 o superior.
- **MongoDB:** Instancia local o remota en `mongodb://127.0.0.1:27017`.
- **Navegador Web:** Chrome, Firefox, Safari o Edge.

---

## 🌐 Ejecutar la Guía Web

Para visualizar la guía interactiva en local:

```bash
python3 -m http.server 4173
```

Abre en tu navegador `http://127.0.0.1:4173`.

> [!NOTE]
> La guía también puede publicarse directamente en **GitHub Pages**. Su simulador funciona completamente en el navegador con memoria local.

---

## ⚙️ Ejecutar la API Backend

```bash
cd api
npm install
npm start
```

Para activar la recarga automática en desarrollo:
```bash
npm run dev
```

La API estará escuchando en `http://localhost:3000`. MongoDB creará la base de datos `api_juegos_clase` de forma automática al insertar el primer videojuego.

---

## 📋 Endpoints de la API

| Método | Endpoint | Acción | Código Éxito |
|---|---|---|---|
| `GET` | `/health` | Chequeo de salud y versión SemVer | `200 OK` |
| `POST` | `/api/v1/juegos` | Registrar un nuevo videojuego | `201 Created` |
| `GET` | `/api/v1/juegos` | Listar catálogo (con filtros opcionales) | `200 OK` |
| `GET` | `/api/v1/juegos/:id` | Consultar detalle de un juego por su ID | `200 OK` (o `404`) |
| `PATCH` | `/api/v1/juegos/:id` | Actualizar parcialmente un juego | `200 OK` (o `404`) |
| `DELETE` | `/api/v1/juegos/:id` | Eliminar un juego del catálogo | `204 No Content` (o `404`) |
| `GET` | `/api/v1/preferencia` | Consultar cookie de última plataforma | `200 OK` |

---

## 🕹️ Formato del Recurso Videojuego

```json
{
  "titulo": "Elden Ring",
  "genero": "rpg",
  "plataforma": "pc",
  "horasJugadas": 110,
  "completado": true
}
```

- **Plataformas válidas:** `pc`, `playstation`, `xbox`, `nintendo`.
- **Géneros válidos:** `accion`, `rpg`, `aventura`, `estrategia`, `plataformas`.

---

## 🧪 Pruebas Manuales con cURL

### 1. Registrar un videojuego y recibir cookie
```bash
curl -i -X POST http://localhost:3000/api/v1/juegos \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"titulo":"Elden Ring","genero":"rpg","plataforma":"pc","horasJugadas":110,"completado":true}'
```

### 2. Probar rechazo de validaciones
```bash
curl -i -X POST http://localhost:3000/api/v1/juegos \
  -H "Content-Type: application/json" \
  -d '{"titulo":"X","genero":"invalido","plataforma":"sega","horasJugadas":-10}'
```

### 3. Listar juegos
```bash
curl -i http://localhost:3000/api/v1/juegos
```

### 4. Consultar cookie guardada
```bash
curl -i -b cookies.txt http://localhost:3000/api/v1/preferencia
```

---

## ✅ Verificación Automatizada

Ejecuta las 10 pruebas unitarias con mocks:
```bash
cd api
npm test
```

Verifica la sintaxis de todos los archivos:
```bash
npm run check
```
