const TOTAL_SECONDS = 30 * 60; // 30 minutos de laboratorio
const STORAGE_KEY = "campuslands-api-lab-games-progress";
const GAMES_KEY = "campuslands-api-lab-games-data";
const COOKIE_KEY = "campuslands-api-lab-games-cookie";

const timerDisplay = document.querySelector("#timerDisplay");
const timerToggle = document.querySelector("#timerToggle");
const timerReset = document.querySelector("#timerReset");
const timerContainer = document.querySelector(".timer");
const progressBar = document.querySelector("#progressBar");
const progressLabel = document.querySelector("#progressLabel");
const progressMessage = document.querySelector("#progressMessage");
const finishCard = document.querySelector("#finishCard");
const toast = document.querySelector("#toast");

let secondsRemaining = TOTAL_SECONDS;
let timerId = null;
let toastId = null;
let completedSteps = readStorage(STORAGE_KEY, []);

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // La guía continúa funcionando aunque localStorage esté restringido.
  }
}

function showToast(message) {
  window.clearTimeout(toastId);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastId = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function renderTimer() {
  timerDisplay.textContent = formatTime(secondsRemaining);
  document.title = timerId
    ? `${formatTime(secondsRemaining)} · Game Vault API Lab`
    : "API Lab · Videojuegos (Game Vault)";
}

function pauseTimer() {
  window.clearInterval(timerId);
  timerId = null;
  timerContainer.classList.remove("is-running");
  timerToggle.title = "Continuar cronómetro";
  timerToggle.setAttribute("aria-label", "Continuar cronómetro");
  timerToggle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7z" /></svg>';
  renderTimer();
}

function startTimer() {
  if (timerId || secondsRemaining <= 0) return;
  timerContainer.classList.add("is-running");
  timerToggle.title = "Pausar cronómetro";
  timerToggle.setAttribute("aria-label", "Pausar cronómetro");
  timerToggle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" /></svg>';
  timerId = window.setInterval(() => {
    secondsRemaining -= 1;
    renderTimer();
    if (secondsRemaining === 0) {
      pauseTimer();
      showToast("¡Tiempo! Cierra con la suite de pruebas.");
    }
  }, 1000);
}

timerToggle.addEventListener("click", () => (timerId ? pauseTimer() : startTimer()));
timerReset.addEventListener("click", () => {
  pauseTimer();
  secondsRemaining = TOTAL_SECONDS;
  timerToggle.title = "Iniciar cronómetro";
  timerToggle.setAttribute("aria-label", "Iniciar cronómetro");
  renderTimer();
  showToast("Cronómetro reiniciado a 30:00");
});

document.querySelectorAll("[data-start-lab]").forEach((button) => {
  button.addEventListener("click", () => {
    startTimer();
    document.querySelector("#express").scrollIntoView({ behavior: "smooth" });
  });
});

document.querySelector("#focusToggle").addEventListener("click", (event) => {
  const active = document.body.classList.toggle("focus-mode");
  event.currentTarget.querySelector("span").textContent = active ? "Mostrar ruta" : "Modo enfoque";
  event.currentTarget.setAttribute("aria-pressed", String(active));
});

const TOTAL_CHECKPOINTS = 7;

function updateProgress() {
  completedSteps = [...new Set(completedSteps)].sort((a, b) => a - b);
  const percentage = Math.round((completedSteps.length / TOTAL_CHECKPOINTS) * 100);
  progressBar.style.width = `${percentage}%`;
  progressLabel.textContent = `${percentage}%`;
  progressMessage.textContent = completedSteps.length === TOTAL_CHECKPOINTS
    ? "¡Misión completada! Tienes una API REST robusta y probada."
    : `${completedSteps.length} de ${TOTAL_CHECKPOINTS} misiones completadas.`;

  document.querySelectorAll("[data-complete]").forEach((checkpoint) => {
    const step = Number(checkpoint.dataset.complete);
    const complete = completedSteps.includes(step);
    checkpoint.classList.toggle("is-complete", complete);
    checkpoint.setAttribute("aria-pressed", String(complete));
  });

  document.querySelectorAll("[data-section]").forEach((navItem) => {
    const section = document.querySelector(`#${navItem.dataset.section}`);
    if (section) {
      const step = Number(section.dataset.step);
      navItem.classList.toggle("is-complete", completedSteps.includes(step));
    }
  });

  finishCard.classList.toggle("is-unlocked", completedSteps.length === TOTAL_CHECKPOINTS);
  writeStorage(STORAGE_KEY, completedSteps);
}

document.querySelectorAll("[data-complete]").forEach((checkpoint) => {
  checkpoint.addEventListener("click", () => {
    const step = Number(checkpoint.dataset.complete);
    if (completedSteps.includes(step)) {
      completedSteps = completedSteps.filter((savedStep) => savedStep !== step);
    } else {
      completedSteps.push(step);
      showToast(step === 6 ? "¡Nivel final desbloqueado!" : `Checkpoint ${String(step).padStart(2, "0")} completado (+100 XP)`);
    }
    updateProgress();
  });
});

document.querySelector("[data-reset-progress]").addEventListener("click", () => {
  completedSteps = [];
  updateProgress();
  document.querySelector("#inicio").scrollIntoView({ behavior: "smooth" });
  showToast("Progreso reiniciado");
});

const navItems = [...document.querySelectorAll("[data-section]")];
const lessonSections = [...document.querySelectorAll(".lesson")];
let navigationLocked = false;
let scrollFrame = null;

function setActiveNavigation(sectionId) {
  navItems.forEach((item) => {
    const active = item.dataset.section === sectionId;
    item.classList.toggle("is-active", active);
    if (active) item.setAttribute("aria-current", "step");
    else item.removeAttribute("aria-current");
  });
}

function updateActiveNavigation() {
  if (navigationLocked) return;
  const marker = window.scrollY + window.innerHeight * 0.34;
  let activeSection = lessonSections[0];

  lessonSections.forEach((section) => {
    if (section.offsetTop <= marker) activeSection = section;
  });

  if (activeSection) {
    setActiveNavigation(activeSection.id);
  }
}

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navigationLocked = true;
    setActiveNavigation(item.dataset.section);
    window.setTimeout(() => {
      navigationLocked = false;
      updateActiveNavigation();
    }, 850);
  });
});

