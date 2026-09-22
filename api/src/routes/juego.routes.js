import { Router } from "express";
import {
  crearJuego,
  listarJuegos,
  obtenerJuego,
  actualizarJuego,
  eliminarJuego,
} from "../controllers/juego.controller.js";
import {
  validarCrearJuego,
  validarActualizarJuego,
  validarJuegoId,
} from "../validators/juego.validator.js";

export const juegoRouter = Router();

juegoRouter.post("/", validarCrearJuego, crearJuego);
juegoRouter.get("/", listarJuegos);
juegoRouter.get("/:id", validarJuegoId, obtenerJuego);
juegoRouter.patch("/:id", validarJuegoId, validarActualizarJuego, actualizarJuego);
juegoRouter.delete("/:id", validarJuegoId, eliminarJuego);
