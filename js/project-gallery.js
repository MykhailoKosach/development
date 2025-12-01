// ================================
// PROJECT PAGE GALLERY MODULE
// Deck-style image gallery for individual project pages
// ================================

(function () {
  const gallery = document.getElementById("projectGallery");
  const dots = document.getElementById("galleryDots");
  const prevBtn = document.querySelector(".gallery-arrow.prev");
  const nextBtn = document.querySelector(".gallery-arrow.next");

  if (!gallery || !dots) return;

  // Project-specific images (placeholder data)
  const images = [
    "https://picsum.photos/id/1011/1600/1000",
    "https://picsum.photos/id/1015/1600/1000",
    "https://picsum.photos/id/1018/1600/1000",
    "https://picsum.photos/id/1025/1600/1000",
    "https://picsum.photos/id/1035/1600/1000",
    "https://picsum.photos/id/1040/1600/1000"
  ];

  // Build slides & dots
  images.forEach((imgSrc, i) => {
    const slide = document.createElement("div");
    slide.className = "gallery-slide";
    slide.innerHTML = `<img src="${imgSrc}" alt="Project photo ${i + 1}" loading="lazy" />`;
    gallery.appendChild(slide);

    const dot = document.createElement("span");
    dot.className = "gallery-dot" + (i === 0 ? " active" : "");
    dot.dataset.i = i;
    dots.appendChild(dot);
  });

  const slides = [...document.querySelectorAll(".gallery-slide")];
  let order = slides.map((_, i) => i);
  const parallax = { t: 0 };

  function layout() {
    const w = gallery.clientWidth;
    const n = slides.length;
    if (!n) return;

    const isMobile = w < 600;

    if (isMobile) {
      // Mobile: Stack cards
      const cardW = w * 0.86;
      const cardH = gallery.clientHeight;
      const offsetY = 16;

      slides.forEach((s, idx) => {
        const pos = order.indexOf(idx);
        const isActive = pos === 0;

        s.style.left = `${(w - cardW) / 2}px`;
        s.style.width = `${cardW}px`;
        s.style.height = `${cardH}px`;
        s.style.transform = `translateY(${pos * offsetY}px) scale(${isActive ? 1 : 0.96})`;
        s.style.zIndex = n - pos;
        s.style.opacity = pos < 3 ? 1 : 0;
        s.style.filter = isActive ? "brightness(1)" : "brightness(0.85)";
      });
    } else {
      // Desktop: Deck layout
      const cardW = Math.min(w * 0.72, 900);
      const cardH = gallery.clientHeight;
      const activeLeft = (w - cardW) / 2;
      const spread = Math.min(cardW * 0.28, 200);

      slides.forEach((s, idx) => {
        const pos = order.indexOf(idx);
        const isActive = pos === 0;

        let left = activeLeft;
        let scale = 1;
        let zIndex = n - pos;
        let opacity = 1;
        let brightness = 1;

        if (pos === 1) {
          left = activeLeft + spread;
          scale = 0.92;
          brightness = 0.88;
        } else if (pos === 2) {
          left = activeLeft + spread * 1.5;
          scale = 0.86;
          brightness = 0.76;
          opacity = 0.9;
        } else if (pos > 2) {
          left = activeLeft + spread * 1.8;
          scale = 0.82;
          brightness = 0.7;
          opacity = 0;
        }

        s.style.left = `${left}px`;
        s.style.width = `${cardW}px`;
        s.style.height = `${cardH}px`;
        s.style.transform = `scale(${scale}) translateX(${parallax.t * -30}px)`;
        s.style.zIndex = zIndex;
        s.style.opacity = opacity;
        s.style.filter = `brightness(${brightness})`;
      });
    }
  }

  function updateDots() {
    const allDots = [...dots.querySelectorAll(".gallery-dot")];
    allDots.forEach((d, i) => {
      d.classList.toggle("active", i === order[0]);
    });
  }

  function cycle(direction = 1) {
    if (direction > 0) {
      order.push(order.shift());
    } else {
      order.unshift(order.pop());
    }
    layout();
    updateDots();
  }

  // Event listeners
  if (prevBtn) prevBtn.addEventListener("click", () => cycle(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => cycle(1));

  dots.addEventListener("click", (e) => {
    const dot = e.target.closest(".gallery-dot");
    if (!dot) return;
    const targetIdx = parseInt(dot.dataset.i, 10);
    const currentIdx = order[0];
    if (targetIdx === currentIdx) return;

    const dist = (targetIdx - currentIdx + images.length) % images.length;
    const dir = dist <= images.length / 2 ? 1 : -1;
    const steps = dir > 0 ? dist : images.length - dist;

    for (let i = 0; i < steps; i++) cycle(dir);
  });

  // Touch/swipe support
  let swipeTarget = gallery;
  let startX = 0,
    startY = 0,
    isDragging = false;

  swipeTarget.addEventListener("pointerdown", (e) => {
    // Ignore if clicking on arrows or dots
    if (
      e.target.closest(".gallery-arrow") ||
      e.target.closest(".gallery-dot")
    ) {
      return;
    }

    startX = e.clientX;
    startY = e.clientY;
    isDragging = true;
    swipeTarget.setPointerCapture(e.pointerId);
    parallax.t = 0;
  });

  swipeTarget.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    parallax.t = Math.max(-1, Math.min(1, dx / 100));
    layout();
  });

  swipeTarget.addEventListener("pointerup", (e) => {
    if (!isDragging) return;
    isDragging = false;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      cycle(dx < 0 ? 1 : -1);
    }

    parallax.t = 0;
    layout();
  });

  swipeTarget.addEventListener("pointercancel", () => {
    isDragging = false;
    parallax.t = 0;
    layout();
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") cycle(-1);
    if (e.key === "ArrowRight") cycle(1);
  });

  // Initial layout
  layout();
  updateDots();

  // Responsive layout
  window.addEventListener("resize", layout);
})();
