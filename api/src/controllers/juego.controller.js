import { CrearJuegoDTO, ActualizarJuegoDTO } from "../dtos/juego.dto.js";
import { juegoService } from "../services/juego.service.js";

export async function crearJuego(req, res, next) {
  try {
    const datos = new CrearJuegoDTO(req.body);
    const juego = await juegoService.crear(datos);

    res.cookie("ultimaPlataforma", juego.plataforma, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(201).json({ data: juego });
  } catch (error) {
    next(error);
  }
}

export async function listarJuegos(req, res, next) {
  try {
    const filtro = {};
    if (req.query.plataforma) filtro.plataforma = req.query.plataforma.toLowerCase();
    if (req.query.genero) filtro.genero = req.query.genero.toLowerCase();

    const juegos = await juegoService.listar(filtro);
    res.json({ data: juegos });
  } catch (error) {
    next(error);
  }
}

export async function obtenerJuego(req, res, next) {
  try {
    const juego = await juegoService.buscarPorId(req.params.id);
    if (!juego) {
      return res.status(404).json({ error: "Videojuego no encontrado" });
    }
    res.json({ data: juego });
  } catch (error) {
    next(error);
  }
}

export async function actualizarJuego(req, res, next) {
  try {
    const datos = new ActualizarJuegoDTO(req.body);
    if (Object.keys(datos).length === 0) {
      return res.status(400).json({ error: "Debes enviar al menos un campo válido para actualizar" });
    }

    const juego = await juegoService.actualizar(req.params.id, datos);
    if (!juego) {
      return res.status(404).json({ error: "Videojuego no encontrado" });
    }

    res.json({ data: juego });
  } catch (error) {
    next(error);
  }
}

export async function eliminarJuego(req, res, next) {
  try {
    const juego = await juegoService.eliminar(req.params.id);
    if (!juego) {
      return res.status(404).json({ error: "Videojuego no encontrado" });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
