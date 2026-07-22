(() => {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector("#site-header");
  const nav = document.querySelector("#site-nav");
  const menuToggle = document.querySelector("#menu-toggle");
  const themeToggle = document.querySelector("#theme-toggle");
  const progress = document.querySelector("#reading-progress");
  const navLinks = [...document.querySelectorAll("#site-nav a")];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const savedTheme = (() => {
    try {
      return localStorage.getItem("wei-theme");
    } catch (_) {
      return null;
    }
  })();

  const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  const setTheme = (theme) => {
    root.dataset.theme = theme;
    const isDark = theme === "dark";
    themeToggle?.setAttribute("aria-pressed", String(isDark));
    themeToggle?.setAttribute("aria-label", `Use ${isDark ? "light" : "dark"} theme`);
    try {
      localStorage.setItem("wei-theme", theme);
    } catch (_) {}
  };

  setTheme(savedTheme || preferredTheme);

  themeToggle?.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });

  const closeMenu = () => {
    nav?.classList.remove("is-open");
    body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation");
  };

  menuToggle?.addEventListener("click", () => {
    const willOpen = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", willOpen);
    body.classList.toggle("menu-open", willOpen);
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    menuToggle.setAttribute("aria-label", willOpen ? "Close navigation" : "Open navigation");
  });

  navLinks.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const updateScrollUI = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);

    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    if (progress) progress.style.width = `${Math.min(100, percentage)}%`;
  };

  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px" }
    );

    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
        });
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: [0, 0.2, 0.5] }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  } else {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
  }

  const year = document.querySelector("#current-year");
  if (year) year.textContent = new Date().getFullYear();
})();
