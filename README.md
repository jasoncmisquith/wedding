# Wedding Invitation Website

A modern, high-fashion wedding invitation website designed with a **Monochrome & Velvet Maroon** editorial aesthetic.

---

## 🚀 Quick Start (Local Testing)

You can preview the website locally using **either Docker or Python**:

### Option 1: Using Docker (Containerized)
Make sure Docker Desktop is open on your Mac, then run:
```bash
docker compose up
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser. Any changes made in the `public/` directory will update instantly!

### Option 2: Using the Instant Local Launcher
Run the automated launcher script (works even if Docker is not installed):
```bash
./start.sh
```
Or start the Python web server directly:
```bash
cd public && python3 -m http.server 3000
```
Open **[http://localhost:3000](http://localhost:3000)**.

---

## 🎨 How to Customize Content

All website files are located in the `public/` directory:

1. **Couple Names & Dates**: Open `public/index.html` and search for `Jacob & Aisha` and `December 12, 2026` to update your details.
2. **Countdown Timer Target**: Open `public/app.js` and edit the date on line 13:
   ```javascript
   const targetDate = new Date('2026-12-12T15:00:00').getTime();
   ```
3. **Photos**:
   - Place your couple photo in `public/assets/images/couple.jpg`.
   - Update the `src` attribute on the `<img>` tag in `public/index.html`.
4. **Schedule & Venues**: Modify the timeline cards in `public/index.html` under the `#schedule` section with your actual ceremony and reception venues.

---

## 🌐 Deploying to Free Cloud Hosting

When you are ready to publish the website online:

### 1. Push to your GitHub Account
```bash
git add .
git commit -m "feat: complete wedding website layout"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main
```

### 2. Connect to Cloudflare Pages or Vercel (100% Free Forever)
1. Go to **[pages.cloudflare.com](https://pages.cloudflare.com)** or **[vercel.com](https://vercel.com)**.
2. Click **"New Project"** and select your GitHub repository.
3. Set the build output directory to: `public` (leave build command blank).
4. Click **Deploy**. Your site will be live on a secure HTTPS link (e.g. `your-wedding.pages.dev` or `your-wedding.vercel.app`) with zero monthly cost!

### 3. Adding a Custom Domain Later
Once you are ready to purchase a domain (e.g., `jacobandaisha.com` via Cloudflare Registrar or Porkbun for ~$9–$10/year):
1. In Cloudflare Pages or Vercel, click **"Custom Domains"** $\rightarrow$ **"Add Domain"**.
2. Type your domain name. It automatically provisions free Let's Encrypt SSL certificates.
