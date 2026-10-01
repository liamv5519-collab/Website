# Bridge Marketing — website

An animated marketing site for **Bridge Marketing**, a Meta advertising agency
(Facebook, Instagram, Messenger, Reels). The theme is a luxury supertall tower on
a moonlit harbour, its facade sparkling with white strobe lights.

The site lives in [`site/`](site/).

```bash
cd site
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → site/dist
```

Deploys as a static site (Vercel, Netlify, Cloudflare Pages, S3…): build command
`npm run build`, output directory `site/dist`.

## Stack

React 19 + Vite · Tailwind CSS v4 · GSAP + ScrollTrigger (native scrolling) ·
Framer Motion (service and form transitions) · Archivo
(self-hosted variable font). Desktop-first at 1440px,
with dedicated phone layouts for the pinned sections.

## Sections

1. **Hero** — the master photograph with a canvas layer of white strobe sparkles
   locked to the tower's outline. Shows immediately; no intro animation.
2. **Statement** — pinned; words brighten as you scroll while the moon rises.
3. **The Light Show (showpiece)** — pinned for ~5 screens. A slit of light
   centred on the tower opens to full-bleed footage of the tower sparkling.
   The five services sit in one list beside it; scrolling lights each in turn
   (or click one to jump to it) and sends a sweep of strobe lights from base to
   spire. The frame folds back
   into a card for the outro. Scroll drives only the frame and copy — the video
   is a muted loop that is never seeked or tied to scroll position.
4. **Approach** — pinned horizontal walk: lobby → boardroom → facade → penthouse.
5. **Reporting** — the five numbers that lead every report, over the aerial view.
6. **Manifesto** — the spire revealed from street level up.
7. **Contact** — the marina, a yacht gliding across on scroll, and an enquiry
   form that delivers to your inbox via Formspree.

## Connecting the contact form

Enquiries are sent through [Formspree](https://formspree.io) (free plan: 50
submissions a month).

1. Sign up at formspree.io and create a new form. Formspree asks for the email
   address the enquiries should go to.
2. Copy the form's endpoint — it looks like `https://formspree.io/f/abcdwxyz`.
3. Either paste it into `contact.formEndpoint` in `site/src/content.js`, or add
   it as an environment variable named `VITE_FORM_ENDPOINT` in your host
   (Vercel → Project → Settings → Environment Variables) and redeploy.

Until an endpoint is set, the form tells visitors enquiries open soon instead
of failing silently. Each enquiry arrives with the name, email, business,
website, chosen budget and message, subject "Strategy call — <business>". A
hidden honeypot field filters out most spam bots.

## Editing copy

All text is in [`site/src/content.js`](site/src/content.js). Before launch:

- Set `brand.email` if you want a public email address shown (it is hidden
  while empty).
- Check every service "detail" line and the process steps match how you work —
  they are written as commitments to clients.

## Assets

Every image and the video were generated with Higgsfield, optimised to WebP / H.264
and hosted on Higgsfield's CDN (URLs in [`site/src/assets.js`](site/src/assets.js)).

| Asset | How it was made |
| --- | --- |
| Master (hero) | GPT Image 2.5, 4K upscale → 2880w WebP |
| Spire, aerial, marina, facade | Image-to-image from the master (same tower, grade) |
| Lobby, boardroom, penthouse lounge | Image-to-image, graded to the master |
| Moon, yacht | Generated on plain backgrounds, background removed |
| Light show video | Kling 3.0 from the master frame, crossfaded into a seamless 4s loop, 1080p, no audio |

To self-host instead of using the CDN, download the URLs in `assets.js` into
`site/public/media/` and point the manifest at `/media/...`.
