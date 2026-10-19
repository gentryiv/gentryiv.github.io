// Mock Project Data Registry
const projectData = {
  "omniblade": {
    title: "OmniBlade Adaptive Gesture Controller",
    tags: ["ESP32", "C++", "MPU-6050", "Bluetooth Serial"],
    description: "Built an adaptive wearable game controller housed in a 3D-printed forearm brace. Sensor fusion algorithms process 6-axis IMU data to convert upper-limb gestures into low-latency game commands over Bluetooth.",
    youtubeId: "",
    repoUrl: "https://github.com/gentryiv"
  },
  "cable-tester": {
    title: "SAMD20 Ten-Pin Cable Tester",
    tags: ["ATSAMD20", "Embedded C", "Bare-Metal"],
    description: "Refactored firmware for automated diagnostic testing of ten-pin cables. Implemented SysTick timers, Watchdog routines, and precise GPIO pin masking via SAM register manipulation.",
    youtubeId: "",
    repoUrl: "https://github.com/gentryiv"
  },
  "gait-analysis": {
    title: "Plantar Sensory Substitution Gait Analysis",
    tags: ["MATLAB", "DSP", "FFT", "Biomechanical Data"],
    description: "Evaluated sensory substitution feedback systems by processing time-series force sensor data. Developed MATLAB routines for Fast Fourier Transformations (FFT) and Power Spectral Density (PSD) analysis.",
    youtubeId: "",
    repoUrl: "https://github.com/gentryiv"
  }
};

// Global references for tab-aware timer management
let startCarouselTimer = null;
let stopCarouselTimer = null;

// Carousel Function Definition
function initCarousel() {
  const slides = document.querySelectorAll(".carousel-slide");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  const dotsContainer = document.getElementById("carousel-dots");
  const carouselContainer = document.getElementById("about-carousel");
  
  if (!slides.length || !dotsContainer) return;

  let currentIndex = 0;
  let slideInterval = null;

  // Clear existing dots to prevent duplication
  dotsContainer.innerHTML = "";

  // Render navigation dots dynamically
  slides.forEach((_, idx) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (idx === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(idx));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll(".dot");

  function updateSlides() {
    slides.forEach((slide, idx) => {
      slide.classList.toggle("active", idx === currentIndex);
    });
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    updateSlides();
    resetTimer();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlides();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlides();
  }

  function startTimer() {
    if (!slideInterval) {
      slideInterval = setInterval(nextSlide, 10000); // 10-second rotation interval
    }
  }

  function stopTimer() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  function resetTimer() {
    stopTimer();
    const aboutSection = document.getElementById("about");
    if (aboutSection && aboutSection.classList.contains("active")) {
      startTimer();
    }
  }

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", () => { nextSlide(); resetTimer(); });
    prevBtn.addEventListener("click", () => { prevSlide(); resetTimer(); });
  }

  if (carouselContainer) {
    carouselContainer.addEventListener("mouseenter", stopTimer);
    carouselContainer.addEventListener("mouseleave", () => {
      const aboutSection = document.getElementById("about");
      if (aboutSection && aboutSection.classList.contains("active")) {
        startTimer();
      }
    });
  }

  startCarouselTimer = startTimer;
  stopCarouselTimer = stopTimer;
}

// DOM Initialization
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("[data-tab]");
  const sections = document.querySelectorAll(".section-content");
  const modal = document.getElementById("project-modal");
  const modalBody = document.getElementById("modal-body");
  const modalClose = document.getElementById("modal-close");

  // Initialize carousel element references & event handlers
  initCarousel();

  // Tab Navigation Handler with Tab-Bound Carousel Lifecycle
  function switchTab(targetTab) {
    sections.forEach(sec => sec.classList.remove("active"));
    document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));

    const activeSection = document.getElementById(targetTab);
    if (activeSection) {
      activeSection.classList.add("active");
    }

    const activeNavLink = document.querySelector(`.nav-link[data-tab="${targetTab}"]`);
    if (activeNavLink) {
      activeNavLink.classList.add("active");
    }

    window.location.hash = targetTab;

    // Start timer strictly on 'about' tab, clear on all other tabs
    if (targetTab === "about") {
      if (startCarouselTimer) startCarouselTimer();
    } else {
      if (stopCarouselTimer) stopCarouselTimer();
    }
  }

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const tab = link.getAttribute("data-tab");
      switchTab(tab);
    });
  });

  // Handle URL Hash on Load
  const initialHash = window.location.hash.replace("#", "");
  if (initialHash && document.getElementById(initialHash)) {
    switchTab(initialHash);
  } else {
    // Default Home view: ensure timer is dormant on landing
    if (stopCarouselTimer) stopCarouselTimer();
  }

  // Modal Render Logic
  function openProjectModal(projectId) {
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

  document.querySelectorAll("[data-project-id]").forEach(element => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      const projectId = element.getAttribute("data-project-id");
      openProjectModal(projectId);
    });
  });

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
});
});
