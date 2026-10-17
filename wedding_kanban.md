---

kanban-plugin: basic

---

## 📋 Phase 2: Feature Backlog

- [ ] **Guest-Specific RSVP System**: Token/magic links (`?code=XYZ`) so guests only see events they are invited to
- [ ] **Google Photos / Media Pipeline**: Automated sync from album to optimized WebP thumbnails
- [ ] **Video Highlight Reel**: 9:16 vertical stories player with progress bars & tap-to-unmute
- [ ] **Venue Navigation QR Codes**: Scannable QR codes for car dashboards & direct Apple/Google Maps deep-links
- [ ] **Organizer Admin Dashboard**: Live RSVP counters, dietary restrictions breakdown, and CSV/Excel export
- [ ] **Digital Guestbook**: Allow guests to leave sweet notes and upload selfies


## 🎯 Next Up (MVP Tasks)

- [ ] **Hero Slideshow Photo Replacements**: Drop in landscape couple photos/videos into `public/assets/images/hero/` for the top slideshow
- [ ] **Custom Domain Setup**: Attach custom domain (Cloudflare Pages custom domain / DNS setup)


## ⏳ In Progress

- [ ] **Mobile & WhatsApp In-App Browser Verification**: Validate touch tap targets, 1-click WhatsApp RSVP links, and calendar sync across iOS Safari and Android Chrome


## ✅ Done

- [x] **Zero-Latency Modal Tap & Mobile Video Instant Rendering (Posters & Wings Deferral)**:
  - Eliminated delayed modal button interaction by moving `<audio id="soundtrack-audio">` to the top of the body and attaching an immediate synchronous inline gesture handler (0ms tap response via `click` and `touchend`) so guests never experience a dead button while bottom scripts download
  - Generated crisp lightweight video poster images (`memory-walk-2-poster.jpg` - 53KB and `memory-walk-poster.jpg` - 101KB) on all `<video>` tags so the visual background is instantly present at 0ms with zero black screen / void during initial video buffering
  - Set `preload="none"` on widescreen desktop ambient wings video (`memory-video-2-wings`) and deferred loading until desktop viewport check in JS, preventing mobile devices from redundantly downloading 5MB of video in parallel and saturating cellular bandwidth
  - Bumped asset cache busters to `styles.css?v=6.7` and `app.js?v=6.7` across `c.html` and `h.html`

- [x] **Bulletproof Welcome Modal & Wax Seal Button Resilience (Cross-Browser / Dark Mode / Adblocker)**:
  - Fixed unstyled/collapsed modal button caused by adblockers (Samsung Internet / AdGuard / Crystal) blocking external CDN scripts (`cdn.tailwindcss.com`): injected self-contained, standalone CSS rules into `styles.css` (`#welcome-envelope-modal .welcome-card`, `.welcome-inner-border`, `.wax-seal-btn`) with inline style fallbacks in HTML
  - Added `<meta name="color-scheme" content="light">` and `<meta name="supported-color-schemes" content="light">` to prevent Android and Samsung Internet forced dark-mode rendering engines from inverting ivory cards into charcoal
  - Guarded inline Tailwind configuration (`if (typeof tailwind !== 'undefined')`) to prevent uncaught `ReferenceError: tailwind is not defined` from killing subsequent JavaScript execution when CDNs are blocked
  - Refactored `public/app.js` with isolated `initWelcomeModal()` running as the absolute first step in `DOMContentLoaded`, wrapped in fault-isolation boundaries so downstream module failures can never prevent the modal from opening, dismissing, or triggering audio/video
  - Bumped asset cache busters to `styles.css?v=6.6` and `app.js?v=6.6` across `c.html` and `h.html`