window.addEventListener("scroll", () => {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(() => {
    updateActiveNavigation();
    scrollFrame = null;
  });
}, { passive: true });

document.querySelectorAll("[data-copy-code]").forEach((button) => {
  button.addEventListener("click", async () => {
    const code = [...button.closest("[data-code-panel]").querySelectorAll(".code-line > span")]
      .map((line) => {
        const cleanLine = line.cloneNode(true);
        cleanLine.querySelectorAll("small").forEach((comment) => comment.remove());
        return cleanLine.textContent.trimEnd();
      })
      .join("\n");
    try {
      await navigator.clipboard.writeText(code);
      button.textContent = "¡Copiado!";
      showToast("Código copiado al portapapeles");
      window.setTimeout(() => {
        const barSpan = button.closest(".code-panel").querySelector(".code-panel__bar span");
        button.textContent = barSpan && barSpan.textContent.includes("terminal") ? "Copiar comando" : "Copiar código";
      }, 1400);
    } catch {
      showToast("Selecciona el código y usa Ctrl/Cmd + C");
    }
  });
});

const semverExamples = {
  major: "2.0.0 · Cambias el contrato (ej. renombras campos obligatorios) y los clientes anteriores dejan de funcionar.",
  minor: "1.1.0 · Agregas soporte para multijugador o filtros opcionales; la API anterior sigue funcionando perfectamente.",
  patch: "1.0.1 · Corriges un mensaje de validación o un typo interno sin tocar las rutas ni los contratos.",
};

