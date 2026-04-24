const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const themeToggle = document.querySelector(".theme-toggle");
const backToTop = document.querySelector(".back-to-top");
const typingText = document.querySelector("#typing-text");
const form = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const year = document.querySelector("#year");
const cursorGlow = document.querySelector(".cursor-glow");
const pageLoader = document.querySelector("#page-loader");
const heroCard = document.querySelector(".hero-card");

const navLinks = document.querySelectorAll(".nav-menu a");
const sections = document.querySelectorAll("main section[id]");
const reveals = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll(".counter");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

const EMAILJS_CONFIG = {
  publicKey: "HceaLPSJ4aSHjul4T",
  serviceId: "service_xzhfojw",
  templateId: "template_m8trso1",
  recipientEmail: "meganreyhan72@gmail.com",
};

const ANALYTICS_CONFIG = {
  googleAnalyticsId: "G-S5WJZXEEWQ",
};

const FORM_COOLDOWN_MS = 30000;
const FORM_COOLDOWN_KEY = "contactFormLastSubmitAt";

let isMenuOpen = false;
const words = ["JavaScript Developer", "Front-End Specialist", "UI Enthusiast"];
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function toggleMenu() {
  isMenuOpen = !isMenuOpen;
  navMenu.classList.toggle("open", isMenuOpen);
  navToggle.setAttribute("aria-expanded", String(isMenuOpen));
}

function initAnalytics() {
  const id = ANALYTICS_CONFIG.googleAnalyticsId.trim();
  if (!id) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  gtag("js", new Date());
  gtag("config", id);
}

function trackEvent(eventName, params = {}) {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

initAnalytics();

const pressableElements = document.querySelectorAll(
  ".btn, .theme-toggle, .nav-toggle, .back-to-top, .filter-btn"
);
pressableElements.forEach((element) => {
  element.addEventListener("pointerdown", () => {
    element.classList.add("is-pressed");
  });
  ["pointerup", "pointerleave", "pointercancel"].forEach((eventName) => {
    element.addEventListener(eventName, () => {
      element.classList.remove("is-pressed");
    });
  });
});

if (navToggle && navMenu) {
  navToggle.addEventListener("click", toggleMenu);
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (isMenuOpen && navMenu && navToggle) toggleMenu();
  });
});

const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
whatsappLinks.forEach((link) => {
  link.addEventListener("click", () => {
    trackEvent("cta_click_whatsapp", {
      location: link.closest("#contact") ? "contact_section" : "hero_or_other",
      link_url: link.href,
    });
  });
});

const bookingLinks = document.querySelectorAll('a[href*="calendly.com"], a[href*="calendar.google.com"]');
bookingLinks.forEach((link) => {
  link.addEventListener("click", () => {
    trackEvent("cta_click_booking", {
      location: link.closest("#contact") ? "contact_section" : "hero_or_other",
      link_url: link.href,
    });
  });
});

function setTheme(theme) {
  document.body.classList.toggle("light", theme === "light");
  localStorage.setItem("theme", theme);
  if (themeToggle) {
    themeToggle.textContent = theme === "light" ? "🌙" : "☀️";
  }
}

const storedTheme = localStorage.getItem("theme");
if (storedTheme) {
  setTheme(storedTheme);
} else {
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  setTheme(prefersLight ? "light" : "dark");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.contains("light");
    setTheme(isLight ? "dark" : "light");
  });
}

function runTypingAnimation() {
  if (!typingText) return;
  const currentWord = words[wordIndex];

  if (!deleting && charIndex <= currentWord.length) {
    typingText.textContent = currentWord.slice(0, charIndex++);
  } else if (deleting && charIndex >= 0) {
    typingText.textContent = currentWord.slice(0, charIndex--);
  }

  let delay = deleting ? 95 : 140;

  if (!deleting && charIndex === currentWord.length + 1) {
    deleting = true;
    delay = 2000;
  }

  if (deleting && charIndex === -1) {
    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    delay = 550;
  }

  setTimeout(runTypingAnimation, delay);
}

if (typingText) {
  runTypingAnimation();
}

if (heroCard && window.matchMedia("(min-width: 1024px)").matches) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    heroCard.addEventListener("pointermove", (event) => {
      const rect = heroCard.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      heroCard.style.transform = `perspective(700px) rotateX(${-y * 4}deg) rotateY(${x * 5}deg) translateY(-2px)`;
    });
    heroCard.addEventListener("pointerleave", () => {
      heroCard.style.transform = "";
    });
  }
}

function updateActiveSection() {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    const target = link.getAttribute("href").replace("#", "");
    link.classList.toggle("active", target === current);
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.18 }
);

reveals.forEach((el) => revealObserver.observe(el));
reveals.forEach((el, index) => {
  if (!el.classList.contains("delay-1")) {
    el.style.transitionDelay = `${Math.min(index * 40, 220)}ms`;
  }
});

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const counter = entry.target;
      const target = Number(counter.dataset.target);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 40));

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          counter.textContent = String(target);
          clearInterval(timer);
          return;
        }
        counter.textContent = String(current);
      }, 24);

      observer.unobserve(counter);
    });
  },
  { threshold: 0.45 }
);

counters.forEach((counter) => counterObserver.observe(counter));

function handleScrollUI() {
  if (backToTop) {
    backToTop.classList.toggle("show", window.scrollY > 450);
  }
  updateActiveSection();
}

window.addEventListener("scroll", handleScrollUI);
handleScrollUI();

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;

    projectCards.forEach((card) => {
      const category = card.dataset.category;
      const show = filter === "all" || category === filter;
      card.style.display = show ? "block" : "none";
    });
  });
});

