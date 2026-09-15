/* =========================================================
   MARK PROJECT ENGINE
   Content lives in projects-data.js.
   This file handles rendering + interactions only.
   ========================================================= */

const projects = Array.isArray(window.PROJECTS) ? window.PROJECTS : [];
const params = new URLSearchParams(window.location.search);
let current = projects.findIndex(p => p.slug === params.get("project"));
if (current < 0) current = 0;

const $ = id => document.getElementById(id);
const safe = value => value || "—";

/* Generic fallback: any <img> that fails to load is swapped for a
   text placeholder box, matching the rest of the template. */
function markImageMissing(img, label) {
  if (!img || !img.parentNode) return;
  const holder = document.createElement("div");
  holder.className = "image-placeholder img-missing";
  holder.textContent = label || "IMAGE HOLDER";
  img.replaceWith(holder);
}
window.markImageMissing = markImageMissing;

const imageMarkup = (src, alt, fallback) => src
  ? `<img src="${src}" alt="${alt}" onerror="markImageMissing(this,'${String(alt || "IMAGE HOLDER").replace(/'/g, "\\'")}')">`
  : fallback;

function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = safe(value);
}

function setMedia(el, src, placeholderText) {
  if (!el) return;
  el.style.backgroundImage = "";
  el.classList.remove("has-media");
  if (src) {
    el.style.backgroundImage = `url("${src}")`;
    el.classList.add("has-media");
    const label = el.querySelector?.(".image-placeholder-label");
    if (label) label.textContent = "";
  } else if (placeholderText) {
    el.textContent = placeholderText;
  }
}

function renderApproach(p) {
  const grid = document.querySelector(".approach-grid");
  if (!grid) return;
  grid.innerHTML = p.approach.map((item, i) => `
    <article class="reveal approach-card-dynamic">
      <div class="approach-icon">${["◇","⌁","▱","⌂"][i] || "◇"}</div>
      <h3>${safe(item[0])}</h3>
      <p>${safe(item[1])}</p>
    </article>
  `).join("");
}

function renderSpaces(p) {
  const grid = $("spacesGrid");
  if (!grid) return;
  grid.innerHTML = p.spaces.map(item => `
    <article class="space-card" data-space="${item[0]}">
      <div class="image-placeholder">${imageMarkup(item[2], item[1], "IMAGE HOLDER")}</div>
      <div class="space-caption"><span>${safe(item[1])}</span><b>→</b></div>
    </article>
  `).join("");
  bindSpaceTabs();
}

function renderMaterials(p) {
  const grid = document.querySelector(".materials-grid");
  if (!grid) return;
  grid.innerHTML = p.materials.map(item => `
    <article>
      <div class="image-placeholder">${imageMarkup(item[2], item[0], "MATERIAL IMAGE")}</div>
      <strong>${safe(item[0])}</strong>
      <span>${safe(item[1])}</span>
    </article>
  `).join("");
}

function renderGallery(p) {
  const grid = $("galleryGrid");
  if (!grid) return;
  const images = Array.isArray(p.gallery) ? p.gallery : [];
  grid.innerHTML = images.slice(0, 5).map((src, i) => `
    <button class="gallery-item ${i === 0 ? "tall" : ""} ${src ? "has-media" : ""}"
      data-gallery="${String(i + 1).padStart(2,"0")}"
      data-src="${src || ""}"
      type="button"
      aria-label="Open gallery image ${i + 1}">
      ${imageMarkup(src, `Gallery image ${i + 1}`, "<span>GALLERY IMAGE</span>")}
    </button>
  `).join("") + `
    <button class="more-photos" id="morePhotos" type="button" aria-label="Open all project photos">
      <span>+${safe(p.morePhotos || 0)}</span><small>MORE PHOTOS</small>
    </button>
  `;
  bindGallery();
}

function renderTimeline(p) {
  const timeline = $("timeline");
  if (!timeline) return;
  timeline.innerHTML = (p.timeline || []).map(item => `
    <div class="timeline-item">
      <h3>${safe(item[0])}</h3>
      <p>${safe(item[1])}</p>
    </div>
  `).join("");
}

function renderBeforeAfter(p) {
  const before = $("beforeLayer");
  const after = document.querySelector(".ba-after");
  if (before) {
    const box = before.querySelector(".image-placeholder");
    if (box) {
      box.innerHTML = imageMarkup(p.before, "Before project image", "BEFORE IMAGE");
    }
  }
  if (after) {
    const box = after.querySelector(".image-placeholder");
    if (box) {
      box.innerHTML = imageMarkup(p.after, "After project image", "AFTER IMAGE");
    }
  }
}

function renderHeroMedia(p) {
  const media = $("heroMedia");
  if (!media) return;
  media.dataset.project = p.slug;
  if (p.hero) {
    media.innerHTML = imageMarkup(p.hero, `${p.title} hero image`, "");
    media.style.backgroundImage = "";
    media.classList.add("has-media");
  } else {
    media.textContent = "HERO IMAGE / VIDEO";
    media.style.backgroundImage = "";
    media.classList.remove("has-media");
  }
}

