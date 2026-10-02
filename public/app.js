// -------------------------------------------------------------
// Wedding Website Client Logic: Scroll-Driven Story Slideshow
// -------------------------------------------------------------

function initApp() {
  initStorySlideshow();
  initStickyStoryGallery();
  initCountdown();
  initCalendarDownloads();
  initMobileMenu();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  // DOM is already parsed (Safari bfcache, fast load, or deferred script)
  initApp();
}

// =============================================================
// 1. FULLSCREEN STORY SLIDESHOW (CLEAN AUTO-PLAY + ARROWS)
// =============================================================
function initStorySlideshow() {
  const wrapper = document.getElementById('story-slideshow-wrapper');
  const slides = document.querySelectorAll('.story-slide');
  const progressFills = document.querySelectorAll('.story-progress-fill');
  const progressBars = document.querySelectorAll('.story-progress-bar-bg');
  const playBtn = document.getElementById('story-autoplay-toggle');
  const playIcon = document.getElementById('story-play-icon');
  const pauseIcon = document.getElementById('story-pause-icon');
  const prevBtn = document.getElementById('hero-prev-btn');
  const nextBtn = document.getElementById('hero-next-btn');
  const tapLeftArea = document.getElementById('story-tap-left');
  const tapRightArea = document.getElementById('story-tap-right');
  const totalSlides = slides.length;

  if (!wrapper || totalSlides === 0) return;

  let currentSlideIndex = 0;
  let autoplayTimer = null;
  let isAutoplaying = true;
  const slideDuration = 4500; // 4.5 seconds per slide

  function goToSlide(index) {
    if (index >= totalSlides) index = 0;
    if (index < 0) index = totalSlides - 1;
    currentSlideIndex = index;

    slides.forEach((slide, i) => {
      if (i === index) {
        // Activate target slide immediately in DOM
        slide.style.display = 'block';
        slide.classList.remove('is-hidden');
        void slide.offsetWidth; // Force layout reflow for CSS transition
        slide.classList.add('active');
      } else {
        // Deactivate previous slide and cleanly hide it after transition
        slide.classList.remove('active');
        setTimeout(() => {
          if (i !== currentSlideIndex) {
            slide.classList.add('is-hidden');
            slide.style.display = 'none';
          }
        }, 700);
      }
    });

    // Update segmented progress bars with smooth animated fill
    progressFills.forEach((fill, i) => {
      fill.style.transition = 'none';
      if (i < index) {
        fill.classList.remove('current-active');
        fill.classList.add('completed');
        fill.style.width = '100%';
      } else if (i === index) {
        fill.classList.add('current-active');
        fill.classList.remove('completed');
        fill.style.width = '0%';
        void fill.offsetWidth; // Force layout reflow
        if (isAutoplaying) {
          fill.style.transition = `width ${slideDuration}ms linear`;
          fill.style.width = '100%';
        } else {
          fill.style.width = '100%';
        }
      } else {
        fill.classList.remove('current-active', 'completed');
        fill.style.width = '0%';
      }
    });
  }

  // Initialize on Slide 0
  goToSlide(0);

  // Arrow Button Navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(currentSlideIndex - 1);
      resetAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(currentSlideIndex + 1);
      resetAutoplay();
    });
  }

  // Tap Left / Right Zones
  if (tapLeftArea) {
    tapLeftArea.addEventListener('click', () => {
      goToSlide(currentSlideIndex - 1);
      resetAutoplay();
    });
  }

  if (tapRightArea) {
    tapRightArea.addEventListener('click', () => {
      goToSlide(currentSlideIndex + 1);
      resetAutoplay();
    });
  }

  // Progress Bar Clicks
  progressBars.forEach((bar, index) => {
    bar.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(index);
      resetAutoplay();
    });
  });

  // Autoplay Controller
  function startAutoplay() {
    isAutoplaying = true;
    if (playIcon) playIcon.classList.add('hidden');
    if (pauseIcon) pauseIcon.classList.remove('hidden');

    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => {
      goToSlide(currentSlideIndex + 1);
    }, slideDuration);
  }

  function stopAutoplay() {
    isAutoplaying = false;
    clearInterval(autoplayTimer);
    autoplayTimer = null;
    if (playIcon) playIcon.classList.remove('hidden');
    if (pauseIcon) pauseIcon.classList.add('hidden');
  }

  function resetAutoplay() {
    if (isAutoplaying) {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(() => {
        goToSlide(currentSlideIndex + 1);
      }, slideDuration);
    }
  }

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

  // Start initial autoplay
  startAutoplay();
}

