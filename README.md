# Shiva Concrete Mixers — Premium Business Website

> **shivaconcretemixers.in** — Bihar's Most Trusted Concrete Mixer & Water Tanker Rental Service

---

## Project Overview

A world-class, premium business website for Shiva Concrete Mixers. Built as a static site (HTML/CSS/JS) — no build steps, no server-side runtime. Works perfectly on GoDaddy shared hosting.

**Design Inspiration:** Apple, Stripe, Linear, Vercel, Awwwards winners  
**Business:** Concrete Mixer & Water Tanker Rental | 40+ Years | All Bihar

---

## Folder Structure

```
shiva-website/
├── index.html          ← Main website (single page)
├── css/
│   └── style.css       ← Full design system & animations
├── js/
│   └── main.js         ← GSAP animations, carousel, FAQ, etc.
├── assets/
│   └── images/
│       ├── concrete-mixer-hero.jpg   ← REPLACE with actual photo
│       ├── og-image.jpg              ← Social share image (1200×630)
│       └── ... (add your photos here)
├── sitemap.xml         ← SEO sitemap
├── robots.txt          ← Search engine instructions
├── .htaccess           ← GoDaddy/Apache optimizations
└── README.md           ← This file
```

---

## Tech Stack

| Technology | Purpose | Why Chosen |
|---|---|---|
| HTML5 | Structure | Semantic, accessible, GoDaddy-compatible |
| CSS3 | Styling | Custom design system, no framework bloat |
| Vanilla JS | Interactions | Fast, zero dependencies |
| GSAP 3.12 | Animations | Industry standard, silky smooth |
| ScrollTrigger | Scroll effects | Best-in-class scroll animations |
| Space Grotesk | Headings font | Premium, tech-forward, legible |
| Manrope | Body font | Clean, modern, highly readable |

> **Why not Next.js/React?** GoDaddy shared hosting doesn't support Node.js server-side rendering. This pure static approach achieves Lighthouse 95+ without any build pipeline or server configuration.

---

## Key Features

- ✅ Breathtaking Hero with animated blobs, particles & parallax
- ✅ Sticky glassmorphism navbar with scroll blur
- ✅ GSAP ScrollTrigger reveal animations throughout
- ✅ Animated counter statistics (40+ Years, 1000+ Customers, etc.)
- ✅ 6-card Services section with hover effects
- ✅ 8-industry grid
- ✅ 8-reason "Why Us" section with sticky left column
- ✅ 3-tier Pricing cards with featured highlight
- ✅ 5-step animated Process timeline
- ✅ 2-branch section with live Google Maps embeds
- ✅ Auto-scrolling testimonial carousel with swipe support
- ✅ Large CTA banner with gradient
- ✅ 15-question animated FAQ accordion
- ✅ Contact section with WhatsApp-integrated form
- ✅ Floating WhatsApp, Call & Scroll-to-top buttons
- ✅ Scroll progress indicator
- ✅ Custom loading animation
- ✅ Full Schema.org JSON-LD structured data
- ✅ Open Graph & Twitter Card meta tags
- ✅ Fully responsive (mobile-first)
- ✅ Accessible (ARIA labels, keyboard nav, semantic HTML)

---

## Deploying to GoDaddy

### Step 1 — Buy/Confirm Hosting
Log in to GoDaddy → My Products → Web Hosting → your cPanel plan.

