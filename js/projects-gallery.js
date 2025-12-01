// ================================
// PROJECTS GALLERY MODULE
// Deck-style project gallery with swipe/drag support
// ================================

(function () {
  const data = [
    {
      img: "https://picsum.photos/id/1011/1600/1000",
      name: "Зимна Вода",
      short: "Складський комплекс класу А+ площею 116 000 м² на Кільцевій дорозі Львова.",
      area: "116 000 м²",
      type: "Сухий, холодильний",
      cls: "A+",
      location: "Кільцева дорога Львова",
      link: "zymna-voda.html"
    },
    {
      img: "https://picsum.photos/id/1003/1600/1000",
      name: "Підрясне",
      short: "Сучасний комплекс класу A, переобладнаний під виробничі потреби, 41 000 м².",
      area: "41 000 м²",
      type: "Сухий, виробничий",
      cls: "A",
      location: "Промислова зона Підрясне",
      link: "pidriasne.html"
    },
    {
      img: "https://picsum.photos/id/1005/1600/1000",
      name: "Рясне",
      short: "Складський комплекс класу B+ площею 7 235,6 м² із сучасною інженерією.",
      area: "7 235,6 м²",
      type: "Сухий, холодильний",
      cls: "B+",
      location: "Рясне, Львів",
      link: "riasne.html"
    },
    {
      img: "https://picsum.photos/id/1016/1600/1000",
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

  // Build slides & dots
  data.forEach((p, i) => {
    const card = document.createElement("article");
    card.className = "projects-slide";
    card.setAttribute("role", "group");
    card.setAttribute("aria-roledescription", "slide");
    card.setAttribute("aria-label", `${i + 1} з ${data.length}: ${p.name}`);
    
    const tagHtml = p.link && p.link !== "#" 
      ? `<a href="${p.link}" class="tag project-tag">Реалізований проєкт</a>`
      : `<span class="tag project-tag" aria-hidden="true">Реалізований проєкт</span>`;
    
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
  let order = slides.map((_, i) => i);
  const parallax = { t: 0 };

  function layout() {
    const w = gallery.clientWidth;
    const n = slides.length;
    if (!n) return;

    if (w < 600) {
      // Mobile layout
      const peek = Math.max(20, Math.min(30, w * 0.06));
      const activeW = Math.max(220, Math.min(w - 2 * peek, 500));
      const center = (w - activeW) / 2;
      const prevIdx = order[n - 1];
      const nextIdx = order[1];

      slides.forEach((el, i) => {
        const pos = order.indexOf(i);
        el.style.pointerEvents = "none";

        if (pos === 0) {
          const dx = parallax.t * 8;
          el.style.left = `${center + dx}px`;
          el.style.width = `${activeW}px`;
          el.style.transform = "scale(1)";
          el.style.filter = "grayscale(0) saturate(1)";
          el.style.zIndex = 100;
          el.style.opacity = 1;
          el.style.pointerEvents = "auto";
        } else if (i === nextIdx) {
          const dx = parallax.t * 18;
          el.style.left = `${w - peek + dx}px`;
          el.style.width = `${activeW}px`;
          el.style.transform = "scale(0.96)";
          el.style.filter = "grayscale(1) brightness(.9)";
          el.style.zIndex = 90;
          el.style.opacity = 1;
          el.style.pointerEvents = "auto";
        } else if (i === prevIdx) {
          const dx = -parallax.t * 18;
          el.style.left = `${-activeW + peek + dx}px`;
          el.style.width = `${activeW}px`;
          el.style.transform = "scale(0.96)";
          el.style.filter = "grayscale(1) brightness(.9)";
          el.style.zIndex = 90;
          el.style.opacity = 1;
          el.style.pointerEvents = "auto";
        } else {
          el.style.left = `${center}px`;
          el.style.width = `${activeW}px`;
          el.style.transform = "scale(0.9)";
          el.style.filter = "grayscale(1) brightness(.7)";
          el.style.zIndex = 1;
          el.style.opacity = 0;
        }
      });

      [...dots.children].forEach((d, idx) =>
        d.classList.toggle("active", order[0] === idx)
      );
      return;
    }

    // Desktop deck layout
    let r = w <= 900 ? 0.66 : 0.7;
    let activeW = Math.min(Math.max(260, w * r), w - 12);
    const peek = Math.max(56, Math.min(160, w * 0.12));
    const nStack = Math.max(0, slides.length - 1);

    let stackStart = activeW - peek;
    let minStep = Math.max(12, Math.min(26, w * 0.03));
    let maxStep = Math.max(28, Math.min(56, w * 0.06));
    let minStackW = Math.max(140, Math.min(260, w * 0.28));

    let s = nStack > 1 ? (w - stackStart - minStackW) / (nStack - 1) : maxStep;
    s = Math.max(minStep, Math.min(maxStep, isFinite(s) ? s : maxStep));
    let stackW = w - stackStart - (nStack - 1) * s;

    if (stackW < minStackW) {
      const deficit = minStackW - stackW;
      activeW = Math.max(220, activeW - deficit - 8);
      stackStart = activeW - peek;
      s = nStack > 1 ? (w - stackStart - minStackW) / (nStack - 1) : maxStep;
      s = Math.max(minStep, Math.min(maxStep, isFinite(s) ? s : maxStep));
      stackW = w - stackStart - (nStack - 1) * s;
    }

    stackW = Math.max(minStackW, Math.min(stackW, Math.max(200, activeW * 0.9)));

    slides.forEach((el, i) => {
      const pos = order.indexOf(i);
      el.style.pointerEvents = "auto";

      if (pos === 0) {
        el.style.left = `0px`;
        el.style.width = `${activeW}px`;
        el.style.transform = "scale(1)";
        el.style.filter = "grayscale(0) saturate(1)";
        el.style.zIndex = 100;
        el.style.opacity = 1;
      } else {
        const k = pos - 1;
        const left = stackStart + k * s;
        const scale = Math.max(0.82, 0.96 - k * 0.04);
        el.style.left = `${left}px`;
        el.style.width = `${stackW}px`;
        el.style.transform = `scale(${scale})`;
        el.style.filter = "grayscale(0.1) brightness(.96)";
        el.style.zIndex = 90 - k;
        el.style.opacity = 1;
      }
    });

    [...dots.children].forEach((d, idx) =>
      d.classList.toggle("active", order[0] === idx)
    );
  }

  function move(dir) {
    if (dir > 0) {
      order.push(order.shift());
    } else {
      order.unshift(order.pop());
    }
    layout();
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
      const idx = parseInt(d.dataset.i, 10);
      const pos = order.indexOf(idx);
      for (let t = 0; t < pos; t++) order.push(order.shift());
      layout();
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

  // Parallax on mobile
  gallery.addEventListener("pointermove", (e) => {
    const w = gallery.clientWidth;
    if (w >= 600) return;
    const rect = gallery.getBoundingClientRect();
    const x = (e.clientX - rect.left) / Math.max(1, w);
    parallax.t = Math.max(-0.5, Math.min(0.5, x - 0.5));
    layout();
  });

  gallery.addEventListener("pointerleave", () => {
    parallax.t = 0;
    layout();
  });

  // Resize handler
  let t;
  window.addEventListener("resize", () => {
    clearTimeout(t);
    t = setTimeout(() => {
      parallax.t = 0;
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
