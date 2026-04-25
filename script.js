const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const themeToggle = document.querySelector(".theme-toggle");
const langToggle = document.querySelector("#lang-toggle");
const backToTop = document.querySelector(".back-to-top");
const typingText = document.querySelector("#typing-text");
const form = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const cursorGlow = document.querySelector(".cursor-glow");
const pageLoader = document.querySelector("#page-loader");
const heroCard = document.querySelector(".hero-card");
const githubCommentsList = document.querySelector("#github-comments-list");
const githubCommentLink = document.querySelector("#github-comment-link");

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

const GITHUB_COMMENTS_CONFIG = {
  owner: "reyhanmegan86",
  repo: "reyhanmegan86.github.io",
  label: "testimonial",
  maxItems: 6,
};

const FORM_COOLDOWN_MS = 30000;
const FORM_COOLDOWN_KEY = "contactFormLastSubmitAt";
const LANGUAGE_KEY = "siteLanguage";

let isMenuOpen = false;
let words = [];
let wordIndex = 0;
let charIndex = 0;
let deleting = false;
let currentLanguage = localStorage.getItem(LANGUAGE_KEY) || "id";
let languageAnimTimer = null;

const COPY = {
  id: {
    navAbout: "Tentang",
    navSkills: "Skill",
    navServices: "Layanan",
    navContact: "Kontak",
    heroBadge: "Available for freelance",
    heroGreeting: "Halo, saya",
    heroDesc: "Saya membuat website modern yang cepat, responsif, dan siap membantu bisnis tampil lebih profesional di internet.",
    heroBtnServices: "Lihat Layanan",
    heroBtnContact: "Hubungi Saya",
    heroBtnCV: "Download CV",
    statProjects: "Project Selesai",
    statClients: "Klien Puas",
    statYears: "Tahun Pengalaman",
    heroCardFast: "⚡ Website Cepat",
    heroCardResponsive: "📱 100% Responsif",
    heroCardConversion: "🎯 Fokus Konversi",
    heroCardWhatsApp: "Chat WhatsApp",
    aboutTitle: "Tentang Saya",
    aboutDesc1: "Saya membantu brand, UMKM, dan personal bisnis tampil lebih kredibel lewat website modern yang cepat, rapi, dan fokus pada hasil.",
    aboutDesc2: "Dengan pengalaman membangun landing page dan company profile, saya menggabungkan desain yang enak dilihat dengan struktur yang mudah dikembangkan untuk jangka panjang.",
    aboutHighlightTitle: "Highlight",
    aboutPoint1: "✅ Optimasi performa dan SEO dasar",
    aboutPoint2: "✅ UI modern dengan animasi halus",
    aboutPoint3: "✅ Integrasi API dan fitur dinamis",
    aboutPoint4: "✅ Struktur kode rapi dan mudah dirawat",
    skillsTitle: "Skill Utama",
    servicesTitle: "Layanan",
    serviceDesc1: "Pembuatan website profesional dari nol sesuai kebutuhan bisnis Anda.",
    serviceDesc2: "Upgrade tampilan website lama agar lebih modern, cepat, dan mobile-friendly.",
    serviceDesc3: "Perawatan rutin, perbaikan bug, dan optimasi performa secara berkala.",
    commentsTitle: "Komentar Publik",
    commentsIntro: "Feedback ini diambil dari GitHub Issues public agar transparan.",
    commentsCta: "Tulis Komentar di GitHub",
    commentsLoading: "Memuat komentar publik...",
    commentsNoData: "Belum ada komentar publik. Jadilah yang pertama memberi feedback di GitHub.",
    commentsFetchError: "Komentar publik belum bisa dimuat sekarang. Coba refresh lagi nanti.",
    commentsFootnote: "Gunakan label \"testimonial\" di issue agar otomatis tampil di sini.",
    contactTitle: "Kontak Saya",
    contactIntro: "Punya ide proyek? Kirim pesan lewat form di bawah ini.",
    contactBtnWhatsapp: "Chat WhatsApp",
    contactBtnBooking: "Booking Kalender",
    formNameLabel: "Nama",
    formNamePlaceholder: "Nama kamu",
    formEmailLabel: "Email",
    formEmailPlaceholder: "email@contoh.com",
    formMessageLabel: "Pesan",
    formMessagePlaceholder: "Tulis kebutuhan proyek kamu...",
    formSubmit: "Kirim Pesan",
    backToTopLabel: "Kembali ke atas",
    footerRights: "© <span id=\"year\"></span> Reyhan. Hak cipta dilindungi.",
    navToggleLabel: "Buka menu",
    langToggleLabel: "Ganti bahasa",
    themeToggleLabel: "Ganti tema",
    typingWords: ["JavaScript Developer", "Front-End Specialist", "UI Enthusiast"],
    sendAgain: "Kirim lagi ({seconds}s)",
    waitBeforeSend: "Tunggu {seconds} detik sebelum kirim pesan lagi.",
    completeFields: "Mohon lengkapi semua field terlebih dahulu.",
    invalidRequest: "Request terdeteksi tidak valid.",
    emailjsNotLoaded: "Library EmailJS tidak termuat. Cek koneksi internet lalu refresh.",
    configNotReady: "Isi dulu EMAILJS_CONFIG di script.js (publicKey, serviceId, templateId, recipientEmail).",
    sending: "Mengirim pesan...",
    sendSuccess: "Pesan berhasil dikirim ke Gmail Anda. Cek Inbox, Promotions, dan Spam.",
    templateNotFound: "Gagal ({status}): template tidak ditemukan. Cek bahwa publicKey, serviceId, dan templateId berasal dari akun EmailJS yang sama. Dipakai sekarang: {serviceId} / {templateId}",
    sendFailed: "Gagal mengirim ({status}): {error}",
  },
  en: {
    navAbout: "About",
    navSkills: "Skills",
    navServices: "Services",
    navContact: "Contact",
    heroBadge: "Available for freelance",
    heroGreeting: "Hi, I'm",
    heroDesc: "I build modern websites that are fast, responsive, and ready to help businesses look more professional online.",
    heroBtnServices: "View Services",
    heroBtnContact: "Contact Me",
    heroBtnCV: "Download CV",
    statProjects: "Projects Completed",
    statClients: "Happy Clients",
    statYears: "Years of Experience",
    heroCardFast: "⚡ Fast Website",
    heroCardResponsive: "📱 100% Responsive",
    heroCardConversion: "🎯 Conversion-Focused",
    heroCardWhatsApp: "Chat on WhatsApp",
    aboutTitle: "About Me",
    aboutDesc1: "I help brands, small businesses, and personal ventures build stronger credibility through modern websites that are fast, clean, and outcome-focused.",
    aboutDesc2: "With hands-on experience building landing pages and company profiles, I combine polished visuals with maintainable structure for long-term growth.",
    aboutHighlightTitle: "Highlights",
    aboutPoint1: "✅ Performance optimization and foundational SEO",
    aboutPoint2: "✅ Modern UI with smooth interactions",
    aboutPoint3: "✅ API integration and dynamic features",
    aboutPoint4: "✅ Clean code structure that is easy to maintain",
    skillsTitle: "Core Skills",
    servicesTitle: "Services",
    serviceDesc1: "Professional website development from scratch based on your business needs.",
    serviceDesc2: "Redesign your old website to be more modern, faster, and mobile-friendly.",
    serviceDesc3: "Routine maintenance, bug fixes, and regular performance optimization.",
    commentsTitle: "Public Comments",
    commentsIntro: "These comments come from public GitHub Issues for transparency.",
    commentsCta: "Write Comment on GitHub",
    commentsLoading: "Loading public comments...",
    commentsNoData: "No public comments yet. Be the first to leave feedback on GitHub.",
    commentsFetchError: "Public comments could not be loaded right now. Please refresh later.",
    commentsFootnote: "Use the \"testimonial\" label in issues so they appear here automatically.",
    contactTitle: "Get in Touch",
    contactIntro: "Have a project idea? Send me a message using the form below.",
    contactBtnWhatsapp: "Chat on WhatsApp",
    contactBtnBooking: "Book a Call",
    formNameLabel: "Name",
    formNamePlaceholder: "Your name",
    formEmailLabel: "Email",
    formEmailPlaceholder: "email@example.com",
    formMessageLabel: "Message",
    formMessagePlaceholder: "Tell me about your project needs...",
    formSubmit: "Send Message",
    backToTopLabel: "Back to top",
    footerRights: "© <span id=\"year\"></span> Reyhan. All rights reserved.",
    navToggleLabel: "Open menu",
    langToggleLabel: "Switch language",
    themeToggleLabel: "Switch theme",
    typingWords: ["JavaScript Developer", "Front-End Specialist", "UI Enthusiast"],
    sendAgain: "Send again ({seconds}s)",
    waitBeforeSend: "Please wait {seconds} seconds before sending another message.",
    completeFields: "Please complete all fields first.",
    invalidRequest: "Invalid request detected.",
    emailjsNotLoaded: "EmailJS library failed to load. Check your internet and refresh.",
    configNotReady: "Please fill EMAILJS_CONFIG in script.js (publicKey, serviceId, templateId, recipientEmail).",
    sending: "Sending message...",
    sendSuccess: "Message sent successfully to your Gmail. Check Inbox, Promotions, and Spam.",
    templateNotFound: "Failed ({status}): template not found. Make sure publicKey, serviceId, and templateId come from the same EmailJS account. Current values: {serviceId} / {templateId}",
    sendFailed: "Failed to send ({status}): {error}",
  },
};

