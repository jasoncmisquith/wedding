// -------------------------------------------------------------
// Wedding Website Client Logic: Scroll-Driven Story Slideshow
// -------------------------------------------------------------

function initApp() {
  initStorySlideshow();
  initStickyStoryGallery();
  initMobileStoryCarousel();
  initMomentsCarousel();
  initMomentsLightbox();
  initCountdown();
  initCalendarDownloads();
  initMobileMenu();
  initAmbientMedia();
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

  // Touch Swipe Gesture Navigation (Mobile Phones & Tablets)
  let touchStartX = 0;
  let touchStartY = 0;

  wrapper.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  wrapper.addEventListener('touchend', (e) => {
    if (e.changedTouches && e.changedTouches.length === 1) {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Trigger horizontal slide transition if horizontal swipe > vertical movement & threshold >= 40px
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) >= 40) {
        if (diffX < 0) {
          goToSlide(currentSlideIndex + 1);
        } else {
          goToSlide(currentSlideIndex - 1);
        }
        resetAutoplay();
      }
    }
  }, { passive: true });

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
// 2.5 MOBILE STORY CAROUSEL & CHAPTER TABS (< lg)
// =============================================================
function initMobileStoryCarousel() {
  const carousel = document.getElementById('story-mobile-carousel');
  const tabs = document.querySelectorAll('.story-tab-pill');
  const dots = document.querySelectorAll('.story-dot');
  const cards = document.querySelectorAll('.story-mobile-card');

  if (!carousel || cards.length === 0) return;

  // Click tab pill -> scroll to card
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      if (cards[index]) {
        cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
  });

  // Click dot -> scroll to card
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (cards[index]) {
        cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
  });

  // Update active tab and dot on scroll
  let scrollRafId = null;
  carousel.addEventListener('scroll', () => {
    if (scrollRafId) cancelAnimationFrame(scrollRafId);
    scrollRafId = requestAnimationFrame(() => {
      const carouselCenter = carousel.scrollLeft + (carousel.offsetWidth / 2);
      let closestIndex = 0;
      let minDiff = Infinity;

      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
        const diff = Math.abs(carouselCenter - cardCenter);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = i;
        }
      });

      // Update tabs
      tabs.forEach((tab, i) => {
        if (i === closestIndex) {
          tab.classList.add('bg-maroon', 'text-white', 'border-maroon');
          tab.classList.remove('bg-white/80', 'text-charcoal', 'border-gray-200');
        } else {
          tab.classList.remove('bg-maroon', 'text-white', 'border-maroon');
          tab.classList.add('bg-white/80', 'text-charcoal', 'border-gray-200');
        }
      });

      // Update dots
      dots.forEach((dot, i) => {
        if (i === closestIndex) {
          dot.className = 'story-dot h-2 w-7 bg-maroon rounded-full transition-all duration-300';
        } else {
          dot.className = 'story-dot h-2 w-2 bg-gray-300 rounded-full transition-all duration-300';
        }
      });
    });
  }, { passive: true });
}

// =============================================================
// 3. LIVE COUNTDOWN TIMER
// =============================================================
function initCountdown() {
  const celebrationEl = document.getElementById('celebration');
  const customTarget = celebrationEl ? celebrationEl.getAttribute('data-target-date') : null;
  // Default: Saturday, November 28, 2026 at 3:30 PM IST (UTC 10:00:00)
  const targetDate = customTarget ? new Date(customTarget).getTime() : Date.UTC(2026, 10, 28, 10, 0, 0);

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
// 4. CALENDAR EXPORT (PER-EVENT & GLOBAL .ICS / GOOGLE CAL)
// =============================================================
function initCalendarDownloads() {
  const icsButtons = document.querySelectorAll('.btn-download-ics');

  icsButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-title') || "Wedding Event — Roopa & Jason";
      const desc = btn.getAttribute('data-desc') || "Wedding celebration for Roopa & Jason";
      const loc = btn.getAttribute('data-loc') || "Mangaluru, Karnataka";
      const start = btn.getAttribute('data-start') || "20261128T100000Z";
      const end = btn.getAttribute('data-end') || "20261128T183000Z";
      const filename = btn.getAttribute('data-file') || "wedding-event.ics";

      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Roopa and Jason Wedding//Wedding Invitation//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:wedding-event-${Date.now()}@weddingwebsite.local`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:${title}`,
        `DESCRIPTION:${desc}`,
        `LOCATION:${loc}`,
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        const link = document.createElement('a');
        const objectUrl = window.URL.createObjectURL(blob);
        link.href = objectUrl;
        link.setAttribute('download', filename);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(objectUrl);
        }, 200);
      }
    });
  });
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

