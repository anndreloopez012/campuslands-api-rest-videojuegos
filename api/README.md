# API REST de Videojuegos · Game Vault · CRUD MVC de 30 minutos

Este proyecto acompaña la web didáctica de refuerzo para Campuslands. Diseñado para completarse en **30 minutos**, con una arquitectura MVC limpia, aditiva (sin reescrituras innecesarias) y enfocada en buenas prácticas de desarrollo backend con Node.js, Express y MongoDB.

---

## 🎯 Objetivo de Aprendizaje
Comprender y construir el ciclo de vida completo de una petición HTTP en una API REST profesional:

```text
Cliente → Ruta → Validación → Controlador → DTO → Servicio → Modelo → MongoDB
```

La respuesta realiza el camino inverso hasta llegar al cliente como un documento JSON con los headers correspondientes (`X-API-Version`, `Set-Cookie`).

---

## 📦 Estructura del Proyecto API

```text
api/
├── package.json                    # Dependencias y scripts
├── README.md                       # Guía de la API y comandos cURL
├── src/
│   ├── app.js                      # Configuración de Express, middlewares y rutas
│   ├── server.js                   # Conexión a MongoDB y arranque del servidor
│   ├── controllers/
│   │   └── juego.controller.js     # Controlador HTTP (req, res, cookie)
│   ├── dtos/
│   │   └── juego.dto.js            # DTOs de creación y actualización con sanitización
│   ├── middlewares/
│   │   └── error.middleware.js     # Manejador centralizado de errores y 404
│   ├── models/
│   │   └── juego.model.js          # Modelo Mongoose (Schema de Videojuego)
│   ├── routes/
│   │   └── juego.routes.js         # Definición de rutas RESTful
│   ├── services/
│   │   └── juego.service.js        # Lógica de acceso a datos con Mongoose
│   └── validators/
│       └── juego.validator.js      # Validaciones declarativas con express-validator
└── test/
    └── api.test.js                 # 10 pruebas automatizadas sin base de datos activa
```

---

## 🚀 Cómo Ejecutar la API

### 1. Requisitos
- Node.js 20 o superior.
- MongoDB activo en `mongodb://127.0.0.1:27017` (o variable `MONGO_URI`).

### 2. Instalación y Ejecución
```bash
# Entrar a la carpeta api
cd api

# Instalar dependencias (solo la primera vez)
npm install

# Iniciar en modo normal
npm start

# O iniciar en modo desarrollo con recarga automática
npm run dev
```

La API estará escuchando en `http://localhost:3000`. MongoDB creará automáticamente la base de datos `api_juegos_clase` al insertar el primer videojuego.

---

## 🎮 Mapa de Endpoints RESTful

| Método | Endpoint | Acción | Código Éxito |
|---|---|---|---|
| `GET` | `/health` | Chequeo de salud y versión SemVer | `200 OK` |
| `POST` | `/api/v1/juegos` | Registrar un nuevo videojuego en el catálogo | `201 Created` |
| `GET` | `/api/v1/juegos` | Listar catálogo (filtro opcional `?plataforma=&genero=`) | `200 OK` |
| `GET` | `/api/v1/juegos/:id` | Consultar detalle de un juego por su ObjectId | `200 OK` (o `404`) |
| `PATCH` | `/api/v1/juegos/:id` | Actualizar parcialmente campos de un juego | `200 OK` (o `404`) |
| `DELETE` | `/api/v1/juegos/:id` | Eliminar un juego del catálogo | `204 No Content` (o `404`) |
| `GET` | `/api/v1/preferencia` | Consultar la cookie de la última plataforma jugada | `200 OK` |

---

## 🧪 Pruebas Manuales con cURL

### 1. Diagnóstico de Salud y SemVer
```bash
curl -i http://localhost:3000/health
```
*Respuesta esperada:* `200 OK`, header `X-API-Version: 1.0.0` y cuerpo:
```json
{
  "estado": "ok",
  "version": "1.0.0",
  "servicio": "api-videojuegos"
}
```

### 2. Registrar un Videojuego (POST) y Guardar Cookie
```bash
curl -i -X POST http://localhost:3000/api/v1/juegos \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "titulo": "Elden Ring",
    "genero": "rpg",
    "plataforma": "pc",
    "horasJugadas": 110,
    "completado": true,
    "cheatCode": "infinite_runes"
  }'
```
- `-i`: Muestra headers (observa `Set-Cookie: ultimaPlataforma=pc`).
- `-c cookies.txt`: Almacena la cookie enviada por el servidor.
- El campo `cheatCode` es descartado automáticamente por el `CrearJuegoDTO`.

### 3. Probar Validaciones (POST Inválido)
```bash
curl -i -X POST http://localhost:3000/api/v1/juegos \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "X",
    "genero": "arcade",
    "plataforma": "sega",
    "horasJugadas": -10
  }'
```
*Respuesta esperada:* `400 Bad Request` con un array `errores` detallando qué campos fallaron.

### 4. Listar Videojuegos (GET)
```bash
curl -i http://localhost:3000/api/v1/juegos
```
Copia el `_id` de uno de los juegos creados para las siguientes pruebas:

### 5. Consultar un Videojuego por ID (GET :id)
```bash
ID="PEGA_AQUÍ_EL_ID_DEL_JUEGO"
curl -i http://localhost:3000/api/v1/juegos/$ID
```

### 6. Actualizar Parcialmente (PATCH :id)
```bash
curl -i -X PATCH http://localhost:3000/api/v1/juegos/$ID \
  -H "Content-Type: application/json" \
  -d '{"horasJugadas": 150, "completado": true}'
```
Solo actualiza las horas y el estado completado; el título, plataforma y género permanecen intactos.

### 7. Consultar Preferencia Guardada en Cookie (GET)
```bash
curl -i -b cookies.txt http://localhost:3000/api/v1/preferencia
```
- `-b cookies.txt`: Reenvía la cookie guardada en el paso 2. El servidor responde `{ "ultimaPlataforma": "pc" }`.

### 8. Eliminar un Videojuego (DELETE :id)
```bash
curl -i -X DELETE http://localhost:3000/api/v1/juegos/$ID
```
*Respuesta esperada:* `204 No Content` sin cuerpo.

---

## ⚡ Verificación Automatizada

Para ejecutar la suite completa de 10 pruebas unitarias y de integración sin depender de una base de datos activa:

```bash
npm test
```

Para verificar sintaxis en todos los archivos:
```bash
npm run check
```
