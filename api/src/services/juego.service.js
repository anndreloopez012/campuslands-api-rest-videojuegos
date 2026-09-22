import { Juego } from "../models/juego.model.js";

export const juegoService = {
  async crear(datos) {
    return Juego.create(datos);
  },

  async listar(filtro = {}) {
    return Juego.find(filtro).sort({ createdAt: -1 });
  },

  async buscarPorId(id) {
    return Juego.findById(id);
  },

  async actualizar(id, datos) {
    return Juego.findByIdAndUpdate(id, datos, {
      new: true,
      runValidators: true,
    });
  },

  async eliminar(id) {
    return Juego.findByIdAndDelete(id);
  },
};
