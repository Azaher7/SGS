const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
let revealItems = document.querySelectorAll(".reveal");
const yearTarget = document.querySelector("#year");
const contactForm = document.querySelector(".contact-form");
const page = document.body?.dataset?.page || "home";

const syncHeader = () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 20);
};

const setText = (selector, value) => {
  if (typeof value !== "string" || !value.trim()) return;
  const el = typeof selector === "string" ? document.querySelector(selector) : selector;
  if (el) el.textContent = value;
};

const setAttr = (selector, attr, value) => {
  if (typeof value !== "string" || !value.trim()) return;
  const el = typeof selector === "string" ? document.querySelector(selector) : selector;
  if (el) el.setAttribute(attr, value);
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const renderList = (selector, items, renderItem) => {
  const container = document.querySelector(selector);
  if (!container || !Array.isArray(items) || !items.length) return;
  container.innerHTML = items.map((item, index) => renderItem(item, index)).join("\n");
  revealItems = document.querySelectorAll(".reveal");
  initReveal();
};

const initReveal = () => {
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });

    revealItems.forEach((item) => {
      if (!item.classList.contains("in-view")) observer.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("in-view"));
  }
};

const applyGlobal = (globalData) => {
  if (!globalData) return;

  setText(".brand-badge", globalData?.brand?.badge);
  document.querySelectorAll(".brand-label").forEach((label) => {
    if (typeof globalData?.brand?.label === "string" && globalData.brand.label.trim()) {
      label.textContent = globalData.brand.label;
    }
  });

  const navLinks = siteNav ? [...siteNav.querySelectorAll("a")] : [];
  const navItems = globalData?.navigation?.items;
  if (Array.isArray(navItems) && navItems.length) {
    navItems.forEach((item, index) => {
      const link = navLinks[index];
      if (!link) return;
      if (item?.label) link.textContent = item.label;
      if (item?.href) link.setAttribute("href", item.href);
    });
  }

  const navCta = globalData?.navigation?.cta;
  if (navCta && navLinks.length) {
    const link = navLinks[navLinks.length - 1];
    if (navCta.label) link.textContent = navCta.label;
    if (navCta.href) link.setAttribute("href", navCta.href);
  }

  setText(".footer-text", globalData?.footer?.description);

  const footerColumns = document.querySelectorAll(".footer-grid > div");
  if (footerColumns.length >= 4) {
    const pagesColumn = footerColumns[1];
    setText(pagesColumn?.querySelector(".footer-title"), globalData?.footer?.pages_title);
    const pageLinks = [...(pagesColumn?.querySelectorAll("a") || [])];
    (globalData?.footer?.pages_links || []).forEach((item, index) => {
      if (!pageLinks[index]) return;
      if (item?.label) pageLinks[index].textContent = item.label;
      if (item?.href) pageLinks[index].setAttribute("href", item.href);
    });

    const focusColumn = footerColumns[2];
    setText(focusColumn?.querySelector(".footer-title"), globalData?.footer?.focus_title);
    const focusParagraphs = [...(focusColumn?.querySelectorAll("p") || [])].slice(1);
    (globalData?.footer?.focus_items || []).forEach((item, index) => {
      if (focusParagraphs[index] && item) focusParagraphs[index].textContent = item;
    });

    const contactColumn = footerColumns[3];
    setText(contactColumn?.querySelector(".footer-title"), globalData?.footer?.contact_title);
    const contactParagraphs = [...(contactColumn?.querySelectorAll("p") || [])].slice(1);
    (globalData?.footer?.contact_lines || []).forEach((item, index) => {
      if (contactParagraphs[index] && item) contactParagraphs[index].textContent = item;
    });
    const footerLink = contactColumn?.querySelector(".footer-link");
    if (footerLink) {
      if (globalData?.footer?.contact_link_label) footerLink.textContent = globalData.footer.contact_link_label;
      if (globalData?.footer?.contact_link_href) footerLink.setAttribute("href", globalData.footer.contact_link_href);
    }
  }

  setText(".footer-base p", globalData?.footer?.copyright_text);
};