- [x] **Ambient Background Video Reliability Fixes**:
  - Relocated MP4 `moov` metadata atoms from the tail (byte 5MB) to the beginning (byte 32) using FastStart progressive web streaming so browsers start playback immediately on packet 0 without waiting for entire 5MB downloads
  - Added `webkit-playsinline` and enforced `muted = true` / `defaultMuted = true` in JS to pass strict mobile WebKit and in-app browser autoplay policies
  - Implemented gesture-unlocked playback recovery for Low Power Mode and strict mobile policies on first user interaction (screen touch, scroll, or "Open Invitation" tap)
  - Added `visibilitychange` auto-resume so videos continue playing after phone screen unlock or switching tabs
  - Added `canplay` listeners and guarded `currentTime` synchronization to prevent Safari `InvalidStateError` stalls

- [x] **LCP & Page Load Optimization (Fast & Seamless Experience)**:
  - Deferred ~12MB of non-critical media by switching `preload="none"` on `memory-video-1` (with 4s staggered buffer in JS) and `preload="none"` on `soundtrack-audio`
  - Set `preload="metadata"` on desktop ambient wings video
  - Eliminated CSS font waterfall by replacing `@import` with non-blocking preconnect & `display=swap` link tags in document head
  - Added `public/_redirects` 200 rewrites for `/h/` and `/c/` to eradicate trailing-slash 307 temporary redirects
  - Generated `favicon.ico`, `favicon.svg`, and `assets/ring-icon.png` to resolve 404s
  - Added `fetchpriority="high"` to above-the-fold emblems and `decoding="async"` across event cards
  - Removed `no-store` meta tags and bumped cache-busted asset versions to `v=6.4`

- [x] **Moments Carousel Alignment & Infinite Wrap Fix**:
  - Resolved empty slot and repeated last image bug when clicking Next / Previous buttons by dynamically calculating exact set repetition period via `sets[1].offsetLeft - sets[0].offsetLeft` (incorporating full flex gap rather than unpadded `offsetWidth`)
  - Replaced hardcoded `+ 28` card step with dynamic `cards[1].offsetLeft - cards[0].offsetLeft`, guaranteeing subpixel-accurate alignment on mobile (24px gap) and desktop (32px gap)
  - Centered navigation in middle set (Set 2) via `normalizeScroll()` prior to button nudges, preventing browser smooth-scroll animations from colliding with edge-wrap boundaries
  - Hardened Lightbox modal rapid-click transitions: debounced timer transitions and preloaded adjacent slides for instantaneous next/previous cycling
  - Bumped asset cache buster to `app.js?v=6.3` across `c.html` and `h.html`

- [x] **Moments Gallery Caption Refinement ("Roses from Her")**:
  - Updated memory moment card caption and image alt tags from "Roses for Her" to "Roses from Her" across all carousel tracks and lightbox view in `public/c.html` and `public/h.html`

- [x] **Smart Returning Visitor Route Memory (`localStorage` Auto-Redirect)**:
  - Stored user's visited invitation path (`wedding_invitation_route`) in `localStorage` whenever they visit `/c` or `/h` (saved both in synchronous `<head>` script and `app.js` for 100% reliability)
  - When returning guests navigate to root (`ivefoundher.fyi` or `/index.html` or `/index.htm`), the `<head>` script instantly redirects them via `window.location.replace()` to their specific invitation page (`/c` or `/h`) with zero screen flicker
  - Uninvited strangers or first-time root visitors with no recorded invitation route continue to see the discreet "Nothing Here • Private Link" / 404 page
  - Bumped asset cache buster to `app.js?v=6.2`

- [x] **Root Routing Privacy & Canonical Invitation Routes (`/c` & `/h`)**:
  - Configured root (`/` and `/index.html`, `/index.htm`) to render a discreet, minimalist "Nothing Here • Private Link" page (`public/index.html` and `public/404.html`) that protects private wedding details from root domain visitors
  - Restricted active wedding invitations strictly to `/c` (Church & Reception) and `/h` (Hindu Ceremony & Reception)
  - Configured 301 redirects and lightweight HTML redirect fallbacks for legacy aliases (`/catholic`, `/church`, `/hindu`, `/hindu-wedding`) pointing to `/c` and `/h`
  - Created `public/index.htm` fallback redirecting to `/`

