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
    const isMobileView = window.innerWidth <= 768;

    // Check if animation should run
    // Desktop: sticky logic requires sectionTop <= 0 (pinned)
    // Mobile: just needs to be in viewport
    const isDesktopActive = !isMobileView && (sectionTop <= 0 && sectionTop > -sectionHeight + viewportHeight);
    const isMobileActive = isMobileView && (rect.bottom > 0 && rect.top < viewportHeight);

    if (isDesktopActive || isMobileActive) {
      // Calculate progress: 0 when section top hits viewport top, 1 when section bottom hits viewport bottom
      const scrolled = -sectionTop;
      let scrollRange = sectionHeight - viewportHeight;
      
      // For mobile, use a shorter scroll range for faster animation
      if (isMobileView) {
        const timeline = section.querySelector('.services-timeline');
        if (timeline) {
          const timelineRect = timeline.getBoundingClientRect();
          const triggerPoint = viewportHeight * 0.5; // Center of screen
          
          // Calculate fill height: distance from timeline top to trigger point
          let fillHeight = triggerPoint - timelineRect.top;
          
          // Calculate max height (last dot position)
          let maxFillHeight = timelineRect.height;
          if (serviceDetails.length > 0) {
             const lastService = serviceDetails[serviceDetails.length - 1];
             const lastServiceRect = lastService.getBoundingClientRect();
             maxFillHeight = lastServiceRect.top - timelineRect.top + 14;
          }

          // Clamp to valid range
          fillHeight = Math.max(0, Math.min(fillHeight, maxFillHeight));
          
          fillBar.style.height = `${fillHeight}px`;
          
          // Determine active item based on fill position
          let activeIndex = -1;
          
          serviceDetails.forEach((detail, index) => {
            const detailRect = detail.getBoundingClientRect();
            // Dot is roughly at top: 8px relative to detail
            const dotTop = detailRect.top - timelineRect.top + 8;
            
            if (fillHeight >= dotTop) {
              activeIndex = index;
            }
          });
          
          // Default to first item if visible or just started
          if (activeIndex < 0 && fillHeight > 0) activeIndex = 0;
          
          if (activeIndex !== -1 && activeIndex !== currentActiveIndex) {
            currentActiveIndex = activeIndex;
            
            serviceDetails.forEach((detail, index) => {
              if (index <= currentActiveIndex) {
                detail.classList.add("active");
              } else {
                detail.classList.remove("active");
              }
            });
          }
        }
      } else {
        // Desktop logic
        const progress = Math.max(0, Math.min(1, scrolled / scrollRange));
        
        // Calculate max width based on timeline container padding (32px total)
        // We want 100% progress to match the last dot position
        const timeline = section.querySelector('.services-timeline');
        if (timeline) {
           const timelineWidth = timeline.getBoundingClientRect().width;
           // 32px is the total horizontal padding (16px left + 16px right)
           const maxFillWidth = timelineWidth - 32; 
           fillBar.style.width = `${progress * maxFillWidth}px`;
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

  function setMobileTimelineHeight() {
    const isMobileView = window.innerWidth <= 768;
    const timeline = section.querySelector('.services-timeline');
    const baseLine = timeline?.querySelector('.services-timeline-base');
    
    if (isMobileView && timeline && baseLine && serviceDetails.length > 0) {
      const lastService = serviceDetails[serviceDetails.length - 1];
      const timelineRect = timeline.getBoundingClientRect();
      const lastServiceRect = lastService.getBoundingClientRect();
      
      // Calculate height to reach the center of the last dot
      // Dot is at top: 8px, height: 12px -> center at 14px relative to item top
      const height = lastServiceRect.top - timelineRect.top + 14;
      
      baseLine.style.height = `${height}px`;
    } else if (baseLine) {
      baseLine.style.height = '';
    }
  }

  // Call on load and resize
  setMobileTimelineHeight();
  window.addEventListener('resize', () => {
      setMobileTimelineHeight();
      updateTimeline();
  });

  window.addEventListener("scroll", onScroll);
  updateTimeline();
})();

