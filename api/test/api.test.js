import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import app from "../src/app.js";
import { CrearJuegoDTO, ActualizarJuegoDTO } from "../src/dtos/juego.dto.js";
import { Juego } from "../src/models/juego.model.js";
import { validarCrearJuego } from "../src/validators/juego.validator.js";

async function withServer(application, run) {
  const server = application.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();

  try {
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

test("GET /health responde 200 y muestra la versión SemVer", async () => {
  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("x-api-version"), "1.0.0");
    assert.deepEqual(body, {
      estado: "ok",
      version: "1.0.0",
      servicio: "api-videojuegos",
    });
  });
});

test("CrearJuegoDTO limpia espacios, estandariza y descarta campos maliciosos", () => {
  const dto = new CrearJuegoDTO({
    titulo: "  The Legend of Zelda: Tears of the Kingdom  ",
    genero: "  Aventura  ",
    plataforma: "  Nintendo  ",
    horasJugadas: "45",
    completado: true,
    cheatCode: "infinite_rupees",
    esAdmin: true,
  });

  assert.deepEqual({ ...dto }, {
    titulo: "The Legend of Zelda: Tears of the Kingdom",
    genero: "aventura",
    plataforma: "nintendo",
    horasJugadas: 45,
    completado: true,
  });
  assert.equal("cheatCode" in dto, false);
  assert.equal("esAdmin" in dto, false);
});

test("ActualizarJuegoDTO incluye únicamente los campos enviados para modificar", () => {
  const dto = new ActualizarJuegoDTO({
    horasJugadas: 60,
    completado: true,
  });

  assert.deepEqual({ ...dto }, {
    horasJugadas: 60,
    completado: true,
  });
  assert.equal("titulo" in dto, false);
  assert.equal("plataforma" in dto, false);
});

test("validarCrearJuego rechaza datos inválidos con estado 400 y lista de errores", async () => {
  const validationApp = express();
  validationApp.use(express.json());
  validationApp.post("/juegos", validarCrearJuego, (req, res) => {
    res.status(201).json({ data: new CrearJuegoDTO(req.body) });
  });

  await withServer(validationApp, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/juegos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo: "X",
        genero: "arcade_invalido",
        plataforma: "atari_invalida",
        horasJugadas: -10,
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.ok(Array.isArray(body.errores));
    assert.ok(body.errores.length >= 4);
  });
});

test("POST /api/v1/juegos crea un videojuego y escribe la cookie de última plataforma", async (t) => {
  t.mock.method(Juego, "create", async (datos) => ({
    _id: "66d8f21a654321abcdef1234",
    ...datos,
  }));

  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/juegos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo: "Elden Ring",
        genero: "rpg",
        plataforma: "pc",
        horasJugadas: 110,
        completado: true,
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.data.titulo, "Elden Ring");
    assert.equal(body.data.plataforma, "pc");
    assert.match(response.headers.get("set-cookie"), /ultimaPlataforma=pc/);
  });
});

test("GET /api/v1/juegos lista el catálogo de videojuegos", async (t) => {
  t.mock.method(Juego, "find", () => ({
    sort: async () => [
      {
        _id: "66d8f21a654321abcdef1234",
        titulo: "Hollow Knight",
        genero: "aventura",
        plataforma: "pc",
      },
    ],
  }));

  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/juegos`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.data.length, 1);
    assert.equal(body.data[0].titulo, "Hollow Knight");
  });
});

test("GET /api/v1/juegos/:id obtiene un videojuego por su ID", async (t) => {
  t.mock.method(Juego, "findById", async () => ({
    _id: "66d8f21a654321abcdef1234",
    titulo: "Super Mario Odyssey",
    genero: "plataformas",
    plataforma: "nintendo",
  }));

  await withServer(app, async (baseUrl) => {
    const response = await fetch(
      `${baseUrl}/api/v1/juegos/66d8f21a654321abcdef1234`
    );
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.data.titulo, "Super Mario Odyssey");
  });
});

test("PATCH /api/v1/juegos/:id actualiza parcialmente un videojuego", async (t) => {
  t.mock.method(Juego, "findByIdAndUpdate", async (id, datos) => ({
    _id: id,
    titulo: "Cyberpunk 2077",
    genero: "rpg",
    plataforma: "pc",
    horasJugadas: datos.horasJugadas ?? 30,
    completado: datos.completado ?? false,
  }));

  await withServer(app, async (baseUrl) => {
    const response = await fetch(
      `${baseUrl}/api/v1/juegos/66d8f21a654321abcdef1234`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ horasJugadas: 85, completado: true }),
      }
    );
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.data.horasJugadas, 85);
    assert.equal(body.data.completado, true);
  });
});

test("DELETE /api/v1/juegos/:id elimina un videojuego", async (t) => {
  t.mock.method(Juego, "findByIdAndDelete", async (id) => ({ _id: id }));

  await withServer(app, async (baseUrl) => {
    const response = await fetch(
      `${baseUrl}/api/v1/juegos/66d8f21a654321abcdef1234`,
      { method: "DELETE" }
    );

    assert.equal(response.status, 204);
    assert.equal(await response.text(), "");
  });
});

test("GET /api/v1/preferencia consulta la cookie de última plataforma", async () => {
  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/preferencia`, {
      headers: { Cookie: "ultimaPlataforma=nintendo" },
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, { ultimaPlataforma: "nintendo" });
  });
});
