import express from "express";
import cookieParser from "cookie-parser";
import { juegoRouter } from "./routes/juego.routes.js";
import {
  manejarError,
  rutaNoEncontrada,
} from "./middlewares/error.middleware.js";

const API_VERSION = "1.0.0";
const app = express();

app.use(express.json());
app.use(cookieParser());

// Header global de versionado SemVer
app.use((req, res, next) => {
  res.set("X-API-Version", API_VERSION);
  next();
});

// Endpoint de diagnóstico de salud y versión
app.get("/health", (req, res) => {
  res.status(200).json({
    estado: "ok",
    version: API_VERSION,
    servicio: "api-videojuegos",
  });
});

// Endpoint para leer la cookie de preferencia
app.get("/api/v1/preferencia", (req, res) => {
  res.json({
    ultimaPlataforma: req.cookies.ultimaPlataforma ?? null,
  });
});

// Rutas CRUD de videojuegos
app.use("/api/v1/juegos", juegoRouter);

// Manejo de errores
app.use(rutaNoEncontrada);
app.use(manejarError);

export default app;
