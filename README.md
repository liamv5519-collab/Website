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

React 19 + Vite · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis smooth scroll ·
Framer Motion (cursor, magnetic buttons, form states). Desktop-first at 1440px,
with dedicated phone layouts for the pinned sections.

## Sections

1. **Hero** — the master photograph with a canvas layer of white strobe sparkles
   locked to the tower's outline; pointer parallax; hover the tower for a burst.
2. **Statement** — pinned; words brighten as you scroll while the moon rises.
3. **The Light Show (showpiece)** — pinned for ~7 screens. A slit of light
   centred on the tower opens to full-bleed footage of the tower sparkling.
   A floor rail climbs 01 → 05; each floor brings in one service with a white
   flash and a sweep of strobe lights from base to spire. The frame folds back
   into a card for the outro. Scroll drives only the frame and copy — the video
   is a muted loop that is never seeked or tied to scroll position.
4. **Approach** — pinned horizontal walk: lobby → boardroom → facade → penthouse.
5. **Reporting** — the five numbers that lead every report, over the aerial view.
6. **Manifesto** — the spire revealed from street level up.
7. **Contact** — the marina, a yacht gliding across on scroll, and a brief form
   (opens the visitor's mail app, pre-filled).

## Editing copy

All text is in [`site/src/content.js`](site/src/content.js). Before launch:

- Replace `brand.email` (`hello@bridgemarketing.co` is a placeholder).
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
