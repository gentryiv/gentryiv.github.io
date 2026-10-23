// Mock Project Data Registry
const projectData = {
  "omniblade": {
    title: "OmniBlade Adaptive Gesture Controller",
    description: `Built an adaptive wearable game controller housed in a 3D-printed forearm brace. Sensor fusion algorithms process 6-axis IMU data to convert upper-limb 
    gestures into low-latency game commands over Bluetooth.`,
    youtubeId: "https://www.youtube.com/watch?v=4rHZ7DJ21A4&time_continue=155&source_ve_path=NzY3NTg&embeds_referring_euri=https%3A%2F%2Fdevpost.com%2F",
    repoUrl: "https://github.com/gentryiv/Omniblade"
  },
  "cable-tester": {
    title: "SAMD20 Ten-Pin Cable Tester",
    description: "Refactored firmware for automated diagnostic testing of ten-pin cables. Implemented SysTick timers, Watchdog routines, and precise GPIO pin masking via SAM register manipulation.",
    youtubeId: "",
    repoUrl: "https://github.com/gentryiv"
  },
  "publix-scraper": {
    title: "Publix BoGo Scraper",
    description: `I love BoGo's. As a freshman, I wanted to learn coding beyond what I was already learning in my programming class. I also wanted to build something useful. 
      So, over that winter break I built this Publix BoGo Scraper that navigates the Publix site, selects a store, scrapes that stores BoGos, filters them based on the user's 
      liked/disliked history, and then sends the user an email with the BoGo's relevant to them. \n The program is written in Python and uses XPath points alongside a wait function 
      and try/except blocks to navigate the site. Data is handled via pandas and then exported via Python's smtplib with a separate program feeding it username and password credentials.
      The program runs in under a minute and is fully automated. \n Future enhancements could include run scheduling, item images in emailed output, grocery lists with cart cost
      comparisons to other stores, deal trend tracking, and an automated notification system for desired deals or when a certain threshold of liked BoGo's is reached to make a trip worthwhile.`,
    repoUrl: "https://github.com/gentryiv/Publix-BoGo-Scraper"
  }
  "fixing": {
    title: "Fixing Things",
    description: `I'm a pretty DIY guy so I do a lot of stuff myself: I've recovered data from a bricked 2011 iMac, fixed different hardware failures on xbox controllers, do most of my own car work,
    fixed a bambu labs printer, and random stuff my mom asks me to fix around the house.`,
  }
};

// Global Carousel Functions (populated by setupCarousel)
window.startCarousel = null;
window.stopCarousel = null;

// --- 1. CORE TAB SWITCHING (FAIL-SAFE & ISOLATED) ---
function switchTab(targetTab) {
  if (!targetTab) return;

  // 1. Toggle section visibility
  const sections = document.querySelectorAll(".section-content");
  sections.forEach(sec => {
    if (sec.id === targetTab) {
      sec.classList.add("active");
    } else {
      sec.classList.remove("active");
    }
  });

  // 2. Toggle navigation link active state
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    if (link.getAttribute("data-tab") === targetTab) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // 3. Update URL hash without page scroll jumps
  try {
    history.pushState(null, null, `#${targetTab}`);
  } catch (e) {
    window.location.hash = targetTab;
  }

  // 4. Manage carousel lifecycle based on tab
  if (targetTab === "about") {
    if (typeof window.startCarousel === "function") window.startCarousel();
  } else {
    if (typeof window.stopCarousel === "function") window.stopCarousel();
  }
}

function setupTabSwitching() {
  // Global Event Delegation for Nav Links
  document.addEventListener("click", (e) => {
    const tabLink = e.target.closest("[data-tab]");
    if (tabLink) {
      e.preventDefault();
      const targetTab = tabLink.getAttribute("data-tab");
      switchTab(targetTab);
    }
  });

  // Handle browser Back/Forward navigation
  window.addEventListener("popstate", () => {
    const hash = window.location.hash.replace("#", "");
    if (hash && document.getElementById(hash)) {
      switchTab(hash);
    } else {
      switchTab("home");
    }
  });

  // Initial Load Tab Resolution
  const initialHash = window.location.hash.replace("#", "");
  if (initialHash && document.getElementById(initialHash)) {
    switchTab(initialHash);
  } else {
    switchTab("home");
  }
}