// =============================================================
// 2. OUR 4-YEAR STORY: STICKY ARCHIVAL GALLERY OBSERVER
// =============================================================
function initStickyStoryGallery() {
  const stickyPhoto = document.getElementById('sticky-photo');
  const stickyYearBadge = document.getElementById('sticky-year-badge');
  const stickyEffectCue = document.getElementById('sticky-effect-cue');
  const milestones = document.querySelectorAll('.narrative-milestone');

  if (!stickyPhoto || milestones.length === 0) return;

  function updateActiveMilestone(target) {
    const newImg = target.getAttribute('data-img');
    const newYear = target.getAttribute('data-year');
    const newEffect = target.getAttribute('data-effect');
    const newPos = target.getAttribute('data-pos') || 'center center';

    // Highlight active milestone card
    milestones.forEach(m => m.classList.remove('active'));
    target.classList.add('active');

    // Smooth cross-browser photo morph (Valid CSS: separate filter and transform)
    if (!stickyPhoto.src.endsWith(newImg)) {
      stickyPhoto.style.opacity = '0.35';
      stickyPhoto.style.filter = 'blur(10px)';
      stickyPhoto.style.webkitFilter = 'blur(10px)';
      stickyPhoto.style.transform = 'scale(0.97)';
      stickyPhoto.style.webkitTransform = 'scale(0.97)';
      
      setTimeout(() => {
        stickyPhoto.src = newImg;
        stickyPhoto.style.objectPosition = newPos;
        if (stickyYearBadge) stickyYearBadge.innerHTML = newYear;
        if (stickyEffectCue) stickyEffectCue.innerHTML = newEffect;

        stickyPhoto.style.opacity = '1';
        stickyPhoto.style.filter = 'blur(0px)';
        stickyPhoto.style.webkitFilter = 'blur(0px)';
        stickyPhoto.style.transform = 'scale(1.0)';
        stickyPhoto.style.webkitTransform = 'scale(1.0)';
      }, 280);
    }
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateActiveMilestone(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '-10% 0px -20% 0px', // Focus zone across laptops, MacBooks & phones
      threshold: [0.15, 0.4]
    });

    milestones.forEach(m => observer.observe(m));
  } else {
    // Fallback for older browsers without IntersectionObserver
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        scrollTimeout = null;
        const viewportMid = window.innerHeight * 0.45;
        milestones.forEach(m => {
          const rect = m.getBoundingClientRect();
          if (rect.top <= viewportMid && rect.bottom >= viewportMid) {
            updateActiveMilestone(m);
          }
        });
      }, 100);
    }, { passive: true });
  }
}

// =============================================================
// 2. LIVE COUNTDOWN TIMER
// =============================================================
function initCountdown() {
  // Wedding Nuptials: Saturday, November 28, 2026 at 3:30 PM IST (UTC+05:30)
  // Date.UTC returns exact epoch milliseconds (10:00:00 UTC), 100% immune to Safari/Chrome/Firefox timezone string discrepancies
  const targetDate = Date.UTC(2026, 10, 28, 10, 0, 0);

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
    title: "Wedding of Roopa & Jason",
    description: "Wedding Nuptials at 3:30 PM (Most Holy Redeemer Church, Derebail), followed by Reception at 7:00 PM at EDGEWATER, Mangaluru.",
    location: "Most Holy Redeemer Church, Derebail (Nuptials) & EDGEWATER, Bokkapatna (Reception), Mangaluru",
    start: "20261128T100000Z", // 3:30 PM IST (UTC 10:00 AM)
    end: "20261128T183000Z"    // Midnight IST (UTC 6:30 PM)
  };

  if (downloadIcsBtn) {
    downloadIcsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Roopa and Jason Wedding//Wedding Invitation//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:wedding-roopa-jason-${Date.now()}@weddingwebsite.local`,
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
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, 'roopa-and-jason-wedding.ics');
      } else {
        const link = document.createElement('a');
        const objectUrl = window.URL.createObjectURL(blob);
        link.href = objectUrl;
        link.setAttribute('download', 'roopa-and-jason-wedding.ics');
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(objectUrl);
        }, 200);
      }
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
// 4. MOBILE MENU
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
