// -------------------------------------------------------------
// Wedding Website Client Logic
// -------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  initStorySlideshow();
  initCountdown();
  initCalendarDownloads();
  initFaqAccordion();
  initMobileMenu();
});

// =============================================================
// 1. FULLSCREEN SCROLL-DRIVEN STORY / SLIDESHOW CONTROLLER
// =============================================================
function initStorySlideshow() {
  const wrapper = document.getElementById('story-slideshow-wrapper');
  const slides = document.querySelectorAll('.story-slide');
  const progressFills = document.querySelectorAll('.story-progress-fill');
  const playBtn = document.getElementById('story-autoplay-toggle');
  const playIcon = document.getElementById('story-play-icon');
  const pauseIcon = document.getElementById('story-pause-icon');
  const totalSlides = slides.length;

  if (!wrapper || totalSlides === 0) return;

  let currentSlideIndex = 0;
  let autoplayTimer = null;
  let isAutoplaying = false;

  function setSlide(index, progressInsideSlide = 0) {
    index = Math.max(0, Math.min(totalSlides - 1, index));
    currentSlideIndex = index;

    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    progressFills.forEach((fill, i) => {
      if (i < index) {
        fill.style.width = '100%';
        fill.classList.remove('current-active');
        fill.classList.add('completed');
      } else if (i === index) {
        fill.style.width = `${Math.min(100, Math.max(5, progressInsideSlide * 100))}%`;
        fill.classList.add('current-active');
        fill.classList.remove('completed');
      } else {
        fill.style.width = '0%';
        fill.classList.remove('current-active', 'completed');
      }
    });
  }

  // Scroll Scrubber (Syncs thumb / mouse scroll with slides and progress bars)
  function onScroll() {
    if (isAutoplaying) return; // Allow autoplay without scroll interference

    const rect = wrapper.getBoundingClientRect();
    const scrollDistance = -rect.top;
    const maxScroll = rect.height - window.innerHeight;

    if (maxScroll <= 0) return;

    const progress = Math.max(0, Math.min(1, scrollDistance / maxScroll));

    // Calculate which slide should be active and progress within it
    const floatIndex = progress * (totalSlides - 1);
    const targetIndex = Math.floor(floatIndex);
    const progressInSlide = floatIndex - targetIndex;

    setSlide(targetIndex, progressInSlide);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Initialize on load

  // Click on Progress Bars to jump to a specific year
  document.querySelectorAll('.story-progress-bar-bg').forEach((bar, index) => {
    bar.addEventListener('click', (e) => {
      e.stopPropagation();
      jumpToSlide(index);
    });
  });

  // Tap Left/Right Screen to navigate like Instagram Stories
  const tapLeftArea = document.getElementById('story-tap-left');
  const tapRightArea = document.getElementById('story-tap-right');

  if (tapLeftArea) {
    tapLeftArea.addEventListener('click', () => {
      if (currentSlideIndex > 0) {
        jumpToSlide(currentSlideIndex - 1);
      }
    });
  }

  if (tapRightArea) {
    tapRightArea.addEventListener('click', () => {
      if (currentSlideIndex < totalSlides - 1) {
        jumpToSlide(currentSlideIndex + 1);
      } else {
        // Jump down to celebration details
        const detailsSection = document.getElementById('celebration');
        if (detailsSection) detailsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  function jumpToSlide(index) {
    const rect = wrapper.getBoundingClientRect();
    const maxScroll = wrapper.clientHeight - window.innerHeight;
    const targetScrollY = window.pageYOffset + rect.top + (maxScroll * (index / (totalSlides - 1)));
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    setSlide(index, 0);
  }

  // Autoplay Slideshow Toggle
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
      let nextIndex = currentSlideIndex + 1;
      if (nextIndex >= totalSlides) nextIndex = 0;
      jumpToSlide(nextIndex);
    }, 4500);
  }

  function stopAutoplay() {
    isAutoplaying = false;
    clearInterval(autoplayTimer);
    if (playIcon) playIcon.classList.remove('hidden');
    if (pauseIcon) pauseIcon.classList.add('hidden');
  }
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
