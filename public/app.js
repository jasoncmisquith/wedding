// -------------------------------------------------------------
// Wedding Website Client Logic: Scroll-Driven Story Slideshow
// -------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  initStorySlideshow();
  initCountdown();
  initCalendarDownloads();
  initFaqAccordion();
  initMobileMenu();
});

// =============================================================
// 1. FULLSCREEN SCROLL-PINNED STORY SLIDESHOW CONTROLLER
// =============================================================
function initStorySlideshow() {
  const container = document.getElementById('story-scroll-container');
  const slides = document.querySelectorAll('.story-slide');
  const progressFills = document.querySelectorAll('.story-progress-fill');
  const progressBars = document.querySelectorAll('.story-progress-bar-bg');
  const playBtn = document.getElementById('story-autoplay-toggle');
  const playIcon = document.getElementById('story-play-icon');
  const pauseIcon = document.getElementById('story-pause-icon');
  const tapLeftArea = document.getElementById('story-tap-left');
  const tapRightArea = document.getElementById('story-tap-right');
  const totalSlides = slides.length;

  if (!container || totalSlides === 0) return;

  let currentSlideIndex = 0;
  let autoplayTimer = null;
  let isAutoplaying = false;
  let isTicking = false;

  // Set visual state of slides
  function setActiveSlide(index) {
    index = Math.max(0, Math.min(totalSlides - 1, index));
    if (index === currentSlideIndex && slides[index].classList.contains('active')) {
      return;
    }
    currentSlideIndex = index;

    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  }

  // Update progress bars based on overall scroll progress (0.0 to 1.0)
  function updateProgressBars(progress) {
    const activeIdx = Math.min(totalSlides - 1, Math.floor(progress * totalSlides));
    
    progressFills.forEach((fill, i) => {
      if (i < activeIdx) {
        fill.classList.remove('current-active');
        fill.classList.add('completed');
        fill.style.width = '100%';
      } else if (i === activeIdx) {
        fill.classList.add('current-active');
        fill.classList.remove('completed');
        // Calculate progress percentage inside this specific segment
        const segmentProgress = (progress - (i / totalSlides)) * totalSlides;
        const fillPercent = Math.max(8, Math.min(100, segmentProgress * 100));
        fill.style.width = `${fillPercent}%`;
      } else {
        fill.classList.remove('current-active', 'completed');
        fill.style.width = '0%';
      }
    });
  }

  // Core Scroll Handler
  function onScroll() {
    const rect = container.getBoundingClientRect();
    const containerHeight = container.offsetHeight;
    const windowHeight = window.innerHeight;
    const totalScrollable = containerHeight - windowHeight;

    if (totalScrollable <= 0) return;

    // Scroll progress from 0.0 to 1.0
    const scrollOffset = -rect.top;
    const progress = Math.max(0, Math.min(1, scrollOffset / totalScrollable));

    // Determine target slide based on progress
    const targetIndex = Math.min(totalSlides - 1, Math.floor(progress * totalSlides));
    setActiveSlide(targetIndex);
    updateProgressBars(progress);

    isTicking = false;
  }

  // RequestAnimationFrame throttled scroll listener for 60fps/120fps performance
  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(onScroll);
      isTicking = true;
    }
  }, { passive: true });

  // Recalculate on window resize
  window.addEventListener('resize', () => {
    onScroll();
  }, { passive: true });

  // Initial calculation
  setActiveSlide(0);
  onScroll();

  // -----------------------------------------------------------
  // PROGRAMMATIC NAVIGATION (Clicking bars, buttons, or tap areas)
  // -----------------------------------------------------------
  function scrollToSlide(index) {
    const containerHeight = container.offsetHeight;
    const windowHeight = window.innerHeight;
    const totalScrollable = containerHeight - windowHeight;
    const containerTop = container.offsetTop;

    // Jump to the middle of that slide's segment
    const targetScroll = containerTop + ((index + 0.4) / totalSlides) * totalScrollable;
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  }

  // Progress Bar Clicks
  progressBars.forEach((bar, index) => {
    bar.addEventListener('click', (e) => {
      e.stopPropagation();
      stopAutoplay();
      scrollToSlide(index);
    });
  });

  // Tap Left Area (Previous Chapter)
  if (tapLeftArea) {
    tapLeftArea.addEventListener('click', () => {
      stopAutoplay();
      if (currentSlideIndex > 0) {
        scrollToSlide(currentSlideIndex - 1);
      }
    });
  }

  // Tap Right Area (Next Chapter)
  if (tapRightArea) {
    tapRightArea.addEventListener('click', () => {
      stopAutoplay();
      if (currentSlideIndex < totalSlides - 1) {
        scrollToSlide(currentSlideIndex + 1);
      } else {
        const celebration = document.getElementById('celebration');
        if (celebration) celebration.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Keyboard Navigation (Arrow Keys)
  window.addEventListener('keydown', (e) => {
    const rect = container.getBoundingClientRect();
    // Only intercept arrow keys if the slideshow is in view
    if (rect.top <= 100 && rect.bottom >= window.innerHeight * 0.5) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (currentSlideIndex < totalSlides - 1) {
          e.preventDefault();
          stopAutoplay();
          scrollToSlide(currentSlideIndex + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (currentSlideIndex > 0) {
          e.preventDefault();
          stopAutoplay();
          scrollToSlide(currentSlideIndex - 1);
        }
      }
    }
  });

  // -----------------------------------------------------------
  // AUTOPLAY SLIDESHOW CONTROLLER
  // -----------------------------------------------------------
  if (playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isAutoplaying) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });
  }

  function startAutoplay() {
    isAutoplaying = true;
    if (playIcon) playIcon.classList.add('hidden');
    if (pauseIcon) pauseIcon.classList.remove('hidden');

    autoplayTimer = setInterval(() => {
      let nextIndex = (currentSlideIndex + 1) % totalSlides;
      scrollToSlide(nextIndex);
    }, 4000);
  }

  function stopAutoplay() {
    if (!isAutoplaying) return;
    isAutoplaying = false;
    clearInterval(autoplayTimer);
    autoplayTimer = null;
    if (playIcon) playIcon.classList.remove('hidden');
    if (pauseIcon) pauseIcon.classList.add('hidden');
  }

  // Pause autoplay if user manually scrolls with touch or wheel
  window.addEventListener('wheel', () => {
    if (isAutoplaying) stopAutoplay();
  }, { passive: true });

  window.addEventListener('touchstart', () => {
    if (isAutoplaying) stopAutoplay();
  }, { passive: true });
}

