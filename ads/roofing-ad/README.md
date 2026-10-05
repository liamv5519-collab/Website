# Roofing ad (5 s, Remotion)

Ready-to-upload videos are in `exports/`:

- `roofing-ad-reels.mp4`: 1080×1920 (9:16), for Reels and Stories
- `roofing-ad-feed.mp4`: 1080×1350 (4:5), for Facebook and Instagram Feed

## Change the text or colors

Edit the `defaultProps` in `src/Root.tsx` (both compositions). `businessName`
and `phone` are hidden while empty.

## Re-render

```bash
npm i
npx remotion render RoofingAd-Reels exports/roofing-ad-reels.mp4 --crf=18
npx remotion render RoofingAd-Feed exports/roofing-ad-feed.mp4 --crf=18
```

Or preview and render from the Studio with `npm run dev`.

Font: Montserrat (SIL Open Font License, see `public/fonts/OFL-LICENSE.txt`).