function renderCtaMedia(p) {
  const media = $("ctaImage");
  if (!media) return;
  media.innerHTML = imageMarkup(p.hero, `${p.title} project image`, "PROJECT CTA IMAGE / VIDEO");
}

function renderProject() {
  if (!projects.length) return;
  const p = projects[current];
  document.title = `MARK GROUPS — ${p.title}`;

  setText("projectCount", "01");
  setText("projectCategory", p.category);
  setText("projectTitle", p.title);
  setText("projectIntro", p.intro);
  setText("projectLocation", p.location);
  setText("projectArea", p.area);
  setText("projectStatus", p.status);
  setText("factClient", p.client);
  setText("factLocation", p.location);
  setText("factPlot", p.plot);
  setText("factBuilt", p.builtUpArea || p.area);
  setText("factType", p.type);
  setText("factStatus", p.status);
  setText("quote", p.quote);
  setText("projectOverview", p.overview);

  renderHeroMedia(p);
  renderCtaMedia(p);
  renderBeforeAfter(p);
  bindBeforeAfter();
  renderApproach(p);
  renderSpaces(p);
  renderTimeline(p);
  renderMaterials(p);
  renderGallery(p);

  history.replaceState({}, "", `?project=${encodeURIComponent(p.slug)}`);
  refreshRevealObserver();
}

function moveProject(direction) {
  current = (current + direction + projects.length) % projects.length;
  renderProject();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* BEFORE / AFTER */
function bindBeforeAfter() {
  const range = $("baRange");
  const before = $("beforeLayer");
  const divider = $("baDivider");
  if (!range || !before || !divider) return;
  if (range.dataset.bound === "1") {
    const v = Number(range.value);
    before.style.width = `${v}%`;
    divider.style.left = `${v}%`;
    return;
  }
  range.dataset.bound = "1";
  const update = value => {
    const v = Number(value);
    before.style.width = `${v}%`;
    divider.style.left = `${v}%`;
  };
  update(range.value);
  range.addEventListener("input", e => update(e.target.value));
}
bindBeforeAfter();

/* KEY SPACES */
function bindSpaceTabs() {
  const cards = [...document.querySelectorAll(".space-card")];
  const tabs = [...document.querySelectorAll(".tabs button")];
  tabs.forEach(button => {
    button.onclick = () => {
      tabs.forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      const filter = button.textContent.trim().toLowerCase();
      cards.forEach(card => {
        const show = filter === "all" || card.dataset.space === filter;
        card.classList.toggle("space-hidden", !show);
        card.classList.toggle("space-active", show);
      });
    };
  });
}
bindSpaceTabs();

/* GALLERY */
let galleryIndex = 0;
let galleryItems = [];

function bindGallery() {
  galleryItems = [...document.querySelectorAll(".gallery-item")];
  galleryItems.forEach((item, index) => {
    item.onclick = () => openGallery(index);
  });
  $("morePhotos")?.addEventListener("click", () => openGallery(0));
}

function renderGalleryModal() {
  const modalImage = $("galleryModalImage");
  const counter = $("galleryCounter");
  if (!modalImage || !counter || !galleryItems.length) return;
  const item = galleryItems[galleryIndex];
  const src = item.dataset.src;
  counter.textContent = `${String(galleryIndex + 1).padStart(2,"0")} / ${String(galleryItems.length).padStart(2,"0")}`;
  modalImage.style.backgroundImage = src ? `url("${src}")` : "";
  modalImage.textContent = src ? "" : `GALLERY IMAGE ${String(galleryIndex + 1).padStart(2,"0")}`;
}

function openGallery(index) {
  if (!galleryItems.length) return;
  galleryIndex = Math.max(0, Math.min(index, galleryItems.length - 1));
  renderGalleryModal();
  $("galleryModal")?.classList.add("open");
  $("galleryModal")?.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeGallery() {
  $("galleryModal")?.classList.remove("open");
  $("galleryModal")?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-close-gallery]").forEach(el => el.addEventListener("click", closeGallery));
$("galleryPrev")?.addEventListener("click", () => {
  galleryIndex = (galleryIndex - 1 + galleryItems.length) % galleryItems.length;
  renderGalleryModal();
});
$("galleryNext")?.addEventListener("click", () => {
  galleryIndex = (galleryIndex + 1) % galleryItems.length;
  renderGalleryModal();
});
document.addEventListener("keydown", e => {
  if (!$("galleryModal")?.classList.contains("open")) return;
  if (e.key === "Escape") closeGallery();
  if (e.key === "ArrowLeft") $("galleryPrev")?.click();
  if (e.key === "ArrowRight") $("galleryNext")?.click();
});

/* REVEAL ANIMATION — rebind after dynamic project rendering */
let revealObserver;
function refreshRevealObserver() {
  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: .12 });
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 60, 300)}ms`;
    revealObserver.observe(el);
  });
}

renderProject();
