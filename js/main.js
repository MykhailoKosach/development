// MOBILE NAV DRAWER
const burgerBtn = document.getElementById("burgerBtn");
const mobileNav = document.getElementById("mobileNav");
const mobileNavBackdrop = document.getElementById("mobileNavBackdrop");

if (burgerBtn && mobileNav) {
  const toggleMobileNav = () => {
    const isOpen = mobileNav.classList.toggle("open");
    if (mobileNavBackdrop) {
      mobileNavBackdrop.classList.toggle("open", isOpen);
    }
    burgerBtn.classList.toggle("is-open", isOpen);
  };

  burgerBtn.addEventListener("click", toggleMobileNav);

  if (mobileNavBackdrop) {
    mobileNavBackdrop.addEventListener("click", toggleMobileNav);
  }

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      burgerBtn.classList.remove("is-open");
      if (mobileNavBackdrop) {
        mobileNavBackdrop.classList.remove("open");
      }
    });
  });
}


// YEAR IN FOOTER
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// MAP POPUP DATA
const mapPointsData = {
  riasne: {
    title: "Рясне",
    text: "Складський комплекс класу B+ із сучасною інженерією та продуманою логістикою.",
    link: "riasne.html",
  },
  pidriasne: {
    title: "Підрясне",
    text: "Сучасний комплекс класу A, переобладнаний під виробничі потреби, площею 41 000 м².",
    link: "pidriasne.html",
  },
  zymna: {
    title: "Зимна Вода",
    text: "Складський комплекс класу A+ площею 116 000 м² у зручній локації на Кільцевій дорозі Львова.",
    link: "zymna-voda.html",
  },
  drohobych: {
    title: "Дрогобич",
    text: "Складський комплекс із потенціалом розвитку логістичної інфраструктури.",
    link: "#",
  },
};

const mapPopup = document.getElementById("mapPopup");
const mapPopupClose = document.getElementById("mapPopupClose");
const mapPopupTitle = document.getElementById("mapPopupTitle");
const mapPopupText = document.getElementById("mapPopupText");
const mapPopupLink = document.getElementById("mapPopupLink");

if (mapPopup && mapPopupTitle && mapPopupText && mapPopupLink) {
  document.querySelectorAll(".map-point").forEach((point) => {
    point.addEventListener("click", () => {
      const key = point.getAttribute("data-location");
      const data = mapPointsData[key];
      if (!data) return;

      mapPopupTitle.textContent = data.title;
      mapPopupText.textContent = data.text;
      mapPopupLink.href = data.link;
      if (data.link === "#") {
        mapPopupLink.classList.add("disabled");
      } else {
        mapPopupLink.classList.remove("disabled");
      }
      mapPopup.classList.add("open");
    });
  });

  if (mapPopupClose) {
    mapPopupClose.addEventListener("click", () => {
      mapPopup.classList.remove("open");
    });
  }
}

// SERVICES LINE INTERACTION
const serviceButtons = document.querySelectorAll(".services-point");
const serviceDetails = document.querySelectorAll(".service-detail");

serviceButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-service");

    serviceButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    serviceDetails.forEach((detail) => {
      const id = detail.getAttribute("data-service-detail");
      detail.classList.toggle("active", id === target);
    });
  });
});

// PROJECTS SLIDER
const projectsTrack = document.getElementById("projectsTrack");
const projectsPrev = document.getElementById("projectsPrev");
const projectsNext = document.getElementById("projectsNext");

if (projectsTrack && projectsPrev && projectsNext) {
  const scrollAmount = 290;

  projectsPrev.addEventListener("click", () => {
    projectsTrack.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  });

  projectsNext.addEventListener("click", () => {
    projectsTrack.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  });

  // SWIPE FUNCTIONALITY
  let touchStartX = 0;
  let touchEndX = 0;
  let isDragging = false;

  projectsTrack.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    isDragging = true;
  }, { passive: true });

  projectsTrack.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    touchEndX = e.changedTouches[0].screenX;
  }, { passive: true });

  projectsTrack.addEventListener("touchend", () => {
    if (!isDragging) return;
    isDragging = false;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - scroll right
        projectsTrack.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      } else {
        // Swipe right - scroll left
        projectsTrack.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
      }
    }

    touchStartX = 0;
    touchEndX = 0;
  }
}

