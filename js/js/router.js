const SECTIONS = {
  inicio: {
    title: "Inicio",
    badge: "Inicio",
    heading: "Centro de control de Nexus Launcher",
    copy: "Resumen general, accesos rápidos y próximos títulos listos para lanzarse desde el navegador."
  },
  biblioteca: {
    title: "Biblioteca",
    badge: "Biblioteca",
    heading: "Catálogo de juegos",
    copy: "Aquí se mostrarán todos los juegos disponibles en el launcher una vez conectemos la biblioteca dinámica."
  },
  favoritos: {
    title: "Favoritos",
    badge: "Favoritos",
    heading: "Tus juegos marcados",
    copy: "Acceso rápido a los títulos que guardes como favoritos."
  },
  perfil: {
    title: "Perfil",
    badge: "Perfil",
    heading: "Perfil del jugador",
    copy: "Configuración de identidad, avatar, biografía y preferencias del launcher."
  }
};

export function initRouter() {
  const navButtons = Array.from(document.querySelectorAll(".nav-item[data-section]"));
  const titleEl = document.getElementById("section-title");
  const contentEl = document.getElementById("main-content");

  if (!navButtons.length || !titleEl || !contentEl) return;

  function renderSection(sectionKey) {
    const section = SECTIONS[sectionKey] || SECTIONS.inicio;

    navButtons.forEach((btn) => {
      const isActive = btn.dataset.section === sectionKey;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-current", isActive ? "page" : "false");
    });

    titleEl.textContent = section.title;

    contentEl.innerHTML = `
      <section class="panel">
        <span class="panel-badge">${section.badge}</span>
        <h2 class="panel-heading">${section.heading}</h2>
        <p class="panel-copy">${section.copy}</p>
      </section>
    `;
  }

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      renderSection(btn.dataset.section);
    });
  });

  renderSection("inicio");
}
