// -------------------------------------------------------------
// Wedding Website Client Logic
// -------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  initHeroParallax();
  initJourneySwitcher();
  initHorizontalScroller();
  initCountdown();
  initCalendarDownloads();
  initFaqAccordion();
  initMobileMenu();
});

// =============================================================
// 1. HERO PARALLAX & CINEMATIC APERTURE MOTION
// =============================================================
function initHeroParallax() {
  const heroCard = document.querySelector('.hero-aperture-card');
  const heroImg = document.querySelector('.hero-portrait-img');
  const monogramBadge = document.getElementById('hero-monogram-badge');

  if (!heroCard || !heroImg) return;

  function onScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollY > 700) return; // Stop calculating after hero is off screen

    const progress = Math.min(1, scrollY / 500);

    // Subtle scale expansion on portrait as you scroll down
    heroImg.style.transform = `scale(${1 + (progress * 0.08)})`;

    // Subtle fade and elevate for monogram badge
    if (monogramBadge) {
      monogramBadge.style.opacity = `${1 - (progress * 1.5)}`;
      monogramBadge.style.transform = `translateY(${progress * -20}px)`;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

// =============================================================
// 2. 4-YEAR JOURNEY VIEW SWITCHER (HORIZONTAL vs EDITORIAL)
// =============================================================
function initJourneySwitcher() {
  const btnHorizontal = document.getElementById('toggle-horizontal-btn');
  const btnEditorial = document.getElementById('toggle-editorial-btn');
  const viewHorizontal = document.getElementById('journey-horizontal-view');
  const viewEditorial = document.getElementById('journey-editorial-view');

  if (!btnHorizontal || !btnEditorial || !viewHorizontal || !viewEditorial) return;

  btnHorizontal.addEventListener('click', () => {
    btnHorizontal.classList.add('active');
    btnEditorial.classList.remove('active');
    viewHorizontal.classList.remove('hidden');
    viewEditorial.classList.add('hidden');
  });

  btnEditorial.addEventListener('click', () => {
    btnEditorial.classList.add('active');
    btnHorizontal.classList.remove('active');
    viewEditorial.classList.remove('hidden');
    viewHorizontal.classList.add('hidden');
  });
}

// =============================================================
// 3. HORIZONTAL SCROLLER (MOUSE WHEEL, SWIPE & PROGRESS)
// =============================================================
function initHorizontalScroller() {
  const container = document.getElementById('journey-cards-scroll');
  const prevBtn = document.getElementById('journey-prev-btn');
  const nextBtn = document.getElementById('journey-next-btn');
  const progressBar = document.getElementById('journey-progress-thumb');

  if (!container) return;

  function updateProgress() {
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll <= 0) return;
    const progress = container.scrollLeft / maxScroll;
    if (progressBar) {
      progressBar.style.transform = `translateX(${progress * 300}%)`;
    }
  }

  container.addEventListener('scroll', updateProgress, { passive: true });

  // Mouse wheel horizontal translation: lets desktop mouse users scroll horizontally!
  container.addEventListener('wheel', (e) => {
    // Only capture if deltaY exists and scrolling horizontally inside container bounds
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      const atStart = container.scrollLeft <= 0;
      const atEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;

      // Allow vertical page scroll to continue if user reached the ends
      if ((e.deltaY > 0 && !atEnd) || (e.deltaY < 0 && !atStart)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * 1.5;
      }
    }
  }, { passive: false });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      container.scrollBy({ left: -360, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      container.scrollBy({ left: 360, behavior: 'smooth' });
    });
  }
}

// =============================================================
// 4. LIVE COUNTDOWN TIMER
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
// 5. CALENDAR EXPORT (GOOGLE & APPLE .ICS)
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
// 6. FAQ ACCORDION
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
// 7. MOBILE MENU
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
