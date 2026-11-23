import { GAMES, getFeaturedGame, filterGames, toggleFavorite } from "./games.js";

function createGameCardHTML(game) {
  return `
    <article class="game-card" data-game-id="${game.id}">
      <div class="game-cover" data-theme="${game.theme}">
        <div class="game-cover-top">
          <span class="game-genre">${game.genre}</span>
          ${game.favorite ? '<span class="game-fav-badge">★ Favorito</span>' : ""}
        </div>
        <span class="game-cover-tag">${game.tag}</span>
      </div>
      <div class="game-body">
        <h3 class="game-title">${game.title}</h3>
        <p class="game-summary">${game.summary}</p>
        <div class="game-actions">
          <button type="button" class="btn-cyan" data-action="play" data-id="${game.id}">Jugar</button>
          <button type="button" class="btn-ghost" data-action="details" data-id="${game.id}">Ficha</button>
          <button
            type="button"
            class="btn-fav ${game.favorite ? "is-favorite" : ""}"
            data-action="fav"
            data-id="${game.id}"
            aria-label="Marcar ${game.title} como favorito"
            title="${game.favorite ? "Quitar de favoritos" : "Añadir a favoritos"}"
          >★</button>
        </div>
      </div>
    </article>
  `;
}

function openGameModal(game) {
  if (!game) return;

  const existing = document.getElementById("game-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "game-modal";
  modal.className = "modal-backdrop";
  modal.innerHTML = `
    <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-game-title">
      <div class="modal-header">
        <h2 id="modal-game-title" class="modal-title">${game.title}</h2>
        <button type="button" class="modal-close" data-close-modal aria-label="Cerrar">✕</button>
      </div>
      <div class="modal-meta">${game.genre} · ${game.tag}</div>
      <p class="modal-desc">${game.summary}</p>
      <div id="modal-status" class="modal-status"></div>
      <div class="modal-actions">
        <button type="button" class="btn-ghost" data-close-modal>Cerrar</button>
        <button type="button" class="btn-cyan" id="modal-launch-btn">Iniciar juego</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.closest("[data-close-modal]")) {
      modal.remove();
    }
  });

  const launchBtn = modal.querySelector("#modal-launch-btn");
  const statusEl = modal.querySelector("#modal-status");
  launchBtn.addEventListener("click", () => {
    statusEl.textContent = `Preparando "${game.title}" (${game.tag})...`;
  });
}

function renderCatalogView(contentEl, { heading, onlyFavorites = false, onRefresh }) {
  contentEl.innerHTML = `
    <div class="catalog-toolbar">
      <div>
        <h2 class="section-heading">${heading}</h2>
        <span id="catalog-count" class="section-count"></span>
      </div>
      <input
        id="game-search"
        type="search"
        class="search-input"
        placeholder="Buscar por nombre o género..."
        aria-label="Buscar juegos"
      />
    </div>
    <div id="catalog-grid"></div>
  `;

  const searchInput = document.getElementById("game-search");
  const countEl = document.getElementById("catalog-count");
  const gridEl = document.getElementById("catalog-grid");

  function updateList() {
    const matches = filterGames(GAMES, {
      query: searchInput ? searchInput.value : "",
      onlyFavorites
    });

    countEl.textContent = `${matches.length} ${matches.length === 1 ? "juego" : "juegos"}`;

    if (!matches.length) {
      gridEl.innerHTML = `
        <div class="empty-state">
          No se encontraron juegos con ese filtro.
        </div>
      `;
      return;
    }

    gridEl.innerHTML = `
      <div class="games-grid">
        ${matches.map(createGameCardHTML).join("")}
      </div>
    `;
  }

  searchInput.addEventListener("input", updateList);

  gridEl.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-action]");
    if (!btn) return;
    const game = GAMES.find((item) => item.id === btn.dataset.id);
    if (!game) return;

    if (btn.dataset.action === "fav") {
      toggleFavorite(game.id, GAMES);
      updateList();
      if (typeof onRefresh === "function") onRefresh();
    } else if (btn.dataset.action === "details" || btn.dataset.action === "play") {
      openGameModal(game);
    }
  });

  updateList();
}

export function initRouter() {
  const navButtons = Array.from(document.querySelectorAll(".nav-item[data-section]"));
  const titleEl = document.getElementById("section-title");
  const contentEl = document.getElementById("main-content");

  if (!navButtons.length || !titleEl || !contentEl) return;

  let currentSection = "inicio";

  function renderSection(sectionKey) {
    currentSection = sectionKey;

    navButtons.forEach((btn) => {
      const isActive = btn.dataset.section === sectionKey;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-current", isActive ? "page" : "false");
    });

    if (sectionKey === "biblioteca") {
      titleEl.textContent = "Biblioteca";
      renderCatalogView(contentEl, {
        heading: "Todos los títulos",
        onlyFavorites: false,
        onRefresh: () => {}
      });
      return;
    }

    if (sectionKey === "favoritos") {
      titleEl.textContent = "Favoritos";
      renderCatalogView(contentEl, {
        heading: "Tus juegos favoritos",
        onlyFavorites: true,
        onRefresh: () => {}
      });
      return;
    }

    if (sectionKey === "perfil") {
      titleEl.textContent = "Perfil";
      contentEl.innerHTML = `
        <section class="panel">
          <span class="panel-badge">Jugador · Nexus ID</span>
          <h2 class="panel-heading">Perfil del jugador</h2>
          <p class="panel-copy">
            Aquí configuraremos tu avatar, nombre de usuario, biografía y estadísticas en la siguiente fase.
          </p>
        </section>
      `;
      return;
    }

    const featured = getFeaturedGame(GAMES);
    titleEl.textContent = "Inicio";
    contentEl.innerHTML = `
      <section class="featured-hero">
        <div>
          <span class="featured-eyebrow">★ Destacado del launcher</span>
          <h2 class="featured-title">${featured.title}</h2>
          <p class="featured-desc">${featured.summary}</p>
          <div class="featured-actions">
            <button type="button" class="btn-cyan" data-action="play" data-id="${featured.id}">Jugar ahora</button>
            <button type="button" class="btn-ghost" data-action="details" data-id="${featured.id}">Ver detalles</button>
          </div>
        </div>
        <div class="featured-artwork">
          <span class="artwork-code">${featured.tag}</span>
          <span class="artwork-label">${featured.genre}</span>
        </div>
      </section>

      <div class="section-header">
        <h2 class="section-heading">Acceso rápido</h2>
        <span class="section-count">${GAMES.length} títulos</span>
      </div>
      <div class="games-grid" id="home-grid">
        ${GAMES.map(createGameCardHTML).join("")}
      </div>
    `;

    contentEl.addEventListener(
      "click",
      (event) => {
        if (currentSection !== "inicio") return;
        const btn = event.target.closest("button[data-action]");
        if (!btn) return;
        const game = GAMES.find((item) => item.id === btn.dataset.id);
        if (!game) return;

        if (btn.dataset.action === "fav") {
          toggleFavorite(game.id, GAMES);
          renderSection("inicio");
        } else if (btn.dataset.action === "details" || btn.dataset.action === "play") {
          openGameModal(game);
        }
      },
      { once: true }
    );
  }

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      renderSection(btn.dataset.section);
    });
  });

  renderSection("inicio");
}
