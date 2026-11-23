export const GAMES = [
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
  }
];

export function getFeaturedGame(games = GAMES) {
  return games.find((game) => game.featured) || games[0];
}

export function filterGames(games = GAMES, { query = "", onlyFavorites = false } = {}) {
  const normalized = query.trim().toLowerCase();

  return games.filter((game) => {
    if (onlyFavorites && !game.favorite) return false;
    if (!normalized) return true;

    return (
      game.title.toLowerCase().includes(normalized) ||
      game.genre.toLowerCase().includes(normalized) ||
      game.summary.toLowerCase().includes(normalized)
    );
  });
}
