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
  googleAnalyticsId: "",
};

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

initAnalytics();

if (navToggle && navMenu) {
  navToggle.addEventListener("click", toggleMenu);
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (isMenuOpen && navMenu && navToggle) toggleMenu();
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

  let delay = deleting ? 60 : 100;

  if (!deleting && charIndex === currentWord.length + 1) {
    deleting = true;
    delay = 1400;
  }

  if (deleting && charIndex === -1) {
    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    delay = 350;
  }

  setTimeout(runTypingAnimation, delay);
}

if (typingText) {
  runTypingAnimation();
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
  const hasEmailJs = typeof window.emailjs !== "undefined";
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

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

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
      if (submitBtn) submitBtn.disabled = true;
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
      formStatus.style.color = "#ff8f8f";
    } finally {
      if (submitBtn) submitBtn.disabled = false;
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
