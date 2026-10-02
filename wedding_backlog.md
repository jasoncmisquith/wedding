# Wedding Website: Detailed Feature Backlog & Specifications

This document catalogs advanced features deferred from the initial MVP launch. When ready to expand the website beyond the core layout and hosting, use these specifications as the implementation blueprint.

---

## 1. Personalized Guest-Specific Event Access & RSVP

### Objective
Enable different guest tiers (e.g. VIP/Family invited to Sangeet/Haldi + Ceremony + Reception vs. Colleagues invited to Reception only) to see only their relevant events and submit their RSVP with zero login friction.

### Architecture & Mechanism
1. **Access Method (Token / Magic Link)**:
   - Unique URL per party: `https://yourwedding.com/invite?code=SMITH7` or `https://yourwedding.com/invite/smith-family`.
   - Optional fallback: A "Find Your Invitation" modal on the site where guests enter their first and last name or phone number.
2. **Data Model**:
   - `guests` table:
     - `id`: UUID
     - `invite_code`: Unique alphanumeric string (e.g., `W2026-X9Y`)
     - `party_name`: "Mr. John & Jane Smith"
     - `max_guests`: Maximum allowed attendees (e.g., 2)
     - `allowed_event_ids`: Array of event IDs (`["ceremony", "reception"]` vs `["sangeet", "ceremony", "reception"]`)
     - `status`: Pending / Attending / Declined
     - `attending_count`: Number confirmed
     - `dietary_requirements`: Text / allergies
     - `song_request`: Optional text
     - `submitted_at`: Timestamp
3. **Database Options**:
   - **Supabase (PostgreSQL)**: Free tier, instant REST API, real-time table viewer, webhooks for notifications.
   - **Google Sheets API**: Low-tech alternative, writes rows directly to a spreadsheet.

---

## 2. Media Pipeline & Google Photos Integration

### Objective
Provide a low-effort workflow to manage and display high-resolution couple photographs without encountering Google Photos API token expiration or mobile performance bottlenecks.

### Technical Problem Solved
Google Photos direct media URLs expire after 60 minutes. Furthermore, the Google Photos Library API requires complex Google Cloud OAuth verification.

### Recommended Approaches
1. **Option A: Cloud Storage + Admin Dropzone (Recommended)**:
   - Use Cloudinary or Cloudflare R2 bucket with an upload preset.
   - Drag-and-drop photos from Google Photos or local drives.
   - Generates automatic responsive WebP thumbnails, lazy-loaded on mobile.
2. **Option B: GitHub Action Google Drive / Photos Sync**:
   - A scheduled workflow that reads from a designated Google Drive folder, pulls newly added images, runs an automated image optimization script (compressing to 1600px WebP), and commits them to the repo assets.

---

## 3. Video Highlight Reel ("Stories" Player)

### Objective
Display short, engaging vertical video snippets of the couple, proposal, or save-the-date teaser—mimicking the Google Photos or Instagram Stories experience.

### Specifications
1. **UX / UI**:
   - Vertical card / modal (9:16 aspect ratio).
   - Segmented progress bars along the top (e.g., 3-5 clips of 10-15 seconds each).
   - Tap left to go back, tap right to advance, hold to pause.
   - Default muted playback with a clear floating sound button ("Tap to unmute") to comply with iOS Safari and Android Chrome autoplay restrictions.
2. **Compression & Hosting**:
   - Videos transcoded to H.264 / MP4 and WebM.
   - Target bitrate: under 1.5 Mbps (file size ~2-4MB per clip).
   - Hosted on CDN (Cloudflare R2, BunnyCDN, or Supabase Storage) with byte-range streaming support.

---

## 4. Maps & QR Code Navigation for Multiple Venues

### Objective
Ensure guests can navigate effortlessly to each venue from their phones or rental car systems.

### Features
- Interactive Google Maps and Apple Maps deep-links (`maps://` for iOS, `https://maps.google.com/` for Android).
- Dynamically rendered QR codes for each venue (e.g., using `qrcode.react` or pre-generated SVG QR codes).
- Directions summary, parking instructions, valet availability, and rideshare (Uber/Lyft) pickup notes.

---

## 5. Organizer Admin Dashboard

### Features
- Real-time RSVP counters: Total Invited, Confirmed Attending, Declined, Pending.
- Filter by specific event (e.g. Haldi count vs Reception count for catering estimates).
- Dietary restrictions aggregator (e.g., 14 Vegetarian, 4 Gluten-Free, 2 Nut Allergy).
- One-click "Export to CSV / Excel" for wedding planners and caterers.
- Webhook alerts: Send a message to your Telegram or WhatsApp group whenever a guest submits their RSVP.

---

## 6. Delight & Engagement Add-ons

- **Background Music Player**: Gentle acoustic/lo-fi track with an unobtrusive vinyl or soundwave play/pause toggle.
- **Digital Guestbook**: Allows guests to leave short warm wishes and upload a selfie during or before the wedding.
- **Spotify / Song Request Field**: Allows guests to suggest songs for the DJ during the RSVP flow.
