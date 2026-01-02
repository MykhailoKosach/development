// ================================
// ABOUT SECTION - MISSION SCROLLER
// Mobile: Swipe-based cumulative reveal
// Desktop: Scroll-triggered phrase activation with arrows
// ================================

(function() {
  const aboutSection = document.getElementById('about');
  if (!aboutSection) return;

  const phrases = aboutSection.querySelectorAll('.about-phrase');
  const descriptions = aboutSection.querySelectorAll('.about-desc');
  const container = aboutSection.querySelector('.about-scroller-container');

  function getHeaderHeight() {
    const headerEl = document.querySelector('.site-header');
    return headerEl ? headerEl.getBoundingClientRect().height : 0;
  }

  function syncHeaderCssVar() {
    const headerHeight = getHeaderHeight();
    if (headerHeight > 0) {
      document.documentElement.style.setProperty('--header-h', `${Math.round(headerHeight)}px`);
    }
  }

  syncHeaderCssVar();
  window.addEventListener('resize', syncHeaderCssVar, { passive: true });
  
  const isMobile = window.innerWidth <= 720;

  // ==================== MOBILE VERSION ====================
  if (isMobile) {
    let mobileCurrentStep = 0;
    let touchStartY = 0;
    let touchStartX = 0;
    let isAnimating = false;
    let isLocked = false;

    function lockPageScroll() {
      if (isLocked) return;
      isLocked = true;

      // Lock scrolling without changing scroll position (prevents jump-to-top flash)
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'none';
    }

    function unlockPageScroll() {
      if (!isLocked) return;
      isLocked = false;

      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.overscrollBehavior = '';
    }

    function checkSectionPosition() {
      if (isLocked) return;
      const headerHeight = getHeaderHeight();
      const scrollerEl = container || aboutSection;
      const rect = scrollerEl.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (mobileCurrentStep >= phrases.length - 1) return;

      // Lock only when the full-screen scroller fits the viewport under the fixed header.
      // If close, snap-align scroller top to the header line, then lock.
      const snapTolerance = 140;
      const fitsTop = Math.abs(rect.top - headerHeight) <= snapTolerance;
      const fitsBottom = Math.abs(rect.bottom - viewportHeight) <= snapTolerance;
      if (!fitsTop || !fitsBottom) return;

      const delta = rect.top - headerHeight;
      if (Math.abs(delta) <= snapTolerance) {
        window.scrollBy(0, delta);
      }

      lockPageScroll();
    }

    function showMobileStep(step) {
      if (step < 0 || step >= phrases.length) return;
      
      mobileCurrentStep = step;
      
      if (step === phrases.length - 1) {
        // Unlock after the last card transition completes
        const unlockDelay = 650;
        window.setTimeout(() => {
          unlockPageScroll();
        }, unlockDelay);
      }
      
      // Phrases are always rendered on mobile; only update active (red) phrase
      phrases.forEach((phrase, index) => {
        if (index === step) {
          phrase.classList.add('mobile-active');
        } else {
          phrase.classList.remove('mobile-active');
        }
      });
      
      descriptions.forEach((desc, index) => {
        if (index <= step) {
          // Keep cards and active phrase in sync (no JS delay)
          desc.classList.add('mobile-visible');
          if (index === step) {
            desc.classList.add('mobile-active');
          } else {
            desc.classList.remove('mobile-active');
          }
        } else {
          desc.classList.remove('mobile-visible');
          desc.classList.remove('mobile-active');
        }
      });
    }

    function handleTouchStart(e) {
      if (!isLocked) return;
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    }

    function handleTouchEnd(e) {
      if (!isLocked) return;
      if (isAnimating) return;
      
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const deltaY = touchStartY - touchEndY;
      const deltaX = Math.abs(touchStartX - touchEndX);
      
      const isVerticalSwipe = Math.abs(deltaY) > Math.abs(deltaX) * 0.5;
      
      if (isVerticalSwipe && Math.abs(deltaY) > 30) {
        e.preventDefault();
        isAnimating = true;
        
        if (deltaY > 0 && mobileCurrentStep < phrases.length - 1) {
          showMobileStep(mobileCurrentStep + 1);
        } else if (deltaY < 0 && mobileCurrentStep > 0) {
          showMobileStep(mobileCurrentStep - 1);
        } else {
          isAnimating = false;
          return;
        }
        
        setTimeout(() => {
          isAnimating = false;
        }, 700);
      }
    }

    function preventScroll(e) {
      if (isLocked && mobileCurrentStep < phrases.length - 1) {
        e.preventDefault();
      }
    }

    window.addEventListener('scroll', checkSectionPosition, { passive: true });
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    aboutSection.addEventListener('touchstart', handleTouchStart, { passive: true });
    aboutSection.addEventListener('touchend', handleTouchEnd, { passive: false });
    showMobileStep(0);
    checkSectionPosition();
    
    return;
  }

  // ==================== DESKTOP VERSION ====================
  let hasAnimated = false;
  let animationInProgress = false;
  let scrollLocked = false;
  let sectionFitted = false;

  function computeBorderLength(borderRectEl) {
    // SVGRectElement supports getTotalLength in modern browsers, but fall back to bbox perimeter.
    try {
      if (typeof borderRectEl.getTotalLength === 'function') {
        const len = borderRectEl.getTotalLength();
        if (Number.isFinite(len) && len > 0) return len;
      }
    } catch (_) {
      // ignore
    }

    try {
      const bbox = borderRectEl.getBBox();
      const w = bbox?.width || 0;
      const h = bbox?.height || 0;
      const len = 2 * (w + h);
      if (Number.isFinite(len) && len > 0) return len;
    } catch (_) {
      // ignore
    }

    return 1000;
  }

  function resetBorderAnimation(phraseEl) {
    const borderRectEl = phraseEl?.querySelector('.about-border-path');
    if (!borderRectEl) return;

    const len = borderRectEl.dataset.borderLen
      ? Number(borderRectEl.dataset.borderLen)
      : computeBorderLength(borderRectEl);
    borderRectEl.dataset.borderLen = String(len);

    // Prevent the "double draw" effect by disabling transition during reset.
    borderRectEl.style.transition = 'none';
    borderRectEl.style.strokeDasharray = String(len);
    borderRectEl.style.strokeDashoffset = String(len);
    // Force style flush
    void borderRectEl.getBoundingClientRect();
    borderRectEl.style.transition = '';
  }

  function playBorderAnimation(phraseEl) {
    const borderRectEl = phraseEl?.querySelector('.about-border-path');
    if (!borderRectEl) return;

    resetBorderAnimation(phraseEl);
    requestAnimationFrame(() => {
      borderRectEl.style.strokeDashoffset = '0';
    });
  }

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

  function isScrollerFittedToViewport() {
    const headerHeight = getHeaderHeight();
    const scrollerEl = container || aboutSection;
    const rect = scrollerEl.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const tolerance = 100;
    return Math.abs(rect.top - headerHeight) < tolerance && Math.abs(rect.bottom - viewportHeight) < tolerance;
  }

  function snapScrollerToHeaderIfClose() {
    const headerHeight = getHeaderHeight();
    const scrollerEl = container || aboutSection;
    const rect = scrollerEl.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const snapTolerance = 140;
    const fitsBottom = Math.abs(rect.bottom - viewportHeight) <= snapTolerance;
    if (!fitsBottom) return false;

    const delta = rect.top - headerHeight;
    if (Math.abs(delta) <= snapTolerance) {
      window.scrollBy(0, delta);
      return true;
    }

    return false;
  }

  function drawArrow(index) {
    const phrase = phrases[index];
    const description = document.getElementById(`aboutDesc${index + 1}`);
    const arrowPath = document.getElementById(`aboutArrowPath${index + 1}`);
    const arrowSvg = document.getElementById('aboutArrowContainer');
    
    if (!phrase || !description || !arrowPath || !arrowSvg) return;

    // Get the red border SVG element inside the phrase
    const borderSvg = phrase.querySelector('.about-border-svg');
    if (!borderSvg) return;
    
    const borderRect = borderSvg.getBoundingClientRect();
    const descRect = description.getBoundingClientRect();
    const svgRect = arrowSvg.getBoundingClientRect();
    
    // Calculate arrow position based on phrase index
    const arrowConfig = [
      { offset: 0.5, pixelOffset: 0 },  // "Ми" - shifted right
      { offset: 0.5, pixelOffset: -50 },   // "будуємо" - slightly left
      { offset: 0.5, pixelOffset: 100 },     // "більше ніж склади" - shifted right
      { offset: 0.5, pixelOffset: 0 }      // "ми будуємо можливості" - center
    ];
    
    const config = arrowConfig[index];
    const arrowXAbs = borderRect.left + (borderRect.width * config.offset) + config.pixelOffset;
    const descIsBelow = descRect.top > borderRect.bottom;

    // Start from the red border edge
    const gapFromBorder = 2;
    const startX = arrowXAbs - svgRect.left;
    const startY = (descIsBelow ? (borderRect.bottom - gapFromBorder) : (borderRect.top + gapFromBorder)) - svgRect.top;
    
    // End 15px before the description card
    const gapBeforeCard = 12;
    // Keep arrows perfectly straight (no angles)
    const endX = startX;
    const endY = (descIsBelow ? (descRect.top - gapBeforeCard) : (descRect.bottom + gapBeforeCard)) - svgRect.top;

    const pathData = `M ${startX} ${startY} L ${endX} ${endY}`;
    arrowPath.setAttribute('d', pathData);
    arrowPath.classList.add('visible');
  }

  function deactivatePhrase(index) {
    if (index < 0 || index >= phrases.length) return;
    
    // Remove only the active class (active highlight)
    phrases[index].classList.remove('active');

    // Reset border so next activation draws cleanly
    resetBorderAnimation(phrases[index]);
    
    // Keep arrows and descriptions visible
  }

  function activatePhrase(index, callback) {
    if (index < 0 || index >= phrases.length) {
      if (callback) callback();
      return;
    }
    
    // Deactivate previous phrase (remove red border)
    if (index > 0) {
      deactivatePhrase(index - 1);
    }
    
    // Highlight active phrase (text color via CSS)
    phrases[index].classList.add('active');

    // Re-run border draw animation on each activation
    playBorderAnimation(phrases[index]);

    // Phrases are always rendered; ensure loaded is set once (no stagger)
    phrases[index].classList.add('loaded');

    const description = document.getElementById(`aboutDesc${index + 1}`);
    if (description) {
      description.classList.add('visible');
    }

    setTimeout(() => {
      drawArrow(index);
      if (callback) callback();
    }, 100);
  }

  function runAutoAnimation() {
    if (hasAnimated || animationInProgress) return;
    
    animationInProgress = true;
    hasAnimated = true;
    lockScroll();

    // Ensure phrases are rendered immediately (no appearance animation)
    phrases.forEach((phrase) => {
      phrase.classList.add('loaded');
      // Prepare border dash state so first activation animates properly
      resetBorderAnimation(phrase);
    });

    // Activate each phrase sequentially with 2-second intervals
    const delays = [800, 2800, 4800, 6800]; // 2 seconds between each (800ms start + 2000ms intervals)
    
    delays.forEach((delay, index) => {
      setTimeout(() => {
        activatePhrase(index, () => {
          if (index === phrases.length - 1) {
            // After last phrase, wait a bit then unlock scroll
            setTimeout(() => {
              animationInProgress = false;
              unlockScroll();
            }, 1000);
          }
        });
      }, delay);
    });
  }

  function checkIfReady() {
    if (hasAnimated || animationInProgress) return;
    
    const rect = aboutSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Check if section is visible at all
    if (rect.top > viewportHeight || rect.bottom < 0) return;
    
    // Start only when the full-screen scroller fits the viewport (under header).
    // If it's close, snap-align first so the content is vertically centered while locked.
    if (!sectionFitted) {
      snapScrollerToHeaderIfClose();
      if (isScrollerFittedToViewport()) {
        sectionFitted = true;
        runAutoAnimation();
      }
    }
  }

  window.addEventListener('scroll', checkIfReady, { passive: true });
  
  // Check on load in case section is already centered
  checkIfReady();
  
  window.addEventListener('resize', () => {
    // Redraw all visible arrows on resize
    phrases.forEach((phrase, index) => {
      if (phrase.classList.contains('active') || descriptions[index]?.classList.contains('visible')) {
        drawArrow(index);
      }
    });
  });
})();
