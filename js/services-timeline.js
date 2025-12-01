// Services Timeline Scroll Animation
(function () {
  const section = document.getElementById("services");
  const fillBar = document.querySelector(".services-timeline-fill");
  const dots = document.querySelectorAll(".timeline-dot");
  const serviceDetails = document.querySelectorAll(".service-detail-timeline");

  if (!section || !fillBar || dots.length === 0) return;

  const services = ["idea", "concept", "land", "design", "build", "operation"];
  let currentActiveIndex = 0;

  const isMobile = window.innerWidth <= 768;

  // Add height to section for scroll space (only on desktop)
  if (!isMobile) {
    const SCROLL_MULTIPLIER = 4; // Section will be 4x viewport height
    section.style.minHeight = `${SCROLL_MULTIPLIER * 100}vh`;
    
    // Wrapper to hold the sticky content
    const stickyWrapper = section.querySelector('.services-timeline-wrapper');
    if (stickyWrapper) {
      stickyWrapper.style.position = 'sticky';
      stickyWrapper.style.top = '0';
      stickyWrapper.style.height = '100vh';
    }
  }

  function updateTimeline() {
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    const viewportHeight = window.innerHeight;

    // Only animate when section is in view
    if (sectionTop <= 0 && sectionTop > -sectionHeight + viewportHeight) {
      // Calculate progress: 0 when section top hits viewport top, 1 when section bottom hits viewport bottom
      const scrolled = -sectionTop;
      let scrollRange = sectionHeight - viewportHeight;
      
      // For mobile, use a shorter scroll range for faster animation
      if (isMobile) {
        scrollRange = Math.min(scrollRange, viewportHeight * 1.5);
      }
      
      const progress = Math.max(0, Math.min(1, scrolled / scrollRange));

      // Update fill bar (width for desktop, height for mobile)
      if (isMobile) {
        fillBar.style.height = `${progress * 100}%`;
      } else {
        fillBar.style.width = `${progress * 100}%`;
      }

      // Calculate which service should be active
      const segmentSize = 1 / services.length;
      let newActiveIndex = 0;
      
      for (let i = 0; i < services.length; i++) {
        const dotThreshold = (i + 1) * segmentSize;
        if (progress >= dotThreshold - 0.01) {
          newActiveIndex = Math.min(i + 1, services.length - 1);
        }
      }
      
      if (progress < segmentSize - 0.01) {
        newActiveIndex = 0;
      }

      // Update active state
      if (newActiveIndex !== currentActiveIndex) {
        currentActiveIndex = newActiveIndex;

        dots.forEach((dot, index) => {
          if (index <= currentActiveIndex) {
            dot.classList.add("active");
          } else {
            dot.classList.remove("active");
          }
        });

        serviceDetails.forEach((detail, index) => {
          if (index === currentActiveIndex) {
            detail.classList.add("active");
          } else {
            detail.classList.remove("active");
          }
        });
      }
    }
  }

  // Throttle scroll updates
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateTimeline();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll);
  updateTimeline();
})();

