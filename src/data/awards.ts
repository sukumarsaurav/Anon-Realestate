export interface AwardItem {
  /** Photograph of the trophy, plaque or certificate. */
  src: string
  title: string
  /** Who presented it. */
  org: string
  /** When it was received — short, human-readable. */
  year: string
  description: string
}

/**
 * Real recognitions received by ANON INDIA. Single source of truth for the
 * home-page carousel (components/home/AwardsSection) and the /awards page.
 */
export const AWARDS: AwardItem[] = [
  {
    src: '/awards/jagran-swarnim-noida-trophy.jpeg',
    title: 'Swarnim Noida Award',
    org: 'Dainik Jagran',
    year: '2026',
    description: 'Acknowledged for valued support and association — Delhi-NCR, April 2026',
  },
  {
    src: '/awards/jagran-leaders-of-change.jpeg',
    title: 'Leaders of Change',
    org: 'Dainik Jagran',
    year: '2026',
    description: 'Outstanding contribution towards the growth and prosperity of Noida',
  },
  {
    src: '/awards/iris-broadway-rising-star.jpeg',
    title: 'Rising Star Award',
    org: 'IRIS Broadway, Greno West',
    year: '2025',
    description: 'In recognition of hard work, commitment, and dedication to professionalism',
  },
  {
    src: '/awards/sunteck-celebration-of-excellence.jpeg',
    title: 'Celebration of Excellence',
    org: 'Sunteck Beach Residences',
    year: '2025',
    description: 'Presented to ANON INDIA as a token of appreciation for valuable participation',
  },
  {
    src: '/awards/sunteck-beach-appreciation.jpeg',
    title: 'Token of Appreciation',
    org: 'Sunteck Beach Residences',
    year: '2025',
    description: "Recognized for valuable participation in Sunteck's luxury beachfront project",
  },
  {
    src: '/awards/jagran-swarnim-noida-office.jpeg',
    title: 'Swarnim Noida Recognition',
    org: 'Dainik Jagran',
    year: '2026',
    description: 'Dual award display at the ANON INDIA headquarters — Delhi-NCR, April 2026',
  },
]