- [x] **Persistent "Open Invitation • With Music" Modal Entrance**:
  - Removed `sessionStorage` suppression so the luxury wax-seal envelope modal (`#welcome-envelope-modal`) triggers reliably on every visit and reload
  - Ensures guests always receive the interactive gesture prompt to begin JVKE soundtrack playback with full audio across Safari iOS, Android Chrome, and macOS
  - Bumped asset cache busters to `styles.css?v=6.0` and `app.js?v=6.1` across `/c` and `/h`

- [x] **Luxury "Open Invitation" Wax Seal Entrance Modal**:
  - Implemented an elegant frosted-glass welcome envelope modal (`#welcome-envelope-modal`) that gracefully solves browser audio autoplay restrictions on Safari (iOS/macOS) and Chrome
  - Displays royal `R & J` monogram, formal invitation wording, couple names, and ceremony date/location
  - Features gold-embossed wax seal button (`[ Open Invitation • With Music 🎵 ]`) that triggers direct user gesture to begin JVKE soundtrack playback with smooth fade-in
  - Includes polite secondary skip link (`Enter in silence`) for guests in quiet environments
  - Seamless 0.6s exit dissolve into the memory video background with `sessionStorage` persistence so return visits in the same session open directly
  - Bumped asset cache buster to `?v=5.9` across all HTML templates, `styles.css`, and `app.js`

- [x] **WhatsApp & Social Chat Rich Link Preview Cards (Open Graph)**:
  - Generated dedicated high-resolution, lightweight preview image `public/assets/images/og-preview.jpg` (768x768 square crop, 141 KB < 300KB WhatsApp crawler limit) from the candid dinner date portrait
  - Added full Open Graph metadata (`og:title`, `og:description`, `og:image`, `og:image:secure_url`, `og:image:width`, `og:image:height`, `og:site_name`, `og:url`, `twitter:card`) across all templates (`index.html`, `c.html`, `h.html`, `church.html`, `catholic.html`, `hindu.html`, `hindu-wedding.html`)
  - Ensures WhatsApp, iMessage, and Telegram generate an eye-catching photo card whenever `https://ivefoundher.fyi/c` (or `/h`) is pasted in chat

- [x] **Default Church Invitation Routed via `/c` Short URL**:
  - Configured symmetrical `/c` short URL route for the default Church & Reception invitation, mirroring `/h` for the Hindu ceremony
  - Created `public/c.html`, `public/church.html`, and `public/catholic.html` synced directly with `public/index.html`
  - Configured redirect rules in `public/_redirects`: root `/` serves directly with zero redirects, while `/c` serves `c.html` and canonical aliases `/church`, `/church.html`, `/catholic`, `/catholic.html`, and `/c.html` route to `/c` (301)
  - Updated internal back-links to point to `/c`

- [x] **Dual-Scene Memory Walk Loop with Desktop Ambient Wings (Starting with Video 2)**:
  - Switched the initial sequence so Video 2 (Cafe Candid with Floral Centerpiece & Ambient Wings, `memory-walk-2.mp4`) starts first upon page load
  - Seamlessly crossfades after ~11s into Video 1 (Beach Walk, `memory-walk.mp4`), and continues in an infinite alternating loop
  - **Desktop Widescreen Ambient Wings**: For Scene 2's vertical portrait footage, rendered a sharp, uncropped vertical video centered on screen flanked by synchronized, softly blurred (`blur(44px)`) motion wings that stretch across the entire widescreen monitor (`scale(3.4)`), eliminating 100% of black pillarbox bars and artificial divider lines
  - **Mobile Full-Bleed Reel**: Single full-screen video on mobile devices (`< md`), naturally filling phone displays with zero split-screen clutter or extra resource overhead
  - **Scene 1 Cinematic Landscape**: Fills widescreen displays edge-to-edge with expansive beach scenery (`scale(1.22)`)
  - Continuous 1.2s opacity crossfades loop endlessly between scenes; single "Pause Motion" control smoothly halts and resumes both scenes
  - Bumped asset cache buster to `?v=5.8` across `index.html`, `h.html`, `hindu.html`, and `hindu-wedding.html`
