import { Schema, model } from "mongoose";

const juegoSchema = new Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60,
    },
    genero: {
      type: String,
      required: true,
      enum: ["accion", "rpg", "aventura", "estrategia", "plataformas"],
    },
    plataforma: {
      type: String,
      required: true,
      enum: ["pc", "playstation", "xbox", "nintendo"],
    },
    horasJugadas: {
      type: Number,
      default: 0,
      min: 0,
    },
    completado: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Juego = model("Juego", juegoSchema);
