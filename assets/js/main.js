// Mock Project Data Registry
const projectData = {
  "omniblade": {
    title: "OmniBlade Adaptive Gesture Controller",
    description: `Built an adaptive wearable game controller housed in a 3D-printed forearm brace. Sensor fusion algorithms process 6-axis IMU data to convert upper-limb gestures into low-latency game commands over Bluetooth.`,
    youtubeId: "ngSVvp_IACE",
    repoUrl: "https://github.com/gentryiv/Omniblade"
  },
  
  "cable-tester": {
    title: "Cable Tester",
    description: "Refactored firmware for automated diagnostic testing of ten-pin cables. Implemented SysTick timers, Watchdog routines, and precise GPIO pin masking via SAM register manipulation.",
    repoUrl: "https://github.com/gentryiv/CableTester"
  },
  
  "publix-scraper": {
    title: "Publix BoGo Scraper",
    description: `I love BoGo's! As a freshman, I wanted to learn coding beyond what I was already learning in my programming class. I also wanted to build something useful. 
    
So, over that winter break I built this Publix BoGo Scraper that navigates the Publix site, selects a store, scrapes that store's BoGos, filters them based on the user's liked/disliked history, and then sends the user an email with the BoGos relevant to them. The program is written in Python and uses XPath points alongside a wait function and try/except blocks to navigate the site. Data is handled via pandas and then exported via Python's smtplib with a separate program feeding it username and password credentials. The program runs in under a minute and is fully automated.

Future enhancements could include run scheduling, item images in emailed output, grocery lists with cart cost comparisons to other stores, deal trend tracking, and an automated notification system for desired deals or when a certain threshold of liked BoGos is reached to make a trip worthwhile.`,
    repoUrl: "https://github.com/gentryiv/Publix-BoGo-Scraper"
  },
  
  "fixing": {
    title: "Fixing Things",
    description: `I'm a pretty DIY guy so I fix a lot of stuff myself: I've recovered data from a bricked 2011 iMac, fixed different hardware failures on Xbox controllers, do most of my own car work, fixed a Bambu Lab printer, fixed a speaker, and random stuff my mom asks me to fix around the house.`
  },

  "senior-design": {
    title: "WISE: Wireless Integrated Sensing for Exoskeletons",
    description: `In progress project

      For my capstone design project at Georgia Tech, Calvin Hur, Pranjal Chatterjee, Sophia Wang, and I are building modular, wireless sensing units that can be integrated with exoskeleton designs for high performance, low cost units that have lighter, simpler, and overall better form factors.
      `,
  },

  "laptop-display": {
    title: "Old Laptop -> Wall Mount Display",
    description: `In progress project
    
    I am taking apart an old laptop I have that is now too old to run (even running Linux its painfully slow) into a wall mounted display where I can show music I'm playing, my calendar, reminders, or whatever else I want.`,
  },

  "arcade": {
    title: "Embedded Arcade Game",
    description: "Built a fun little game player with a joystick and 4 buttons for inputs; coded a game to go with it where a turkey collects food while avoiding the poisonous pill, plus a sentient pill that chases it. The buttons add different effects to the game such as changing the game speed, switching to an inverted high contrast mode, or pausing it.",
    youtubeId: "MOf9QYwM4ag",
    repoUrl: "https://github.com/gentryiv/TurkeyZombieRampage_Embedded-Arcade-Game"
  },

  "buck-converter": {
    title: "Buck Converter",
    description: "Designed a 24V input synchronous buck converter with selectable 12V, 5V, and 3.3V outputs at up to 3 A. Selected the LM5148 controller, external MOSFETs, current-sensing components, and feedback-network configurations using datasheets to guide component selection and circuit design. Developed the output-selection circuitry, opted for a 500 kHz switching freuency and a 5 mΩ current-sense resistor, and designed in both internal and external biasing circuits. Designed the PCB layout in Altium Designer, and hand-soldered it.",
  }
};

// Global Carousel Functions (populated by setupCarousel)
window.startCarousel = null;
window.stopCarousel = null;

// --- 1. CORE TAB SWITCHING (FAIL-SAFE & ISOLATED) ---
function switchTab(targetTab) {
  if (!targetTab) return;

  const sections = document.querySelectorAll(".section-content");
  sections.forEach(sec => {
    if (sec.id === targetTab) {
      sec.classList.add("active");
    } else {
      sec.classList.remove("active");
    }
  });

  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    if (link.getAttribute("data-tab") === targetTab) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  try {
    history.pushState(null, null, `#${targetTab}`);
  } catch (e) {
    window.location.hash = targetTab;
  }

  if (targetTab === "about") {
    if (typeof window.startCarousel === "function") window.startCarousel();
  } else {
    if (typeof window.stopCarousel === "function") window.stopCarousel();
  }
}

function setupTabSwitching() {
  document.addEventListener("click", (e) => {
    const tabLink = e.target.closest("[data-tab]");
    if (tabLink) {
      e.preventDefault();
      const targetTab = tabLink.getAttribute("data-tab");
      switchTab(targetTab);
    }
  });

  window.addEventListener("popstate", () => {
    const hash = window.location.hash.replace("#", "");
    if (hash && document.getElementById(hash)) {
      switchTab(hash);
    } else {
      switchTab("home");
    }
  });

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
      intervalId = setInterval(nextSlide, 10000);
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

// --- 3. MODAL COMPONENT (NO TAGS) ---
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

    let repoHTML = "";
    if (data.repoUrl) {
      repoHTML = `
        <a href="${data.repoUrl}" target="_blank" style="display: inline-block; background: var(--gt-navy); color: var(--gt-gold); padding: 0.5rem 1rem; border-radius: 4px; text-decoration: none; font-size: 0.85rem; font-weight: 600;">
          View Repository on GitHub
        </a>`;
    }

    modalBody.innerHTML = `
      <h2 style="font-size: 1.5rem; color: var(--gt-navy); font-weight: 700; margin-bottom: 0.5rem;">${data.title}</h2>
      ${videoHTML}
      <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem; line-height: 1.7; white-space: pre-line;">
        ${data.description}
      </p>
      ${repoHTML}
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
  try { setupCarousel(); } catch (e) { console.error("Carousel setup error:", e); }
  try { setupTabSwitching(); } catch (e) { console.error("Tab setup error:", e); }
  try { setupModal(); } catch (e) { console.error("Modal setup error:", e); }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
