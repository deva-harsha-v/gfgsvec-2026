export interface Club {
  id: string;
  name: string;
  category: 'TECHNICAL' | 'NON_TECHNICAL';
  description: string;
  lead: string;
  contactEmail: string;
  route?: string; // Route of the club details page, if dynamic
}

export const CLUBS: Club[] = [
  {
    id: 'gfg',
    name: 'GeeksforGeeks SVEC Student Chapter',
    category: 'TECHNICAL',
    description: 'The premium coding community of Sri Vasavi Engineering College. Organizes coding contests, algorithm hackathons, mock interviews, and training sessions in competitive programming, software development, and design.',
    lead: 'Student President & Executive Board',
    contactEmail: 'gfg_chapter@srivasaviengg.ac.in',
    route: '/clubs/gfg'
  },
  {
    id: 'gdg',
    name: 'Google Developer Groups Campus',
    category: 'TECHNICAL',
    description: 'Brings together developers interested in Google technology stacks. Hosts seminars on Firebase, Android, Google Cloud Platform, Flutter, and machine learning models.',
    lead: 'Lead Organizer',
    contactEmail: 'gdg_svec@srivasaviengg.ac.in'
  },
  {
    id: 'cultural',
    name: 'SVEC Cultural Club (Spandana)',
    category: 'NON_TECHNICAL',
    description: 'Encourages student talents in music, dance, visual arts, theater, and creative writing. Hosts the annual college fest and cultural competitive events.',
    lead: 'Faculty Coordinator',
    contactEmail: 'spandana_cult@srivasaviengg.ac.in'
  },
  {
    id: 'sports',
    name: 'SVEC Sports and Athletics Club',
    category: 'NON_TECHNICAL',
    description: 'Promotes physical fitness and sportsmanship. Oversees college teams in cricket, volleyball, basketball, badminton, table tennis, and tracks.',
    lead: 'Physical Director',
    contactEmail: 'sports_dept@srivasaviengg.ac.in'
  },
  {
    id: 'nss',
    name: 'NSS (National Service Scheme) Unit',
    category: 'NON_TECHNICAL',
    description: 'Inculcates social service values through community service projects, blood donation camps, digital literacy programs in rural areas, and environmental conservation initiatives.',
    lead: 'NSS Program Officer',
    contactEmail: 'nss_unit@srivasaviengg.ac.in'
  }
];