// =============================================================
// 5. AMBIENT BACKGROUND VIDEO & VINYL SOUNDTRACK (CLEAR MEMORY)
// =============================================================
function initAmbientMedia() {
  const video = document.getElementById('memory-video');
  const videoToggleBtn = document.getElementById('video-toggle-btn');
  const videoToggleLabel = document.getElementById('video-toggle-label');
  const videoIndicatorDot = document.getElementById('video-indicator-dot');

  if (video) {
    video.play().catch(function() {});

    if (videoToggleBtn) {
      videoToggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (video.paused) {
          video.play();
          if (videoToggleLabel) videoToggleLabel.textContent = 'Pause Motion';
          if (videoIndicatorDot) {
            videoIndicatorDot.className = 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse';
          }
        } else {
          video.pause();
          if (videoToggleLabel) videoToggleLabel.textContent = 'Play Motion';
          if (videoIndicatorDot) {
            videoIndicatorDot.className = 'w-2 h-2 rounded-full bg-amber-400';
          }
        }
      });
    }
  }

  const audio = document.getElementById('soundtrack-audio');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const audioToggleLabel = document.getElementById('audio-toggle-label');
  const audioPromptBanner = document.getElementById('audio-prompt-banner');

  if (!audio) return;

  let isAudioPlaying = false;
  let targetVolume = 0.55;

  function updateAudioUI(playing) {
    isAudioPlaying = playing;
    if (audioToggleBtn) {
      if (playing) {
        audioToggleBtn.classList.remove('is-paused', 'sound-awaiting-gesture');
        audioToggleBtn.classList.add('is-playing');
        audioToggleBtn.setAttribute('aria-label', 'Pause wedding soundtrack');
        if (audioToggleLabel) audioToggleLabel.textContent = 'Sound: On';
      } else {
        audioToggleBtn.classList.remove('is-playing');
        audioToggleBtn.classList.add('is-paused');
        audioToggleBtn.setAttribute('aria-label', 'Play wedding soundtrack');
        if (audioToggleLabel) audioToggleLabel.textContent = 'Sound: Off';
      }
    }
    if (audioPromptBanner && playing) {
      audioPromptBanner.style.opacity = '0';
      setTimeout(() => { audioPromptBanner.style.display = 'none'; }, 500);
    }
  }

  let fadeTimer = null;
  function fadeInVolume() {
    if (fadeTimer) clearInterval(fadeTimer);
    let currentVol = 0;
    try {
      audio.volume = 0;
    } catch (e) {
      // Some mobile platforms (iOS) manage volume strictly via hardware buttons
      return;
    }

    const step = targetVolume / 12;
    fadeTimer = setInterval(function() {
      currentVol += step;
      if (currentVol >= targetVolume) {
        audio.volume = targetVolume;
        clearInterval(fadeTimer);
        fadeTimer = null;
      } else {
        try {
          audio.volume = currentVol;
        } catch (e) {
          clearInterval(fadeTimer);
          fadeTimer = null;
        }
      }
    }, 100);
  }

  function playAudioWithFade() {
    try {
      audio.volume = 0;
    } catch (e) {}

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(function() {
        updateAudioUI(true);
        fadeInVolume();
      }).catch(function(err) {
        console.log('Autoplay deferred pending user interaction (standard browser policy):', err.name);
        updateAudioUI(false);
        if (audioToggleBtn) {
          audioToggleBtn.classList.add('sound-awaiting-gesture');
        }
        if (audioToggleLabel) {
          audioToggleLabel.textContent = 'Tap for Sound';
        }
        armGestureListeners();
      });
    }
  }

  function pauseAudio() {
    audio.pause();
    updateAudioUI(false);
  }

  function toggleAudio() {
    if (audio.paused) {
      playAudioWithFade();
    } else {
      pauseAudio();
    }
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleAudio();
    });
  }

  if (audioPromptBanner) {
    audioPromptBanner.addEventListener('click', function(e) {
      e.stopPropagation();
      playAudioWithFade();
    });
  }

  audio.addEventListener('ended', function() {
    audio.currentTime = 0;
    playAudioWithFade();
  });

  let gestureArmed = false;
  function armGestureListeners() {
    if (gestureArmed) return;
    gestureArmed = true;

    // Modern browsers require a genuine user activation (click, touch, pointer, keypress).
    // Passive scroll/wheel does not count as activation and must not disarm these listeners.
    const validActivationEvents = ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown'];

    function handleFirstGesture() {
      if (!audio) return;
      if (!audio.paused) {
        disarmGestureListeners();
        return;
      }

      const promise = audio.play();
      if (promise !== undefined) {
        promise.then(function() {
          updateAudioUI(true);
          fadeInVolume();
          disarmGestureListeners();
        }).catch(function(err) {
          // If gesture was not recognized as activation, keep armed for the next click/tap
          console.warn('Waiting for direct user interaction:', err);
        });
      }
    }

    function disarmGestureListeners() {
      gestureArmed = false;
      validActivationEvents.forEach(function(evt) {
        window.removeEventListener(evt, handleFirstGesture, { capture: true });
      });
    }

    validActivationEvents.forEach(function(evt) {
      window.addEventListener(evt, handleFirstGesture, { capture: true, passive: true });
    });
  }

  // Attempt immediate autoplay on load
  playAudioWithFade();

  // Tab Visibility Change
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
      if (audio && !audio.paused) {
        audio.pause();
        updateAudioUI(false);
      }
      if (video && !video.paused) {
        video.pause();
      }
    } else {
      if (video && video.paused) {
        video.play().catch(() => {});
      }
    }
  });
}

