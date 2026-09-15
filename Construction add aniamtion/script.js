// MARK Construction page motion
// Editorial scroll reveals + lightweight hero entrance. No floating effects.
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const targets = document.querySelectorAll(".services, .projects, .process, .why-mark, footer, .service-item, .project-card, .process-step");
  targets.forEach((el, i) => {
    el.classList.add("reveal-on-scroll");
    if (el.classList.contains("service-item") || el.classList.contains("process-step")) {
      el.style.transitionDelay = `${(i % 5) * 70}ms`;
    }
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal-on-scroll").forEach(el => observer.observe(el));
});
