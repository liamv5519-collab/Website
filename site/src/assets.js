// Every visual on the site was generated with Higgsfield, optimised to WebP,
// and re-hosted on Higgsfield's CDN. Media IDs are kept for traceability.
const CDN = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3Jo1IShwS4ARdRQTEmT9q44U1fD'

export const assets = {
  // Master: the tower across the harbour under a full moon (4K upscale, 2880w WebP).
  hero: { src: `${CDN}/d9ac8f2f-1100-4f14-9fc3-1a78936909d6.webp`, w: 2880, h: 1613 },
  // Image-to-image variants of the master — same tower, same grade.
  spire: { src: `${CDN}/056b80bb-4b0e-465d-b413-1185866abbb8.webp`, w: 1360, h: 2048 },
  aerial: { src: `${CDN}/014befc9-432d-4083-9a57-5df8ced63b14.webp`, w: 2560, h: 1448 },
  marina: { src: `${CDN}/7070bc5d-e14b-4beb-8d33-bf43cbd1d463.webp`, w: 2560, h: 1448 },
  facade: { src: `${CDN}/888a7571-b4f9-4cb1-80db-b86a2f3137c2.webp`, w: 2560, h: 1448 },
  // Supporting interiors, graded to match the master.
  lounge: { src: `${CDN}/2f220f1d-8c72-497f-a5af-d71e565f5be4.webp`, w: 2560, h: 1448 },
  lobby: { src: `${CDN}/bc668241-3400-4a70-b563-7446a6befd9a.webp`, w: 1600, h: 2000 },
  boardroom: { src: `${CDN}/e00bf72a-2f8a-437a-9892-b64e3fe779ea.webp`, w: 2560, h: 1448 },
  // Cutouts (background removed, transparent WebP).
  moon: { src: `${CDN}/31453929-67ec-4735-9662-7fcdbfdfc978.webp`, w: 890, h: 900 },
  yacht: { src: `${CDN}/d3600bc0-695c-497f-b101-00bafa4a414b.webp`, w: 1600, h: 575 },
  // The light show: the tower's white strobe lights sparkling. Kling 3.0 from
  // the master frame, crossfaded into a seamless 4s loop, 1080p H.264, no audio.
  lightShow: {
    src: `${CDN}/29b6b2e1-04e5-4e0b-bfdd-e3e227806c5d.mp4`,
    poster: `${CDN}/63a40378-de10-463c-8d5e-6fee4a05cb05.webp`,
    aspect: 16 / 9,
  },
}

// Where the tower sits inside the master frame, in normalised image
// coordinates (measured from the 4K master). Used to place the sparkle layer.
export const towerShape = [
  [0.615, 0.06],
  [0.624, 0.25],
  [0.634, 0.43],
  [0.643, 0.6],
  [0.65, 0.72],
  [0.58, 0.72],
  [0.587, 0.6],
  [0.596, 0.43],
  [0.606, 0.25],
]
