// ================================
// SERVICES TIMELINE SECTION
// ================================

(function() {
  const section = document.getElementById('services');
  if (!section || !section.classList.contains('services-timeline-section')) return;

  const cards = section.querySelectorAll('.service-card');
  const dots = section.querySelectorAll('.timeline-dot');
  const fillLine = section.querySelector('.timeline-fill');
  
  const TOTAL_STEPS = cards.length;
  let isFixed = false;
  let scrollStart = 0;

  function handleScroll() {
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Section reaches top - fix it
    if (rect.top <= 0 && !isFixed) {
      isFixed = true;
      section.style.position = 'fixed';
      section.style.top = '0';
      section.style.left = '0';
      section.style.width = '100%';
      section.style.height = '100vh';
      section.style.zIndex = '100';
      scrollStart = window.pageYOffset;
      
      // Add spacer to maintain scroll
      const spacer = document.createElement('div');
      spacer.id = 'services-spacer';
      spacer.style.height = `${viewportHeight * TOTAL_STEPS}px`;
      section.parentNode.insertBefore(spacer, section);
    }
    
    // Calculate progress while fixed
    if (isFixed) {
      const scrolled = window.pageYOffset - scrollStart;
      const maxScroll = viewportHeight * (TOTAL_STEPS - 1);
      let progress = Math.max(0, Math.min(1, scrolled / maxScroll));
      
      // Update timeline fill
      if (fillLine) {
        fillLine.style.width = `${progress * 100}%`;
      }
      
      // Update dots and cards
      dots.forEach((dot, i) => {
        const stepProgress = i / (TOTAL_STEPS - 1);
        if (progress >= stepProgress) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
      
      cards.forEach((card, i) => {
        const stepProgress = i / (TOTAL_STEPS - 1);
        if (progress >= stepProgress) {
          card.classList.add('show');
        } else {
          card.classList.remove('show');
        }
      });
      
      // Unfix when done
      if (scrolled >= maxScroll + viewportHeight / 2) {
        isFixed = false;
        section.style.position = '';
        section.style.top = '';
        section.style.left = '';
        section.style.width = '';
        section.style.height = '';
        section.style.zIndex = '';
        
        const spacer = document.getElementById('services-spacer');
        if (spacer) spacer.remove();
      }
    }
    
    // Reset if scrolled back up
    if (rect.top > 0 && !isFixed) {
      const spacer = document.getElementById('services-spacer');
      if (spacer) {
        isFixed = false;
        section.style.position = '';
        section.style.top = '';
        section.style.left = '';
        section.style.width = '';
        section.style.height = '';
        section.style.zIndex = '';
        spacer.remove();
        
        // Reset everything
        if (fillLine) fillLine.style.width = '0%';
        dots.forEach(dot => dot.classList.remove('active'));
        cards.forEach(card => card.classList.remove('show'));
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
})();
