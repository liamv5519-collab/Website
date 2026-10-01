// Every visual on the site was generated with Higgsfield, optimised to WebP,
// and hosted on Higgsfield's CDN.
const CDN = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3Jo1IShwS4ARdRQTEmT9q44U1fD'
const RAW = 'https://d8j0ntlcm91z4.cloudfront.net/user_3Jo1IShwS4ARdRQTEmT9q44U1fD'

export const assets = {
  // Master: the twisting tower on a beachfront skyline at sunset — palms,
  // mountains, gulls, a few LED screen towers (4K upscale, 2880w WebP).
  hero: { src: `${CDN}/b958db6b-d8e7-4868-8166-9ac90227035f.webp`, w: 2880, h: 1633 },
  // Image-to-image variants of the master — same tower, same sunset.
  spire: { src: `${CDN}/46daed22-b213-44bc-8d69-d0b3d909855e.webp`, w: 1360, h: 2048 },
  aerial: { src: `${CDN}/f5422a4b-4807-4f28-948d-b04a508e407d.webp`, w: 2560, h: 1448 },
  marina: { src: `${CDN}/9c2cbcdc-90e1-4fcd-8873-c8fbdedc2d0c.webp`, w: 2560, h: 1448 },
  facade: { src: `${CDN}/5a0663f1-eb09-42f5-85c1-13b7d2a1b8cb.webp`, w: 2560, h: 1448 },
  // Interiors with sunset views.
  lounge: { src: `${CDN}/5fd7ee7a-acb4-44c6-bcf0-8a82474327f8.webp`, w: 2560, h: 1448 },
  lobby: { src: `${CDN}/bc668241-3400-4a70-b563-7446a6befd9a.webp`, w: 1600, h: 2000 },
  boardroom: { src: `${CDN}/6c0c3c34-54a7-4da0-b342-14f2cfb3038c.webp`, w: 2560, h: 1448 },
  // Cutouts (background removed, transparent WebP).
  moon: { src: `${CDN}/31453929-67ec-4735-9662-7fcdbfdfc978.webp`, w: 890, h: 900 },
  yacht: { src: `${CDN}/d3600bc0-695c-497f-b101-00bafa4a414b.webp`, w: 1600, h: 575 },
  // The light show: Kling 3.0 from the master frame — tower lights twinkling,
  // screens shifting, gulls, palms and waves moving. Muted loop.
  lightShow: {
    src: `${RAW}/hf_20261001_134035_5dfab679-e86e-48eb-b9dd-93afa49fb0e4.mp4`,
    poster: `${CDN}/b958db6b-d8e7-4868-8166-9ac90227035f.webp`,
    aspect: 16 / 9,
  },
}

// Where the main tower sits inside the master frame, in normalised image
// coordinates (measured from the 4K master): tip at the top, widening slightly
// to where it meets the rest of the skyline. Used to place the flashing lights.
export const towerShape = [
  [0.666, 0.075],
  [0.672, 0.15],
  [0.677, 0.25],
  [0.682, 0.35],
  [0.684, 0.45],
  [0.685, 0.52],
  [0.649, 0.52],
  [0.65, 0.45],
  [0.651, 0.35],
  [0.654, 0.25],
  [0.66, 0.15],
]

// Horizontal position of the tower's spire, used to centre the light-show slit.
export const towerX = 0.667
