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

function initApp() {
  // DOM Elements Selection
  const navLinks = document.querySelectorAll("[data-tab]");
  const sections = document.querySelectorAll(".section-content");
  const modal = document.getElementById("project-modal");
  const modalBody = document.getElementById("modal-body");
  const modalClose = document.getElementById("modal-close");

  // Carousel State Variables
  let carouselInterval = null;
  let currentSlideIndex = 0;

  const slides = document.querySelectorAll(".carousel-slide");
  const dotsContainer = document.getElementById("carousel-dots");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  const carouselContainer = document.getElementById("about-carousel");

  // --- Carousel Helper Functions ---
  function updateCarouselDisplay() {
    if (!slides.length) return;
    slides.forEach((slide, idx) => {
      slide.classList.toggle("active", idx === currentSlideIndex);
    });
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll(".dot");
      dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === currentSlideIndex);
      });
    }
  }

  function nextSlide() {
    if (!slides.length) return;
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    updateCarouselDisplay();
  }

  function prevSlide() {
    if (!slides.length) return;
    currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    updateCarouselDisplay();
  }

  function startCarousel() {
    if (!slides.length) return;
    if (!carouselInterval) {
      carouselInterval = setInterval(nextSlide, 10000); // 10-second rotation
    }
  }

  function stopCarousel() {
    if (carouselInterval) {
      clearInterval(carouselInterval);
      carouselInterval = null;
    }
  }

  function resetCarouselTimer() {
    stopCarousel();
    const aboutSection = document.getElementById("about");
    if (aboutSection && aboutSection.classList.contains("active")) {
      startCarousel();
    }
  }

  // Initialize Carousel Dots & Buttons
  if (slides.length && dotsContainer) {
    dotsContainer.innerHTML = "";
    slides.forEach((_, idx) => {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      if (idx === 0) dot.classList.add("active");
      dot.addEventListener("click", () => {
        currentSlideIndex = idx;
        updateCarouselDisplay();
        resetCarouselTimer();
      });
      dotsContainer.appendChild(dot);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetCarouselTimer();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetCarouselTimer();
    });
  }

  if (carouselContainer) {
    carouselContainer.addEventListener("mouseenter", stopCarousel);
    carouselContainer.addEventListener("mouseleave", () => {
      const aboutSection = document.getElementById("about");
      if (aboutSection && aboutSection.classList.contains("active")) {
        startCarousel();
      }
    });
  }

  // --- Core Tab Switcher Logic ---
  function switchTab(targetTab) {
    if (!targetTab) return;

    // Deactivate all sections & navigation links
    sections.forEach(sec => sec.classList.remove("active"));
    document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));

    // Activate target section
    const activeSection = document.getElementById(targetTab);
    if (activeSection) {
      activeSection.classList.add("active");
    }

    // Activate active navigation link state
    const activeNavLinks = document.querySelectorAll(`.nav-link[data-tab="${targetTab}"]`);
    activeNavLinks.forEach(link => link.classList.add("active"));

    // Update URL hash without causing viewport scrolling jumps
    if (history.pushState) {
      history.pushState(null, null, `#${targetTab}`);
    } else {
      window.location.hash = targetTab;
    }

    // Manage carousel lifecycle based on current tab
    if (targetTab === "about") {
      startCarousel();
    } else {
      stopCarousel();
    }
  }

  // Attach event listeners to all navigation tab links
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const tab = link.getAttribute("data-tab");
      if (tab) {
        switchTab(tab);
      }
    });
  });

  // Handle Initial Load Hash or Default to Home
  const initialHash = window.location.hash.replace("#", "");
  if (initialHash && document.getElementById(initialHash)) {
    switchTab(initialHash);
  } else {
    switchTab("home");
  }

  // --- Modal Logic ---
  function openProjectModal(projectId) {
    const data = projectData[projectId];
    if (!data || !modal || !modalBody) return;

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
    if (modal) modal.classList.remove("active");
    if (modalBody) modalBody.innerHTML = "";
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
}

// Execution Guard ensuring initialization runs regardless of DOM readiness state
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
});
