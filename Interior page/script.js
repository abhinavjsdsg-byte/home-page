document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const modal = document.getElementById("modal");
  const film = document.getElementById("film");
  const close = document.getElementById("close");

  const revealItems = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -5% 0px" });
  revealItems.forEach(el => observer.observe(el));

  const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 30);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // Smoothly make buttons feel responsive without changing layout.
  document.querySelectorAll(".cta,.gold,.outline-btn,.project-card,.service-card").forEach(el => {
    el.addEventListener("pointerenter", () => el.classList.add("is-hovered"));
    el.addEventListener("pointerleave", () => el.classList.remove("is-hovered"));
  });

  if (film && modal && close) {
    film.addEventListener("click", () => {
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    });
    const closeModal = () => {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    };
    close.addEventListener("click", closeModal);
    modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
  }
});