document.querySelectorAll("[data-semver]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector("#semverMessage").textContent = semverExamples[button.dataset.semver];
  });
});

document.querySelectorAll("[data-version-answer]").forEach((button) => {
  button.addEventListener("click", () => {
    const correct = button.dataset.versionAnswer === "1.1.0";
    const feedback = document.querySelector("#versionFeedback");
    feedback.textContent = correct
      ? "✓ ¡Correcto! Añadir una funcionalidad retrocompatible (campo opcional) incrementa MINOR."
      : "✕ Inténtalo de nuevo: no rompe compatibilidad (no es MAJOR) ni es solo un bugfix (no es PATCH).";
    feedback.style.color = correct ? "#10b981" : "#f43f5e";
  });
});

const presets = {
  valid: {
    titulo: "Elden Ring",
    genero: "rpg",
    plataforma: "pc",
    horasJugadas: 110,
    completado: true,
  },
  invalid: {
    titulo: "X",
    genero: "arcade",
    plataforma: "sega",
    horasJugadas: -10,
  },
  extra: {
    titulo: "The Legend of Zelda: Tears of the Kingdom",
    genero: "aventura",
    plataforma: "nintendo",
    horasJugadas: 65,
    completado: false,
    cheatCode: "infinite_rupees",
    esAdmin: true,
  },
  update: {
    horasJugadas: 140,
    completado: true,
  },
};

const methodSelect = document.querySelector("#methodSelect");
const routeSelect = document.querySelector("#routeSelect");
const requestBody = document.querySelector("#requestBody");
const sendRequest = document.querySelector("#sendRequest");
const responseOutput = document.querySelector("#responseOutput");
const responseStatus = document.querySelector("#responseStatus");
const cookieOutput = document.querySelector("#cookieOutput");

document.querySelectorAll("[data-preset]").forEach((button) => {
  button.addEventListener("click", () => {
    const presetKey = button.dataset.preset;
    const isUpdate = presetKey === "update";
    methodSelect.value = isUpdate ? "PATCH" : "POST";
    routeSelect.value = isUpdate ? "/api/v1/juegos/:id" : "/api/v1/juegos";
    requestBody.disabled = false;
    requestBody.value = JSON.stringify(presets[presetKey], null, 2);
  });
});

function syncRequestControls() {
  const route = routeSelect.value;
  const method = methodSelect.value;

  if (["/health", "/api/v1/preferencia"].includes(route)) {
    methodSelect.value = "GET";
  } else if (route === "/api/v1/juegos" && ["PATCH", "DELETE"].includes(method)) {
    methodSelect.value = "GET";
  } else if (route === "/api/v1/juegos/:id" && method === "POST") {
    methodSelect.value = "GET";
  }

  requestBody.disabled = ["GET", "DELETE"].includes(methodSelect.value);
}

routeSelect.addEventListener("change", syncRequestControls);
methodSelect.addEventListener("change", () => {
  if (["PATCH", "DELETE"].includes(methodSelect.value)) {
    routeSelect.value = "/api/v1/juegos/:id";
  } else if (methodSelect.value === "POST") {
    routeSelect.value = "/api/v1/juegos";
  }
  syncRequestControls();
});

const GENEROS_VALIDOS = ["accion", "rpg", "aventura", "estrategia", "plataformas"];
const PLATAFORMAS_VALIDAS = ["pc", "playstation", "xbox", "nintendo"];