// =============================================================
// 2. LIVE COUNTDOWN TIMER
// =============================================================
function initCountdown() {
  const targetDate = new Date('2026-12-12T15:00:00').getTime();

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-minutes');
  const secsEl = document.getElementById('cd-seconds');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      daysEl.innerText = '00';
      hoursEl.innerText = '00';
      minsEl.innerText = '00';
      secsEl.innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.innerText = String(days).padStart(2, '0');
    hoursEl.innerText = String(hours).padStart(2, '0');
    minsEl.innerText = String(minutes).padStart(2, '0');
    secsEl.innerText = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// =============================================================
// 3. CALENDAR EXPORT (GOOGLE & APPLE .ICS)
// =============================================================
function initCalendarDownloads() {
  const downloadIcsBtn = document.getElementById('download-ics-btn');
  const googleCalBtn = document.getElementById('google-cal-btn');

  const eventDetails = {
    title: "Jacob & Aisha's Wedding Celebration",
    description: "Join us in celebrating our wedding ceremony and reception!",
    location: "The Fairmont Grand Ballroom, 950 Mason St, San Francisco, CA 94108",
    start: "20261212T230000Z",
    end: "20261213T070000Z"
  };

  if (downloadIcsBtn) {
    downloadIcsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Our Wedding//Wedding Invitation//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:wedding-${Date.now()}@weddingwebsite.local`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTSTART:${eventDetails.start}`,
        `DTEND:${eventDetails.end}`,
        `SUMMARY:${eventDetails.title}`,
        `DESCRIPTION:${eventDetails.description}`,
        `LOCATION:${eventDetails.location}`,
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'jacob-and-aisha-wedding.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  if (googleCalBtn) {
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.start}/${eventDetails.end}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
    googleCalBtn.setAttribute('href', gCalUrl);
    googleCalBtn.setAttribute('target', '_blank');
    googleCalBtn.setAttribute('rel', 'noopener noreferrer');
  }
}

// =============================================================
// 4. FAQ ACCORDION
// =============================================================
function initFaqAccordion() {
  const faqButtons = document.querySelectorAll('.faq-toggle');

  faqButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      faqButtons.forEach(otherBtn => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          const otherContent = otherBtn.nextElementSibling;
          const otherIcon = otherBtn.querySelector('.faq-icon');
          if (otherContent) otherContent.classList.add('hidden');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        }
      });

      if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        content.classList.add('hidden');
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        btn.setAttribute('aria-expanded', 'true');
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(45deg)';
      }
    });
  });
}

// =============================================================
// 5. MOBILE MENU
// =============================================================
function initMobileMenu() {
  const menuToggle = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuToggle || !mobileMenu) return;

  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}
