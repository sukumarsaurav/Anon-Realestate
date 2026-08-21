export interface EventPhoto {
  src: string
  alt: string
  /** Intrinsic pixel size — portrait frames claim two rows in the gallery. */
  width: number
  height: number
}

export interface PastEvent {
  slug: string
  title: string
  date: string
  venue: string
  /** Short kicker shown above the title. */
  kind: string
  body: string
  photos: EventPhoto[]
}

/** Events ANON INDIA has hosted or been part of, newest first. */
export const PAST_EVENTS: PastEvent[] = [
  {
    slug: 'best-performance-2025',
    title: 'Best Performance Awards',
    date: '10 December 2025',
    venue: 'ANON INDIA HQ, Noida',
    kind: 'Team recognition',
    body:
      'An in-house celebration of the advisors who closed the most families into their new homes this quarter — and of the support teams who made those handovers smooth.',
    photos: [
      { src: '/events/best-performance/team-entrance.jpg', alt: 'ANON INDIA team gathered at the office entrance on awards day', width: 1280, height: 575 },
      { src: '/events/best-performance/sales-desk.jpg', alt: 'Advisors at the ANON INDIA sales desk during the Best Performance event', width: 1280, height: 575 },
      { src: '/events/best-performance/top-performers.jpg', alt: 'Top-performing advisors of the quarter at the ANON INDIA office', width: 575, height: 1280 },
    ],
  },
  {
    slug: 'big-winter-carnival-2025',
    title: 'Big Winter Carnival',
    date: '22–23 November 2025',
    venue: 'IRIS Broadway, Greno West',
    kind: 'Two-day property carnival',
    body:
      'Two days of walkthroughs, spot offers and live entertainment at IRIS Broadway — a celebration of joy, community and opportunity, hosted alongside Trehan IRIS and Omega.',
    photos: [
      { src: '/events/winter-carnival/team-group.jpg', alt: 'ANON INDIA team on stage at the Big Winter Carnival', width: 1280, height: 960 },
      { src: '/events/winter-carnival/iris-broadway-banner.jpg', alt: 'Partners in front of the IRIS Broadway Greno West carnival banner', width: 1280, height: 960 },
      { src: '/events/winter-carnival/stage-lineup.jpg', alt: 'ANON INDIA advisors lined up on the carnival stage', width: 1280, height: 960 },
      { src: '/events/winter-carnival/lounge-break.jpg', alt: 'ANON INDIA advisors taking a break in the carnival lounge', width: 1280, height: 960 },
    ],
  },
  {
    slug: 'iris-rising-star-2025',
    title: 'IRIS Awards Night',
    date: '2025',
    venue: 'IRIS Broadway, Greno West',
    kind: 'Channel partner awards',
    body:
      'ANON INDIA received the Rising Star Award from Trehan IRIS Broadway, presented to founder Deepak Sharma in recognition of the team’s sales contribution and professionalism.',
    photos: [
      { src: '/events/iris-awards/rising-star-presentation.jpg', alt: 'Rising Star Award being presented to ANON INDIA at IRIS Broadway', width: 1280, height: 960 },
      { src: '/events/iris-awards/certificate-handover.jpg', alt: 'ANON INDIA receiving the Rising Star certificate on stage', width: 960, height: 1280 },
      { src: '/events/iris-awards/stage-ceremony.jpg', alt: 'Channel partners on stage at the IRIS Broadway awards ceremony', width: 1280, height: 960 },
    ],
  },
]

export interface RecurringFormat {
  title: string
  when: string
  where: string
  body: string
}

/** Standing formats buyers can register for at any time. */
export const RECURRING_FORMATS: RecurringFormat[] = [
  {
    title: 'Weekend Site Visit Drive',
    when: 'Every Saturday & Sunday',
    where: 'All Noida & Greater Noida projects',
    body: 'Guided, no-pressure site visits with a dedicated advisor. Book your slot.',
  },
  {
    title: 'Property Investment Meet',
    when: 'Monthly',
    where: 'ANON INDIA, Noida',
    body: 'Market insights and curated opportunities for serious investors.',
  },
  {
    title: 'New Launch Preview',
    when: 'On announcement',
    where: 'Project site',
    body: 'Early-bird pricing and first pick of inventory for registered buyers.',
  },
]