function validateGame(body) {
  const errors = [];
  const title = typeof body.titulo === "string" ? body.titulo.trim() : "";
  const genero = typeof body.genero === "string" ? body.genero.trim().toLowerCase() : "";
  const plataforma = typeof body.plataforma === "string" ? body.plataforma.trim().toLowerCase() : "";

  if (title.length < 2 || title.length > 60) {
    errors.push({ type: "field", value: body.titulo, msg: "El título debe tener entre 2 y 60 caracteres", path: "titulo", location: "body" });
  }
  if (!GENEROS_VALIDOS.includes(genero)) {
    errors.push({ type: "field", value: body.genero, msg: `El género debe ser uno de: ${GENEROS_VALIDOS.join(", ")}`, path: "genero", location: "body" });
  }
  if (!PLATAFORMAS_VALIDAS.includes(plataforma)) {
    errors.push({ type: "field", value: body.plataforma, msg: `La plataforma debe ser una de: ${PLATAFORMAS_VALIDAS.join(", ")}`, path: "plataforma", location: "body" });
  }
  if (body.horasJugadas !== undefined && (!Number.isInteger(body.horasJugadas) || body.horasJugadas < 0)) {
    errors.push({ type: "field", value: body.horasJugadas, msg: "Las horas jugadas deben ser un número entero mayor o igual a 0", path: "horasJugadas", location: "body" });
  }
  if (body.completado !== undefined && typeof body.completado !== "boolean") {
    errors.push({ type: "field", value: body.completado, msg: "El estado completado debe ser un valor booleano", path: "completado", location: "body" });
  }
  return errors;
}

function validateGameUpdate(body) {
  const allowed = ["titulo", "genero", "plataforma", "horasJugadas", "completado"];
  const errors = [];
  const sent = allowed.filter((k) => body[k] !== undefined);

  if (sent.length === 0) {
    errors.push({ msg: "Debes enviar al menos un campo válido para actualizar", location: "body" });
  }
  if (body.titulo !== undefined && (typeof body.titulo !== "string" || body.titulo.trim().length < 2 || body.titulo.trim().length > 60)) {
    errors.push({ msg: "El título debe tener entre 2 y 60 caracteres", path: "titulo", location: "body" });
  }
  if (body.genero !== undefined && !GENEROS_VALIDOS.includes(String(body.genero).toLowerCase().trim())) {
    errors.push({ msg: `El género debe ser uno de: ${GENEROS_VALIDOS.join(", ")}`, path: "genero", location: "body" });
  }
  if (body.plataforma !== undefined && !PLATAFORMAS_VALIDAS.includes(String(body.plataforma).toLowerCase().trim())) {
    errors.push({ msg: `La plataforma debe ser una de: ${PLATAFORMAS_VALIDAS.join(", ")}`, path: "plataforma", location: "body" });
  }
  if (body.horasJugadas !== undefined && (!Number.isInteger(body.horasJugadas) || body.horasJugadas < 0)) {
    errors.push({ msg: "Las horas jugadas deben ser un número entero mayor o igual a 0", path: "horasJugadas", location: "body" });
  }
  if (body.completado !== undefined && typeof body.completado !== "boolean") {
    errors.push({ msg: "El estado completado debe ser un valor booleano", path: "completado", location: "body" });
  }
  return errors;
}