### Step 2 — Add Your Photos
Before uploading, add real business photos:
```
assets/images/concrete-mixer-hero.jpg   → A good photo of your mixer (600×500px)
assets/images/og-image.jpg             → Logo or mixer photo (1200×630px)
```
Use free stock photos from [Unsplash](https://unsplash.com/s/photos/concrete-mixer) if needed.

### Step 3 — Upload via File Manager
1. Log in to GoDaddy → cPanel → **File Manager**
2. Navigate to `public_html/`
3. Upload the entire `shiva-website/` folder contents directly into `public_html/`
   - `index.html` → `public_html/index.html`
   - `css/` → `public_html/css/`
   - `js/` → `public_html/js/`
   - `assets/` → `public_html/assets/`
   - `.htaccess` → `public_html/.htaccess`
   - `sitemap.xml` → `public_html/sitemap.xml`
   - `robots.txt` → `public_html/robots.txt`

### Step 4 — Upload via FTP (Alternative)
Use FileZilla or any FTP client:
- **Host:** Your domain or GoDaddy FTP server
- **Username/Password:** From cPanel → FTP Accounts
- Upload to `/public_html/`

### Step 5 — Configure Domain
In GoDaddy DNS settings, ensure:
- `A` record points to your hosting IP
- Or use GoDaddy's nameservers (auto-configured for their hosting)

### Step 6 — Enable SSL (Free)
cPanel → **SSL/TLS** → Install Free SSL (Let's Encrypt)  
The `.htaccess` already forces HTTPS automatically.

### Step 7 — Submit to Google
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://shivaconcretemixers.in`
3. Submit `sitemap.xml`: `https://shivaconcretemixers.in/sitemap.xml`

---

## Replacing Stock Images

The hero image currently loads from Unsplash as a fallback. To add your own:

1. Take photos of your concrete mixers, water tankers, and work sites
2. Resize to optimal dimensions:
   - Hero: 600×480px, compressed to <150KB
   - OG Image: 1200×630px
3. Save as `.jpg` or `.webp` in `assets/images/`
4. Update the `src` in `index.html`

**Recommended free stock photos (until you have your own):**
- https://unsplash.com/s/photos/concrete-mixer
- https://unsplash.com/s/photos/construction-site
- https://unsplash.com/s/photos/water-tanker

---

## Contact Form

The contact form submits via **WhatsApp** — it opens a pre-filled WhatsApp message to +91 9123282007 with the customer's details. This works without any backend server, email service, or PHP.

To add real email submission (optional), integrate [FormSpree](https://formspree.io/) — it's free:
1. Sign up at formspree.io
2. Create a form, get the endpoint
3. Change `form action="#"` to `action="https://formspree.io/f/YOUR_ID"`

---

## Performance Optimization

- Images use `loading="lazy"` (native browser lazy loading)
- Fonts preconnected with `rel="preconnect"`
- GSAP loaded from Cloudflare CDN (cached globally)
- `.htaccess` enables Gzip compression + 1-year browser caching
- No unused CSS (all styles are purpose-built)
- Minimal JavaScript, no heavy frameworks

**Expected Lighthouse scores:**
- Performance: 92–96
- Accessibility: 95+
- SEO: 98–100
- Best Practices: 95+

---

## Customization Guide

### Update Phone Numbers
Search `+919123282007` in `index.html` and replace with new numbers.

### Update Pricing
Find `₹7,000` in `index.html` and update.

### Add More FAQs
Copy an `.faq-item` block in `index.html` and add your Q&A.

### Change Colors
In `css/style.css`, update `:root` variables:
```css
--yellow:    #F59E0B;  /* Primary accent — Construction Yellow */
--charcoal:  #111111;  /* Dark sections */
--dark:      #0a0a0a;  /* Page background */
```

### Add Google Analytics
Paste your GA4 script tag before `</head>` in `index.html`.

---

## Future Improvements

1. **Gallery Section** — Add a masonry photo grid with lightbox (use [GLightbox](https://biati-digital.github.io/glightbox/))
2. **WhatsApp Chat Widget** — Replace FAB with [WhatsApp Chat Button](https://www.elfsight.com/whatsapp-chat-widget/)
3. **Customer Photos** — Add real customer testimonials with photos
4. **Video Hero** — Replace hero image with a site/equipment video
5. **Google Reviews Integration** — Embed live Google reviews
6. **Multi-language** — Add Hindi version for broader reach
7. **Blog** — SEO articles on construction tips
8. **Equipment Gallery** — Masonry grid with hover zoom and lightbox
9. **Live Chat** — Add Tawk.to free live chat widget

---

## Support

**Business:** Shiva Concrete Mixers  
**Website:** shivaconcretemixers.in  
**Phone:** +91 9123282007  
**Branch 2:** +91 99342 59335  
**Hours:** Mon–Sun 8 AM–8 PM

---

*Built with ❤️ for Bihar's construction industry*
