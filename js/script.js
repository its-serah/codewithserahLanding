(function () {
  document.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("js-enabled");
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Initialize critical functionality immediately
    initMobileNavigation();
    initHeroObserver();
    initNewsletter();
    initScrollToTop(prefersReducedMotion);

    // Defer non-critical animations to after page load
    if (document.readyState === "complete") {
      initDeferredFeatures(prefersReducedMotion);
    } else {
      window.addEventListener("load", function () {
        // Use requestIdleCallback if available, otherwise setTimeout
        if ("requestIdleCallback" in window) {
          requestIdleCallback(function () {
            initDeferredFeatures(prefersReducedMotion);
          });
        } else {
          setTimeout(function () {
            initDeferredFeatures(prefersReducedMotion);
          }, 100);
        }
      });
    }
  });

  function initDeferredFeatures(prefersReducedMotion) {
    initHeroTyping(prefersReducedMotion);
    initCodeTyping(prefersReducedMotion);
    initStatCounters(prefersReducedMotion);
    initScrollReveal(prefersReducedMotion);
    initConfetti(prefersReducedMotion);
    initAmbassadorCarousel();
    initSequentialGallery(prefersReducedMotion);
  }

  function initMobileNavigation() {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener("click", function () {
      const expanded = this.getAttribute("aria-expanded") === "true";
      this.setAttribute("aria-expanded", String(!expanded));
      this.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }

  function initHeroObserver() {
    const navbar = document.querySelector(".navbar");
    const hero = document.querySelector(".hero");
    if (!navbar || !hero) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          navbar.classList.toggle("is-scrolled", !entry.isIntersecting);
        });
      },
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 },
    );

    observer.observe(hero);
  }

  function initHeroTyping(prefersReducedMotion) {
    const textEl = document.querySelector(".typing-text");
    const cursorEl = document.querySelector(".typing-cursor");
    if (!textEl) return;

    const phrases = [
      "Learn to Code",
      "Build Cool Projects",
      "Explore Science & Art",
      "Think Creatively",
      "Shape the Future",
    ];

    if (prefersReducedMotion) {
      textEl.textContent = phrases[0];
      if (cursorEl) cursorEl.style.display = "none";
      return;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let pauseTimer = null;

    function tick() {
      const current = phrases[phraseIndex];

      if (!deleting) {
        textEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === current.length) {
          // Pause before deleting
          pauseTimer = setTimeout(function () {
            deleting = true;
            tick();
          }, 1800);
          return;
        }
        setTimeout(tick, 80);
      } else {
        textEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, 400);
          return;
        }
        setTimeout(tick, 40);
      }
    }

    tick();
  }

  function initCodeTyping(prefersReducedMotion) {
    const codeElement = document.querySelector(".code-typing");
    if (!codeElement) return;

    let lines;
    try {
      lines = JSON.parse(codeElement.dataset.lines || "[]");
    } catch (error) {
      lines = [];
    }

    if (!Array.isArray(lines) || lines.length === 0) {
      return;
    }

    if (prefersReducedMotion) {
      codeElement.textContent = lines.join("\n");
      return;
    }

    const caret = document.createElement("span");
    caret.className = "code-caret";
    let lineIndex = 0;
    let charIndex = 0;
    let buffer = "";

    const typeNext = () => {
      if (lineIndex >= lines.length) {
        return;
      }

      const currentLine = lines[lineIndex];
      buffer += currentLine.charAt(charIndex);
      charIndex += 1;

      if (charIndex > currentLine.length) {
        buffer += "\n";
        lineIndex += 1;
        charIndex = 0;
      }

      codeElement.textContent = buffer;
      codeElement.appendChild(caret);

      if (lineIndex < lines.length) {
        const delay = currentLine.charAt(charIndex - 1) === " " ? 40 : 70;
        window.setTimeout(typeNext, delay);
      }
    };

    typeNext();
  }

  function initStatCounters(prefersReducedMotion) {
    const counters = document.querySelectorAll(".stat-card");
    if (!counters.length) return;

    const animateCounter = (element) => {
      const target = Number(element.dataset.target || 0);
      const suffix = element.dataset.suffix || "";
      const numberElement = element.querySelector(".stat-number");
      if (!numberElement) return;

      if (prefersReducedMotion) {
        numberElement.textContent = formatNumber(target, suffix);
        return;
      }

      const duration = 1400;
      const start = performance.now();

      const step = (timestamp) => {
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = easeOutCubic(progress);
        const value = Math.floor(eased * target);
        numberElement.textContent = formatNumber(value, suffix);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          numberElement.textContent = formatNumber(target, suffix);
        }
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );

    counters.forEach((card) => observer.observe(card));
  }

  function initScrollReveal(prefersReducedMotion) {
    if (prefersReducedMotion) {
      document
        .querySelectorAll(".reveal")
        .forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" },
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  }

  function initConfetti(prefersReducedMotion) {
    if (prefersReducedMotion) {
      return;
    }

    const triggers = document.querySelectorAll(".confetti-trigger");
    if (!triggers.length) return;

    triggers.forEach((trigger) => {
      trigger.addEventListener("mouseenter", () => launchConfetti(trigger));
      trigger.addEventListener("focus", () => launchConfetti(trigger));
    });
  }

  function launchConfetti(trigger) {
    const bounds = trigger.getBoundingClientRect();
    const colors = ["#FBE58C", "#FFD1A8", "#A68BE0", "#2F4464"];
    const pieces = 18;

    for (let i = 0; i < pieces; i += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.background = colors[i % colors.length];
      piece.style.left = `${bounds.left + bounds.width / 2}px`;
      piece.style.top = `${bounds.top + window.scrollY + bounds.height / 2}px`;
      document.body.appendChild(piece);

      const angle = (Math.PI * 2 * i) / pieces;
      const distance = 40 + Math.random() * 40;
      const translateX = Math.cos(angle) * distance;
      const translateY = Math.sin(angle) * distance;

      requestAnimationFrame(() => {
        piece.style.opacity = "1";
        piece.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${Math.random() * 160 - 80}deg)`;
        piece.style.transition =
          "transform 600ms ease-out, opacity 600ms ease-out";
      });

      window.setTimeout(() => {
        piece.style.opacity = "0";
        piece.addEventListener("transitionend", () => piece.remove(), {
          once: true,
        });
      }, 600);
    }
  }

  function initNewsletter() {
    var form = document.querySelector(".newsletter-form");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var email = form.querySelector('input[type="email"]');
      if (!email || !email.value.trim()) {
        email?.focus();
        return;
      }

      email.value = "";
      form.classList.add("success");
      setTimeout(function () {
        form.classList.remove("success");
      }, 2000);
    });
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function formatNumber(value, suffix) {
    const formatted = new Intl.NumberFormat("en-US").format(value);
    return `${formatted}${suffix}`;
  }

  function initScrollToTop(prefersReducedMotion) {
    const scrollToTopBtn = document.getElementById("scrollToTop");
    if (!scrollToTopBtn) return;

    // Show/hide button based on scroll position
    const toggleButton = () => {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.add("visible");
      } else {
        scrollToTopBtn.classList.remove("visible");
      }
    };

    // Scroll to top when clicked
    scrollToTopBtn.addEventListener("click", () => {
      if (prefersReducedMotion) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    });

    // Listen to scroll events
    window.addEventListener("scroll", toggleButton);

    // Initial check
    toggleButton();
  }

  function initAmbassadorCarousel() {
    const grid = document.querySelector(".ambassadors-grid");
    const prevBtn = document.querySelector(".carousel-arrow-prev");
    const nextBtn = document.querySelector(".carousel-arrow-next");
    const progressContainer = document.querySelector(".carousel-progress");

    if (!grid || !prevBtn || !nextBtn || !progressContainer) return;

    const cards = Array.from(grid.querySelectorAll(".ambassador-card"));
    const totalCards = cards.length;
    const cardsPerView = 3;
    const totalPages = Math.ceil(totalCards / cardsPerView);

    // Create progress dots
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement("div");
      dot.className = "progress-dot";
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => scrollToPage(i));
      progressContainer.appendChild(dot);
    }

    const dots = Array.from(
      progressContainer.querySelectorAll(".progress-dot"),
    );

    function updateActiveDot() {
      const scrollLeft = grid.scrollLeft;
      const cardWidth = cards[0].offsetWidth;
      const gap = parseInt(getComputedStyle(grid).gap);
      const scrollPerPage = (cardWidth + gap) * cardsPerView;
      const currentPage = Math.round(scrollLeft / scrollPerPage);

      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentPage);
      });
    }

    function scrollToPage(pageIndex) {
      const cardWidth = cards[0].offsetWidth;
      const gap = parseInt(getComputedStyle(grid).gap);
      const scrollAmount = (cardWidth + gap) * cardsPerView * pageIndex;
      grid.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }

    prevBtn.addEventListener("click", () => {
      const cardWidth = cards[0].offsetWidth;
      const gap = parseInt(getComputedStyle(grid).gap);
      const scrollAmount = (cardWidth + gap) * cardsPerView;
      grid.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
      const cardWidth = cards[0].offsetWidth;
      const gap = parseInt(getComputedStyle(grid).gap);
      const scrollAmount = (cardWidth + gap) * cardsPerView;
      grid.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    grid.addEventListener("scroll", updateActiveDot);
  }

  function initSequentialGallery(prefersReducedMotion) {
    const gallerySlides = document.querySelectorAll(".gallery-slide");

    if (!gallerySlides.length) return;

    if (prefersReducedMotion) {
      gallerySlides.forEach((slide) => {
        slide.style.opacity = "1";
        slide.style.transform = "translate(-50%, -50%) scale(1)";
      });
      return;
    }

    let currentIndex = 0;
    let animationInProgress = false;

    // Function to show the next slide
    function showNextSlide() {
      if (animationInProgress || currentIndex >= gallerySlides.length) {
        return;
      }

      animationInProgress = true;
      const currentSlide = gallerySlides[currentIndex];

      if (currentIndex === 0) {
        // First slide: Zoom in dramatically
        currentSlide.classList.add("zoom-in");

        // Wait 2.5 seconds, then zoom out
        setTimeout(() => {
          currentSlide.classList.remove("zoom-in");
          currentSlide.classList.add("zoom-out");

          // After zoom out animation, move to next
          setTimeout(() => {
            currentIndex++;
            animationInProgress = false;
            showNextSlide();
          }, 1000);
        }, 2500);
      } else {
        // Subsequent slides: Just show them
        currentSlide.classList.add("show-next");

        // Stay for 2 seconds, then disappear
        setTimeout(() => {
          currentSlide.classList.remove("show-next");
          currentSlide.classList.add("zoom-out");

          // After disappearing, move to next
          setTimeout(() => {
            currentIndex++;
            animationInProgress = false;

            // If not the last slide, show next
            if (currentIndex < gallerySlides.length) {
              showNextSlide();
            } else {
              // Loop back to beginning after a pause
              setTimeout(() => {
                resetGallery();
              }, 2000);
            }
          }, 1000);
        }, 2000);
      }
    }

    // Function to reset gallery and start over
    function resetGallery() {
      gallerySlides.forEach((slide) => {
        slide.classList.remove("zoom-in", "zoom-out", "show-next");
      });
      currentIndex = 0;
      animationInProgress = false;
      showNextSlide();
    }

    // Observer to start animation when gallery comes into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            currentIndex === 0 &&
            !animationInProgress
          ) {
            showNextSlide();
            observer.disconnect(); // Only trigger once
          }
        });
      },
      { threshold: 0.3 },
    );

    const galleryStage = document.querySelector(".gallery-stage");
    if (galleryStage) {
      observer.observe(galleryStage);
    }
  }
})();
