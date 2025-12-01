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
    let isSectionFixed = false;
    let scrollLocked = false;

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
      
      phrases.forEach((phrase, index) => {
        if (index <= step) {
          setTimeout(() => {
            phrase.classList.add('mobile-visible');
          }, index * 100);
        } else {
          phrase.classList.remove('mobile-visible');
        }
      });
      
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
      if (isSectionFixed && mobileCurrentStep < phrases.length - 1) {
        e.preventDefault();
      }
    }

    window.addEventListener('scroll', checkSectionPosition, { passive: true });
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    showMobileStep(0);
    checkSectionPosition();
    
    return;
  }

  // ==================== DESKTOP VERSION ====================
  let currentIndex = -1;
  let hasInitialized = false;
  let isAnimating = false;
  let animationTimeout = null;
  let scrollListenerActive = true;
  let lastActivatedIndex = -1;

  function initializePhrases() {
    if (hasInitialized) return;
    hasInitialized = true;
    
    phrases.forEach((phrase, index) => {
      setTimeout(() => {
        phrase.classList.add('loaded');
      }, index * 200);
    });
  }

  function getScrollProgress() {
    const rect = aboutSection.getBoundingClientRect();
    const sectionHeight = aboutSection.offsetHeight;
    const viewportHeight = window.innerHeight;
    
    const scrollStart = -rect.top;
    const scrollRange = sectionHeight - viewportHeight;
    const progress = Math.max(0, Math.min(1, scrollStart / scrollRange));
    
    return progress;
  }

  function drawArrow(index) {
    const phrase = phrases[index];
    const description = document.getElementById(`aboutDesc${index + 1}`);
    const arrowPath = document.getElementById(`aboutArrowPath${index + 1}`);
    
    if (!phrase || !description || !arrowPath) return;

    const phraseRect = phrase.getBoundingClientRect();
    const descRect = description.getBoundingClientRect();
    
    const arrowConfig = [
      { offset: 0.25, pixelOffset: -130 },
      { offset: 0.1, pixelOffset: -50 },
      { offset: 0.5, pixelOffset: 0 },
      { offset: 0.2, pixelOffset: 0 }
    ];
    
    const config = arrowConfig[index];
    const arrowX = phraseRect.left + (phraseRect.width * config.offset) + config.pixelOffset;
    const descIsBelow = descRect.top > phraseRect.bottom;
    
    const startX = arrowX;
    const startY = descIsBelow ? phraseRect.bottom : phraseRect.top;
    const endX = arrowX;
    const endY = descIsBelow ? descRect.top : descRect.bottom;

    const pathData = `M ${startX} ${startY} L ${endX} ${endY}`;
    arrowPath.setAttribute('d', pathData);
    arrowPath.classList.add('visible');
  }

  function hideArrow(index) {
    const arrowPath = document.getElementById(`aboutArrowPath${index + 1}`);
    if (arrowPath) {
      arrowPath.classList.remove('visible');
    }
  }

  function activatePhrase(index) {
    if (index < 0 || index >= phrases.length) return;
    if (phrases[index].classList.contains('active') || lastActivatedIndex === index) return;
    
    lastActivatedIndex = index;
    phrases[index].classList.add('active');
    
    const borderPath = phrases[index].querySelector('.about-border-path');
    if (borderPath) {
      const pathLength = borderPath.getTotalLength();
      borderPath.style.strokeDasharray = pathLength;
      borderPath.style.strokeDashoffset = '0';
    }

    const description = document.getElementById(`aboutDesc${index + 1}`);
    if (description) {
      description.classList.add('visible');
    }

    setTimeout(() => {
      drawArrow(index);
    }, 100);
  }

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
    
    if (lastActivatedIndex === index) {
      lastActivatedIndex = -1;
    }
  }

  function updateOnScroll() {
    if (isAnimating) return;
    
    const rect = aboutSection.getBoundingClientRect();
    
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      initializePhrases();
    }
    
    if (rect.top > window.innerHeight || rect.bottom < 0) {
      return;
    }
    
    const progress = getScrollProgress();
    
    const thresholds = [
      { start: 0.1, end: 0.25 },
      { start: 0.25, end: 0.5 },
      { start: 0.5, end: 0.7 },
      { start: 0.7, end: 0.95 }
    ];
    
    let newIndex = -1;
    
    for (let i = 0; i < thresholds.length; i++) {
      if (progress >= thresholds[i].start) {
        newIndex = i;
      }
    }
    
    if (newIndex !== currentIndex) {
      if (isAnimating && newIndex === lastActivatedIndex) {
        return;
      }
      
      scrollListenerActive = false;
      isAnimating = true;
      
      if (animationTimeout) {
        clearTimeout(animationTimeout);
      }
      
      if (currentIndex >= 0 && currentIndex !== newIndex) {
        deactivatePhrase(currentIndex);
      }
      
      if (newIndex >= 0) {
        activatePhrase(newIndex);
      }
      
      currentIndex = newIndex;
      
      animationTimeout = setTimeout(() => {
        isAnimating = false;
        scrollListenerActive = true;
      }, 1200);
    }
  }

  function handleScroll() {
    if (!scrollListenerActive) return;
    updateOnScroll();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  
  window.addEventListener('resize', () => {
    if (currentIndex >= 0) {
      drawArrow(currentIndex);
    }
  });
})();