const applyHome = (data) => {
  if (!data) return;

  setAttr(".hero-media img", "src", data?.hero?.image_url);
  setAttr(".hero-media img", "alt", data?.hero?.image_alt);
  setText("#hero-title", data?.hero?.title);
  setText("#hero-subtitle", data?.hero?.subtitle);

  const heroActions = document.querySelectorAll(".hero-actions a");
  (data?.hero?.actions || []).forEach((item, index) => {
    const link = heroActions[index];
    if (!link) return;
    if (item?.label) link.textContent = item.label;
    if (item?.href) link.setAttribute("href", item.href);
  });

  renderList(".hero-panel", data?.hero?.stats, (item) => `
    <div class="panel-line">
      <strong>${escapeHtml(item?.value || "")}</strong>
      <span>${escapeHtml(item?.text || "")}</span>
    </div>
  `);

  setText(".credibility-layout > p", data?.credibility?.summary);
  renderList(".credibility-tags", data?.credibility?.tags, (item) => `<span>${escapeHtml(item || "")}</span>`);

  setText("#about-title", data?.about_intro?.title);
  setText("#about-text", data?.about_intro?.text);
  const aboutLink = document.querySelector(".section-copy .text-link");
  if (aboutLink) {
    if (data?.about_intro?.link_label) aboutLink.textContent = data.about_intro.link_label;
    if (data?.about_intro?.link_href) aboutLink.setAttribute("href", data.about_intro.link_href);
  }

  const mediaImages = document.querySelectorAll(".media-stack img");
  (data?.about_intro?.images || []).forEach((image, index) => {
    if (!mediaImages[index]) return;
    if (image?.url) mediaImages[index].setAttribute("src", image.url);
    if (image?.alt) mediaImages[index].setAttribute("alt", image.alt);
  });

  setText(".section-soft .section-head .kicker", data?.services_section?.kicker);
  setText(".section-soft .section-head h2", data?.services_section?.title);
  renderList(".service-grid", data?.services_section?.cards, (item, index) => `
    <article class="service-card ${item?.highlight || index === 0 ? "highlight" : ""} reveal">
      <h3>${escapeHtml(item?.title || "")}</h3>
      <p>${escapeHtml(item?.text || "")}</p>
    </article>
  `);

  setText(".section-visual .section-head .kicker", data?.solutions_section?.kicker);
  setText(".section-visual .section-head h2", data?.solutions_section?.title);
  renderList(".solution-rows", data?.solutions_section?.rows, (item, index) => `
    <article class="solution-row ${(item?.reverse || index % 2 === 1) ? "reverse" : ""} reveal">
      <div class="solution-image">
        <img src="${escapeHtml(item?.image_url || "")}" alt="${escapeHtml(item?.image_alt || "")}">
      </div>
      <div class="solution-copy">
        <p class="solution-type">${escapeHtml(item?.type || "")}</p>
        <h3>${escapeHtml(item?.title || "")}</h3>
        <p>${escapeHtml(item?.text || "")}</p>
      </div>
    </article>
  `);

  const projectHead = document.querySelectorAll("main .section .section-head")[2];
  if (projectHead) {
    setText(projectHead.querySelector(".kicker"), data?.projects_section?.kicker);
    setText(projectHead.querySelector("h2"), data?.projects_section?.title);
  }
  renderList(".project-grid", data?.projects_section?.items, (item, index) => `
    <article class="project-tile ${item?.large || index === 0 ? "project-large" : ""} reveal">
      <img src="${escapeHtml(item?.image_url || "")}" alt="${escapeHtml(item?.image_alt || "")}">
      <div class="project-overlay">
        <p>${escapeHtml(item?.kicker || "")}</p>
        <h3>${escapeHtml(item?.title || "")}</h3>
      </div>
    </article>
  `);

  setText(".presence-copy .kicker", data?.presence_section?.kicker);
  setText(".presence-copy h2", data?.presence_section?.title);
  setText(".presence-copy p:last-child", data?.presence_section?.text);
  renderList(".presence-points", data?.presence_section?.points, (item) => `
    <article>
      <strong>${escapeHtml(item?.title || "")}</strong>
      <span>${escapeHtml(item?.text || "")}</span>
    </article>
  `);

  const whyHead = document.querySelector(".why-grid")?.previousElementSibling;
  if (whyHead) {
    setText(whyHead.querySelector(".kicker"), data?.why_section?.kicker);
    setText(whyHead.querySelector("h2"), data?.why_section?.title);
  }
  renderList(".why-grid", data?.why_section?.cards, (item) => `
    <article class="why-card reveal">
      <h3>${escapeHtml(item?.title || "")}</h3>
      <p>${escapeHtml(item?.text || "")}</p>
    </article>
  `);

  setText(".cta-layout .kicker", data?.cta?.kicker);
  setText(".cta-layout h2", data?.cta?.title);
  setText(".cta-layout .button", data?.cta?.button_label);
  setAttr(".cta-layout .button", "href", data?.cta?.button_href);
};

