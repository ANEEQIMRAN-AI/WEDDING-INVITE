# Fiza Abdullah weds Muhammad Hasaan — Barat Invitation

Plain HTML + CSS + JavaScript. No build step, no dependencies, fonts self-hosted.

## Run
Open `index.html` in a browser, or serve the folder: `python3 -m http.server 8000` → http://localhost:8000

## Update details — edit only `js/config.js`
- `time` — set a 24h time (e.g. `"19:30"`) once confirmed. Until then the Time card says "To be announced" and the countdown targets 00:00 on 2 Jan 2027, Pakistan time.
- `contact.whatsapp` / `contact.rsvpPhone` — optional; an RSVP button appears when set.
- Captions / alt text for the venue photos are in `gallery`.

## Deploy (Netlify / Vercel / Cloudflare Pages / GitHub Pages / any static host)
Upload the whole folder. Then, for WhatsApp/Facebook previews, open `index.html` and replace both `SITE_URL` placeholders (`og:url`, `og:image`) with your real address, e.g. `https://fiza-hasaan.netlify.app`.

## Images
Originals are in `assets-source/`. `python3 scripts/make-images.py` (needs Pillow, fonttools, brotli) regenerates everything in `images/`, including the invitation card (names/date/venue written onto the template's lines — change the strings at the top of the script to re-render it).
