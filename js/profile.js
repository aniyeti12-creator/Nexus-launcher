import { GAMES } from "./games.js";

const PROFILE_STORAGE_KEY = "nexus_launcher_profile_v1";

const DEFAULT_PROFILE = {
  username: "NexusPlayer",
  bio: "Explorando el catálogo de Nexus Launcher."
};

export function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    const parsed = JSON.parse(raw);
    return {
      username: typeof parsed.username === "string" && parsed.username.trim()
        ? parsed.username.trim()
        : DEFAULT_PROFILE.username,
      bio: typeof parsed.bio === "string" ? parsed.bio : DEFAULT_PROFILE.bio
    };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveProfile(profile) {
  const clean = {
    username: (profile.username || "").trim() || DEFAULT_PROFILE.username,
    bio: (profile.bio || "").trim()
  };
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(clean));
  } catch {
    // Ignorar errores de almacenamiento si el navegador restringe localStorage
  }
  return clean;
}

export function renderProfileView(contentEl) {
  const profile = loadProfile();
  const totalGames = GAMES.length;
  const favCount = GAMES.filter((game) => game.favorite).length;

  contentEl.innerHTML = `
    <section class="panel profile-panel">
      <div class="profile-top">
        <div class="profile-avatar" aria-hidden="true">
          ${profile.username.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <span class="panel-badge">Jugador · Nexus ID</span>
          <h2 id="profile-display-name" class="panel-heading">${profile.username}</h2>
          <p id="profile-display-bio" class="panel-copy">${profile.bio || "Sin biografía definida."}</p>
        </div>
      </div>

      <div class="profile-stats">
        <div class="stat-box">
          <span class="stat-value">${totalGames}</span>
          <span class="stat-label">Juegos en catálogo</span>
        </div>
        <div class="stat-box">
          <span id="profile-fav-count" class="stat-value">${favCount}</span>
          <span class="stat-label">Favoritos guardados</span>
        </div>
      </div>

      <form id="profile-form" class="profile-form">
        <div class="form-field">
          <label for="profile-username" class="form-label">Nombre de jugador</label>
          <input
            id="profile-username"
            name="username"
            type="text"
            class="form-input"
            maxlength="28"
            value="${profile.username.replace(/"/g, "&quot;")}"
            required
          />
        </div>

        <div class="form-field">
          <label for="profile-bio" class="form-label">Biografía corta</label>
          <input
            id="profile-bio"
            name="bio"
            type="text"
            class="form-input"
            maxlength="110"
            value="${profile.bio.replace(/"/g, "&quot;")}"
            placeholder="Tu lema o estilo de juego..."
          />
        </div>

        <div class="profile-form-footer">
          <button type="submit" class="btn-cyan">Guardar perfil</button>
          <span id="profile-feedback" class="profile-feedback" aria-live="polite"></span>
        </div>
      </form>
    </section>
  `;

  const form = contentEl.querySelector("#profile-form");
  const usernameInput = contentEl.querySelector("#profile-username");
  const bioInput = contentEl.querySelector("#profile-bio");
  const displayName = contentEl.querySelector("#profile-display-name");
  const displayBio = contentEl.querySelector("#profile-display-bio");
  const avatarEl = contentEl.querySelector(".profile-avatar");
  const feedbackEl = contentEl.querySelector("#profile-feedback");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const updated = saveProfile({
      username: usernameInput.value,
      bio: bioInput.value
    });

    usernameInput.value = updated.username;
    bioInput.value = updated.bio;
    displayName.textContent = updated.username;
    displayBio.textContent = updated.bio || "Sin biografía definida.";
    avatarEl.textContent = updated.username.slice(0, 2).toUpperCase();
    feedbackEl.textContent = "Perfil guardado en el navegador.";
  });
}
