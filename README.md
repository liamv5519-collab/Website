# Bridge Marketing — website

An animated marketing site for **Bridge Marketing**, a Meta advertising agency
(Facebook, Instagram, Messenger, Reels). The theme is a twisting supertall glass tower
on a beachfront skyline at sunset — palms, sand, gulls, mountains behind, a few
LED-screen towers — its facade covered in Burj Khalifa–style flashing white
lights.

The site lives in [`site/`](site/).

```bash
cd site
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → site/dist
```

Deploys as a static site (Vercel, Netlify, Cloudflare Pages, S3…): build command
`npm run build`, output directory `site/dist`.

## Live site and editing

Live at **https://liamv5519-collab.github.io/Website/** (GitHub Pages).

The site republishes itself: every change committed to the repo's default
branch (`main` and `claude/confident-bardeen-f6gpqj` are kept identical) runs the
[Publish site](.github/workflows/publish-site.yml) workflow, which builds the
site and deploys it to Pages. The live page updates about a minute later
(hard-refresh with Cmd+Shift+R to skip the browser's cache). You can follow a
run under the repo's **Actions** tab.

One-time setup: in the repo's **Settings → Pages → Build and deployment →
Source**, choose **GitHub Actions**.

To edit text yourself on github.com: open `site/src/content.js`, click the
pencil icon, change the words between the quotes, then **Commit changes**.

## Stack

React 19 + Vite · Tailwind CSS v4 · GSAP + ScrollTrigger (native scrolling) ·
Framer Motion (service and form transitions) · Bricolage Grotesque (headlines)
and Geist (body), both self-hosted variable fonts. Desktop-first at 1440px,
with dedicated phone layouts for the pinned sections.

## Sections

1. **Hero** — the master photograph, brought to life by the same frame as
   video (surf, palms, gulls; a crossfaded loop with no visible jump), extra
   gulls drawn on a canvas, and a faint drifting haze along the horizon. Over
   it, ~1,300 white lights locked to the tower's outline (steady embers and
   constant strobe flashes) reflect in the water, and searchlights spaced
   evenly up both edges and the spire sweep the sky. Shows immediately; no
   intro animation.
2. **Statement** — pinned; words brighten as you scroll while the moon rises over the sunset.
3. **The Light Show (showpiece)** — pinned for ~5 screens. A slit of light
   centred on the tower opens to full-bleed footage of the tower sparkling.
   The five services sit in one list beside it; scrolling lights each in turn
   (or click one to jump to it). The frame folds back
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
| Scene video (hero + light show) | Kling 3.0 from the master frame, locked-off camera, 5s, 1080p; looped in the browser by crossfading two copies |

To self-host instead of using the CDN, download the URLs in `assets.js` into
`site/public/media/` and point the manifest at `/media/...`.
