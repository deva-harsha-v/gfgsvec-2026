export interface StatItem {
  value: string;
  label: string;
  subtext?: string;
}

export interface CollegeMetadata {
  name: string;
  shortName: string;
  established: string;
  affiliation: string;
  accreditation: string;
  logoUrl: string;
  address: string;
  phone: string;
  email: string;
  admissionsContact: string;
  placementsContact: string;
  mapEmbedUrl: string;
  socials: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    youtube: string;
  };
}

export const COLLEGE_METADATA: CollegeMetadata = {
  name: 'Sri Vasavi Engineering College',
  shortName: 'SVEC',
  established: '2001',
  affiliation: 'Permanently Affiliated to JNTUK, Kakinada & Approved by AICTE, New Delhi',
  accreditation: 'Accredited by NAAC with \'A\' Grade, NBA Accredited B.Tech Programs (CSE, ECE, EEE, ME)',
  logoUrl: '/logo.svg', // We can style/use the existing logo.svg or customize it
  address: '[COLLEGE_ADDRESS]',
  phone: '[OFFICIAL_PHONE]',
  email: '[OFFICIAL_EMAIL]',
  admissionsContact: '[ADMISSIONS_CONTACT]',
  placementsContact: '[PLACEMENTS_CONTACT]',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3822.428784114407!2d81.4729112148157!3d16.829107988418047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37e4d8fb851e39%3A0x6a05e263d5964f43!2sSri%20Vasavi%20Engineering%20College!5e0!3m2!1sen!2sin!4v1629876543210!5m2!1sen!2sin',
  socials: {
    facebook: '[FACEBOOK_URL]',
    twitter: '[TWITTER_URL]',
    linkedin: '[LINKEDIN_URL]',
    instagram: '[INSTAGRAM_URL]',
    youtube: '[YOUTUBE_URL]',
  }
};

export const COLLEGE_VISION = 'To be a premier technological institute striving for excellence with global perspective and societal commitment.';

export const COLLEGE_MISSION = [
  'To impart high quality technical education by providing a conducive learning environment.',
  'To foster research, innovation, and entrepreneurial skills through industry-institute collaboration.',
  'To inculcate ethical values, professional discipline, and life-long learning skills for social and economic development.'
];

export const COLLEGE_STATS: StatItem[] = [
  { value: '[YEARS_OF_EXCELLENCE]', label: 'Years of Academic Excellence', subtext: 'Established in 2001' },
  { value: '[ACTIVE_STUDENTS]', label: 'Active Students', subtext: 'UG & PG Streams' },
  { value: '[QUALIFIED_FACULTY]', label: 'Qualified Faculty', subtext: 'Ph.D. & Post-graduates' },
  { value: '[ACADEMIC_PROGRAMS]', label: 'Academic Programs', subtext: 'B.Tech, M.Tech, MBA, Diploma' },
  { value: '[PLACEMENT_PERCENTAGE]', label: 'Average Placements', subtext: 'Consistent Track Record' },
  { value: '[HIGHEST_PACKAGE]', label: 'Highest Package Offered', subtext: 'Top Tier Product Companies' }
];

export const ADMISSIONS_INFO = {
  btech: {
    title: 'B.Tech Admissions',
    eligibility: 'Pass in 10+2 / Intermediate examination with Mathematics, Physics, and Chemistry (MPC) as optional subjects, along with a qualified rank in APEAPCET / JEE-Mains.',
    process: 'Admissions are conducted through state-level counseling (APEAPCET Category-A seats) and management quota (Category-B seats).',
  },
  mtech: {
    title: 'M.Tech Admissions',
    eligibility: 'B.E. / B.Tech or equivalent degree in the relevant discipline with a valid GATE score or qualified rank in APPGECET.',
    process: 'Admissions are conducted through APPGECET/GATE state counseling and management quota.',
  },
  mba: {
    title: 'MBA Admissions',
    eligibility: 'Any recognized Bachelor\'s Degree of minimum 3 years duration with a qualified rank in APICET.',
    process: 'Admissions are made through APICET counseling and management quota.',
  },
  documents: [
    'APEAPCET / APPGECET / APICET Rank Card & Hall Ticket',
    'SSC (10th Std) Marks memo & Pass Certificate',
    'Intermediate / 10+2 / Diploma Marks Memo',
    'Degree Certificate & Consolidated Marks Memo (for PG)',
    'Transfer Certificate (TC) & Conduct Certificate',
    'Study / Bonafide Certificates from 6th standard to Intermediate / Degree',
    'Caste / Community Certificate (for BC/SC/ST/EWS categories)',
    'Income Certificate & Ration Card (for fee reimbursement schemes)',
    'Aadhar Card photocopy (Student and Parents)',
    'Passport size photographs (4 numbers)'
  ],
  dates: [
    { event: 'APEAPCET Results Announcement', date: '[RESULTS_ANNOUNCEMENT_DATE]' },
    { event: 'AP Counseling Notification Release', date: '[COUNSELING_NOTIFICATION_DATE]' },
    { event: 'Certificate Verification Phase', date: '[CERTIFICATE_VERIFICATION_DATE]' },
    { event: 'Web Options Entry Commencement', date: '[WEB_OPTIONS_COMMENCEMENT_DATE]' },
    { event: 'Classwork Commencement (1st Year B.Tech)', date: '[CLASSWORK_COMMENCEMENT_DATE]' }
  ]
};

export const PLACEMENTS_OVERVIEW = {
  text: 'The Training and Placement (T&P) cell at Sri Vasavi Engineering College plays a vital role in identifying placement opportunities and guiding students towards high-caliber careers. The department operates year-round to facilitate training programs, corporate outreach, internships, and on-campus recruitment drives.',
  highlights: [
    'Pre-placement training in Data Structures, Algorithms, Aptitude, Soft Skills, and Mock Interviews.',
    'Dedicated placement office in Hyderabad and Chennai for corporate liaisons.',
    'Strategic partnerships with national and international recruitment bodies.',
    'Opportunities for paid internships with high conversion rates into full-time roles.'
  ],
  recruiters: [
    '[RECRUITER_1]', '[RECRUITER_2]', '[RECRUITER_3]', '[RECRUITER_4]', '[RECRUITER_5]', '[RECRUITER_6]'
  ],
  statistics: [
    { label: 'Highest Package', value: '[HIGHEST_PACKAGE]' },
    { label: 'Average Package', value: '[AVERAGE_PACKAGE]' },
    { label: 'Companies Visited', value: '[COMPANIES_VISITED]' },
    { label: 'Total Offers Issued', value: '[TOTAL_OFFERS_ISSUED]' },
    { label: 'Internship Offers', value: '[INTERNSHIP_OFFERS]' }
  ]
};
