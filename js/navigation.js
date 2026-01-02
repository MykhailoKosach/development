// ================================
// NAVIGATION MODULE
// ================================

// Helper function to check current language
function isCurrentlyEnglish() {
  const path = window.location.pathname;
  const fileName = path.substring(path.lastIndexOf('/') + 1);
  return fileName.endsWith('-en.html');
}

// Helper function to get page in correct language
function getPageInCurrentLanguage(basePage) {
  const isEnglish = isCurrentlyEnglish();
  
  // Remove any existing -en suffix first to get the base page
  const cleanBasePage = basePage.replace('-en.html', '.html');
  
  if (isEnglish) {
    return cleanBasePage.replace('.html', '-en.html');
  }
  return cleanBasePage;
}

// Navigation link handler for warehouse pages
function navigateToWarehouse(e, basePage) {
  e.preventDefault();
  const targetPage = getPageInCurrentLanguage(basePage);
  window.location.href = targetPage;
}

// Setup warehouse navigation links
(function() {
  // Select all warehouse navigation links
  const warehouseLinks = document.querySelectorAll('.nav-dropdown a[role="menuitem"]');
  
  warehouseLinks.forEach(link => {
    const href = link.getAttribute('href');
    // Only handle warehouse pages, not index links
    if (href && !href.includes('index') && !href.includes('#')) {
      link.addEventListener('click', function(e) {
        navigateToWarehouse(e, href);
      });
    }
  });
})();

// Mobile nav drawer
(function() {
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
})();

// Language toggle - acts as a switch
(function() {
  const langToggleContainers = document.querySelectorAll('.lang-toggle');
  
  function getCurrentPage() {
    const path = window.location.pathname;
    const fileName = path.substring(path.lastIndexOf('/') + 1);
    return fileName || 'index.html';
  }

  function switchToLanguage(targetLang) {
    const currentPage = getCurrentPage();
    const currentHash = window.location.hash;
    
    // Determine if we're currently on an English page
    const isCurrentlyEnglish = currentPage.endsWith('-en.html');
    
    // If already on the target language, do nothing
    if ((targetLang === 'en' && isCurrentlyEnglish) || (targetLang === 'ua' && !isCurrentlyEnglish)) {
      return;
    }
    
    let targetPage = '';
    
    if (targetLang === 'en') {
      // Switch to English: add -en before .html
      if (currentPage === 'index.html') {
        targetPage = 'index-en.html';
      } else {
        targetPage = currentPage.replace('.html', '-en.html');
      }
    } else {
      // Switch to Ukrainian: remove -en
      if (currentPage === 'index-en.html') {
        targetPage = 'index.html';
      } else {
        targetPage = currentPage.replace('-en.html', '.html');
      }
    }
    
    window.location.href = targetPage + currentHash;
  }

  // Add click handlers to all language toggle buttons
  langToggleContainers.forEach(container => {
    const buttons = container.querySelectorAll('.lang-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const targetLang = this.getAttribute('data-lang');
        switchToLanguage(targetLang);
      });
    });
  });
})();
