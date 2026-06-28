#!/usr/bin/env node
/**
 * seed.mjs — Populate the Supabase database with rich dummy data.
 *
 * Run:  node scripts/seed.mjs
 *
 * Uses the service-role key from .env.local so it bypasses RLS.
 * Idempotent: deletes existing rows in the seeded tables first.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Load .env.local ──────────────────────────────────────────────────────────
const envPath = resolve(__dirname, '..', '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const env = Object.fromEntries(
  envContent.split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => { const [k, ...v] = l.split('='); return [k.trim(), v.join('=').trim()] })
)

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY)

// ── Helper ──────────────────────────────────────────────────────────────────
function uid() { return crypto.randomUUID() }

// Unsplash images — deterministic, high-quality, royalty-free
const IMG = {
  // Property / project images (real estate)
  properties: [
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=900&q=80&auto=format&fit=crop',
  ],
  // City skylines
  cities: {
    'Jaipur':      'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=900&q=80&auto=format&fit=crop',
    'Jodhpur':     'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=900&q=80&auto=format&fit=crop',
    'Udaipur':     'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=80&auto=format&fit=crop',
    'Kota':        'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=900&q=80&auto=format&fit=crop',
    'Ajmer':       'https://images.unsplash.com/photo-1524813686514-a57563d77965?w=900&q=80&auto=format&fit=crop',
    'Jaisalmer':   'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=900&q=80&auto=format&fit=crop',
    'Pushkar':     'https://images.unsplash.com/photo-1590050751260-d0d0ec632b76?w=900&q=80&auto=format&fit=crop',
    'Bhilwara':    'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=900&q=80&auto=format&fit=crop',
    'Alwar':       'https://images.unsplash.com/photo-1567157577867-05ccb1388e13?w=900&q=80&auto=format&fit=crop',
    'Sikar':       'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=900&q=80&auto=format&fit=crop',
    'Delhi NCR':   'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=900&q=80&auto=format&fit=crop',
    'Gurugram':    'https://images.unsplash.com/photo-1595424515765-a93cc12b8f6c?w=900&q=80&auto=format&fit=crop',
  },
  // Team / profile photos (professional headshots from Unsplash)
  team: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80&auto=format&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&auto=format&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&auto=format&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&auto=format&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80&auto=format&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80&auto=format&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80&auto=format&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80&auto=format&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80&auto=format&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&auto=format&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80&auto=format&fit=crop&crop=face',
  ],
  // Blog images
  blog: [
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523192193543-6e7296d960e4?w=900&q=80&auto=format&fit=crop',
  ],
}

// ── Developers ───────────────────────────────────────────────────────────────
const developers = [
  { id: uid(), name: 'ANON Developers',            logo_url: null, website_url: 'https://anonindia.com',  sort_order: 1, is_active: true },
  { id: uid(), name: 'ANON Constructions',          logo_url: null, website_url: 'https://anonindia.com',  sort_order: 2, is_active: true },
  { id: uid(), name: 'ANON Interiors',              logo_url: null, website_url: 'https://anonindia.com',  sort_order: 3, is_active: true },
  { id: uid(), name: 'ANON Infrastructure',          logo_url: null, website_url: 'https://anonindia.com',  sort_order: 4, is_active: true },
  { id: uid(), name: 'ANON Green Homes',            logo_url: null, website_url: null,                     sort_order: 5, is_active: true },
  { id: uid(), name: 'ANON Commercial Ventures',    logo_url: null, website_url: null,                     sort_order: 6, is_active: true },
]

// ── Team members (with profile images) ───────────────────────────────────────
const team = [
  { id: uid(), name: 'Rajesh Sharma',       designation: 'Founder & MD',            level: 'leadership', photo_url: IMG.team[0],  sort_order: 1,  is_public: true },
  { id: uid(), name: 'Priya Agarwal',       designation: 'Director – Sales',        level: 'leadership', photo_url: IMG.team[4],  sort_order: 2,  is_public: true },
  { id: uid(), name: 'Vikram Singh',        designation: 'VP – Project Delivery',   level: 'leadership', photo_url: IMG.team[1],  sort_order: 3,  is_public: true },
  { id: uid(), name: 'Anita Mehra',         designation: 'Head of Marketing',       level: 'leadership', photo_url: IMG.team[5],  sort_order: 4,  is_public: true },
  { id: uid(), name: 'Suresh Patel',        designation: 'Chief Architect',         level: 'leadership', photo_url: IMG.team[2],  sort_order: 5,  is_public: true },
  { id: uid(), name: 'Deepak Joshi',        designation: 'Senior Property Advisor', level: 'advisor',    photo_url: IMG.team[3],  sort_order: 6,  is_public: true },
  { id: uid(), name: 'Kavita Rathore',      designation: 'Property Advisor',        level: 'advisor',    photo_url: IMG.team[6],  sort_order: 7,  is_public: true },
  { id: uid(), name: 'Amit Gupta',          designation: 'Property Advisor',        level: 'advisor',    photo_url: IMG.team[8],  sort_order: 8,  is_public: true },
  { id: uid(), name: 'Neha Verma',          designation: 'Client Relations Manager',level: 'advisor',    photo_url: IMG.team[7],  sort_order: 9,  is_public: true },
  { id: uid(), name: 'Rohit Choudhary',     designation: 'Legal & RERA Expert',     level: 'advisor',    photo_url: IMG.team[9],  sort_order: 10, is_public: true },
  { id: uid(), name: 'Meenakshi Tiwari',    designation: 'Interior Design Lead',    level: 'advisor',    photo_url: IMG.team[10], sort_order: 11, is_public: true },
  { id: uid(), name: 'Arjun Kapoor',        designation: 'Site Engineer',           level: 'operations', photo_url: IMG.team[11], sort_order: 12, is_public: true },
]

// ── Projects (across multiple cities, diverse types) ─────────────────────────
function gallery(startIdx, count = 4) {
  const out = []
  for (let i = 0; i < count; i++) out.push(IMG.properties[(startIdx + i) % IMG.properties.length])
  return out
}

const projects = [
  // ── JAIPUR (5 projects) ─────────────────────────────────────────────────
  {
    id: uid(), name: 'ANON Royal Greens',        type: 'plotted_development', city: 'Jaipur',    locality: 'Ajmer Road',
    status: 'under_construction', description: 'Premium plotted development on Ajmer Road with world-class amenities, gated security, and lush green landscapes. Ideal for families and investors seeking long-term value in Jaipur\'s fastest-growing corridor.',
    gallery_urls: gallery(0), hero_image_url: IMG.properties[0], starting_price: 2500000, price_per_sqft: 4500,
    bhk_config: 'NA (Plots)', website_category: 'residential', is_featured: true, is_active: true,
    rera_number: 'RAJ/RERA/P/2024/001234', rera_registration_date: '2024-03-15', total_units: 120,
    expected_completion_date: '2026-12-31', amenities: ['Gated Community', 'Club House', 'Swimming Pool', 'Park', 'Temple', '24/7 Security', 'Underground Electricity', 'Wide Roads', 'Rain Water Harvesting', 'Jogging Track'],
    developer_id: developers[0].id,
    usp: ['0% pre-EMI till possession', 'JDA approved layout', 'Near upcoming metro station'],
    connectivity: [{ place: 'Jaipur International Airport', distance: '18 km' }, { place: 'Ajmer Highway NH-8', distance: '0.5 km' }, { place: 'Jaipur Railway Station', distance: '12 km' }],
    faqs: [],
  },
  {
    id: uid(), name: 'ANON City Heights',        type: 'apartment',          city: 'Jaipur',    locality: 'Mansarovar Extension',
    status: 'ready_to_move', description: 'Modern 2/3 BHK apartments in the heart of Mansarovar with premium fittings, vastu-compliant design, and panoramic city views. Walking distance to metro and top schools.',
    gallery_urls: gallery(2), hero_image_url: IMG.properties[2], starting_price: 4500000, price_per_sqft: 5200,
    bhk_config: '2, 3 BHK', website_category: 'residential', is_featured: true, is_active: true,
    rera_number: 'RAJ/RERA/P/2023/005678', rera_registration_date: '2023-08-10', total_units: 200,
    expected_completion_date: '2025-06-30', amenities: ['Lift', 'Power Backup', 'Gym', 'Children Play Area', 'CCTV', 'Intercom', 'Covered Parking', 'Fire Safety', 'Landscaped Garden'],
    developer_id: developers[1].id,
    usp: ['OC received', 'Ready to move', 'Metro within 500m walking distance'],
    connectivity: [{ place: 'Mansarovar Metro Station', distance: '500m' }, { place: 'World Trade Park', distance: '6 km' }, { place: 'SMS Hospital', distance: '8 km' }],
    faqs: [],
  },
  {
    id: uid(), name: 'ANON Business Park',       type: 'commercial',         city: 'Jaipur',    locality: 'Tonk Road',
    status: 'under_construction', description: 'State-of-the-art commercial spaces on Jaipur\'s premium Tonk Road. IT/ITES ready offices, retail showrooms, and food court. High ROI potential in Jaipur\'s business hub.',
    gallery_urls: gallery(4), hero_image_url: IMG.properties[1], starting_price: 8500000, price_per_sqft: 7800,
    bhk_config: 'Office / Retail', website_category: 'commercial', is_featured: true, is_active: true,
    rera_number: 'RAJ/RERA/P/2024/002345', rera_registration_date: '2024-01-20', total_units: 80,
    expected_completion_date: '2027-03-31', amenities: ['Central AC', 'High-Speed Elevators', 'Cafeteria', 'Conference Rooms', 'Visitor Parking', 'Power Backup', 'Fire Safety', 'Security'],
    developer_id: developers[0].id,
    usp: ['12% assured returns for 3 years', 'Pre-leased units available', 'Tonk Road frontage'],
    connectivity: [{ place: 'Tonk Road', distance: 'On main road' }, { place: 'Airport', distance: '15 km' }, { place: 'C-Scheme Business District', distance: '4 km' }],
    faqs: [],
  },
  {
    id: uid(), name: 'ANON Heritage Villas',     type: 'villa',              city: 'Jaipur',    locality: 'Vaishali Nagar',
    status: 'pre_launch', description: 'Exclusive heritage-inspired luxury villas in Vaishali Nagar. Each villa blends Rajasthani architectural grandeur with modern luxury. Private gardens, rooftop terraces, and smart home features.',
    gallery_urls: gallery(6), hero_image_url: IMG.properties[5], starting_price: 15000000, price_per_sqft: 8500,
    bhk_config: '3, 4, 5 BHK', website_category: 'luxury', is_featured: true, is_active: true,
    rera_number: 'RAJ/RERA/P/2025/000111', rera_registration_date: '2025-01-05', total_units: 32,
    expected_completion_date: '2028-06-30', amenities: ['Private Garden', 'Rooftop Terrace', 'Smart Home', 'Italian Marble', 'Modular Kitchen', 'Home Theatre', 'Swimming Pool', 'Gym', 'Club House', 'Concierge'],
    developer_id: developers[0].id,
    usp: ['Only 32 exclusive villas', 'Heritage Rajasthani architecture', 'Italian marble throughout'],
    connectivity: [{ place: 'Vaishali Nagar Market', distance: '1 km' }, { place: 'Ridhi Sidhi Circle', distance: '3 km' }, { place: 'Railway Station', distance: '7 km' }],
    faqs: [],
  },
  {
    id: uid(), name: 'ANON Sunrise Plots',       type: 'plotted_development', city: 'Jaipur',    locality: 'Kalwar Road',
    status: 'under_construction', description: 'Affordable JDA-approved plots on Kalwar Road. Well-planned infrastructure with underground utilities, parks, and temple. Best value-for-money investment in Jaipur.',
    gallery_urls: gallery(8), hero_image_url: IMG.properties[8], starting_price: 1200000, price_per_sqft: 2800,
    bhk_config: 'NA (Plots)', website_category: 'residential', is_featured: false, is_active: true,
    rera_number: 'RAJ/RERA/P/2024/003456', rera_registration_date: '2024-06-01', total_units: 250,
    expected_completion_date: '2026-09-30', amenities: ['Boundary Wall', 'Park', 'Temple', 'Street Lights', 'Underground Drainage', 'Wide Internal Roads'],
    developer_id: developers[1].id,
    usp: ['JDA approved', 'Starting just ₹12 Lakh', 'Near Ring Road'],
    connectivity: [{ place: 'Ring Road', distance: '2 km' }, { place: 'Kalwar Road NH-11C', distance: '0.5 km' }, { place: 'Chomu', distance: '15 km' }],
    faqs: [],
  },

  // ── JODHPUR (3 projects) ────────────────────────────────────────────────
  {
    id: uid(), name: 'ANON Blue City Residences', type: 'apartment',          city: 'Jodhpur',   locality: 'Pal Road',
    status: 'under_construction', description: 'Luxury apartments inspired by Jodhpur\'s iconic Blue City. Modern living spaces with traditional Rajasthani detailing, overlooking Mehrangarh Fort views.',
    gallery_urls: gallery(1), hero_image_url: IMG.properties[3], starting_price: 3800000, price_per_sqft: 4800,
    bhk_config: '2, 3 BHK', website_category: 'luxury', is_featured: true, is_active: true,
    rera_number: 'RAJ/RERA/P/2024/004567', rera_registration_date: '2024-04-10', total_units: 96,
    expected_completion_date: '2027-06-30', amenities: ['Swimming Pool', 'Gym', 'Rooftop Lounge', 'Landscaped Garden', 'Club House', 'CCTV', 'Power Backup', 'EV Charging'],
    developer_id: developers[0].id,
    usp: ['Fort-view apartments', 'Jodhpur stone facade', 'Premium Pal Road location'],
    connectivity: [{ place: 'Jodhpur Airport', distance: '5 km' }, { place: 'Pal Road Market', distance: '1 km' }, { place: 'Mehrangarh Fort', distance: '8 km' }],
    faqs: [],
  },
  {
    id: uid(), name: 'ANON Desert Palm',          type: 'plotted_development', city: 'Jodhpur',   locality: 'Pali Road',
    status: 'ready_to_move', description: 'Well-developed plotted colony on Pali Road with complete infrastructure. Enjoy the charm of the Thar with modern amenities and clear land titles.',
    gallery_urls: gallery(3), hero_image_url: IMG.properties[9], starting_price: 1800000, price_per_sqft: 3200,
    bhk_config: 'NA (Plots)', website_category: 'residential', is_featured: false, is_active: true,
    rera_number: 'RAJ/RERA/P/2023/006789', rera_registration_date: '2023-05-20', total_units: 180,
    expected_completion_date: '2025-03-31', amenities: ['Gated Community', 'Park', 'Temple', 'Community Hall', 'Wide Roads', 'Street Lights'],
    developer_id: developers[1].id,
    usp: ['Ready possession', 'Clear titles', 'Fully developed infrastructure'],
    connectivity: [{ place: 'Jodhpur Railway Station', distance: '10 km' }, { place: 'Pali Road NH-65', distance: '0.5 km' }, { place: 'AIIMS Jodhpur', distance: '6 km' }],
    faqs: [],
  },
  {
    id: uid(), name: 'ANON Marwar Heights',       type: 'apartment',          city: 'Jodhpur',   locality: 'Shastri Nagar',
    status: 'pre_launch', description: 'Upcoming premium apartment project in the heart of Jodhpur. Spacious 3/4 BHK flats with modern architecture and rooftop infinity pool.',
    gallery_urls: gallery(10), hero_image_url: IMG.properties[12], starting_price: 5500000, price_per_sqft: 5500,
    bhk_config: '3, 4 BHK', website_category: 'luxury', is_featured: false, is_active: true,
    rera_number: 'RAJ/RERA/P/2025/000222', rera_registration_date: '2025-02-15', total_units: 64,
    expected_completion_date: '2028-12-31', amenities: ['Infinity Pool', 'Sky Lounge', 'Home Automation', 'Gym', 'Yoga Deck', 'Concierge', 'EV Charging', 'Rainwater Harvesting'],
    developer_id: developers[0].id,
    usp: ['Rooftop infinity pool', 'Smart home enabled', 'Limited 64 units'],
    connectivity: [{ place: 'Shastri Nagar Market', distance: '0.5 km' }, { place: 'Jodhpur Airport', distance: '8 km' }, { place: 'Clock Tower', distance: '3 km' }],
    faqs: [],
  },

  // ── UDAIPUR (3 projects) ────────────────────────────────────────────────
  {
    id: uid(), name: 'ANON Lake View Residency',  type: 'apartment',          city: 'Udaipur',   locality: 'Fatehsagar Road',
    status: 'under_construction', description: 'Premium lakeside apartments near Fateh Sagar Lake. Wake up to stunning lake views every morning. Udaipur\'s most coveted residential address.',
    gallery_urls: gallery(5), hero_image_url: IMG.properties[4], starting_price: 6500000, price_per_sqft: 6200,
    bhk_config: '2, 3, 4 BHK', website_category: 'luxury', is_featured: true, is_active: true,
    rera_number: 'RAJ/RERA/P/2024/005678', rera_registration_date: '2024-07-01', total_units: 48,
    expected_completion_date: '2027-09-30', amenities: ['Lake View', 'Infinity Pool', 'Gym', 'Spa', 'Club House', 'Concierge', 'Valet Parking', 'Landscaped Garden', 'Yoga Room'],
    developer_id: developers[0].id,
    usp: ['Direct Fateh Sagar Lake views', 'Only 48 exclusive units', 'Vastu compliant'],
    connectivity: [{ place: 'Fateh Sagar Lake', distance: '200m' }, { place: 'Udaipur City Palace', distance: '4 km' }, { place: 'Udaipur Airport', distance: '22 km' }],
    faqs: [],
  },
  {
    id: uid(), name: 'ANON Mewar Enclave',        type: 'plotted_development', city: 'Udaipur',   locality: 'Hiran Magri',
    status: 'ready_to_move', description: 'Well-planned residential plots in the prime Hiran Magri sector. Fully developed with wide roads, gardens, and gated security. Perfect for building your dream home in the City of Lakes.',
    gallery_urls: gallery(7), hero_image_url: IMG.properties[6], starting_price: 3200000, price_per_sqft: 4200,
    bhk_config: 'NA (Plots)', website_category: 'residential', is_featured: false, is_active: true,
    rera_number: 'RAJ/RERA/P/2023/007890', rera_registration_date: '2023-11-15', total_units: 100,
    expected_completion_date: '2025-06-30', amenities: ['Gated Community', 'Garden', 'Club House', 'Children Play Area', 'Walking Path', 'Street Lights', 'Underground Wiring'],
    developer_id: developers[1].id,
    usp: ['Prime Hiran Magri location', 'Ready for construction', '80% already sold'],
    connectivity: [{ place: 'Hiran Magri Market', distance: '1 km' }, { place: 'Celebration Mall', distance: '3 km' }, { place: 'Railway Station', distance: '6 km' }],
    faqs: [],
  },
  {
    id: uid(), name: 'ANON Royal Retreat',        type: 'villa',              city: 'Udaipur',   locality: 'Badi Lake Road',
    status: 'pre_launch', description: 'Ultra-luxury villas near Badi Lake with private pools and panoramic Aravalli mountain views. A second-home retreat for discerning buyers seeking Udaipur\'s finest.',
    gallery_urls: gallery(11), hero_image_url: IMG.properties[13], starting_price: 25000000, price_per_sqft: 12000,
    bhk_config: '4, 5 BHK', website_category: 'luxury', is_featured: true, is_active: true,
    rera_number: 'RAJ/RERA/P/2025/000333', rera_registration_date: '2025-03-01', total_units: 18,
    expected_completion_date: '2029-03-31', amenities: ['Private Pool', 'Mountain View', 'Wine Cellar', 'Home Theatre', 'Butler Service', 'Helipad', 'Organic Farm', 'Spa', 'Horse Riding'],
    developer_id: developers[0].id,
    usp: ['Only 18 ultra-luxury villas', 'Private pool in every villa', 'Aravalli mountain views'],
    connectivity: [{ place: 'Badi Lake', distance: '1 km' }, { place: 'Udaipur City', distance: '12 km' }, { place: 'Airport', distance: '30 km' }],
    faqs: [],
  },

  // ── KOTA (2 projects) ──────────────────────────────────────────────────
  {
    id: uid(), name: 'ANON Chambal Gardens',      type: 'plotted_development', city: 'Kota',      locality: 'Kunhari',
    status: 'under_construction', description: 'Affordable residential plots near Kota\'s education hub. Ideal for parents of students and investors looking at Kota\'s booming real estate market.',
    gallery_urls: gallery(9), hero_image_url: IMG.properties[8], starting_price: 900000, price_per_sqft: 2200,
    bhk_config: 'NA (Plots)', website_category: 'residential', is_featured: false, is_active: true,
    rera_number: 'RAJ/RERA/P/2024/006789', rera_registration_date: '2024-08-20', total_units: 300,
    expected_completion_date: '2026-12-31', amenities: ['Park', 'Temple', 'Community Center', 'Street Lights', 'Water Supply', 'Drainage'],
    developer_id: developers[1].id,
    usp: ['Near coaching institutes hub', 'Starting ₹9 Lakh only', 'High rental demand'],
    connectivity: [{ place: 'Allen/Resonance Institutes', distance: '3 km' }, { place: 'Kota Junction', distance: '8 km' }, { place: 'Chambal Garden', distance: '5 km' }],
    faqs: [],
  },
  {
    id: uid(), name: 'ANON Student Heights',      type: 'apartment',          city: 'Kota',      locality: 'Mahaveer Nagar',
    status: 'ready_to_move', description: 'Compact studio and 1 BHK apartments designed for Kota\'s student community and young professionals. Fully furnished options available. High rental yield investment.',
    gallery_urls: gallery(12), hero_image_url: IMG.properties[10], starting_price: 1800000, price_per_sqft: 3800,
    bhk_config: 'Studio, 1, 2 BHK', website_category: 'residential', is_featured: false, is_active: true,
    rera_number: 'RAJ/RERA/P/2023/008901', rera_registration_date: '2023-12-01', total_units: 150,
    expected_completion_date: '2025-02-28', amenities: ['Furnished Units', 'Study Lounge', 'Gym', 'Cafeteria', 'Wi-Fi Enabled', 'Laundry', 'CCTV', 'Power Backup'],
    developer_id: developers[1].id,
    usp: ['8-10% rental yield', 'Ready to move', 'Near coaching centers'],
    connectivity: [{ place: 'Mahaveer Nagar Market', distance: '0.5 km' }, { place: 'Coaching Hub', distance: '2 km' }, { place: 'Railway Station', distance: '5 km' }],
    faqs: [],
  },

  // ── AJMER (2 projects) ─────────────────────────────────────────────────
  {
    id: uid(), name: 'ANON Pushkar View',         type: 'plotted_development', city: 'Ajmer',     locality: 'Pushkar Road',
    status: 'under_construction', description: 'Scenic residential plots on the Ajmer-Pushkar highway corridor. Beautiful Aravalli backdrop with modern amenities. Growing investment corridor.',
    gallery_urls: gallery(14), hero_image_url: IMG.properties[14], starting_price: 1500000, price_per_sqft: 2600,
    bhk_config: 'NA (Plots)', website_category: 'residential', is_featured: false, is_active: true,
    rera_number: 'RAJ/RERA/P/2024/009012', rera_registration_date: '2024-09-15', total_units: 200,
    expected_completion_date: '2027-03-31', amenities: ['Gated Community', 'Mountain View', 'Park', 'Temple', 'Club House', 'Wide Roads'],
    developer_id: developers[1].id,
    usp: ['Aravalli mountain backdrop', 'Ajmer-Pushkar corridor growth', 'Highway connectivity'],
    connectivity: [{ place: 'Ajmer Railway Station', distance: '8 km' }, { place: 'Pushkar', distance: '10 km' }, { place: 'Dargah Sharif', distance: '6 km' }],
    faqs: [],
  },
  {
    id: uid(), name: 'ANON Silver Oak Residency', type: 'apartment',          city: 'Ajmer',     locality: 'Beawar Road',
    status: 'pre_launch', description: 'Upcoming premium apartment complex on Beawar Road. Smart-home enabled flats with rooftop garden and community spaces.',
    gallery_urls: gallery(0, 5), hero_image_url: IMG.properties[15], starting_price: 3200000, price_per_sqft: 4000,
    bhk_config: '2, 3 BHK', website_category: 'residential', is_featured: false, is_active: true,
    rera_number: 'RAJ/RERA/P/2025/000444', rera_registration_date: '2025-04-01', total_units: 72,
    expected_completion_date: '2028-09-30', amenities: ['Smart Home', 'Rooftop Garden', 'Gym', 'Community Hall', 'EV Charging', 'Power Backup', 'Rainwater Harvesting'],
    developer_id: developers[0].id,
    usp: ['Smart home standard', 'Rooftop infinity garden', 'Solar-powered common areas'],
    connectivity: [{ place: 'Beawar Road', distance: 'On main road' }, { place: 'Ajmer City Centre', distance: '5 km' }, { place: 'NH-8', distance: '3 km' }],
    faqs: [],
  },

  // ── JAISALMER (1 project) ──────────────────────────────────────────────
  {
    id: uid(), name: 'ANON Golden Sands',         type: 'plotted_development', city: 'Jaisalmer', locality: 'Sam Road',
    status: 'under_construction', description: 'Desert-themed luxury plotted development near Sam Sand Dunes. Perfect for resort homes and Airbnb investments. Unique opportunity in India\'s Golden City.',
    gallery_urls: gallery(6, 5), hero_image_url: IMG.properties[7], starting_price: 2200000, price_per_sqft: 3000,
    bhk_config: 'NA (Plots)', website_category: 'luxury', is_featured: false, is_active: true,
    rera_number: 'RAJ/RERA/P/2024/010123', rera_registration_date: '2024-11-01', total_units: 50,
    expected_completion_date: '2027-06-30', amenities: ['Desert View', 'Camel Safari Access', 'Resort Club House', 'Infinity Pool', 'Amphitheatre', 'Bonfire Area', 'Wi-Fi Campus'],
    developer_id: developers[0].id,
    usp: ['Airbnb-ready investment', 'Near Sam Sand Dunes', 'Desert luxury living'],
    connectivity: [{ place: 'Sam Sand Dunes', distance: '5 km' }, { place: 'Jaisalmer Fort', distance: '40 km' }, { place: 'Jaisalmer Airport', distance: '35 km' }],
    faqs: [],
  },

  // ── DELHI NCR (2 projects) ─────────────────────────────────────────────
  {
    id: uid(), name: 'ANON Metro Square',         type: 'commercial',         city: 'Delhi NCR', locality: 'Dwarka Expressway',
    status: 'under_construction', description: 'Premium commercial spaces on Dwarka Expressway. IT offices, co-working spaces, and retail in Delhi NCR\'s hottest commercial corridor.',
    gallery_urls: gallery(1, 5), hero_image_url: IMG.properties[1], starting_price: 12000000, price_per_sqft: 9500,
    bhk_config: 'Office / Retail', website_category: 'commercial', is_featured: true, is_active: true,
    rera_number: 'HARERA/GGM/2024/001234', rera_registration_date: '2024-05-15', total_units: 120,
    expected_completion_date: '2027-12-31', amenities: ['Central AC', 'Foodcourt', 'Conference Center', 'EV Charging', 'Helipad', 'High-Speed Elevators', '24/7 Security', 'Multi-level Parking'],
    developer_id: developers[3].id,
    usp: ['Dwarka Expressway frontage', 'Metro-connected', 'Pre-leased options'],
    connectivity: [{ place: 'Dwarka Expressway', distance: 'On main road' }, { place: 'IGI Airport', distance: '20 km' }, { place: 'Cyber City Gurugram', distance: '15 km' }],
    faqs: [],
  },
  {
    id: uid(), name: 'ANON Green Valley',         type: 'villa',              city: 'Delhi NCR', locality: 'Sohna Road',
    status: 'pre_launch', description: 'Eco-luxury villas on Sohna Road with private gardens, solar rooftops, and smart home technology. Sustainable living meets premium comfort.',
    gallery_urls: gallery(11, 5), hero_image_url: IMG.properties[13], starting_price: 18000000, price_per_sqft: 10000,
    bhk_config: '3, 4, 5 BHK', website_category: 'luxury', is_featured: false, is_active: true,
    rera_number: 'HARERA/GGM/2025/000555', rera_registration_date: '2025-01-20', total_units: 40,
    expected_completion_date: '2028-12-31', amenities: ['Solar Rooftop', 'Private Garden', 'Smart Home', 'EV Charging', 'Organic Farm', 'Infinity Pool', 'Club House', 'Tennis Court', 'Walking Trails'],
    developer_id: developers[3].id,
    usp: ['100% solar-powered villas', 'Sohna Road connectivity', 'IGBC Green certified'],
    connectivity: [{ place: 'Sohna Road', distance: '0.5 km' }, { place: 'Golf Course Extension', distance: '8 km' }, { place: 'Rajiv Chowk', distance: '25 km' }],
    faqs: [],
  },

  // ── GURUGRAM (2 projects) ──────────────────────────────────────────────
  {
    id: uid(), name: 'ANON Millennium Tower',     type: 'apartment',          city: 'Gurugram',  locality: 'Golf Course Road',
    status: 'under_construction', description: 'Ultra-premium high-rise apartments on Golf Course Road. 40-storey tower with floor-to-ceiling glass, branded residences, and 5-star amenities.',
    gallery_urls: gallery(2, 5), hero_image_url: IMG.properties[2], starting_price: 35000000, price_per_sqft: 18000,
    bhk_config: '3, 4 BHK', website_category: 'luxury', is_featured: true, is_active: true,
    rera_number: 'HARERA/GGM/2024/002345', rera_registration_date: '2024-06-01', total_units: 160,
    expected_completion_date: '2028-06-30', amenities: ['Infinity Pool', 'Sky Lounge', 'Concierge', 'Valet Parking', 'Private Cinema', 'Wine Bar', 'Spa', 'Business Center', 'Helipad'],
    developer_id: developers[3].id,
    usp: ['Golf Course Road address', '40-storey iconic tower', 'Branded residences'],
    connectivity: [{ place: 'Golf Course Road', distance: 'On main road' }, { place: 'Cyber Hub', distance: '3 km' }, { place: 'IGI Airport', distance: '18 km' }],
    faqs: [],
  },
  {
    id: uid(), name: 'ANON Cyber Plaza',          type: 'commercial',         city: 'Gurugram',  locality: 'Sector 62',
    status: 'ready_to_move', description: 'Fully operational commercial complex in Sector 62. Grade-A office spaces near upcoming metro. Ideal for corporates and startups.',
    gallery_urls: gallery(4, 5), hero_image_url: IMG.properties[11], starting_price: 7500000, price_per_sqft: 8500,
    bhk_config: 'Office / Co-working', website_category: 'commercial', is_featured: false, is_active: true,
    rera_number: 'HARERA/GGM/2023/009012', rera_registration_date: '2023-09-20', total_units: 200,
    expected_completion_date: '2025-01-31', amenities: ['Grade-A AC', 'Co-working Spaces', 'Cafeteria', 'Multi-level Parking', 'Power Backup', '24/7 Security', 'Conference Rooms', 'ATM'],
    developer_id: developers[5].id,
    usp: ['OC received', '85% occupancy', 'Near proposed metro station'],
    connectivity: [{ place: 'Sector 62 Main Road', distance: '0.5 km' }, { place: 'SPR Road', distance: '2 km' }, { place: 'HUDA City Centre Metro', distance: '10 km' }],
    faqs: [],
  },

  // ── BHILWARA (1 project) ───────────────────────────────────────────────
  {
    id: uid(), name: 'ANON Textile City Plots',   type: 'plotted_development', city: 'Bhilwara',  locality: 'Gangapur Road',
    status: 'under_construction', description: 'Well-planned residential and commercial plots near Bhilwara\'s textile industrial area. Ideal for business owners and investors in Rajasthan\'s textile capital.',
    gallery_urls: gallery(13), hero_image_url: IMG.properties[14], starting_price: 800000, price_per_sqft: 1800,
    bhk_config: 'NA (Plots)', website_category: 'residential', is_featured: false, is_active: true,
    rera_number: 'RAJ/RERA/P/2024/011234', rera_registration_date: '2024-10-10', total_units: 350,
    expected_completion_date: '2027-03-31', amenities: ['Park', 'Temple', 'Community Center', 'Wide Roads', 'Water Tank', 'Street Lights'],
    developer_id: developers[1].id,
    usp: ['Starting ₹8 Lakh', 'Near textile hub', 'Great rental potential'],
    connectivity: [{ place: 'Gangapur Road', distance: '0.5 km' }, { place: 'Bhilwara City', distance: '5 km' }, { place: 'Textile RIICO Area', distance: '3 km' }],
    faqs: [],
  },

  // ── ALWAR (1 project) ─────────────────────────────────────────────────
  {
    id: uid(), name: 'ANON Tiger Trail Villas',   type: 'villa',              city: 'Alwar',     locality: 'Sariska Road',
    status: 'pre_launch', description: 'Nature villas near Sariska Tiger Reserve. Weekend getaway homes surrounded by Aravalli forests. Ideal for eco-tourism and nature lovers.',
    gallery_urls: gallery(5, 5), hero_image_url: IMG.properties[5], starting_price: 8500000, price_per_sqft: 5500,
    bhk_config: '2, 3 BHK', website_category: 'luxury', is_featured: false, is_active: true,
    rera_number: 'RAJ/RERA/P/2025/000666', rera_registration_date: '2025-05-01', total_units: 24,
    expected_completion_date: '2028-06-30', amenities: ['Forest View', 'Private Garden', 'Nature Trail', 'Bird Watching Deck', 'Organic Kitchen', 'Bonfire Area', 'Cycling Track'],
    developer_id: developers[4].id,
    usp: ['Adjacent to Sariska Reserve', 'Only 24 villas', 'Eco-certified construction'],
    connectivity: [{ place: 'Sariska Tiger Reserve', distance: '2 km' }, { place: 'Alwar City', distance: '35 km' }, { place: 'Jaipur', distance: '110 km' }],
    faqs: [],
  },

  // ── SIKAR (1 project) ─────────────────────────────────────────────────
  {
    id: uid(), name: 'ANON Shekhawati Greens',    type: 'plotted_development', city: 'Sikar',     locality: 'Jaipur Road',
    status: 'under_construction', description: 'Affordable residential plots on Sikar-Jaipur highway. Growing city with strong connectivity to Jaipur. Ideal first investment for young professionals.',
    gallery_urls: gallery(8, 4), hero_image_url: IMG.properties[9], starting_price: 600000, price_per_sqft: 1500,
    bhk_config: 'NA (Plots)', website_category: 'residential', is_featured: false, is_active: true,
    rera_number: 'RAJ/RERA/P/2024/012345', rera_registration_date: '2024-12-01', total_units: 400,
    expected_completion_date: '2027-06-30', amenities: ['Park', 'Boundary Wall', 'Street Lights', 'Water Supply', 'Temple'],
    developer_id: developers[1].id,
    usp: ['Starting ₹6 Lakh', 'Jaipur highway location', 'Fastest growing Tier-3 city'],
    connectivity: [{ place: 'Jaipur-Sikar Highway', distance: '0.5 km' }, { place: 'Sikar City', distance: '3 km' }, { place: 'Jaipur', distance: '100 km' }],
    faqs: [],
  },
]

// ── Testimonials (with photos) ──────────────────────────────────────────────
const testimonials = [
  { id: uid(), client_name: 'Ramesh Kumar',     project: 'ANON Royal Greens',      content: 'We invested in a plot at Royal Greens 2 years ago and the value has already doubled. The development is exactly as promised — wide roads, beautiful park, and gated security. ANON INDIA kept every promise.', rating: 5, photo_url: IMG.team[0], is_active: true, sort_order: 1 },
  { id: uid(), client_name: 'Sunita Devi',      project: 'ANON City Heights',      content: 'Moving into City Heights was the best decision for my family. The apartment is spacious, well-ventilated, and the metro is just a 5-minute walk. The ANON team helped us through every step of the paperwork.', rating: 5, photo_url: IMG.team[4], is_active: true, sort_order: 2 },
  { id: uid(), client_name: 'Dr. Anil Mathur',  project: 'ANON Lake View Residency', content: 'As an NRI investor, I was initially skeptical. But ANON INDIA\'s transparency and regular video updates won me over. My Lake View apartment is coming along beautifully — the Fateh Sagar views are breathtaking.', rating: 5, photo_url: IMG.team[2], is_active: true, sort_order: 3 },
  { id: uid(), client_name: 'Pooja Sharma',     project: 'ANON Desert Palm',       content: 'We bought a plot in Jodhpur as a weekend getaway investment. The legal process was incredibly smooth — clear titles, RERA registered, and ANON even helped with the loan. Highly recommended!', rating: 4, photo_url: IMG.team[5], is_active: true, sort_order: 4 },
  { id: uid(), client_name: 'Mohit Jain',       project: 'ANON Business Park',     content: 'I invested in a commercial unit at Business Park for rental income. The location on Tonk Road is fantastic, and ANON has already signed anchor tenants. Getting 10% yield in the first year.', rating: 5, photo_url: IMG.team[3], is_active: true, sort_order: 5 },
  { id: uid(), client_name: 'Nandini Rathore',  project: 'ANON Mewar Enclave',     content: 'My father always wanted a plot in Udaipur. ANON Mewar Enclave made that dream come true. The location in Hiran Magri is perfect, and the development quality is top-notch. We\'re building our retirement home here.', rating: 5, photo_url: IMG.team[6], is_active: true, sort_order: 6 },
  { id: uid(), client_name: 'Raj Singhania',    project: 'ANON Metro Square',      content: 'The commercial space I bought in Delhi NCR has been a great investment. ANON\'s team is professional, responsive, and truly understands the market. Would invest with them again without hesitation.', rating: 4, photo_url: IMG.team[8], is_active: true, sort_order: 7 },
  { id: uid(), client_name: 'Kavya Agarwal',    project: 'ANON Sunrise Plots',     content: 'As a first-time investor, ANON made the whole experience stress-free. They explained RERA, documentation, and even helped me compare options within my budget. Bought my first plot at just ₹12 Lakh!', rating: 5, photo_url: IMG.team[10], is_active: true, sort_order: 8 },
]

// ── Blog posts ──────────────────────────────────────────────────────────────
const blogPosts = [
  {
    id: uid(), title: '10 Things to Check Before Buying a Plot in Rajasthan', slug: '10-things-check-before-buying-plot-rajasthan',
    excerpt: 'Essential checklist for first-time plot buyers — from RERA verification to land title due diligence.',
    content: `<h2>Why Due Diligence Matters</h2><p>Buying a plot in Rajasthan can be one of the most rewarding investments of your lifetime. But without proper checks, it can also be risky. Here are 10 essential things every buyer must verify before signing on the dotted line.</p><h3>1. RERA Registration</h3><p>Always verify the project's RERA registration on rera.rajasthan.gov.in. A valid RERA number means the project has been approved by the regulatory authority.</p><h3>2. Clear Land Title</h3><p>Ensure the land has a clear title with no encumbrances, disputes, or mortgages. Ask for the title deed and get it verified by a lawyer.</p><h3>3. Approved Layout Plan</h3><p>Check if the layout is approved by JDA, UIT, or the relevant development authority. Unapproved layouts can face demolition orders.</p><h3>4. Encumbrance Certificate</h3><p>Get a 30-year encumbrance certificate from the sub-registrar office. This confirms no legal liabilities on the property.</p><h3>5. Infrastructure Development</h3><p>Visit the site to check road quality, drainage, electricity connections, and water supply. Don't rely on brochure images alone.</p><h3>6. Location Connectivity</h3><p>Check proximity to highways, schools, hospitals, and markets. Good connectivity ensures both living comfort and investment appreciation.</p><h3>7. Builder Track Record</h3><p>Research the developer's past projects, delivery timelines, and customer reviews. A proven track record reduces risk significantly.</p><h3>8. Payment Plan & Hidden Costs</h3><p>Understand the complete cost breakdown — registration charges, GST, maintenance deposits, and any other fees. Avoid developers who are vague about costs.</p><h3>9. Possession Timeline</h3><p>Get the possession timeline in writing and verify it against the RERA commitment. Delayed possession is the most common complaint in Indian real estate.</p><h3>10. Legal Opinion</h3><p>Always get an independent legal opinion before making payment. A ₹5,000 legal consultation can save you from a ₹50 lakh mistake.</p>`,
    featured_image_url: IMG.blog[0], category: 'investment', tags: ['buying guide', 'plots', 'rajasthan', 'RERA'],
    is_published: true, published_at: '2025-01-15T10:00:00Z', view_count: 1250,
  },
  {
    id: uid(), title: 'RERA Rajasthan: A Complete Guide for Home Buyers in 2025', slug: 'rera-rajasthan-complete-guide-2025',
    excerpt: 'Everything you need to know about RERA regulations in Rajasthan — your rights, how to file complaints, and why it matters.',
    content: `<h2>What is RERA?</h2><p>The Real Estate (Regulation and Development) Act, 2016 was enacted to protect home buyers and bring transparency to the real estate sector. Rajasthan was among the first states to implement RERA.</p><h3>Key Protections for Buyers</h3><p>Under RERA, developers must: register all projects above 500 sq.m, deposit 70% of collections in an escrow account, provide quarterly project updates, and deliver possession on time or pay interest penalties.</p><h3>How to Verify a Project</h3><p>Visit rera.rajasthan.gov.in and search by project name or RERA number. You can see the approved layout, completion timeline, and developer details.</p><h3>Filing a Complaint</h3><p>If a developer violates RERA norms, you can file a complaint online at the RERA portal. The authority must resolve it within 60 days.</p>`,
    featured_image_url: IMG.blog[1], category: 'legal', tags: ['RERA', 'legal', 'buyer rights', '2025'],
    is_published: true, published_at: '2025-02-20T10:00:00Z', view_count: 890,
  },
  {
    id: uid(), title: 'Top 5 Emerging Real Estate Corridors in Jaipur 2025', slug: 'top-5-emerging-corridors-jaipur-2025',
    excerpt: 'Discover the fastest-growing investment corridors in Jaipur — from Ajmer Road to Kalwar Road.',
    content: `<h2>Jaipur's Real Estate Boom</h2><p>Jaipur's real estate market is experiencing unprecedented growth, driven by the metro expansion, ring road development, and influx of IT companies. Here are the top 5 corridors where smart investors are putting their money.</p><h3>1. Ajmer Road</h3><p>The Ajmer Road corridor has seen 40% price appreciation in the last 3 years, thanks to the upcoming metro line and proximity to the airport.</p><h3>2. Kalwar Road</h3><p>Affordable plots starting from ₹10 Lakh make Kalwar Road the most accessible investment corridor for first-time buyers.</p><h3>3. Tonk Road</h3><p>Jaipur's premier commercial corridor continues to attract IT/ITES companies and retail brands.</p><h3>4. Mansarovar Extension</h3><p>With the metro already operational, Mansarovar Extension offers the best of both worlds — connectivity and green living.</p><h3>5. Vaishali Nagar</h3><p>Established locality seeing luxury villa and premium apartment developments for high-net-worth buyers.</p>`,
    featured_image_url: IMG.blog[2], category: 'market', tags: ['Jaipur', 'investment', 'market trends', 'corridors'],
    is_published: true, published_at: '2025-03-10T10:00:00Z', view_count: 1580,
  },
  {
    id: uid(), title: 'Plotted Development vs. Apartment: Which is Right for You?', slug: 'plotted-development-vs-apartment-guide',
    excerpt: 'A detailed comparison to help you decide between buying a plot or an apartment in Rajasthan.',
    content: `<h2>The Great Debate</h2><p>One of the most common questions we get from first-time buyers: should I buy a plot or an apartment? The answer depends on your goals, budget, and timeline.</p><h3>Plotted Development</h3><p><strong>Pros:</strong> Higher appreciation (land always appreciates), freedom to build your dream home, lower maintenance costs, no depreciation.</p><p><strong>Cons:</strong> No immediate rental income, construction hassle, may need to wait for infrastructure development.</p><h3>Apartment</h3><p><strong>Pros:</strong> Ready to move or quick possession, immediate rental income, shared amenities (gym, pool, security), low maintenance effort.</p><p><strong>Cons:</strong> Depreciating asset (building ages), monthly maintenance charges, limited customization, strata issues.</p><h3>Our Recommendation</h3><p>For long-term wealth creation (5+ years), plotted developments typically outperform apartments by 2-3x in appreciation. For immediate use or rental income, apartments are the practical choice.</p>`,
    featured_image_url: IMG.blog[3], category: 'investment', tags: ['plots', 'apartments', 'comparison', 'guide'],
    is_published: true, published_at: '2025-04-05T10:00:00Z', view_count: 2100,
  },
  {
    id: uid(), title: 'How to Calculate ROI on Real Estate Investment in India', slug: 'calculate-roi-real-estate-india',
    excerpt: 'Learn to evaluate real estate returns like a pro — rental yield, capital appreciation, and total ROI calculation.',
    content: `<h2>Understanding Real Estate ROI</h2><p>Real estate ROI in India comes from two sources: rental yield and capital appreciation. Here's how to calculate both and make informed investment decisions.</p><h3>Rental Yield</h3><p>Annual Rental Yield = (Annual Rent / Purchase Price) × 100. In Indian metros, residential rental yields range from 2-4%, while commercial properties can yield 6-10%.</p><h3>Capital Appreciation</h3><p>Track the historical price growth of the area over 3-5 years. Emerging corridors in Rajasthan have shown 15-25% annual appreciation.</p><h3>Total ROI Formula</h3><p>Total ROI = [(Current Value - Purchase Price + Total Rent Received) / Purchase Price] × 100. Always account for registration costs, stamp duty, and maintenance expenses.</p>`,
    featured_image_url: IMG.blog[4], category: 'investment', tags: ['ROI', 'calculation', 'investment', 'rental yield'],
    is_published: true, published_at: '2025-05-12T10:00:00Z', view_count: 1750,
  },
  {
    id: uid(), title: 'NRI Guide: Investing in Rajasthan Real Estate from Abroad', slug: 'nri-guide-rajasthan-real-estate-investment',
    excerpt: 'Complete guide for NRIs looking to invest in Rajasthan — legal requirements, taxation, and how ANON INDIA helps.',
    content: `<h2>Why NRIs Are Investing in Rajasthan</h2><p>Rajasthan's real estate offers NRIs an attractive combination of affordable prices, high appreciation potential, and cultural connection. Here's everything you need to know.</p><h3>Legal Framework</h3><p>NRIs can freely purchase residential and commercial property in India under FEMA regulations. Agricultural land purchase requires RBI approval.</p><h3>Documentation Required</h3><p>Valid passport, PAN card, NRE/NRO bank account details, and power of attorney (if buying remotely). ANON INDIA assists with all documentation.</p><h3>Tax Implications</h3><p>Long-term capital gains (after 2 years for property) are taxed at 20% with indexation benefit. Rental income is taxed at applicable slab rates. DTAA benefits available for many countries.</p><h3>How ANON INDIA Helps NRIs</h3><p>We offer: video tours of properties, legal documentation support, power of attorney facilitation, and post-purchase property management services.</p>`,
    featured_image_url: IMG.blog[5], category: 'investment', tags: ['NRI', 'guide', 'Rajasthan', 'FEMA'],
    is_published: true, published_at: '2025-06-01T10:00:00Z', view_count: 980,
  },
]

// ── Career listings ─────────────────────────────────────────────────────────
const careers = [
  { id: uid(), title: 'Senior Property Advisor',    department: 'Sales',        employment_type: 'full_time', location: 'Jaipur',   description: 'We\'re looking for an experienced property advisor to join our growing team. You\'ll guide clients through their property purchase journey, from first consultation to final handover.', requirements: '3+ years in real estate sales, excellent communication skills, knowledge of Jaipur market, valid driving license.', is_active: true },
  { id: uid(), title: 'Digital Marketing Executive', department: 'Marketing',    employment_type: 'full_time', location: 'Jaipur',   description: 'Manage our digital presence across social media, Google Ads, and content marketing. Drive lead generation and brand awareness.', requirements: '2+ years in digital marketing, experience with Meta Ads and Google Ads, portfolio required.', is_active: true },
  { id: uid(), title: 'Site Engineer',               department: 'Construction', employment_type: 'full_time', location: 'Jodhpur',  description: 'Supervise construction activities at our Jodhpur projects. Ensure quality, safety, and timeline adherence.', requirements: 'B.E./B.Tech in Civil Engineering, 2+ years site experience, knowledge of RCC and finishing work.', is_active: true },
  { id: uid(), title: 'Interior Designer',           department: 'Design',       employment_type: 'full_time', location: 'Jaipur',   description: 'Design interiors for model apartments, sales offices, and client homes. Blend Rajasthani heritage with modern aesthetics.', requirements: 'Degree in Interior Design, proficiency in AutoCAD and 3D rendering, 2+ years experience.', is_active: true },
  { id: uid(), title: 'Legal Associate – RERA',      department: 'Legal',        employment_type: 'full_time', location: 'Jaipur',   description: 'Handle RERA registrations, land title verifications, and legal documentation for all projects. Ensure compliance with all regulatory requirements.', requirements: 'LLB/LLM, 3+ years in real estate law, knowledge of RERA Act and Rajasthan land laws.', is_active: true },
  { id: uid(), title: 'Marketing Intern',            department: 'Marketing',    employment_type: 'internship', location: 'Jaipur',  description: 'Join our marketing team for a 6-month internship. Learn real estate marketing, content creation, and campaign management.', requirements: 'Currently pursuing or recently completed MBA/BBA in Marketing. Strong writing skills.', is_active: true },
]

// ── Seed execution ──────────────────────────────────────────────────────────
async function seed() {
  console.log('🌱 Seeding ANON INDIA database…\n')

  // Clean existing data (order matters for FK constraints)
  console.log('🧹 Cleaning existing data…')
  for (const table of ['testimonials', 'career_listings', 'blog_posts', 'plots', 'projects', 'team_members', 'developers']) {
    const { error } = await sb.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (error) console.warn(`  ⚠ ${table}: ${error.message}`)
    else console.log(`  ✓ ${table} cleared`)
  }

  // Insert developers
  console.log('\n📦 Inserting developers…')
  const { error: devErr } = await sb.from('developers').insert(developers)
  if (devErr) console.error('  ✗', devErr.message)
  else console.log(`  ✓ ${developers.length} developers`)

  // Insert team members
  console.log('👥 Inserting team members…')
  const { error: teamErr } = await sb.from('team_members').insert(team)
  if (teamErr) console.error('  ✗', teamErr.message)
  else console.log(`  ✓ ${team.length} team members (with profile images)`)

  // Insert projects
  console.log('🏗️ Inserting projects…')
  const { error: projErr } = await sb.from('projects').insert(projects)
  if (projErr) console.error('  ✗', projErr.message)
  else console.log(`  ✓ ${projects.length} projects across ${new Set(projects.map(p => p.city)).size} cities`)

  // Insert testimonials
  console.log('💬 Inserting testimonials…')
  const { error: testErr } = await sb.from('testimonials').insert(testimonials)
  if (testErr) console.error('  ✗', testErr.message)
  else console.log(`  ✓ ${testimonials.length} testimonials (with photos)`)

  // Insert blog posts
  console.log('📝 Inserting blog posts…')
  const { error: blogErr } = await sb.from('blog_posts').insert(blogPosts)
  if (blogErr) console.error('  ✗', blogErr.message)
  else console.log(`  ✓ ${blogPosts.length} blog posts`)

  // Insert career listings
  console.log('💼 Inserting career listings…')
  const { error: carErr } = await sb.from('career_listings').insert(careers)
  if (carErr) console.error('  ✗', carErr.message)
  else console.log(`  ✓ ${careers.length} career listings`)

  // Summary
  console.log('\n' + '═'.repeat(60))
  console.log('✅ Seeding complete!\n')
  console.log('📊 Summary:')
  console.log(`   • ${developers.length} developers`)
  console.log(`   • ${team.length} team members with profile images`)
  console.log(`   • ${projects.length} projects across ${new Set(projects.map(p => p.city)).size} cities`)
  console.log(`     Cities: ${[...new Set(projects.map(p => p.city))].join(', ')}`)
  console.log(`   • ${testimonials.length} testimonials with photos`)
  console.log(`   • ${blogPosts.length} blog posts`)
  console.log(`   • ${careers.length} career listings`)
  console.log('\n🚀 Restart your dev server to see the changes: npm run dev')
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