- [x] **Continuous Dual-Video Crossfade Loop (Memory Walk 1 & 2)**:
  - Built an ambient dual-video crossfade engine alternating between `memory-walk.mp4` (~14s) and `memory-walk-2.mp4` (~11s) in an infinite seamless loop
  - Triggers a graceful 1.2-second CSS opacity dissolve 1.2 seconds before the active video ends, seamlessly waking and fading in the next video without black gaps or buffering pauses
  - Removed manual switcher buttons from the navbar and mobile menu to keep header navigation clean and effortless
  - Retained responsive cinematic zoom (`scale(1.2)` desktop, `scale(1.08)` mobile) across both alternating videos
  - Synced and bumped asset cache buster to `?v=5.5` across `index.html`, `h.html`, `hindu.html`, and `hindu-wedding.html`
- [x] **Safari / WebKit Auto-Glide & Layout Hardening**:
  - Resolved multi-row wrapping on Safari by adding strict layout CSS (`flex-direction: row !important`, `flex-wrap: nowrap !important`, `min-width: max-content !important`, and `white-space: nowrap`)
  - Suppressed inherited `scroll-behavior: smooth` on `#moments-carousel-viewport` with `scroll-behavior: auto !important`, preventing WebKit's smooth-scroll engine from continuously aborting and fighting 60fps JS auto-glide updates
  - Scoped mouse hover pause to individual photo cards (`.moment-card`) rather than the entire 100vw viewport, ensuring the carousel keeps gliding on Mac even when the mouse cursor rests on page margins
  - Synced and bumped asset cache buster to `?v=5.2` across `index.html`, `h.html`, `hindu.html`, and `hindu-wedding.html`
- [x] **Expanded "Moments of Us" Gallery to 12 Cherished Moments**:
  - Integrated 3 additional romantic photographs: "Roses for Her" (cone bouquet of mini red roses in the car), "Two Roses, Two Hearts" (intertwined hands holding a pink and red rose), and "By Your Side" (warm embrace portrait under the pergola)
  - Seamlessly woven into the 12-moment luxury narrative alongside "Two Halves, One Heart" (hand-drawn by Roopa & Jason), "Held in Love", "Golden Floral Reflection", "Breeze Over the Hills", and candid everyday smiles
  - Synced 3-set infinite loop track across `index.html`, `h.html`, `hindu.html`, and `hindu-wedding.html` with updated "1 of 12" counter and cache buster `?v=5.1`
- [x] **Safari / WebKit Auto-Glide Carousel Fix**:
  - Diagnosed auto-scrolling freeze in macOS Safari & iOS WebKit caused by WebKit's native integer truncation on `element.scrollLeft` (which rounded `100 + 0.55` back down to `100` on every frame)
  - Implemented high-precision JS float accumulator (`currentScroll += speed; viewport.scrollLeft = Math.round(currentScroll)`) so subpixel auto-scroll advances smoothly every ~33ms on WebKit engines without stalling
  - Added image-load listeners on track elements to guarantee precise dimension measurement in Safari
  - Synced and bumped asset cache buster to `?v=4.9` across all HTML templates (`index.html`, `h.html`, `hindu.html`, `hindu-wedding.html`)
- [x] **Parents' Names on Homepage & `/h` Short URL Route**:
  - Integrated parents' blessing cards onto the main homepage (`index.html`) under "Together With Our Parents" (`Roopa S Nayar - D/o Veena & Somaraj Nayar` and `Jason Conred Misquith - S/o Joseph & Astrid Misquith`)
  - Configured concise `/h` URL route for the Hindu wedding ceremony invitation (`public/h.html`) alongside automatic redirects in `public/_redirects` from `/hindu` and `/hindu-wedding`
- [x] **De-duplicated Ganesha Motif & Auspicious Inscription on Hindu Invitation**:
  - Removed duplicate Lord Ganesha emblem and Sanskrit inscription (`॥ श्री गणेशाय नमः ॥`) from the top hero ("I've Found Her") section
  - Retained the motif exclusively within the formal celebration card (`#celebration`) as the traditional opening blessing for the wedding invitation
  - Applied and cache-busted with `?v=4.6` across `hindu.html` and `hindu-wedding.html`
