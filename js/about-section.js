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
      const headerEl = document.querySelector('.site-header');
      const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 0;

      // Lock when the mission text (phrases) hits the very top under the header
      const anchorEl = aboutSection.querySelector('.about-mission-text') || phrases[0] || aboutSection;
      const anchorRect = anchorEl.getBoundingClientRect();
      const lockY = headerHeight;

      if (mobileCurrentStep >= phrases.length - 1) return;

      // Only lock when the anchor crosses the header line
      if (anchorRect.top <= lockY && anchorRect.bottom >= lockY) {
        const delta = anchorRect.top - lockY;

        // Snap-align to remove the white gap (section padding) before locking
        if (Math.abs(delta) <= 120) {
          window.scrollBy(0, delta);
        }

        lockPageScroll();
      }
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
  let sectionCentered = false;

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

  function isSectionCentered() {
    const rect = aboutSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const sectionCenter = rect.top + (rect.height / 2);
    const viewportCenter = viewportHeight / 2;
    
    // Check if section center is within 100px of viewport center
    return Math.abs(sectionCenter - viewportCenter) < 100;
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

  function checkIfCentered() {
    if (hasAnimated || animationInProgress) return;
    
    const rect = aboutSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Check if section is visible at all
    if (rect.top > viewportHeight || rect.bottom < 0) return;
    
    // Check if section is centered
    if (isSectionCentered() && !sectionCentered) {
      sectionCentered = true;
      runAutoAnimation();
    }
  }

  window.addEventListener('scroll', checkIfCentered, { passive: true });
  
  // Check on load in case section is already centered
  checkIfCentered();
  
  window.addEventListener('resize', () => {
    // Redraw all visible arrows on resize
    phrases.forEach((phrase, index) => {
      if (phrase.classList.contains('active') || descriptions[index]?.classList.contains('visible')) {
        drawArrow(index);
      }
    });
  });
})();
