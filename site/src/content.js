// All site copy in one place. Edit here; components only render it.

export const brand = {
  name: 'Bridge Marketing',
  short: 'Bridge',
  // Public contact email. Leave empty to hide every email link on the site.
  email: '',
}

export const nav = [
  { label: 'Services', href: '#services' },
  { label: 'Approach', href: '#approach' },
  { label: 'Reporting', href: '#reporting' },
  { label: 'Contact', href: '#contact' },
]

export const hero = {
  eyebrow: 'Meta advertising — Facebook · Instagram · Messenger · Reels',
  title: ['Be the tallest', 'thing on the feed.'],
  body: 'Bridge Marketing plans, builds and runs Meta ads for businesses that want to be seen from a distance. We start with the foundations. Then we light every floor.',
  primary: 'Book a strategy call',
  secondary: 'See the services',
}

export const statement =
  'Most ads are built like bungalows. Quick to put up. Easy to forget. We build towers — campaigns with foundations, structure, and a light on every floor.'

export const lightShow = {
  eyebrow: 'The services',
  title: 'Every floor, lit.',
  intro: 'Five disciplines. One team. Scroll to climb the tower.',
  outro: 'The whole tower. One team.',
  services: [
    {
      floor: '01',
      level: 'Foundations',
      title: 'Strategy & account audit',
      body: 'We open your ad account and read it like a ledger. Every campaign since the pixel went live. Then we write the plan on one page.',
      detail: 'We check whether your pixel fires twice on the thank-you page. It usually does.',
    },
    {
      floor: '02',
      level: 'Structure',
      title: 'Creative production',
      body: 'Statics, carousels and 9:16 video. Built for the thumb, not the boardroom. Written, shot and edited in-house.',
      detail: 'Every video has to make sense on mute. Captions are burned in, never auto-generated.',
    },
    {
      floor: '03',
      level: 'Reach',
      title: 'Audiences & targeting',
      body: 'Broad where Meta’s algorithm is smart. Precise where it isn’t. Lookalikes built from buyers, not from page likes.',
      detail: 'Your last 180 days of customers are excluded from prospecting. Most accounts forget.',
    },
    {
      floor: '04',
      level: 'Conversion',
      title: 'Funnels & retargeting',
      body: 'Landing pages, instant forms and Messenger flows. The ad is the door. We build the hallway behind it.',
      detail: 'Lead forms carry one qualifying question. It filters out the tyre-kickers before your phone rings.',
    },
    {
      floor: '05',
      level: 'Observation deck',
      title: 'Scaling & reporting',
      body: 'Budgets rise only when the numbers earn it. You see exactly what we see, every week, in plain English.',
      detail: 'One page, every Monday. Cost per result is always the first line.',
    },
  ],
}

export const approach = {
  eyebrow: 'The approach',
  title: 'How a tower goes up.',
  steps: [
    {
      image: 'lobby',
      room: 'The lobby',
      when: 'Week one',
      title: 'We learn the business.',
      body: 'A forty-five minute call. Then read access to your ad account, your analytics and your last twelve months of sales.',
    },
    {
      image: 'boardroom',
      room: 'The boardroom',
      when: 'Week one',
      title: 'We agree the plan.',
      body: 'Budget, audiences, offers and a shot list for creative. One page. You sign it before a single dollar is spent.',
    },
    {
      image: 'facade',
      room: 'The facade',
      when: 'Week two',
      title: 'We build it.',
      body: 'Ads, landing pages, tracking and events. Every conversion is test-fired and checked in Events Manager before launch.',
    },
    {
      image: 'lounge',
      room: 'The penthouse',
      when: 'Every week after',
      title: 'We keep it lit.',
      body: 'Weekly optimisation. Fresh creative before fatigue sets in. A monthly review where we decide what to build next.',
    },
  ],
}

export const reporting = {
  eyebrow: 'Reporting',
  title: 'The view from the top.',
  body: 'You never have to ask how the ads are doing. The same five numbers lead every report, in the same order, every week.',
  metrics: [
    { key: 'CPR', name: 'Cost per result', note: 'What one lead, booking or sale actually costs you.' },
    { key: 'ROAS', name: 'Return on ad spend', note: 'Revenue back for every dollar in. Tracked, not estimated.' },
    { key: 'CTR', name: 'Click-through rate', note: 'Whether the ad earns the tap. Below 1% means new creative.' },
    { key: 'HOOK', name: 'Hook rate', note: 'Share of viewers still watching at three seconds.' },
    { key: 'FREQ', name: 'Frequency', note: 'How often the same person sees you. Above 3, we rotate.' },
  ],
}

export const manifesto = {
  quote: 'Tall buildings are not put up in a weekend. Neither are ad accounts that last.',
  byline: 'The Bridge Marketing principle',
}

export const contact = {
  eyebrow: 'Contact',
  title: ['Let’s put your name', 'on the skyline.'],
  body: 'Tell us about the business and what a good month looks like. We reply with a first read of your account.',
  budgets: ['Under $2,000 / month', '$2,000 – $5,000 / month', '$5,000 – $15,000 / month', '$15,000+ / month'],
  submit: 'Request a strategy call',
  sending: 'Sending…',
  // Where enquiries are delivered. Create a free form at https://formspree.io,
  // then paste its endpoint here, e.g. 'https://formspree.io/f/abcdwxyz'.
  formEndpoint: '',
  sent: {
    eyebrow: 'Received',
    title: 'Thank you. Your enquiry is in.',
    body: 'We read every one ourselves and will be in touch shortly with a first read of your account.',
  },
  errors: {
    notConnected: 'Enquiries open very soon — the form isn’t connected yet.',
    failed: 'That didn’t go through. Please check your connection and try again.',
  },
}

export const footer = {
  line: 'Meta advertising for businesses that want to be seen from a distance.',
  legal: 'Meta, Facebook, Instagram and Messenger are trademarks of Meta Platforms, Inc. Bridge Marketing is an independent agency.',
}
