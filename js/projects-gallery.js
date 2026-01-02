// ================================
// PROJECTS GALLERY MODULE
// Deck-style project gallery with swipe/drag support
// ================================

(function () {
  const data = [
    {
      img: "assets/zymna-main.jpg",
      name: "Зимна Вода",
      short: "Складський комплекс класу А+ площею 116 000 м² на Кільцевій дорозі Львова.",
      area: "116 000 м²",
      type: "Сухий, холодильний",
      cls: "A+",
      location: "Кільцева дорога Львова",
      link: "zymna-voda.html"
    },
    {
      img: "assets/pidryasne-main.jpg",
      name: "Підрясне",
      short: "Сучасний комплекс класу A, переобладнаний під виробничі потреби, 41 000 м².",
      area: "41 000 м²",
      type: "Сухий, виробничий",
      cls: "A",
      location: "Промислова зона Підрясне",
      link: "pidriasne.html"
    },
    {
      img: "assets/ryasne-main.jpg",
      name: "Рясне",
      short: "Складський комплекс класу B+ площею 7 235,6 м² із сучасною інженерією.",
      area: "7 235,6 м²",
      type: "Сухий, холодільний",
      cls: "B+",
      location: "Рясне, Львів",
      link: "riasne.html"
    },
    {
      img: "assets/drohobych-main.png",
      name: "Дрогобич",
      short: "Промисловий об'єкт у стратегічній локації з потенціалом розвитку логістики.",
      area: "—",
      type: "Складський, промисловий",
      cls: "—",
      location: "Дрогобич",
      link: "#"
    }
  ];

  const gallery = document.getElementById("projectsGallery");
  const dots = document.getElementById("projectsDots");
  if (!gallery || !dots) return;
  
  // Prevent double initialization
  if (gallery.dataset.initialized === 'true') return;
  gallery.dataset.initialized = 'true';

  // Build slides & dots
  data.forEach((p, i) => {
    const card = document.createElement("article");
    card.className = "projects-slide";
    card.setAttribute("role", "group");
    card.setAttribute("aria-roledescription", "slide");
    card.setAttribute("aria-label", `${i + 1} з ${data.length}: ${p.name}`);
    
    const tagHtml = p.link && p.link !== "#" 
      ? `<a href="${p.link}" class="tag project-tag">Детальніше</a>`
      : `<span class="tag project-tag" aria-hidden="true">Детальніше</span>`;
    
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" loading="lazy" />
      <div class="overlay">
        <div class="project-passport">
          <h3>${p.name}</h3>
          <p>${p.short}</p>
          <div class="meta">
            <div><strong>Площа:</strong> ${p.area}</div>
            <div><strong>Тип складу:</strong> ${p.type}</div>
            <div><strong>Клас:</strong> ${p.cls}</div>
            <div><strong>Локація:</strong> ${p.location}</div>
          </div>
          ${tagHtml}
        </div>
      </div>`;
    
    gallery.appendChild(card);

    const d = document.createElement("span");
    d.className = "projects-dot" + (i === 0 ? " active" : "");
    d.dataset.i = i;
    dots.appendChild(d);
  });

  const slides = [...document.querySelectorAll(".projects-slide")];
  let currentIndex = 0;

  function layout() {
    const w = gallery.clientWidth;
    const h = gallery.clientHeight;
    const n = slides.length;
    if (!n) return;

    if (w < 600) {
      // Mobile: 3D carousel with cards fanned on both sides (same as project-page-gallery)
      const cardW = Math.max(260, Math.min(w * 0.8, 380));
      const centerLeft = (w - cardW) / 2;

      slides.forEach((slide, i) => {
        // Calculate infinite loop distance
        let distance = i - currentIndex;
        
        // Wrap around for infinite loop (find shortest path)
        if (distance > n / 2) distance -= n;
        if (distance < -n / 2) distance += n;
        
        const absDistance = Math.abs(distance);
        
        slide.style.left = `${centerLeft}px`;
        slide.style.width = `${cardW}px`;
        slide.style.height = `${h}px`;

        // Only show active card + 2 cards on each side
        if (absDistance > 2) {
          slide.style.opacity = 0;
          slide.style.pointerEvents = 'none';
          slide.style.zIndex = -1;
          slide.style.transform = "translate3d(0, 0, 0) scale(0.8) rotateY(0deg)";
          slide.style.filter = "brightness(0.7)";
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
          // Cards fan out on their respective sides
          const isLeft = distance < 0;
          const stackPos = absDistance;
          
          const offsetX = isLeft ? -40 - (stackPos - 1) * 40 : 40 + (stackPos - 1) * 40;
          const offsetY = -8 - (stackPos - 1) * 12;
          const rotation = isLeft ? 28 + (stackPos - 1) * 8 : -28 - (stackPos - 1) * 8;
          const scale = Math.max(0.7, 0.93 - (stackPos - 1) * 0.1);
          const brightness = Math.max(0.55, 0.88 - (stackPos - 1) * 0.15);

          slide.style.transform = `translate3d(${offsetX}px, ${offsetY}px, ${-stackPos * 50}px) scale(${scale}) rotateY(${rotation}deg)`;
          slide.style.zIndex = 100 - stackPos;
          slide.style.opacity = 1;
          slide.style.filter = `brightness(${brightness})`;
          slide.style.pointerEvents = 'auto';
        }
      });

      [...dots.children].forEach((d, idx) =>
        d.classList.toggle("active", idx === currentIndex)
      );
      return;
    }

    // Desktop deck layout
    let order = slides.map((_, i) => i);
    // Rotate order array to match currentIndex
    for (let i = 0; i < currentIndex; i++) {
      order.push(order.shift());
    }

    // Account for arrow space: arrows are at side-margin - arrow-size - 10px
    // side-margin is 10vw, arrow-size is ~56px max, so we need padding
    const arrowSpace = Math.max(70, w * 0.1); // Reserve space for arrows on each side
    const usableWidth = w - (arrowSpace * 2);

    let r = w <= 900 ? 0.55 : 0.58;
    let activeW = Math.min(Math.max(220, usableWidth * r), usableWidth - 12);
    const peek = Math.max(45, Math.min(120, usableWidth * 0.1));
    const visibleCards = Math.min(slides.length - 1, 4); // Show up to 4 cards in stack

    let stackStart = activeW - peek;
    let minStep = Math.max(10, Math.min(22, usableWidth * 0.025));
    let maxStep = Math.max(24, Math.min(45, usableWidth * 0.05));
    let minStackW = Math.max(120, Math.min(220, usableWidth * 0.24));

    let s = visibleCards > 1 ? (usableWidth - stackStart - minStackW) / (visibleCards - 1) : maxStep;
    s = Math.max(minStep, Math.min(maxStep, isFinite(s) ? s : maxStep));
    let stackW = usableWidth - stackStart - (visibleCards - 1) * s;

    if (stackW < minStackW) {
      const deficit = minStackW - stackW;
      activeW = Math.max(200, activeW - deficit - 8);
      stackStart = activeW - peek;
      s = visibleCards > 1 ? (usableWidth - stackStart - minStackW) / (visibleCards - 1) : maxStep;
      s = Math.max(minStep, Math.min(maxStep, isFinite(s) ? s : maxStep));
      stackW = usableWidth - stackStart - (visibleCards - 1) * s;
    }

    stackW = Math.max(minStackW, Math.min(stackW, Math.max(180, activeW * 0.88)));

    // Center the deck in the available space
    const totalWidth = stackStart + stackW + (visibleCards - 1) * s;
    const leftOffset = arrowSpace + (usableWidth - totalWidth) / 2;

    slides.forEach((el, i) => {
      const pos = order.indexOf(i);
      el.style.pointerEvents = "auto";
      el.style.height = "100%";

      if (pos === 0) {
        el.style.left = `${leftOffset}px`;
        el.style.width = `${activeW}px`;
        el.style.transform = "scale(1)";
        el.style.filter = "grayscale(0) saturate(1)";
        el.style.zIndex = 100;
        el.style.opacity = 1;
      } else if (pos <= visibleCards) {
        const k = pos - 1;
        const left = leftOffset + stackStart + k * s;
        const scale = Math.max(0.82, 0.96 - k * 0.04);
        el.style.left = `${left}px`;
        el.style.width = `${stackW}px`;
        el.style.transform = `scale(${scale})`;
        el.style.filter = "grayscale(0.1) brightness(.96)";
        el.style.zIndex = 90 - k;
        el.style.opacity = 1;
      } else {
        // Hidden cards beyond visible stack
        el.style.left = `${leftOffset + stackStart}px`;
        el.style.width = `${stackW}px`;
        el.style.transform = "scale(0.8)";
        el.style.filter = "grayscale(0.3) brightness(.9)";
        el.style.zIndex = 1;
        el.style.opacity = 0;
        el.style.pointerEvents = "none";
      }
    });

    [...dots.children].forEach((d, idx) =>
      d.classList.toggle("active", idx === currentIndex)
    );
  }

  function goToSlide(index) {
    currentIndex = (index + data.length) % data.length;
    layout();
  }

  function next() {
    goToSlide(currentIndex + 1);
  }

  function prev() {
    goToSlide(currentIndex - 1);
  }

  function move(dir) {
    if (dir > 0) {
      next();
    } else {
      prev();
    }
  }

  // Arrow controls
  document.querySelectorAll(".projects-arrow").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      move(parseInt(btn.dataset.dir, 10));
    });
  });

  // Keyboard navigation
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") move(1);
    if (e.key === "ArrowLeft") move(-1);
  });

  // Dot navigation
  [...dots.children].forEach((d) =>
    d.addEventListener("click", () => {
      goToSlide(parseInt(d.dataset.i, 10));
    })
  );

  // Pointer swipe controls
  let pointerActive = false;
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let startTime = 0;

  const swipeDistance = 150;
  const projectsSection = document.getElementById("projects");
  const swipeTarget = projectsSection || gallery.parentElement || gallery;

  const resetPointer = () => {
    pointerActive = false;
    pointerId = null;
    startX = 0;
    startY = 0;
    startTime = 0;
  };

  swipeTarget.addEventListener("pointerdown", (e) => {
    // Don't capture if clicking on arrows, dots, or project links
    if (e.target.closest('.projects-arrow') || 
        e.target.closest('.projects-dot') || 
        e.target.closest('.project-tag')) {
      return;
    }
    
    pointerActive = true;
    pointerId = e.pointerId;
    startX = e.clientX;
    startY = e.clientY;
    startTime = performance.now();
    if (swipeTarget.setPointerCapture) {
      swipeTarget.setPointerCapture(pointerId);
    }
  }, { passive: true });

  swipeTarget.addEventListener("pointermove", (e) => {
    if (!pointerActive) return;
  }, { passive: true });

  swipeTarget.addEventListener("pointerup", (e) => {
    if (!pointerActive) return;
    const dx = e.clientX - startX;
    const dy = Math.abs(e.clientY - startY);
    const dt = performance.now() - startTime;
    const dynamicThreshold = dt < 320 ? 70 : swipeDistance;

    const horizontalEnough = Math.abs(dx) > dynamicThreshold;
    const verticalAcceptable = dy < Math.max(200, Math.abs(dx) * 0.75);
    if (horizontalEnough && verticalAcceptable) {
      move(dx < 0 ? 1 : -1);
    }
    resetPointer();
  }, { passive: true });

  swipeTarget.addEventListener("pointercancel", resetPointer, { passive: true });

  // Parallax removed for mobile (no longer needed with 3D carousel)

  // Resize handler
  let t;
  window.addEventListener("resize", () => {
    clearTimeout(t);
    t = setTimeout(() => {
      layout();
    }, 80);
  });

  // Initial layout
  layout();

  // Fade in on scroll
  const galleryWrap = document.querySelector(".projects-gallery-wrap");
  if (projectsSection && galleryWrap) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          galleryWrap.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      { threshold: 0.2 }
    );
    io.observe(projectsSection);
  }
})();
