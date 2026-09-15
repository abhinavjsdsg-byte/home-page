document.addEventListener("DOMContentLoaded", () => {
  const imageHolders = document.querySelectorAll(".image-holder");
  imageHolders.forEach(holder => {
    const img = holder.querySelector("img");
    const label = holder.querySelector(":scope > span");
    if (!img || !label) return;

    const check = () => {
      if (img.complete && img.naturalWidth > 0) label.style.display = "none";
      else label.style.display = "flex";
    };
    img.addEventListener("load", check);
    img.addEventListener("error", check);
    check();
  });

  const revealItems = document.querySelectorAll(".impact-strip div,.journey-item,.leader,.world-grid article,.founder-copy,.founder-photo,.values");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.08});

  revealItems.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(14px)";
    el.style.transition = "opacity .6s ease, transform .6s ease";
    observer.observe(el);
  });

  const menuButton = document.querySelector(".mobile-menu-button");
  const menuPanel = document.querySelector("#mobileMenuPanel");
  if (menuButton && menuPanel) {
    menuButton.addEventListener("click", () => {
      const open = menuPanel.classList.toggle("open");
      menuButton.classList.toggle("open", open);
      menuButton.setAttribute("aria-expanded", String(open));
      menuPanel.setAttribute("aria-hidden", String(!open));
    });
    menuPanel.querySelectorAll("a").forEach(link => link.addEventListener("click", () => menuButton.click()));
  }

});