if (!COPY[currentLanguage]) {
  currentLanguage = "id";
}

function getCopy(key, vars = {}) {
  const dict = COPY[currentLanguage] || COPY.id;
  let text = dict[key] ?? COPY.id[key] ?? "";
  Object.entries(vars).forEach(([name, value]) => {
    text = text.replaceAll(`{${name}}`, String(value));
  });
  return text;
}

function resetTypingAnimation() {
  wordIndex = 0;
  charIndex = 0;
  deleting = false;
  words = COPY[currentLanguage].typingWords;
  if (typingText) {
    typingText.textContent = "";
  }
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (!key) return;
    if (key === "footerRights") {
      element.innerHTML = getCopy(key);
      return;
    }
    element.textContent = getCopy(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    if (!key) return;
    element.setAttribute("placeholder", getCopy(key));
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    const key = element.dataset.i18nAriaLabel;
    if (!key) return;
    element.setAttribute("aria-label", getCopy(key));
  });

  if (navToggle) navToggle.setAttribute("aria-label", getCopy("navToggleLabel"));
  if (themeToggle) themeToggle.setAttribute("aria-label", getCopy("themeToggleLabel"));
  if (langToggle) {
    langToggle.setAttribute("aria-label", getCopy("langToggleLabel"));
    langToggle.textContent = currentLanguage === "id" ? "EN" : "ID";
  }
  syncYear();
}

