export class CrearJuegoDTO {
  constructor(data) {
    this.titulo = data.titulo?.trim();
    this.genero = data.genero?.trim().toLowerCase();
    this.plataforma = data.plataforma?.trim().toLowerCase();
    this.horasJugadas = Number(data.horasJugadas ?? 0);
    this.completado = Boolean(data.completado ?? false);
  }
}

export class ActualizarJuegoDTO {
  constructor(data) {
    if (data.titulo !== undefined) this.titulo = data.titulo?.trim();
    if (data.genero !== undefined) this.genero = data.genero?.trim().toLowerCase();
    if (data.plataforma !== undefined) this.plataforma = data.plataforma?.trim().toLowerCase();
    if (data.horasJugadas !== undefined) this.horasJugadas = Number(data.horasJugadas);
    if (data.completado !== undefined) this.completado = Boolean(data.completado);
  }
}
