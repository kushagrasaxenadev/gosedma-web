// GOSEDMA — Application Constants

export const SITE_CONFIG = {
  name: 'GOSEDMA',
  fullName: 'Global Institute of Self Defence & Martial Arts',
  tagline: "A Richa Gaur's Academy",
  description:
    'GOSEDMA is a premier martial arts and self-defence training academy in Jaipur, Rajasthan. Founded by Richa Gaur, offering Taekwondo, Muay Thai, Krav Maga, MMA, and specialized self-defence programs.',
  establishedYear: 2010,
  city: 'Jaipur',
  state: 'Rajasthan',
  country: 'India',
  url: 'https://gosedma.com', // Placeholder
  email: 'info@gosedma.com', // Placeholder — from site_settings
  phone: '+91-9999999999', // Placeholder — from site_settings
  whatsapp: '919999999999', // Placeholder — from site_settings
} as const;

export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/gosedma', // Placeholder
  facebook: 'https://facebook.com/gosedma', // Placeholder
  youtube: 'https://youtube.com/@gosedma', // Placeholder
} as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'Our Academy', href: '/about' },
      { label: 'Founder — Richa Gaur', href: '/founder' },
    ],
  },
  {
    label: 'Programs',
    href: '/programs',
    children: [
      { label: 'All Programs', href: '/programs' },
      { label: 'Competition Training', href: '/competition-training' },
      { label: 'Summer Camps', href: '/summer-camps' },
    ],
  },
  {
    label: 'Workshops',
    href: '/workshops',
    featured: true,
    children: [
      { label: 'Overview', href: '/workshops' },
      { label: 'School Self-Defence', href: '/workshops/schools', featured: true },
      { label: 'Corporate Workshops', href: '/workshops/corporate' },
    ],
  },
  {
    label: 'Academy',
    href: '/achievements',
    children: [
      { label: 'Achievements', href: '/achievements' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Videos', href: '/videos' },
      { label: 'Events', href: '/events' },
      { label: 'News', href: '/news' },
    ],
  },
  { label: 'Branches', href: '/branches' },
  { label: 'Contact', href: '/contact' },
] as const;

export const FOOTER_LINKS = {
  programs: [
    { label: 'Taekwondo', href: '/programs/taekwondo' },
    { label: 'Muay Thai', href: '/programs/muay-thai' },
    { label: 'MMA', href: '/programs/mma' },
    { label: 'Krav Maga', href: '/programs/krav-maga' },
    { label: 'Self Defence', href: '/programs/self-defence' },
    { label: "Women's Self Defence", href: '/programs/womens-self-defence' },
  ],
  quickLinks: [
    { label: 'Book a Trial', href: '/trial' },
    { label: 'School Workshops', href: '/workshops/schools' },
    { label: 'Our Branches', href: '/branches' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact Us', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Safety Disclaimer', href: '/safety-disclaimer' },
  ],
} as const;

export const PROGRAM_CATEGORIES = [
  'Taekwondo',
  'Muay Thai / Thai Kickboxing',
  'MMA',
  'Krav Maga',
  'Military Tactical Self Defence',
  'Survival Self Defence',
  "Women's Self Defence",
  "Children's Self Defence",
  'Stunt Training',
  'Gymnastics / Poomsae',
  'Fitness / Conditioning',
  'Competition Athlete Training',
  'Assistant Trainer / Instructor Programs',
  'School Workshops',
  'Corporate Workshops',
  'Community / NGO Programs',
  'Summer Camps',
] as const;

export const ENQUIRY_STATUS = {
  trial: ['new', 'contacted', 'converted', 'lost'] as const,
  workshop: [
    'new',
    'contacted',
    'qualified',
    'proposal_sent',
    'negotiating',
    'booked',
    'completed',
    'lost',
  ] as const,
  contact: ['new', 'read', 'responded', 'closed'] as const,
} as const;

export const PRICING_MODES = ['exact', 'starting_from', 'range', 'enquire', 'hidden'] as const;

export const VERIFICATION_STATUSES = ['draft', 'client_verified', 'source_verified'] as const;
