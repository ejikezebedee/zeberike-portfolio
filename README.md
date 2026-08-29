# Zeberike — AI Automation Portfolio

Production-ready static portfolio for AI agents, business automation and software systems.

## What is included

- Responsive light/neutral visual system (no black background)
- Sticky navigation and scroll progress
- Hero AI-agent control-plane visualization
- Services, selected work, AI agent workflow, automation examples, about, process and contact sections
- Netlify-compatible contact form with honeypot protection
- SEO metadata, Open Graph artwork, JSON-LD, robots.txt and sitemap.xml
- Accessibility focus states, reduced-motion support and semantic sectioning
- Netlify and Vercel configuration
- No build step, no JavaScript framework dependency and no external font dependency

## Deploy

### Netlify
Drag this folder into Netlify or connect the repository. `netlify.toml` publishes the root directory and the contact form is automatically detected.

### Vercel
Import the folder/repository as a static project. `vercel.json` adds baseline security headers. To receive contact messages on Vercel, connect the form to your preferred form/API backend.

### Any static host
Upload all files to the web root. `index.html`, `styles.css`, `script.js` and the SVG assets are all self-contained except for Google Fonts.

## Before publishing

1. Replace `YOUR-DOMAIN.example` in `robots.txt` and `sitemap.xml` with the final domain.
2. Add your real social/profile links if you want them exposed publicly.
3. Add public case-study URLs when those pages are ready.
4. If deploying outside Netlify, wire the contact form to a secure API or form service.

## Local preview

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Contact form email delivery

The contact form posts to a Netlify Function (`netlify/functions/contact.js`) that emails
submissions to `emekekorie@zeberike.com` via Hostinger SMTP.

Required environment variable in Netlify (Site settings -> Environment variables):

- `SMTP_PASS` — the Hostinger mailbox password (required)

Optional (defaults are pre-set for Hostinger):

- `SMTP_HOST` (default `smtp.hostinger.com`)
- `SMTP_PORT` (default `465`)
- `SMTP_USER` (default `emekekorie@zeberike.com`)
- `CONTACT_TO` (default `emekekorie@zeberike.com`)

To run locally: `npm install`, then `netlify dev`.