// =============================================================
// 7. MOMENTS OF US INFINITE SCROLL CAROUSEL
// =============================================================
function initMomentsCarousel() {
  const viewport = document.getElementById('moments-carousel-viewport');
  const track = document.getElementById('moments-carousel-track');
  const prevBtn = document.getElementById('carousel-prev-btn');
  const nextBtn = document.getElementById('carousel-next-btn');

  if (!viewport || !track) return;

  const sets = track.querySelectorAll('.carousel-set');
  if (sets.length < 2) return;

  let singleSetWidth = sets[0].offsetWidth;
  function updateDimensions() {
    if (sets[0]) singleSetWidth = sets[0].offsetWidth;
  }
  window.addEventListener('resize', updateDimensions);

  // Set initial scroll offset to middle set once layout is calculated
  setTimeout(() => {
    updateDimensions();
    if (singleSetWidth > 0 && viewport.scrollLeft === 0) {
      viewport.scrollLeft = singleSetWidth;
    }
  }, 100);

  let isHovered = false;
  let isDragging = false;
  let startX = 0;
  let scrollStart = 0;
  let dragDistance = 0;
  let resumeTimer = null;
  const speed = 0.55; // Gentle, luxury auto-glide (pixels per frame)

  function autoScroll() {
    if (!isHovered && !isDragging) {
      viewport.scrollLeft += speed;

      // Wrap forward seamlessly when reaching the end of the second set
      if (singleSetWidth > 0 && viewport.scrollLeft >= singleSetWidth * 2) {
        viewport.scrollLeft -= singleSetWidth;
      }
      // Wrap backward seamlessly if scrolled past beginning
      if (singleSetWidth > 0 && viewport.scrollLeft <= 0) {
        viewport.scrollLeft += singleSetWidth;
      }
    }
    requestAnimationFrame(autoScroll);
  }

  requestAnimationFrame(autoScroll);

  // Pause on desktop mouse hover
  viewport.addEventListener('mouseenter', () => { isHovered = true; });
  viewport.addEventListener('mouseleave', () => { isHovered = false; });

  // Mouse Drag / Swipe
  viewport.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragDistance = 0;
    startX = e.pageX - viewport.offsetLeft;
    scrollStart = viewport.scrollLeft;
    viewport.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const x = e.pageX - viewport.offsetLeft;
    const walk = (x - startX) * 1.4;
    dragDistance = Math.abs(walk);
    viewport.scrollLeft = scrollStart - walk;

    if (singleSetWidth > 0) {
      if (viewport.scrollLeft >= singleSetWidth * 2) viewport.scrollLeft -= singleSetWidth;
      if (viewport.scrollLeft <= 0) viewport.scrollLeft += singleSetWidth;
    }
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      viewport.style.cursor = 'grab';
    }
  });

  // Touch Support (iOS Safari, Android Chrome)
  viewport.addEventListener('touchstart', () => {
    isDragging = true;
    clearTimeout(resumeTimer);
  }, { passive: true });

  viewport.addEventListener('touchend', () => {
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      isDragging = false;
    }, 1200);
  }, { passive: true });

  // Native momentum scroll wrap guard
  viewport.addEventListener('scroll', () => {
    if (singleSetWidth > 0) {
      if (viewport.scrollLeft >= singleSetWidth * 2) {
        viewport.scrollLeft -= singleSetWidth;
      } else if (viewport.scrollLeft <= 0) {
        viewport.scrollLeft += singleSetWidth;
      }
    }
  }, { passive: true });

  // Manual Nudge Navigation Buttons
  const getCardStep = () => {
    const card = track.querySelector('.moment-card');
    return card ? card.offsetWidth + 28 : 340;
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      isHovered = true;
      viewport.scrollBy({ left: -getCardStep(), behavior: 'smooth' });
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { isHovered = false; }, 2000);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      isHovered = true;
      viewport.scrollBy({ left: getCardStep(), behavior: 'smooth' });
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { isHovered = false; }, 2000);
    });
  }
}

