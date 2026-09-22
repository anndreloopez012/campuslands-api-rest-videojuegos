import { body, param, validationResult } from "express-validator";

const responderErrores = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
};

export const GENEROS_VALIDOS = ["accion", "rpg", "aventura", "estrategia", "plataformas"];
export const PLATAFORMAS_VALIDAS = ["pc", "playstation", "xbox", "nintendo"];

export const validarCrearJuego = [
  body("titulo")
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage("El título debe tener entre 2 y 60 caracteres"),
  body("genero")
    .trim()
    .toLowerCase()
    .isIn(GENEROS_VALIDOS)
    .withMessage(`El género debe ser uno de: ${GENEROS_VALIDOS.join(", ")}`),
  body("plataforma")
    .trim()
    .toLowerCase()
    .isIn(PLATAFORMAS_VALIDAS)
    .withMessage(`La plataforma debe ser una de: ${PLATAFORMAS_VALIDAS.join(", ")}`),
  body("horasJugadas")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Las horas jugadas deben ser un número entero mayor o igual a 0"),
  body("completado")
    .optional()
    .isBoolean()
    .withMessage("El estado completado debe ser un valor booleano"),
  responderErrores,
];

export const validarActualizarJuego = [
  body("titulo")
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage("El título debe tener entre 2 y 60 caracteres"),
  body("genero")
    .optional()
    .trim()
    .toLowerCase()
    .isIn(GENEROS_VALIDOS)
    .withMessage(`El género debe ser uno de: ${GENEROS_VALIDOS.join(", ")}`),
  body("plataforma")
    .optional()
    .trim()
    .toLowerCase()
    .isIn(PLATAFORMAS_VALIDAS)
    .withMessage(`La plataforma debe ser una de: ${PLATAFORMAS_VALIDAS.join(", ")}`),
  body("horasJugadas")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Las horas jugadas deben ser un número entero mayor o igual a 0"),
  body("completado")
    .optional()
    .isBoolean()
    .withMessage("El estado completado debe ser un valor booleano"),
  responderErrores,
];

export const validarJuegoId = [
  param("id")
    .isMongoId()
    .withMessage("El id del videojuego no es un ObjectId de MongoDB válido"),
  responderErrores,
];
