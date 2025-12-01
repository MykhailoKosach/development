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
    console.log("move() called with dir:", dir);
    console.log("order before:", [...order]);
    if (dir > 0) {
      order.push(order.shift());
    } else {
      order.unshift(order.pop());
    }
    console.log("order after:", [...order]);
    console.log("calling layout()");
    layout();
    console.log("layout() finished");
  }

  // Arrow controls
  const arrowButtons = document.querySelectorAll(".projects-arrow");
  console.log("Found arrow buttons:", arrowButtons.length);
  arrowButtons.forEach((btn) => {
    console.log("Adding click to arrow:", btn.className, btn.dataset.dir);
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("Arrow clicked, dir:", btn.dataset.dir);
      move(parseInt(btn.dataset.dir, 10));
    });
  });

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

  // Pointer swipe controls (horizontal only)
  let pointerActive = false;
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let startTime = 0;

  const swipeDistance = 150; // base horizontal distance to trigger
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
    // Don't capture if clicking on arrows or dots
    if (e.target.closest('.projects-arrow') || e.target.closest('.projects-dot')) {
      return;
    }
    
    pointerActive = true;
    pointerId = e.pointerId;
    startX = e.clientX;
    startY = e.clientY;
    startTime = performance.now();
    // Capture to keep receiving events even when finger leaves child nodes
    if (swipeTarget.setPointerCapture) {
      swipeTarget.setPointerCapture(pointerId);
    }
  }, { passive: true });

  swipeTarget.addEventListener("pointermove", (e) => {
    if (!pointerActive) return;
    // No-op: we evaluate on pointerup; move is kept for potential future live feedback.
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

  // Fade/slide section in when entering viewport
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

// ================================
// ABOUT SECTION - MISSION SCROLLER
// ================================
(function() {
  const aboutSection = document.getElementById('about');
  if (!aboutSection) return;

  const phrases = aboutSection.querySelectorAll('.about-phrase');
  const descriptions = aboutSection.querySelectorAll('.about-desc');
  const container = aboutSection.querySelector('.about-scroller-container');
  
  const isMobile = window.innerWidth <= 720;

  // ==================== MOBILE VERSION ====================
  if (isMobile) {
    let mobileCurrentStep = 0;
    let touchStartY = 0;
    let touchStartX = 0;
    let isAnimating = false;
    let isSectionFixed = false;
    let scrollLocked = false;

    // Lock/unlock body scroll
    function lockScroll() {
      if (!scrollLocked) {
        scrollLocked = true;
        document.body.style.overflow = 'hidden';
      }
    }

    function unlockScroll() {
      if (scrollLocked) {
        scrollLocked = false;
        document.body.style.overflow = '';
      }
    }

    // Make section fixed when user scrolls to it
    function checkSectionPosition() {
      const rect = aboutSection.getBoundingClientRect();
      
      if (rect.top <= 100 && !isSectionFixed && mobileCurrentStep < phrases.length - 1) {
        isSectionFixed = true;
        lockScroll();
        aboutSection.style.position = 'fixed';
        aboutSection.style.top = '0';
        aboutSection.style.left = '0';
        aboutSection.style.right = '0';
        aboutSection.style.zIndex = '100';
      }
    }

    function showMobileStep(step) {
      if (step < 0 || step >= phrases.length) return;
      
      mobileCurrentStep = step;
      
      // If reached last step, unlock scroll and unfix section
      if (step === phrases.length - 1) {
        setTimeout(() => {
          isSectionFixed = false;
          unlockScroll();
          aboutSection.style.position = '';
          aboutSection.style.top = '';
          aboutSection.style.left = '';
          aboutSection.style.right = '';
          aboutSection.style.zIndex = '';
        }, 600);
      }
      
      // Show all phrases up to current step (cumulative)
      phrases.forEach((phrase, index) => {
        if (index <= step) {
          setTimeout(() => {
            phrase.classList.add('mobile-visible');
          }, index * 100);
        } else {
          phrase.classList.remove('mobile-visible');
        }
      });
      
      // Show all descriptions up to current step (stacked vertically)
      descriptions.forEach((desc, index) => {
        if (index <= step) {
          setTimeout(() => {
            desc.classList.add('mobile-visible');
          }, 200 + (index * 100));
        } else {
          desc.classList.remove('mobile-visible');
        }
      });
    }

    function handleTouchStart(e) {
      if (!isSectionFixed) return;
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    }

    function handleTouchEnd(e) {
      if (!isSectionFixed) return;
      if (isAnimating) return; // Prevent multiple rapid swipes
      
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const deltaY = touchStartY - touchEndY;
      const deltaX = Math.abs(touchStartX - touchEndX);
      
      // Check if swipe is more vertical than horizontal (ratio-based detection)
      const isVerticalSwipe = Math.abs(deltaY) > Math.abs(deltaX) * 0.5;
      
      // Minimum swipe distance
      if (isVerticalSwipe && Math.abs(deltaY) > 30) {
        e.preventDefault();
        isAnimating = true;
        
        if (deltaY > 0 && mobileCurrentStep < phrases.length - 1) {
          // Swipe up - next
          showMobileStep(mobileCurrentStep + 1);
        } else if (deltaY < 0 && mobileCurrentStep > 0) {
          // Swipe down - previous
          showMobileStep(mobileCurrentStep - 1);
        } else {
          // No valid action, unlock immediately
          isAnimating = false;
          return;
        }
        
        // Clear animation lock after transition completes
        setTimeout(() => {
          isAnimating = false;
        }, 700);
      }
    }

    // Prevent scroll when section is fixed
    function preventScroll(e) {
      if (isSectionFixed && mobileCurrentStep < phrases.length - 1) {
        e.preventDefault();
      }
    }

    // Initialize mobile
    window.addEventListener('scroll', checkSectionPosition, { passive: true });
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    showMobileStep(0);
    checkSectionPosition();
    
    return; // Exit here for mobile
  }

  // ==================== DESKTOP VERSION ====================
  let currentIndex = -1;
  let hasInitialized = false;
  let isAnimating = false;
  let animationTimeout = null;
  let scrollListenerActive = true;
  let lastActivatedIndex = -1;

  // Initialize phrases on first view
  function initializePhrases() {
    if (hasInitialized) return;
    hasInitialized = true;
    
    phrases.forEach((phrase, index) => {
      setTimeout(() => {
        phrase.classList.add('loaded');
      }, index * 200);
    });
  }

  // Calculate scroll progress within the about section
  function getScrollProgress() {
    const rect = aboutSection.getBoundingClientRect();
    const sectionHeight = aboutSection.offsetHeight;
    const viewportHeight = window.innerHeight;
    
    // Start when section enters viewport, end when it leaves
    const scrollStart = -rect.top;
    const scrollRange = sectionHeight - viewportHeight;
    const progress = Math.max(0, Math.min(1, scrollStart / scrollRange));
    
    return progress;
  }

  // Draw arrow from phrase to description
  function drawArrow(index) {
    const phrase = phrases[index];
    const description = document.getElementById(`aboutDesc${index + 1}`);
    const arrowPath = document.getElementById(`aboutArrowPath${index + 1}`);
    
    if (!phrase || !description || !arrowPath) return;

    const phraseRect = phrase.getBoundingClientRect();
    const descRect = description.getBoundingClientRect();
    
    // Define horizontal offset for arrow start point
    // Can use percentage (0-1) or add absolute pixel offset
    const arrowConfig = [
      { offset: 0.25, pixelOffset: -130 },  // Phrase 0: "Ми" - 25% + 10px left
      { offset: 0.1, pixelOffset: -50 },    // Phrase 1: "будуємо"
      { offset: 0.5, pixelOffset: 0 },     // Phrase 2: "більше ніж склади"
      { offset: 0.2, pixelOffset: 0 }      // Phrase 3: "ми будуємо можливості"
    ];
    
    const config = arrowConfig[index];
    
    // Calculate arrow X position: percentage of width + pixel adjustment
    const arrowX = phraseRect.left + (phraseRect.width * config.offset) + config.pixelOffset;
    
    // Determine if description is above or below phrase
    const descIsBelow = descRect.top > phraseRect.bottom;
    
    // Start point: custom X position on phrase edge (top or bottom)
    const startX = arrowX;
    const startY = descIsBelow ? phraseRect.bottom : phraseRect.top;
    
    // End point: same X position on description edge (perfectly vertical line)
    const endX = arrowX;
    const endY = descIsBelow ? descRect.top : descRect.bottom;

    // Perfectly straight vertical line
    const pathData = `M ${startX} ${startY} L ${endX} ${endY}`;
    arrowPath.setAttribute('d', pathData);
    
    // Show arrow smoothly
    arrowPath.classList.add('visible');
  }

  // Hide arrow
  function hideArrow(index) {
    const arrowPath = document.getElementById(`aboutArrowPath${index + 1}`);
    if (arrowPath) {
      arrowPath.classList.remove('visible');
    }
  }

  // Activate phrase based on index
  function activatePhrase(index) {
    if (index < 0 || index >= phrases.length) return;
    
    // Don't re-activate if already active OR if it was the last one we activated
    if (phrases[index].classList.contains('active') || lastActivatedIndex === index) return;
    
    lastActivatedIndex = index;
    phrases[index].classList.add('active');
    
    const borderPath = phrases[index].querySelector('.about-border-path');
    if (borderPath) {
      const pathLength = borderPath.getTotalLength();
      borderPath.style.strokeDasharray = pathLength;
      borderPath.style.strokeDashoffset = '0';
    }

    // Show description and keep it visible
    const description = document.getElementById(`aboutDesc${index + 1}`);
    if (description) {
      description.classList.add('visible');
    }

    // Draw arrow after a small delay to ensure smooth rendering
    setTimeout(() => {
      drawArrow(index);
    }, 100);
  }

  // Deactivate phrase
  function deactivatePhrase(index) {
    if (index < 0 || index >= phrases.length) return;
    
    phrases[index].classList.remove('active');
    
    const borderPath = phrases[index].querySelector('.about-border-path');
    if (borderPath) {
      const pathLength = borderPath.getTotalLength();
      borderPath.style.strokeDasharray = pathLength;
      borderPath.style.strokeDashoffset = pathLength;
    }

    hideArrow(index);
    
    // Reset last activated when deactivating
    if (lastActivatedIndex === index) {
      lastActivatedIndex = -1;
    }
  }

  // Update based on scroll progress
  function updateOnScroll() {
    // Skip updates if currently animating
    if (isAnimating) return;
    
    const rect = aboutSection.getBoundingClientRect();
    
    // Initialize when section enters viewport
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      initializePhrases();
    }
    
    // Only process if section is in viewport
    if (rect.top > window.innerHeight || rect.bottom < 0) {
      return;
    }
    
    const progress = getScrollProgress();
    
    // Define thresholds for each phrase (0 to 1) - non-overlapping ranges
    const thresholds = [
      { start: 0.1, end: 0.25 },   // Phrase 0: "Ми"
      { start: 0.25, end: 0.5 },   // Phrase 1: "будуємо"
      { start: 0.5, end: 0.7 },    // Phrase 2: "більше ніж склади"
      { start: 0.7, end: 0.95 }    // Phrase 3: "ми будуємо можливості"
    ];
    
    let newIndex = -1;
    
    // Determine which phrase should be active (find the last matching one)
    for (let i = 0; i < thresholds.length; i++) {
      if (progress >= thresholds[i].start) {
        newIndex = i;
      }
    }
    
    // Update active phrase if changed
    if (newIndex !== currentIndex) {
      // Additional safety check - skip if already animating to this exact phrase
      if (isAnimating && newIndex === lastActivatedIndex) {
        return;
      }
      
      // Disable scroll listener during animation
      scrollListenerActive = false;
      isAnimating = true;
      
      // Clear any existing timeout
      if (animationTimeout) {
        clearTimeout(animationTimeout);
      }
      
      // Deactivate old phrase (only if it's different from new one)
      if (currentIndex >= 0 && currentIndex !== newIndex) {
        deactivatePhrase(currentIndex);
      }
      
      // Activate new phrase
      if (newIndex >= 0) {
        activatePhrase(newIndex);
      }
      
      currentIndex = newIndex;
      
      // Release animation lock after border and arrow animations complete
      // Border animation: 1s, Arrow drawing: ~150ms total (100ms delay + 50ms)
      animationTimeout = setTimeout(() => {
        isAnimating = false;
        scrollListenerActive = true;
      }, 1200);
    }
  }

  // Scroll event listener with throttling during animation
  function handleScroll() {
    if (!scrollListenerActive) return;
    updateOnScroll();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Resize handler
  window.addEventListener('resize', () => {
    if (currentIndex >= 0) {
      drawArrow(currentIndex);
    }
  });

  // Initial check - don't run immediately, wait for first scroll
  // This prevents double-triggering on page load
  // updateOnScroll();
})();
