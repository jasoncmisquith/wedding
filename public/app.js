// -------------------------------------------------------------
// Wedding Website Client Logic: Scroll-Driven Story Slideshow
// -------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  initStorySlideshow();
  initStoryConcepts();
  initCountdown();
  initCalendarDownloads();
  initFaqAccordion();
  initMobileMenu();
});

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
  let isAutoplaying = true; // Auto-play by default as requested

  function goToSlide(index) {
    if (index >= totalSlides) index = 0;
    if (index < 0) index = totalSlides - 1;
    currentSlideIndex = index;

    slides.forEach((slide, i) => {
      const content = slide.querySelector('.story-content');
      if (i === index) {
        slide.classList.add('active');
        if (content) {
          content.style.display = 'block';
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

  // Autoplay Controller (Switches every 4.5s)
  function startAutoplay() {
    isAutoplaying = true;
    if (playIcon) playIcon.classList.add('hidden');
    if (pauseIcon) pauseIcon.classList.remove('hidden');

    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => {
      goToSlide(currentSlideIndex + 1);
    }, 4500);
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
      }, 4500);
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
// 2. INTERACTIVE 4-YEAR STORY CONCEPTS SHOWCASE
// =============================================================
function initStoryConcepts() {
  const tabs = document.querySelectorAll('.concept-tab-btn');
  const views = document.querySelectorAll('.concept-view');

  if (tabs.length === 0) return;

  // Tab Switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetConcept = tab.getAttribute('data-concept');

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      views.forEach(v => {
        if (v.id === targetConcept) {
          v.classList.remove('hidden');
          v.classList.add('block');
        } else {
          v.classList.remove('block');
          v.classList.add('hidden');
        }
      });
    });
  });

  // -----------------------------------------------------------
  // A. CONCEPT A: STICKY GALLERY OBSERVER (APPLE / MUSEUM LOOK)
  // -----------------------------------------------------------
  const stickyPhoto = document.getElementById('sticky-photo');
  const stickyYearBadge = document.getElementById('sticky-year-badge');
  const stickyEffectCue = document.getElementById('sticky-effect-cue');
  const milestones = document.querySelectorAll('.narrative-milestone');

  if (stickyPhoto && milestones.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const newImg = target.getAttribute('data-img');
          const newYear = target.getAttribute('data-year');
          const newEffect = target.getAttribute('data-effect');

          // Highlight active milestone card
          milestones.forEach(m => m.classList.remove('active'));
          target.classList.add('active');

          // Smooth photo morph with focus/scale
          if (stickyPhoto.src !== newImg) {
            stickyPhoto.style.opacity = '0.35';
            stickyPhoto.style.filter = 'blur(10px) scale(0.97)';
            
            setTimeout(() => {
              stickyPhoto.src = newImg;
              if (stickyYearBadge) stickyYearBadge.innerHTML = newYear;
              if (stickyEffectCue) stickyEffectCue.innerHTML = newEffect;

              stickyPhoto.style.opacity = '1';
              stickyPhoto.style.filter = 'blur(0px) scale(1.0)';
            }, 300);
          }
        }
      });
    }, {
      root: null,
      threshold: 0.6 // Triggers when milestone is centered in viewport
    });

    milestones.forEach(m => observer.observe(m));
  }

  // -----------------------------------------------------------
  // B. CONCEPT C: 3D MEMORY DECK (INTERACTIVE KEEPSAKE)
  // -----------------------------------------------------------
  const flipBtn = document.getElementById('deck-flip-btn');
  const resetBtn = document.getElementById('deck-reset-btn');
  const deckTitle = document.getElementById('deck-story-title');
  const deckQuote = document.getElementById('deck-story-quote');

  const deckData = [
    {
      year: "2023 &bull; First Coffee",
      title: "The Spark & First Coffee",
      quote: `"A nervous first coffee in the city that turned into a four-hour conversation. The moment we both quietly realized this was the start of something rare."`
    },
    {
      year: "2024 &bull; Road Trips",
      title: "Exploring Horizons Together",
      quote: `"Coastal road trips, mountain trails, learning each other's favorite songs, and discovering that home isn't a place—it's wherever we are together."`
    },
    {
      year: "2025 &bull; The Proposal",
      title: "The Unforgettable \"Yes!\"",
      quote: `"Under a golden sunset, with joyful tears and trembling hands. The easiest question he ever asked, and the happiest answer she ever gave."`
    },
    {
      year: "2026 &bull; Our Wedding Day",
      title: "The Vows of a Lifetime",
      quote: `"Now, surrounded by the people who mean the world to us, we celebrate our union. You are an essential part of our story."`
    }
  ];

  let currentCardIndex = 0;

  function flipTopCard() {
    if (currentCardIndex < 3) {
      const activeCard = document.getElementById(`deck-card-${currentCardIndex}`);
      if (activeCard) {
        activeCard.classList.add('flipped');
      }
      currentCardIndex++;
      
      // Update text
      if (deckTitle) deckTitle.innerText = deckData[currentCardIndex].title;
      if (deckQuote) deckQuote.innerText = deckData[currentCardIndex].quote;
    } else {
      // Loop back to start
      resetDeck();
    }
  }

  function resetDeck() {
    for (let i = 0; i <= 3; i++) {
      const card = document.getElementById(`deck-card-${i}`);
      if (card) card.classList.remove('flipped');
    }
    currentCardIndex = 0;
    if (deckTitle) deckTitle.innerText = deckData[0].title;
    if (deckQuote) deckQuote.innerText = deckData[0].quote;
  }

  if (flipBtn) {
    flipBtn.addEventListener('click', flipTopCard);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetDeck);
  }

  // Allow clicking directly on any deck card to flip
  for (let i = 0; i <= 3; i++) {
    const card = document.getElementById(`deck-card-${i}`);
    if (card) {
      card.addEventListener('click', flipTopCard);
    }
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