function syncYear() {
  const yearElement = document.querySelector("#year");
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }
}

function playLanguageTransition() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  document.body.classList.remove("language-switching");
  void document.body.offsetWidth;
  document.body.classList.add("language-switching");

  if (languageAnimTimer) {
    clearTimeout(languageAnimTimer);
  }
  languageAnimTimer = setTimeout(() => {
    document.body.classList.remove("language-switching");
  }, 420);
}

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

function formatGithubDate(dateText) {
  if (!dateText) return "";
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(currentLanguage === "id" ? "id-ID" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function buildGithubIssueUrl() {
  const { owner, repo, label } = GITHUB_COMMENTS_CONFIG;
  if (!owner || !repo) return "https://github.com/";
  return `https://github.com/${owner}/${repo}/issues/new?labels=${encodeURIComponent(label)}&title=${encodeURIComponent("Feedback portfolio")}`;
}

function renderGithubComments(items = [], state = "success") {
  if (!githubCommentsList) return;

  if (state === "loading") {
    githubCommentsList.innerHTML = `<article class="github-comment-card"><p>${escapeHtml(getCopy("commentsLoading"))}</p></article>`;
    return;
  }

  if (state === "error") {
    githubCommentsList.innerHTML = `<article class="github-comment-card"><p>${escapeHtml(getCopy("commentsFetchError"))}</p></article>`;
    return;
  }

  if (!items.length) {
    githubCommentsList.innerHTML = `<article class="github-comment-card"><p>${escapeHtml(getCopy("commentsNoData"))}</p></article>`;
    return;
  }

  githubCommentsList.innerHTML = items
    .map((item) => {
      const title = escapeHtml(item.title || "Untitled");
      const body = escapeHtml((item.body || "").trim().slice(0, 180) || title);
      const author = escapeHtml(item.user?.login || "GitHub User");
      const issueUrl = item.html_url || "#";
      const createdAt = formatGithubDate(item.created_at);
      const authorAndDate = createdAt ? `@${author} • ${escapeHtml(createdAt)}` : `@${author}`;

      return `
        <article class="github-comment-card">
          <h3>${title}</h3>
          <p>${body}</p>
          <div class="github-comment-meta">
            <span>${authorAndDate}</span>
            <a href="${issueUrl}" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </article>
      `;
    })
    .join("");
}

async function loadGithubComments() {
  const { owner, repo, label, maxItems } = GITHUB_COMMENTS_CONFIG;
  if (!githubCommentsList) return;
  if (!owner || !repo) {
    renderGithubComments([], "error");
    return;
  }

  renderGithubComments([], "loading");
  const endpoint = `https://api.github.com/repos/${owner}/${repo}/issues?state=open&labels=${encodeURIComponent(label)}&per_page=${Math.max(1, Number(maxItems) || 6)}`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/vnd.github+json",
      },
    });
    if (!response.ok) {
      throw new Error(`GitHub API status ${response.status}`);
    }
    const issues = await response.json();
    const filteredIssues = Array.isArray(issues) ? issues.filter((item) => !item.pull_request) : [];
    renderGithubComments(filteredIssues, "success");
  } catch (error) {
    console.error("Failed to load GitHub comments:", error);
    renderGithubComments([], "error");
  }
}

