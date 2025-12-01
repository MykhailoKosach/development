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
