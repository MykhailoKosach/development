// ================================
// NAVIGATION MODULE
// ================================

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
  const langToggles = document.querySelectorAll(".lang-toggle");
  
  langToggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      // Check if we're on the English page
      const isEnglish = window.location.pathname.includes('index-en.html');
      
      // Toggle to the other language
      if (isEnglish) {
        window.location.href = 'index.html';
      } else {
        window.location.href = 'index-en.html';
      }
    });
  });
})();