// =============================================================
// 8. MOMENTS OF US LIGHTBOX MODAL (CLEAN FULL-VIEW GALLERY)
// =============================================================
function initMomentsLightbox() {
  const lightbox = document.getElementById('moments-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const prevBtn = document.getElementById('lightbox-prev-btn');
  const nextBtn = document.getElementById('lightbox-next-btn');
  const cards = document.querySelectorAll('.moment-card');

  if (!lightbox || !lightboxImg || cards.length === 0) return;

  // Deduplicate unique moments from repeating carousel cards
  const uniqueMoments = [];
  const seenSrcs = new Set();
  cards.forEach(card => {
    const img = card.querySelector('img');
    const src = img ? img.getAttribute('src') : '';
    const alt = img ? img.getAttribute('alt') : 'Roopa & Jason Moment';
    if (src && !seenSrcs.has(src)) {
      seenSrcs.add(src);
      uniqueMoments.push({ src, alt });
    }
  });

  if (uniqueMoments.length === 0) return;

  let currentIndex = 0;
  let isOpen = false;

  function showMoment(index) {
    if (index < 0) index = uniqueMoments.length - 1;
    if (index >= uniqueMoments.length) index = 0;
    currentIndex = index;

    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = 'scale(0.97)';

    setTimeout(() => {
      lightboxImg.src = uniqueMoments[currentIndex].src;
      lightboxImg.alt = uniqueMoments[currentIndex].alt;
      if (lightboxCounter) {
        lightboxCounter.textContent = `${currentIndex + 1} of ${uniqueMoments.length}`;
      }
      lightboxImg.style.opacity = '1';
      lightboxImg.style.transform = 'scale(1)';
    }, 120);
  }

  function openLightbox(index) {
    isOpen = true;
    showMoment(index);
    lightbox.style.display = 'flex';
    lightbox.style.visibility = 'visible';
    lightbox.classList.remove('is-hidden');
    void lightbox.offsetWidth;
    lightbox.classList.add('opacity-100');
    lightbox.classList.remove('opacity-0');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!isOpen) return;
    isOpen = false;
    lightbox.classList.add('opacity-0');
    lightbox.classList.remove('opacity-100');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!isOpen) {
        lightbox.classList.add('is-hidden');
        lightbox.style.display = 'none';
        lightbox.style.visibility = 'hidden';
      }
    }, 300);
  }

  cards.forEach(card => {
    const img = card.querySelector('img');
    const src = img ? img.getAttribute('src') : '';
    const matchIndex = uniqueMoments.findIndex(m => m.src === src);
    card.addEventListener('click', (e) => {
      openLightbox(matchIndex >= 0 ? matchIndex : 0);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showMoment(currentIndex - 1); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showMoment(currentIndex + 1); });

  // Backdrop click to close (when clicking outside the center image)
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.id === 'lightbox-stage') {
      closeLightbox();
    }
  });

  // Keyboard navigation: Escape, ArrowLeft, ArrowRight
  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') showMoment(currentIndex - 1);
    else if (e.key === 'ArrowRight') showMoment(currentIndex + 1);
  });

  // Touch Swipe for Mobile Safari / iOS
  let touchStartX = 0;
  let touchStartY = 0;
  lightbox.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    if (e.changedTouches.length === 1) {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        if (deltaX > 0) showMoment(currentIndex - 1);
        else showMoment(currentIndex + 1);
      }
    }
  }, { passive: true });
}