const applyPageHero = (data) => {
  if (!data?.hero) return;
  setAttr(".page-hero-media img", "src", data.hero.image_url);
  setAttr(".page-hero-media img", "alt", data.hero.image_alt);
  setText(".page-hero-layout .kicker", data.hero.kicker);
  setText(".page-hero-layout h1", data.hero.title);
  setText(".page-hero-layout p:last-child", data.hero.text);
};

const applyAbout = (data) => {
  if (!data) return;
  applyPageHero(data);
  setText(".narrow-text .kicker", data?.intro?.kicker);
  setText(".narrow-text h2", data?.intro?.title);
  setText(".narrow-text p:last-child", data?.intro?.text);

  renderList(".card-row.three", data?.pillars, (item) => `
    <article class="info-card reveal">
      <p class="kicker">${escapeHtml(item?.kicker || "")}</p>
      <h3>${escapeHtml(item?.title || "")}</h3>
    </article>
  `);

  setText(".split-grid.reverse .section-copy .kicker", data?.market_focus?.kicker);
  setText(".split-grid.reverse .section-copy h2", data?.market_focus?.title);
  setText(".split-grid.reverse .section-copy p:last-child", data?.market_focus?.text);
  setAttr(".wide-image img", "src", data?.market_focus?.image_url);
  setAttr(".wide-image img", "alt", data?.market_focus?.image_alt);

  const whyHead = document.querySelector(".section-dark-map .section-head");
  setText(whyHead?.querySelector(".kicker"), data?.why_section?.kicker);
  setText(whyHead?.querySelector("h2"), data?.why_section?.title);
  renderList(".section-dark-map .why-grid", data?.why_section?.cards, (item) => `
    <article class="why-card dark reveal">
      <h3>${escapeHtml(item?.title || "")}</h3>
      <p>${escapeHtml(item?.text || "")}</p>
    </article>
  `);

  setText(".cta-layout .kicker", data?.cta?.kicker);
  setText(".cta-layout h2", data?.cta?.title);
  setText(".cta-layout .button", data?.cta?.button_label);
  setAttr(".cta-layout .button", "href", data?.cta?.button_href);
};

const applyServices = (data) => {
  if (!data) return;
  applyPageHero(data);
  renderList(".service-list", data?.service_panels, (item, index) => `
    <article class="service-panel ${item?.featured || index === 0 ? "featured" : ""} reveal">
      <div>
        <p class="kicker">${escapeHtml(item?.number || "")}</p>
        <h2>${escapeHtml(item?.title || "")}</h2>
        <p>${escapeHtml(item?.text || "")}</p>
      </div>
      <div class="service-panel-side">
        ${item?.image_url ? `<div class="service-panel-image"><img src="${escapeHtml(item.image_url)}" alt="${escapeHtml(item?.image_alt || item?.title || "Service image")}"></div>` : ""}
        <ul>
          ${(item?.bullets || []).map((bullet) => `<li>${escapeHtml(bullet || "")}</li>`).join("")}
        </ul>
      </div>
    </article>
  `);
  setText(".cta-layout .kicker", data?.cta?.kicker);
  setText(".cta-layout h2", data?.cta?.title);
  setText(".cta-layout .button", data?.cta?.button_label);
  setAttr(".cta-layout .button", "href", data?.cta?.button_href);
};

