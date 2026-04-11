const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const revealItems = document.querySelectorAll(".reveal");
const yearTarget = document.querySelector("#year");
const contactForm = document.querySelector(".contact-form");

const syncHeader = () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 20);
};

syncHeader();
window.addEventListener("scroll", syncHeader);

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("in-view"));
}

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

if (contactForm) {
  const feedback = contactForm.querySelector(".form-feedback");
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    contactForm.reset();
    if (feedback) {
      feedback.textContent = "Thank you. Your consultation request has been received.";
    }
  });
}

fetch("content/home.json")
  .then((response) => response.json())
  .then((data) => {
    const heroTitle = document.getElementById("hero-title");
    const heroSubtitle = document.getElementById("hero-subtitle");
    const aboutTitle = document.getElementById("about-title");
    const aboutText = document.getElementById("about-text");

    if (heroTitle) heroTitle.textContent = data.hero_title || "";
    if (heroSubtitle) heroSubtitle.textContent = data.hero_subtitle || "";
    if (aboutTitle) aboutTitle.textContent = data.about_title || "";
    if (aboutText) aboutText.textContent = data.about_text || "";
  })
  .catch((error) => {
    console.error("Failed to load CMS content:", error);
  });
