// ================================
// PROJECT PAGE GALLERY MODULE
// 3D carousel with active image in front, others fanned behind on both sides
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
  let currentIndex = 0;

  function layout() {
    const w = gallery.clientWidth;
    const h = gallery.clientHeight;
    const n = slides.length;
    if (!n) return;

    const isMobile = w < 600;
    const cardW = isMobile ? Math.max(260, Math.min(w * 0.8, 380)) : Math.min(w * 0.65, 800);
    const centerLeft = (w - cardW) / 2;

    slides.forEach((slide, i) => {
      // Calculate infinite loop distance
      let distance = i - currentIndex;
      
      // Wrap around for infinite loop (find shortest path)
      if (distance > n / 2) distance -= n;
      if (distance < -n / 2) distance += n;
      
      const absDistance = Math.abs(distance);
      
      // Position all cards centered by default
      slide.style.left = `${centerLeft}px`;
      slide.style.width = `${cardW}px`;
      slide.style.height = `${h}px`;

      // Only show active card + 2 cards on each side
      if (absDistance > 2) {
        slide.style.opacity = 0;
        slide.style.pointerEvents = 'none';
        slide.style.zIndex = -1;
        return;
      }

      if (distance === 0) {
        // Active card - front and center
        slide.style.transform = `translate3d(0, 0, 0) scale(1) rotateY(0deg)`;
        slide.style.zIndex = 100;
        slide.style.opacity = 1;
        slide.style.filter = `brightness(1)`;
        slide.style.pointerEvents = 'auto';
      } else {
        // Cards fan out on their respective sides (left stays left, right stays right)
        const isLeft = distance < 0;
        const stackPos = absDistance; // 1 or 2
        
        // Calculate offsets - each position gets its own offset
        const offsetX = isMobile 
          ? (isLeft ? -40 - (stackPos -1) * 40 : 40 + (stackPos - 1) * 40)
          : (isLeft ? -120 - (stackPos - 1) * 50 : 120 + (stackPos - 1) * 50);
        
        const offsetY = isMobile 
          ? -8 - (stackPos - 1) * 12 
          : -15 - (stackPos - 1) * 18;
        
        const rotation = isMobile
          ? (isLeft ? 28 + (stackPos - 1) * 8 : -28 - (stackPos - 1) * 8)
          : (isLeft ? 38 + (stackPos - 1) * 10 : -38 - (stackPos - 1) * 10);
        
        const scale = Math.max(0.7, 0.93 - (stackPos - 1) * 0.1);
        const brightness = Math.max(0.55, 0.88 - (stackPos - 1) * 0.15);

        slide.style.transform = `translate3d(${offsetX}px, ${offsetY}px, ${-stackPos * 50}px) scale(${scale}) rotateY(${rotation}deg)`;
        slide.style.zIndex = 100 - stackPos;
        slide.style.opacity = 1;
        slide.style.filter = `brightness(${brightness})`;
        slide.style.pointerEvents = 'auto';
      }
    });

    // Update dots
    [...dots.children].forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = (index + images.length) % images.length;
    layout();
  }

  function next() {
    goToSlide(currentIndex + 1);
  }

  function prev() {
    goToSlide(currentIndex - 1);
  }

  // Event listeners
  if (prevBtn) prevBtn.addEventListener("click", prev);
  if (nextBtn) nextBtn.addEventListener("click", next);

  dots.addEventListener("click", (e) => {
    const dot = e.target.closest(".gallery-dot");
    if (!dot) return;
    goToSlide(parseInt(dot.dataset.i, 10));
  });

  // Touch/swipe support
  let swipeTarget = document.querySelector(".project-gallery-wrap") || gallery;
  let startX = 0;
  let startY = 0;
  let isDragging = false;

  swipeTarget.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".gallery-arrow") || e.target.closest(".gallery-dot")) {
      return;
    }
    startX = e.clientX;
    startY = e.clientY;
    isDragging = true;
    swipeTarget.setPointerCapture(e.pointerId);
  });

  swipeTarget.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
  });

  swipeTarget.addEventListener("pointerup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    swipeTarget.releasePointerCapture(e.pointerId);

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const threshold = 50;

    // Swipe horizontally
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
      if (dx > 0) {
        prev();
      } else {
        next();
      }
    }
  });

  swipeTarget.addEventListener("pointercancel", (e) => {
    if (isDragging) {
      isDragging = false;
      swipeTarget.releasePointerCapture(e.pointerId);
    }
  });

  // Keyboard navigation
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  // Initial layout
  window.addEventListener("resize", layout);
  layout();

    isDragging = false;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      cycle(dx < 0 ? 1 : -1);
    }

    parallax.t = 0;
    layout();

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