- [x] **Sticky Hovering Soundtrack Button with Auto-Minimizing Sound Orb**:
  - Restored 100% reliable pause and stop ability by binding directly to native HTML5 `audio.paused`, `play`, and `pause` events
  - Built smooth auto-minimizing behavior: button displays the full luxury pill (`Sound: On • JVKE "her"` or `Sound: Off`) upon interaction, then gently collapses after 3 seconds into a compact 38px circular frosted gold sound orb containing the dancing micro-equalizer
  - Hovering on desktop instantly expands the orb back to the full pill; tapping on mobile toggles playback and expands it for 3s to confirm state before discreetly re-minimizing
  - Positioned at the bottom-right corner with iOS `safe-area-inset-bottom` and macOS Dock clearance
  - Applied and cache-busted with `?v=4.8` across `index.html`, `hindu.html`, and `hindu-wedding.html`
- [x] **Infinite Scroll Moments Carousel & EXIF Orientation Normalization**:
  - Normalized EXIF orientation tags (reset Galaxy S24 Ultra orientation tags 6/8 to 1), eliminating double-rotation artifacts in modern web browsers so all photos render 100% upright
  - Honored deletion of unneeded photos, focusing the Moments gallery on the couple's 4 core captures: Candlelight Dinner (`01-dinner-date.jpg`), Golden Blossoms Mirror (`golden-mirror.jpg`), Everyday Warmth (`02-everyday-love.jpg`), and Festive Celebration (`festive-smiles.jpg`)
  - Engineered a seamless infinite-scroll horizontal carousel track with edge vignette fades, smooth auto-glide (0.55px/frame), and pause on mouse hover or touch interaction
  - Added interactive swipe/drag support (mouse & touch) and Prev/Next nudge navigation controls
  - Connected an uncropped full-resolution Lightbox modal that seamlessly cycles through the 4 unique moments
  - Applied and cache-busted with `?v=4.3` across `index.html`, `hindu.html`, and `hindu-wedding.html`
- [x] **Editorial "Moments of Us" Photo Gallery & Lightbox Integration**:
  - Integrated 5 authentic couple photographs from downloads (`beach-waves.jpg`, `evening-portrait.jpg`, `sunlit-umbrella.jpg`, `golden-mirror.jpg`, `festive-smiles.jpg`) alongside couple favorites (`01-dinner-date.jpg`, `02-everyday-love.jpg`)
  - Normalized EXIF orientations using `sips` (corrected 180° inversion on dining table and festive celebration selfies)
  - Resized and compressed assets to lightweight web formats (~270KB–640KB each) to ensure smooth 60fps mobile scrolling
  - Engineered responsive editorial layout: balanced 3-column grid featuring a cinematic full-width panoramic beach centerpiece (`beach-waves.jpg`)
  - Built full-featured interactive Lightbox Modal with uncropped display, smooth transitions, mobile touch-swipe support, and keyboard controls (Esc, Arrow keys)
  - Applied across `index.html`, `hindu.html`, and `hindu-wedding.html` with cache buster `?v=4.2`
- [x] **Consolidated Experience & Removed Standalone Feature**:
  - Fully integrated the "I've Found Her" cinema hero, ambient beach memory video, and soundtrack directly into the primary invitation (`index.html`) and Hindu ceremony pages (`hindu.html` & `hindu-wedding.html`)
  - Removed the standalone `ive-found-her.html` page, `public/ive-found-her/` route, and the "Dedicated I've Found Her Feature" buttons from all templates to keep the user experience unified and uncluttered