initAnalytics();
applyLanguage();
resetTypingAnimation();
if (githubCommentLink) {
  githubCommentLink.href = buildGithubIssueUrl();
}
loadGithubComments();

const pressableElements = document.querySelectorAll(
  ".btn, .theme-toggle, .lang-toggle, .nav-toggle, .back-to-top, .filter-btn"
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

if (langToggle) {
  langToggle.addEventListener("click", () => {
    currentLanguage = currentLanguage === "id" ? "en" : "id";
    localStorage.setItem(LANGUAGE_KEY, currentLanguage);
    applyLanguage();
    resetTypingAnimation();
    playLanguageTransition();
  });
}

function runTypingAnimation() {
  if (!typingText) return;
  if (!words.length) {
    setTimeout(runTypingAnimation, 350);
    return;
  }
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
      submitBtn.textContent = getCopy("sendAgain", { seconds: remainingSeconds });
      return;
    }

    submitBtn.disabled = false;
    submitBtn.textContent = getCopy("formSubmit");
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
      formStatus.textContent = getCopy("waitBeforeSend", { seconds: remainingSeconds });
      formStatus.style.color = "#ff8f8f";
      return;
    }

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = getCopy("completeFields");
      formStatus.style.color = "#ff8f8f";
      return;
    }

    // Anti-spam: bot umumnya mengisi field tersembunyi ini.
    if (honeypotInput && honeypotInput.value.trim() !== "") {
      formStatus.textContent = getCopy("invalidRequest");
      formStatus.style.color = "#ff8f8f";
      return;
    }

    if (!hasEmailJs) {
      formStatus.textContent = getCopy("emailjsNotLoaded");
      formStatus.style.color = "#ff8f8f";
      return;
    }

    if (!isConfigReady) {
      formStatus.textContent = getCopy("configNotReady");
      formStatus.style.color = "#ff8f8f";
      return;
    }

    try {
      startCooldown();
      formStatus.textContent = getCopy("sending");
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

      formStatus.textContent = getCopy("sendSuccess");
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
        formStatus.textContent = getCopy("templateNotFound", {
          status: errorStatus,
          serviceId: EMAILJS_CONFIG.serviceId,
          templateId: EMAILJS_CONFIG.templateId,
        });
      } else {
        formStatus.textContent = getCopy("sendFailed", {
          status: errorStatus,
          error: errorText,
        });
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

if (pageLoader) {
  window.addEventListener("load", () => {
    pageLoader.classList.add("hide");
  });
}