if (form && formStatus) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const honeypotInput = form.querySelector("#website");
  const defaultSubmitText = submitBtn ? submitBtn.textContent : "Kirim Pesan";
  const hasEmailJs = typeof window.emailjs !== "undefined";
  let cooldownTimer = null;
  const isConfigReady =
    EMAILJS_CONFIG.publicKey &&
    EMAILJS_CONFIG.serviceId &&
    EMAILJS_CONFIG.templateId &&
    EMAILJS_CONFIG.recipientEmail &&
    !EMAILJS_CONFIG.publicKey.includes("ISI_") &&
    !EMAILJS_CONFIG.serviceId.includes("ISI_") &&
    !EMAILJS_CONFIG.templateId.includes("ISI_") &&
    !EMAILJS_CONFIG.recipientEmail.includes("ganti-email-kamu");

  if (hasEmailJs && isConfigReady) {
    window.emailjs.init({
      publicKey: EMAILJS_CONFIG.publicKey,
      limitRate: {
        id: "portfolio-contact-form",
        throttle: 12000,
      },
    });
  }

  function getRemainingCooldownMs() {
    const lastSubmitAt = Number(localStorage.getItem(FORM_COOLDOWN_KEY) || 0);
    return Math.max(0, FORM_COOLDOWN_MS - (Date.now() - lastSubmitAt));
  }

  function stopCooldownTimer() {
    if (cooldownTimer) {
      clearInterval(cooldownTimer);
      cooldownTimer = null;
    }
  }

  function renderCooldownState() {
    if (!submitBtn) return;
    const remainingMs = getRemainingCooldownMs();
    if (remainingMs > 0) {
      const remainingSeconds = Math.ceil(remainingMs / 1000);
      submitBtn.disabled = true;
      submitBtn.textContent = `Kirim lagi (${remainingSeconds}s)`;
      return;
    }

    submitBtn.disabled = false;
    submitBtn.textContent = defaultSubmitText;
    stopCooldownTimer();
  }

  function startCooldown() {
    localStorage.setItem(FORM_COOLDOWN_KEY, String(Date.now()));
    renderCooldownState();
    stopCooldownTimer();
    cooldownTimer = setInterval(renderCooldownState, 500);
  }

  renderCooldownState();
  if (getRemainingCooldownMs() > 0) {
    cooldownTimer = setInterval(renderCooldownState, 500);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    trackEvent("contact_form_submit_attempt", { method: "emailjs" });

    const remainingMs = getRemainingCooldownMs();
    if (remainingMs > 0) {
      const remainingSeconds = Math.ceil(remainingMs / 1000);
      trackEvent("contact_form_submit_blocked_cooldown", {
        remaining_seconds: remainingSeconds,
      });
      formStatus.textContent = `Tunggu ${remainingSeconds} detik sebelum kirim pesan lagi.`;
      formStatus.style.color = "#ff8f8f";
      return;
    }

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = "Mohon lengkapi semua field terlebih dahulu.";
      formStatus.style.color = "#ff8f8f";
      return;
    }

    // Anti-spam: bot umumnya mengisi field tersembunyi ini.
    if (honeypotInput && honeypotInput.value.trim() !== "") {
      formStatus.textContent = "Request terdeteksi tidak valid.";
      formStatus.style.color = "#ff8f8f";
      return;
    }

    if (!hasEmailJs) {
      formStatus.textContent = "Library EmailJS tidak termuat. Cek koneksi internet lalu refresh.";
      formStatus.style.color = "#ff8f8f";
      return;
    }

    if (!isConfigReady) {
      formStatus.textContent =
        "Isi dulu EMAILJS_CONFIG di script.js (publicKey, serviceId, templateId, recipientEmail).";
      formStatus.style.color = "#ff8f8f";
      return;
    }

    try {
      startCooldown();
      formStatus.textContent = "Mengirim pesan...";
      formStatus.style.color = "";

      await window.emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
        from_name: name,
        from_email: email,
        message,
        to_email: EMAILJS_CONFIG.recipientEmail,
        reply_to: email,
        sent_at: new Date().toLocaleString("id-ID"),
      });

      trackEvent("contact_form_submit_success", {
        method: "emailjs",
      });

      formStatus.textContent =
        "Pesan berhasil dikirim ke Gmail Anda. Cek Inbox, Promotions, dan Spam.";
      formStatus.style.color = "";
      form.reset();
    } catch (error) {
      const errorText =
        (error && typeof error === "object" && "text" in error && error.text) ||
        (error && typeof error === "object" && "message" in error && error.message) ||
        "Unknown error";
      const errorStatus =
        error && typeof error === "object" && "status" in error ? String(error.status) : "no-status";

      console.error("EmailJS send failed:", error);
      const notFoundTemplate = String(errorText).toLowerCase().includes("template id not found");
      if (notFoundTemplate) {
        formStatus.textContent =
          `Gagal (${errorStatus}): template tidak ditemukan. Cek bahwa publicKey, serviceId, dan templateId berasal dari akun EmailJS yang sama. ` +
          `Dipakai sekarang: ${EMAILJS_CONFIG.serviceId} / ${EMAILJS_CONFIG.templateId}`;
      } else {
        formStatus.textContent = `Gagal mengirim (${errorStatus}): ${errorText}`;
      }
      trackEvent("contact_form_submit_error", {
        method: "emailjs",
        error_status: errorStatus,
        error_text: String(errorText).slice(0, 120),
      });
      formStatus.style.color = "#ff8f8f";
    } finally {
      renderCooldownState();
    }
  });
}

if (cursorGlow) {
  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
}

if (year) {
  year.textContent = String(new Date().getFullYear());
}

if (pageLoader) {
  window.addEventListener("load", () => {
    pageLoader.classList.add("hide");
  });
}