// --- 2. CAROUSEL COMPONENT (ISOLATED) ---
function setupCarousel() {
  const slides = document.querySelectorAll(".carousel-slide");
  const dotsContainer = document.getElementById("carousel-dots");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  const carouselContainer = document.getElementById("about-carousel");

  if (!slides.length) return;

  let currentIndex = 0;
  let intervalId = null;

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentIndex);
    });
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll(".dot");
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
      });
    }
  }

  function nextSlide() { showSlide(currentIndex + 1); }
  function prevSlide() { showSlide(currentIndex - 1); }

  function start() {
    if (!intervalId) {
      intervalId = setInterval(nextSlide, 10000); // 10s rotation
    }
  }

  function stop() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function reset() {
    stop();
    const aboutSec = document.getElementById("about");
    if (aboutSec && aboutSec.classList.contains("active")) {
      start();
    }
  }

  // Create dot indicators
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className = "dot" + (i === 0 ? " active" : "");
      dot.addEventListener("click", () => {
        showSlide(i);
        reset();
      });
      dotsContainer.appendChild(dot);
    });
  }

  if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); reset(); });
  if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); reset(); });

  if (carouselContainer) {
    carouselContainer.addEventListener("mouseenter", stop);
    carouselContainer.addEventListener("mouseleave", () => {
      const aboutSec = document.getElementById("about");
      if (aboutSec && aboutSec.classList.contains("active")) {
        start();
      }
    });
  }

  window.startCarousel = start;
  window.stopCarousel = stop;
}

// --- 3. MODAL COMPONENT (ISOLATED) ---
function setupModal() {
  const modal = document.getElementById("project-modal");
  const modalBody = document.getElementById("modal-body");
  const modalClose = document.getElementById("modal-close");

  if (!modal || !modalBody) return;

  function openModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    let videoHTML = "";
    if (data.youtubeId) {
      videoHTML = `
        <div class="video-container">
          <iframe src="https://www.youtube.com/embed/${data.youtubeId}" allowfullscreen></iframe>
        </div>`;
    }

    modalBody.innerHTML = `
      <h2 style="font-size: 1.5rem; color: var(--gt-navy); font-weight: 700; margin-bottom: 0.5rem;">${data.title}</h2>
      <div class="project-tags" style="margin-bottom: 1rem;">
        ${data.tags.map(t => `<span class="tag">${t}</span>`).join("")}
      </div>
      ${videoHTML}
      <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem; line-height: 1.7;">
        ${data.description}
      </p>
      <a href="${data.repoUrl}" target="_blank" style="display: inline-block; background: var(--gt-navy); color: var(--gt-gold); padding: 0.5rem 1rem; border-radius: 4px; text-decoration: none; font-size: 0.85rem; font-weight: 600;">
        View Repository on GitHub
      </a>
    `;

    modal.classList.add("active");
  }

  function closeModal() {
    modal.classList.remove("active");
    modalBody.innerHTML = "";
  }

  document.addEventListener("click", (e) => {
    const card = e.target.closest("[data-project-id]");
    if (card) {
      e.stopPropagation();
      const projectId = card.getAttribute("data-project-id");
      openModal(projectId);
    }
  });

  if (modalClose) modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

// --- INITIALIZATION ENTRY POINT ---
function init() {
  try { setupTabSwitching(); } catch (e) { console.error("Tab setup error:", e); }
  try { setupCarousel(); } catch (e) { console.error("Carousel setup error:", e); }
  try { setupModal(); } catch (e) { console.error("Modal setup error:", e); }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
