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

// Language toggle
(function() {
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
})();
