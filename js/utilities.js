// ================================
// UTILITIES MODULE
// Small utility functions for footer, forms, etc.
// ================================

// Year in footer
(function() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
})();

// Contact form handler
(function() {
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Дякуємо за звернення! Ми зв'яжемося з вами найближчим часом.");
      contactForm.reset();
    });
  }
})();