// ABOUT STEPS SCROLL VISIBILITY (only one highlighted)
// ABOUT STEPS SCROLL VISIBILITY (only for #about section)
const aboutSection = document.getElementById("about");
const aboutSteps = aboutSection
  ? aboutSection.querySelectorAll("[data-about-step]")
  : [];

if (aboutSteps.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      let visibleEntry = null;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleEntry = entry;
        }
      });
      if (visibleEntry) {
        aboutSteps.forEach((step) => step.classList.remove("visible"));
        visibleEntry.target.classList.add("visible");
      }
    },
    { rootMargin: "-40% 0px -40% 0px", threshold: 0.1 }
  );

  aboutSteps.forEach((step) => observer.observe(step));
}



// SIMPLE FORM HANDLER (no backend)
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Дякуємо за звернення! Ми зв’яжемося з вами найближчим часом.");
    contactForm.reset();
  });
}


// ================================
// PROJECTS DECK GALLERY (Реалізовані проєкти)
// ================================
(function () {
  const data = [
    {
      img: "https://picsum.photos/id/1011/1600/1000", // TODO: replace with real image path
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
      short: "Промисловий об’єкт у стратегічній локації з потенціалом розвитку логістики.",
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
          <span class="tag project-tag" aria-hidden="true">Реалізований проєкт</span>
        </div>
      </div>`;
    
    // Add click only to the tag button
    const tag = card.querySelector('.project-tag');
    if (tag && p.link && p.link !== "#") {
      tag.style.cursor = 'pointer';
      tag.addEventListener("click", (e) => {
        e.stopPropagation();
        window.location.href = p.link;
      });
    }
    
    gallery.appendChild(card);

    const d = document.createElement("span");
    d.className = "projects-dot" + (i === 0 ? " active" : "");
    d.dataset.i = i;
    dots.appendChild(d);
  });

  const slides = [...document.querySelectorAll(".projects-slide")];
  let order = slides.map((_, i) => i); // active is always order[0]
  const parallax = { t: 0 };

  function layout() {
    const w = gallery.clientWidth;
    const n = slides.length;
    if (!n) return;

    // Mobile layout
    if (w < 600) {
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
  document.querySelectorAll(".projects-arrow").forEach((btn) =>
    btn.addEventListener("click", () =>
      move(parseInt(btn.dataset.dir, 10))
    )
  );

  // Keyboard
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

  // Touch swipe controls
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  let isSwiping = false;

  gallery.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    isSwiping = true;
  }, { passive: true });

  gallery.addEventListener("touchmove", (e) => {
    if (!isSwiping) return;
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
  }, { passive: true });

  gallery.addEventListener("touchend", () => {
    if (!isSwiping) return;
    isSwiping = false;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diffX = touchStartX - touchEndX;
    const diffY = Math.abs(touchStartY - touchEndY);

    // Only process horizontal swipes (ignore vertical scrolling)
    if (Math.abs(diffX) > swipeThreshold && diffY < swipeThreshold) {
      if (diffX > 0) {
        // Swipe left - next slide
        move(1);
      } else {
        // Swipe right - previous slide
        move(-1);
      }
    }

    touchStartX = 0;
    touchStartY = 0;
    touchEndX = 0;
    touchEndY = 0;
  }

  // Pointer-based parallax (mobile only)
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

  // Resize throttle
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
})();

// LANGUAGE TOGGLE (visual only for now)
const langButtons = document.querySelectorAll(".lang-btn");

if (langButtons.length) {
  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      langButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      // TODO: hook real language switch here later
    });
  });
}
