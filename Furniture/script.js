document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll(".reveal:not(.hero .reveal)");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => observer.observe(el));

  // Stagger the process steps when the process enters the viewport.
  const steps = document.querySelectorAll(".process-step");
  const processObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      steps.forEach((step, i) => {
        step.animate(
          [{opacity:0, transform:"translateY(16px)"},{opacity:1, transform:"translateY(0)"}],
          {duration:500, delay:i*100, easing:"cubic-bezier(.2,.7,.2,1)", fill:"forwards"}
        );
      });
      processObserver.unobserve(entry.target);
    });
  }, {threshold:.2});
  const track = document.querySelector(".process-track");
  if (track) processObserver.observe(track);

  // Keep feature cards as cards only: no navigation is attached.
  document.querySelectorAll(".collection-card").forEach(card => {
    card.addEventListener("mouseenter", () => card.classList.add("is-hovered"));
    card.addEventListener("mouseleave", () => card.classList.remove("is-hovered"));
  });
});
