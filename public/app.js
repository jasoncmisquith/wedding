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
// 1. FULLSCREEN STORY SLIDESHOW CONTROLLER
// =============================================================
function initStorySlideshow() {
  const wrapper = document.getElementById('story-slideshow-wrapper');
  const slides = document.querySelectorAll('.story-slide');
  const progressFills = document.querySelectorAll('.story-progress-fill');
  const progressBars = document.querySelectorAll('.story-progress-bar-bg');
  const playBtn = document.getElementById('story-autoplay-toggle');
  const playIcon = document.getElementById('story-play-icon');
  const pauseIcon = document.getElementById('story-pause-icon');
  const tapLeftArea = document.getElementById('story-tap-left');
  const tapRightArea = document.getElementById('story-tap-right');
  const totalSlides = slides.length;

  if (!wrapper || totalSlides === 0) return;

  let currentSlideIndex = 0;
  let autoplayTimer = null;
  let isAutoplaying = false;
  let isWheelThrottled = false;
  let wheelAccumulator = 0;
  const WHEEL_THRESHOLD = 30; // Natural threshold for both trackpads and mouse wheels

  function goToSlide(index) {
    index = Math.max(0, Math.min(totalSlides - 1, index));
    currentSlideIndex = index;

    slides.forEach((slide, i) => {
      const content = slide.querySelector('.story-content');
      if (i === index) {
        slide.classList.add('active');
        if (content) {
          content.style.display = 'block';
          // Ensure display:block is painted before opacity/transform transition
          void content.offsetWidth;
          content.style.opacity = '1';
          content.style.transform = 'translateY(0)';
        }
      } else {
        slide.classList.remove('active');
        if (content) {
          content.style.opacity = '0';
          content.style.transform = 'translateY(16px)';
          setTimeout(() => {
            if (i !== currentSlideIndex) {
              content.style.display = 'none';
            }
          }, 350);
        }
      }
    });

    // Update segmented progress bars
    progressFills.forEach((fill, i) => {
      if (i < index) {
        fill.classList.remove('current-active');
        fill.classList.add('completed');
        fill.style.width = '100%';
      } else if (i === index) {
        fill.classList.add('current-active');
        fill.classList.remove('completed');
        fill.style.width = '100%';
      } else {
        fill.classList.remove('current-active', 'completed');
        fill.style.width = '0%';
      }
    });
  }

  // Initialize on Slide 0
  goToSlide(0);

  // -----------------------------------------------------------
  // A. SCROLL / MOUSE WHEEL GESTURE CONTROLLER
  // -----------------------------------------------------------
  window.addEventListener('wheel', (e) => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Only intercept when user is at the top of the webpage (viewing the story slideshow)
    if (scrollY <= 15) {
      if (e.deltaY > 0) {
        // Scrolling DOWN
        if (currentSlideIndex < totalSlides - 1) {
          // MUST call preventDefault on every downward wheel event so the browser doesn't scroll the page!
          e.preventDefault();

          if (isWheelThrottled) return;

          wheelAccumulator += e.deltaY;
          if (wheelAccumulator >= WHEEL_THRESHOLD) {
            wheelAccumulator = 0;
            isWheelThrottled = true;
            stopAutoplay();
            goToSlide(currentSlideIndex + 1);
            setTimeout(() => {
              isWheelThrottled = false;
              wheelAccumulator = 0;
            }, 550);
          }
        } else {
          // On last slide (2026: Chapter IV):
          // Allow natural page scroll down into #celebration!
        }
      } else if (e.deltaY < 0) {
        // Scrolling UP
        if (currentSlideIndex > 0) {
          e.preventDefault();

          if (isWheelThrottled) return;

          wheelAccumulator += e.deltaY;
          if (wheelAccumulator <= -WHEEL_THRESHOLD) {
            wheelAccumulator = 0;
            isWheelThrottled = true;
            stopAutoplay();
            goToSlide(currentSlideIndex - 1);
            setTimeout(() => {
              isWheelThrottled = false;
              wheelAccumulator = 0;
            }, 550);
          }
        }
      }
    }
  }, { passive: false });

  // -----------------------------------------------------------
  // B. TOUCH SWIPE CONTROLLER (MOBILE & TABLET)
  // -----------------------------------------------------------
  let touchStartY = 0;
  let touchStartX = 0;

  wrapper.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  wrapper.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const diffY = touchStartY - touchEndY;
    const diffX = touchStartX - touchEndX;

    if (Math.abs(diffY) > 40 || Math.abs(diffX) > 40) {
      stopAutoplay();
      if (diffY > 40 || diffX > 40) {
        // Swipe UP or LEFT -> Next
        if (currentSlideIndex < totalSlides - 1) {
          goToSlide(currentSlideIndex + 1);
        } else {
          const celebration = document.getElementById('celebration');
          if (celebration) celebration.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (diffY < -40 || diffX < -40) {
        // Swipe DOWN or RIGHT -> Prev
        if (currentSlideIndex > 0) {
          goToSlide(currentSlideIndex - 1);
        }
      }
    }
  }, { passive: true });

  // -----------------------------------------------------------
  // C. PROGRESS BAR CLICKS & TAP AREAS
  // -----------------------------------------------------------
  progressBars.forEach((bar, index) => {
    bar.addEventListener('click', (e) => {
      e.stopPropagation();
      stopAutoplay();
      goToSlide(index);
    });
  });

  if (tapLeftArea) {
    tapLeftArea.addEventListener('click', () => {
      stopAutoplay();
      if (currentSlideIndex > 0) {
        goToSlide(currentSlideIndex - 1);
      }
    });
  }

  if (tapRightArea) {
    tapRightArea.addEventListener('click', () => {
      stopAutoplay();
      if (currentSlideIndex < totalSlides - 1) {
        goToSlide(currentSlideIndex + 1);
      } else {
        const celebration = document.getElementById('celebration');
        if (celebration) celebration.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // -----------------------------------------------------------
  // D. KEYBOARD NAVIGATION (ARROW KEYS)
  // -----------------------------------------------------------
  window.addEventListener('keydown', (e) => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollY <= 50) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (currentSlideIndex < totalSlides - 1) {
          e.preventDefault();
          stopAutoplay();
          goToSlide(currentSlideIndex + 1);
        } else {
          const celebration = document.getElementById('celebration');
          if (celebration) celebration.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (currentSlideIndex > 0) {
          e.preventDefault();
          stopAutoplay();
          goToSlide(currentSlideIndex - 1);
        }
      }
    }
  });

  // -----------------------------------------------------------
  // E. AUTOPLAY CONTROLLER
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
      goToSlide(nextIndex);
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

  // Stop autoplay if user manually scrolls or touches
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
