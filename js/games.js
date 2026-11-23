const STORAGE_KEY = "nexus_launcher_favorites_v1";

const DEFAULT_GAMES = [
  {
    id: "cyber-drift",
    title: "Cyber Drift 2099",
    genre: "Arcade · Velocidad",
    tag: "WEBGL · 60 FPS",
    theme: "cyan",
    featured: true,
    favorite: true,
    url: "#cyber-drift",
    summary: "Carreras urbanas nocturnas de reflejos rápidos directamente en el navegador."
  },
  {
    id: "void-protocol",
    title: "Void Protocol",
    genre: "Táctico · Acción",
    tag: "HTML5 · SOLO",
    theme: "violet",
    featured: false,
    favorite: true,
    url: "#void-protocol",
    summary: "Infiltración por turnos en estaciones orbitales con gestión de energía."
  },
  {
    id: "neon-breaker",
    title: "Neon Breaker DX",
    genre: "Puzzle · Retro",
    tag: "INSTANT · LIGERO",
    theme: "emerald",
    featured: false,
    favorite: false,
    url: "#neon-breaker",
    summary: "Rompe bloques energéticos con potenciadores en cadena y ritmo electrónico."
  },
  {
    id: "orbital-pulse",
    title: "Orbital Pulse",
    genre: "Ritmo · Arcade",
    tag: "WEB AUDIO · 60 FPS",
    theme: "cyan",
    featured: false,
    favorite: false,
    url: "#orbital-pulse",
    summary: "Sincroniza esquivas y disparos al compás de sintetizadores en órbita baja."
  }
];

function loadSavedFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : null;
  } catch {
    return null;
  }
}

function saveFavorites(games) {
  try {
    const favoriteIds = games.filter((game) => game.favorite).map((game) => game.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
  } catch {
    // Ignorar errores de almacenamiento si el navegador restringe localStorage
  }
}

const savedFavorites = loadSavedFavorites();

export const GAMES = DEFAULT_GAMES.map((game) => ({
  ...game,
  favorite: savedFavorites ? savedFavorites.has(game.id) : game.favorite
}));

export function getFeaturedGame(games = GAMES) {
  return games.find((game) => game.featured) || games[0];
}

export function getAvailableGenres(games = GAMES) {
  return Array.from(new Set(games.map((game) => game.genre)));
}

export function filterGames(games = GAMES, { query = "", onlyFavorites = false, genre = "all" } = {}) {
  const normalized = query.trim().toLowerCase();

  return games.filter((game) => {
    if (onlyFavorites && !game.favorite) return false;
    if (genre && genre !== "all" && game.genre !== genre) return false;
    if (!normalized) return true;

    return (
      game.title.toLowerCase().includes(normalized) ||
      game.genre.toLowerCase().includes(normalized) ||
      game.summary.toLowerCase().includes(normalized)
    );
  });
}

export function sortGames(games, sortBy = "default") {
  const copy = [...games];
  if (sortBy === "title-asc") {
    return copy.sort((a, b) => a.title.localeCompare(b.title, "es"));
  }
  if (sortBy === "title-desc") {
    return copy.sort((a, b) => b.title.localeCompare(a.title, "es"));
  }
  if (sortBy === "favorites-first") {
    return copy.sort((a, b) => Number(b.favorite) - Number(a.favorite));
  }
  return copy;
}

export function toggleFavorite(gameId, games = GAMES) {
  const target = games.find((game) => game.id === gameId);
  if (target) {
    target.favorite = !target.favorite;
    saveFavorites(games);
  }
  return target;
}