- [x] **Clear Memory Translucency & White Hero Cinema Typography**:
  - Rendered opening hero title *"I've Found Her"*, couple names (*Roopa & Jason*), and date/location in pure white with cinematic contrast drop shadows (`rgba(0,0,0,0.7)`) over the clear memory beach video
  - Removed all CSS `backdrop-filter: blur(...)` filters and the `bg-black/15` overlay that caused the video to look smudged/foggy behind translucent cards
  - Transitioned cards to clean zero-blur translucent white plates (`rgba(255, 255, 255, 0.72)` and `0.65`) so the ocean waves, sunlight, and couple movement flow through with 100% razor-sharp clarity
- [x] **Curated 2-Photo "Moments of Us" Showcase**:
  - Removed the last 3 photos per couple preference, retaining their 2 favorite photos (`01-dinner-date.jpg` and `02-everyday-love.jpg`)
  - Purged all AI narrative text, quotes, descriptions, and "Chapter" headings entirely
  - Built a clean 2-column editorial photo grid (`grid grid-cols-1 md:grid-cols-2`) with luxury gold hairline borders and subtle hover zoom
  - Removed carousel tabs, swipe dots, empty milestones, and sticky morph overhead
  - Updated navigation and hero buttons to "Moments of Us" across `index.html`, `hindu-wedding.html`, and `hindu.html`
- [x] **Sample Mantap Image Integration (`hindu-wedding.jpg`)**:
  - Replaced stock photo with user's authentic outdoor floral mantap sample
  - Engineered 3:2 landscape canvas (1536x1024) matching church & roce event cards
  - Preserved 100% full height of original mantap without zooming in or vertical cropping (archival floral canopy, crystal chandeliers, pillars, chairs, and stage carpet intact)
  - Seamlessly filled side wings using GPU-accelerated `CIBlendWithMask` Gaussian ambient blur with zero hard seams
  - Appended `?v=3.8` cache buster across `hindu-wedding.html` and `hindu.html`
- [x] **Streamlined Moments of Us Photo Gallery**:
  - Simplified the 5 photo milestones to clean chapter titles only (`Chapter I • Endless Conversations`, `Chapter II • Everyday Magic`, `Chapter III • Sunlit Arches`, `Chapter IV • Swept Off Our Feet`, `Chapter V • Under the Evening Sky`)
  - Removed lengthy narrative paragraph blocks from both mobile carousel and desktop sticky photo gallery
  - Applied consistently across primary invitation (`index.html`) and dedicated Hindu wedding pages (`hindu-wedding.html` / `hindu.html`)
  - Cleaned up image cues and synchronized interactive carousel selectors
- [x] **Separate Hindu Wedding & Reception Page (`hindu-wedding.html` / `hindu.html`)**:
  - Created dedicated page for guests invited exclusively to the Hindu Wedding Ceremony and Wedding Reception
  - Extracted authentic Lord Ganesha motif & auspicious inscription (`॥ श्री गणेशाय नमः ॥`) from couple's invitation card
  - Structured Event 1: Hindu Wedding Ceremony at "Golden Orca", Udupi on Thursday, Nov 26, 2026 with decoded QR Google Maps pin (`https://maps.app.goo.gl/BSbywbBBMkJ7ogCU8`), calendar sync, and WhatsApp RSVP
  - Structured Event 2: Wedding Reception at EDGEWATER, Mangaluru on Saturday, Nov 28, 2026
  - Excluded Roce and Church wedding from this page to maintain targeted invitation lists
  - Preserved identical styling, responsive layout, and 5-chapter couple story gallery
- [x] **Authentic Venue Photography for Events**:
  - Replaced generic Unsplash placeholders with authentic photos for each event venue:
    - Roce Ceremony: Derebail Church Main Hall (`assets/images/events/roce-hall.jpg`)
    - Wedding Ceremony: Most Holy Redeemer Church, Derebail (`assets/images/events/derebail-church.jpg`)
    - Wedding Reception: EDGEWATER Bokkapatna waterfront terrace (`assets/images/events/edgewater-reception.jpg`)
  - Optimized images for mobile performance and bumped asset cache-buster to `?v=3.7`
