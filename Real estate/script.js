document.addEventListener("DOMContentLoaded", () => {
  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  // Counter animation
  const counters = document.querySelectorAll("[data-count]");
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const duration = 1300;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(target * eased).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString();
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.8 });

  counters.forEach(c => counterObserver.observe(c));

  // Header background on scroll
  const header = document.getElementById("siteHeader");
  window.addEventListener("scroll", () => {
    header.style.background = window.scrollY > 20
      ? "rgba(8,8,8,.98)"
      : "rgba(8,8,8,.94)";
  }, { passive: true });
});