function buildResponse() {
  const route = routeSelect.value;
  const method = methodSelect.value;

  if (route === "/health") {
    return { status: 200, body: { estado: "ok", version: "1.0.0", servicio: "api-videojuegos" } };
  }

  if (route === "/api/v1/preferencia") {
    return {
      status: 200,
      body: { ultimaPlataforma: readStorage(COOKIE_KEY, null) },
    };
  }

  if (route === "/api/v1/juegos" && method === "GET") {
    return { status: 200, body: { data: readStorage(GAMES_KEY, []) } };
  }

  if (route === "/api/v1/juegos/:id") {
    const games = readStorage(GAMES_KEY, []);
    const game = games[0];

    if (!game) return { status: 404, body: { error: "Videojuego no encontrado", ayuda: "Crea un juego primero con POST" } };
    if (method === "GET") return { status: 200, body: { data: game } };

    if (method === "DELETE") {
      writeStorage(GAMES_KEY, games.slice(1));
      return { status: 204, body: null };
    }

    if (method === "PATCH") {
      let changes;
      try {
        changes = JSON.parse(requestBody.value);
      } catch {
        return { status: 400, body: { error: "El body no contiene JSON válido" } };
      }

      const errors = validateGameUpdate(changes);
      if (errors.length) return { status: 400, body: { errores: errors } };

      const allowedChanges = {};
      if (changes.titulo !== undefined) allowedChanges.titulo = changes.titulo.trim();
      if (changes.genero !== undefined) allowedChanges.genero = changes.genero.trim().toLowerCase();
      if (changes.plataforma !== undefined) allowedChanges.plataforma = changes.plataforma.trim().toLowerCase();
      if (changes.horasJugadas !== undefined) allowedChanges.horasJugadas = Number(changes.horasJugadas);
      if (changes.completado !== undefined) allowedChanges.completado = Boolean(changes.completado);

      const updatedGame = { ...game, ...allowedChanges, updatedAt: new Date().toISOString() };
      writeStorage(GAMES_KEY, [updatedGame, ...games.slice(1)]);
      return { status: 200, body: { data: updatedGame } };
    }
  }

  let requestData;
  try {
    requestData = JSON.parse(requestBody.value);
  } catch {
    return { status: 400, body: { error: "El body no contiene JSON válido" } };
  }

  const errors = validateGame(requestData);
  if (errors.length) return { status: 400, body: { errores: errors } };

  // DTO logic: sanitizar y descartar campos extra
  const now = new Date().toISOString();
  const newGame = {
    _id: `66d8${Date.now().toString(16).padEnd(20, "0")}`,
    titulo: requestData.titulo.trim(),
    genero: requestData.genero.trim().toLowerCase(),
    plataforma: requestData.plataforma.trim().toLowerCase(),
    horasJugadas: Number(requestData.horasJugadas ?? 0),
    completado: Boolean(requestData.completado ?? false),
    createdAt: now,
    updatedAt: now,
  };

  const games = readStorage(GAMES_KEY, []);
  games.unshift(newGame);
  writeStorage(GAMES_KEY, games);
  writeStorage(COOKIE_KEY, newGame.plataforma);
  return { status: 201, body: { data: newGame } };
}

function escapeHtml(value) {
  return value.replace(/[&<>"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
  })[character]);
}

function highlightJson(data) {
  const safeJson = escapeHtml(JSON.stringify(data, null, 2));
  return safeJson.replace(
    /(&quot;.*?&quot;)(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?/g,
    (match, string, colon) => {
      if (string) return colon
        ? `<span class="console-key">${string}</span>${colon}`
        : `<span class="console-string">${string}</span>`;
      return `<span class="console-number">${match}</span>`;
    },
  );
}

sendRequest.addEventListener("click", () => {
  responseStatus.textContent = "PROCESANDO";
  responseStatus.className = "response-status";
  responseOutput.innerHTML = '<span class="console-muted">// Petición en curso: Ruta → Validación → DTO → Servicio → MongoDB…</span>';
  sendRequest.disabled = true;

  window.setTimeout(() => {
    const response = buildResponse();
    responseStatus.textContent = `${response.status} ${response.status < 400 ? "OK" : "ERROR"}`;
    responseStatus.classList.add(response.status < 400 ? "is-success" : "is-error");
    const bodyOutput = response.status === 204
      ? '<span class="console-muted">// 204 No Content: el videojuego fue eliminado correctamente del catálogo.</span>'
      : highlightJson(response.body);
    responseOutput.innerHTML = `<span class="console-muted">X-API-Version: 1.0.0\nContent-Type: application/json\n\n</span>${bodyOutput}`;
    const cookie = readStorage(COOKIE_KEY, null);
    cookieOutput.textContent = cookie ? `ultimaPlataforma=${cookie}; HttpOnly; SameSite=Lax` : "vacío";
    sendRequest.disabled = false;
  }, 350);
});

const savedCookie = readStorage(COOKIE_KEY, null);
if (savedCookie) cookieOutput.textContent = `ultimaPlataforma=${savedCookie}; HttpOnly; SameSite=Lax`;

updateProgress();
renderTimer();
updateActiveNavigation();