- [x] **Invitation-First Layout Reorganization (Primary Invitation Flow)**:
  - Positioned the Wedding Celebration hero, couple names, and live countdown directly at the top of the page for instant mobile/WhatsApp access
  - Placed Family Welcome and the 3 Event Cards (Roce, Wedding Ceremony, Reception) front and center with one-tap directions, calendar sync, and WhatsApp RSVP
  - Relocated the 5-chapter couple photo gallery (`#our-story`) into its own dedicated section immediately following the events
  - Archived standalone 4-year hero slideshow into `slideshow-archive.html`
  - Reordered desktop and mobile navigation links (`Invitation` → `Events & Venues` → `Our Story`)
- [x] **Mobile-First Per-Event Cards & Consolidated RSVP**:
  - Replaced standalone venue, rsvp, and calendar sections with dedicated cards for Roce, Wedding Ceremony, and Reception
  - Added depicting photos for each event (warm blessing decor for Roce, sanctuary for Wedding Ceremony, waterfront terrace for Reception)
  - Integrated 1-click WhatsApp RSVP with customized pre-filled messages per event to `+91 7760071720`
  - Integrated per-event Add to Calendar (Google Calendar & Apple/Outlook `.ics`)
  - Added direct Apple Maps and Google Maps directions buttons on every card
  - Included fallback general inquiry card for Jason (+91 7760071720)
  - Maintained backward-compatibility anchor links (`#venue`, `#rsvp`, `#calendar`)
- [x] **Mobile Experience & Scroll-Snap Stories Deck**:
  - Built horizontal CSS scroll-snap story deck with interactive chapter tabs and swipe indicator dots for mobile screens
  - Preserved side-by-side sticky morph gallery for desktop displays (`lg:`)
  - Added native touch swipe gesture navigation to fullscreen Hero Slideshow
  - Polished mobile countdown timer spacing, full-width venue map buttons, and frosted navigation dropdown
- [x] **Integrated 5 Real Couple Photos & Romantic Story Milestones**:
  - Added couple's real photos to `public/assets/images/story/`
  - Authored a 5-chapter romantic narrative (Endless Conversations, Everyday Magic, Sunlit Arches, Swept Off Our Feet, Under the Evening Sky)
  - Added `data-pos` object positioning in `app.js` to ensure portrait face framing across all mobile & desktop displays
- [x] **Deployed Staging Site & Pushed to GitHub**:
  - Deployed static web app to Cloudflare Pages via Wrangler
  - Pushed all commits to `origin/main` (`git@github.com:jasoncmisquith/wedding.git`)
- [x] **Simplified Event Terminology**:
  - Replaced all occurrences of "twilight reception" with "reception" and "pre-wedding roce" with "roce" across welcome narrative, venue badges, and calendar sync exports
- [x] **Minimalist RSVP Card**:
  - Associated RSVP contact specifically with Jason (`+91 7760071720`) with dedicated WhatsApp and Call buttons
- [x] **Streamlined Celebration Header**:
  - Simplified header typography to clean "Roopa & Jason", removing formal card full legal names and parents' lineage
- [x] **Removed FAQ Section & Unused JS**:
  - Purged FAQ accordion section and handlers to keep the narrative focused and clean
- [x] **Correct Reception Timing**:
  - Updated Reception to 7:00 PM onwards in venue badge and calendar sync
- [x] **Safari Slideshow Fix & Mac Dock Clearance**:
  - Replaced Safari-incompatible keyframe transform loops on `object-fit: cover` with smooth CSS transitions
  - Set explicit `display: none` in HTML markup on inactive slides and CSS `visibility: hidden` to prevent WebKit out-of-order layer compositing
  - Constrained sticky frame max-height to `min(440px, calc(100vh - 13.5rem))` so it never gets clipped by the macOS Dock
- [x] **Fullscreen Hero Slideshow**:
  - Built clean fullscreen slideshow with auto-switch every 4.5s, segmented progress bars, and natural scroll continuation
- [x] **Project Setup & Vault Tracking**:
  - Initialized Git repository, established Obsidian Kanban tracking, and aligned on Velvet Maroon & Champagne Gold aesthetic


%% kanban:settings
```
{"kanban-plugin":"basic"}
```
%%