const applySolutions = (data) => {
  if (!data) return;
  applyPageHero(data);
  renderList(".visual-list", data?.solutions, (item, index) => `
    <article class="visual-solution ${(item?.reverse || index % 2 === 1) ? "reverse" : ""} reveal">
      <div class="visual-media">
        <img src="${escapeHtml(item?.image_url || "")}" alt="${escapeHtml(item?.image_alt || "")}">
      </div>
      <div class="visual-copy">
        <p class="kicker">${escapeHtml(item?.kicker || "")}</p>
        <h2>${escapeHtml(item?.title || "")}</h2>
        <p>${escapeHtml(item?.text || "")}</p>
      </div>
    </article>
  `);
  setText(".cta-layout .kicker", data?.cta?.kicker);
  setText(".cta-layout h2", data?.cta?.title);
  setText(".cta-layout .button", data?.cta?.button_label);
  setAttr(".cta-layout .button", "href", data?.cta?.button_href);
};

const applyProjects = (data) => {
  if (!data) return;
  applyPageHero(data);
  renderList(".project-story-list", data?.stories, (item, index) => `
    <article class="project-story ${(item?.reverse || index % 2 === 1) ? "reverse" : ""} reveal">
      <div class="story-image">
        <img src="${escapeHtml(item?.image_url || "")}" alt="${escapeHtml(item?.image_alt || "")}">
      </div>
      <div class="story-copy">
        <p class="kicker">${escapeHtml(item?.kicker || "")}</p>
        <h2>${escapeHtml(item?.title || "")}</h2>
        <p>${escapeHtml(item?.text || "")}</p>
      </div>
    </article>
  `);
  setText(".cta-layout .kicker", data?.cta?.kicker);
  setText(".cta-layout h2", data?.cta?.title);
  setText(".cta-layout .button", data?.cta?.button_label);
  setAttr(".cta-layout .button", "href", data?.cta?.button_href);
};

const applyContact = (data) => {
  if (!data) return;
  applyPageHero(data);
  setText(".contact-panel .kicker", data?.form?.kicker);
  setText(".contact-panel h2", data?.form?.title);

  const labels = contactForm ? [...contactForm.querySelectorAll("label")] : [];
  const fields = data?.form?.fields || {};
  const fieldOrder = [
    ["name", 0, "input"],
    ["company", 1, "input"],
    ["email", 2, "input"],
    ["focus", 3, "select"],
    ["brief", 4, "textarea"]
  ];

  fieldOrder.forEach(([key, index, inputType]) => {
    const field = fields[key];
    const label = labels[index];
    if (!field || !label) return;
    if (field.label) {
      const node = label.childNodes[0];
      if (node) node.textContent = `${field.label}\n              `;
    }
    const input = label.querySelector(inputType);
    if (!input) return;
    if (field.placeholder) input.setAttribute("placeholder", field.placeholder);
    if (key === "focus" && Array.isArray(field.options) && field.options.length) {
      input.innerHTML = field.options.map((option) => `<option>${escapeHtml(option || "")}</option>`).join("");
    }
  });

  setText(".contact-form button", data?.form?.submit_label);
  setText(".form-feedback", data?.form?.feedback_text);

  renderList(".contact-side", data?.info_cards, (item) => `
    <article class="contact-info-card">
      <p class="kicker">${escapeHtml(item?.kicker || "")}</p>
      ${item?.title ? `<h3>${escapeHtml(item.title)}</h3>` : ""}
      <p>${escapeHtml(item?.text || "")}</p>
    </article>
  `);
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

initReveal();

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    contactForm.reset();
    const feedback = contactForm.querySelector(".form-feedback");
    const defaultMessage = "Thank you. Your consultation request has been received.";
    if (feedback && !feedback.textContent.trim()) {
      feedback.textContent = defaultMessage;
    }
  });
}

const fetchJson = async (path) => {
  try {
    const response = await fetch(path);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error(`Failed to load ${path}:`, error);
    return null;
  }
};

(async () => {
  const [globalData, pageData] = await Promise.all([
    fetchJson("content/global.json"),
    fetchJson(`content/${page}.json`)
  ]);

  applyGlobal(globalData);

  if (pageData?.meta?.title) document.title = pageData.meta.title;
  if (pageData?.meta?.description) {
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", pageData.meta.description);
  }

  const pageHandlers = {
    home: applyHome,
    about: applyAbout,
    services: applyServices,
    solutions: applySolutions,
    projects: applyProjects,
    contact: applyContact
  };

  const handler = pageHandlers[page];
  if (handler) handler(pageData);
})();
