const header=document.getElementById('header');
addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>40),{passive:true});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.18,rootMargin:'0px 0px -70px'});
document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=Math.min(i*90,360)+'ms';observer.observe(el)});
document.querySelector('video').addEventListener('error',e=>e.currentTarget.style.display='none');

document.querySelectorAll(".selected-works .reveal").forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i * 110, 440)}ms`;
});

document.querySelectorAll(".timeline-item").forEach((item, i) => {
  item.style.transitionDelay = `${Math.min(i * 130, 520)}ms`;
});

/* ---------- IMPACT COUNTER ---------- */
const impactSection = document.querySelector(".impact");
const impactNumbers = document.querySelectorAll(".impact-number[data-target]");
let impactCounted = false;

function animateImpactNumber(el, delay = 0) {
  const target = Number(el.dataset.target);
  const suffix = el.dataset.suffix || "";
  const duration = 1800;
  const startValue = 0;

  setTimeout(() => {
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      // Smooth luxury-style ease-out: fast start, gentle finish.
      const eased = 1 - Math.pow(1 - progress, 4);
      const value = Math.floor(startValue + (target - startValue) * eased);

      el.innerHTML = `${value}<span>${suffix}</span>`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.innerHTML = `${target}<span>${suffix}</span>`;
      }
    }

    requestAnimationFrame(tick);
  }, delay);
}

function startImpactCounter() {
  if (impactCounted || !impactNumbers.length) return;
  impactCounted = true;

  impactNumbers.forEach((number, index) => {
    animateImpactNumber(number, index * 220);
  });
}

if (impactSection) {
  const impactObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        startImpactCounter();
        impactObserver.disconnect();
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -8% 0px"
  });

  impactObserver.observe(impactSection);

  // Fallback for browsers/page states where the section is already visible.
  requestAnimationFrame(() => {
    const rect = impactSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      startImpactCounter();
    }
  });
}

document.querySelectorAll(".why-mark .reveal").forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i * 90, 540)}ms`;
});

/* ---------- OFFICIAL PARTNERS SLIDER ---------- */
const partnerTrack = document.getElementById("partnerTrack");
const partnerPrev = document.querySelector(".partner-prev");
const partnerNext = document.querySelector(".partner-next");
let partnerOffset = 0;

function partnerStep() {
  const first = partnerTrack?.querySelector(".partner-logo");
  return first ? first.getBoundingClientRect().width : 180;
}

if (partnerTrack && partnerPrev && partnerNext) {
  partnerNext.addEventListener("click", () => {
    partnerTrack.style.animation = "none";
    partnerOffset -= partnerStep();
    partnerTrack.style.transform = `translateX(${partnerOffset}px)`;
  });

  partnerPrev.addEventListener("click", () => {
    partnerTrack.style.animation = "none";
    partnerOffset += partnerStep();
    partnerTrack.style.transform = `translateX(${partnerOffset}px)`;
  });
}

document.querySelectorAll(".partners .reveal").forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i * 110, 330)}ms`;
});

/* ---------- CLIENT REVIEWS: 9-SLIDE AUTO CAROUSEL ---------- */
const reviewSlides = Array.from(document.querySelectorAll(".review-slide"));
const reviewCurrent = document.getElementById("reviewCurrent");
const reviewPrev = document.getElementById("reviewPrev");
const reviewNext = document.getElementById("reviewNext");
const reviewsShell = document.querySelector(".reviews-shell");
let reviewIndex = 0;
let reviewTimer = null;

function showReview(index) {
  if (!reviewSlides.length) return;
  reviewIndex = (index + reviewSlides.length) % reviewSlides.length;

  reviewSlides.forEach((slide, i) => {
    slide.classList.toggle("active", i === reviewIndex);
  });

  if (reviewCurrent) {
    reviewCurrent.textContent = String(reviewIndex + 1).padStart(2, "0");
  }
}

function startReviewTimer() {
  clearInterval(reviewTimer);
  reviewTimer = setInterval(() => {
    showReview(reviewIndex + 1);
  }, 5200);
}

if (reviewSlides.length) {
  showReview(0);
  startReviewTimer();

  reviewNext?.addEventListener("click", () => {
    showReview(reviewIndex + 1);
    startReviewTimer();
  });

  reviewPrev?.addEventListener("click", () => {
    showReview(reviewIndex - 1);
    startReviewTimer();
  });

  reviewsShell?.addEventListener("mouseenter", () => clearInterval(reviewTimer));
  reviewsShell?.addEventListener("mouseleave", startReviewTimer);
}

document.querySelectorAll(".reviews .reveal").forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i * 130, 260)}ms`;
});

document.querySelectorAll(".mark-footer .reveal").forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i * 140, 280)}ms`;
});
