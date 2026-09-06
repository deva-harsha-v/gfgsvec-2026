export interface EventItem {
  id: string;
  title: string;
  date: string;
  category: 'PLACEMENTS' | 'ACADEMICS' | 'CLUBS' | 'WORKSHOPS';
  image?: string;
  description: string;
}

export const EVENTS: EventItem[] = [
  {
    id: 'placement-drive-2026',
    title: 'Grand Placement Drive 2026 Concluded',
    date: '2026-07-20',
    category: 'PLACEMENTS',
    description: 'Over 150 students from the final year B.Tech classes have secured job offers during our phase 1 placement campaign with national and MNC partners including TCS, Cognizant, and DXC Technology.',
  },
  {
    id: 'btech-orientation-2026',
    title: 'Orientation Program for 1st Year B.Tech Students',
    date: '2026-08-10',
    category: 'ACADEMICS',
    description: 'Welcoming the new batch of engineering students at Sri Vasavi Engineering College! An orientation week is scheduled containing campus tours, departmental introductory events, and guest seminars.',
  },
  {
    id: 'gfg-workshop-react',
    title: 'Web Design & React Framework Workshop by GFG Club',
    date: '2026-08-05',
    category: 'CLUBS',
    description: 'A 2-day technical workshop organized by the GeeksforGeeks student body covering CSS layouts, Next.js framework, and API integration. Attended by over 200 coding enthusiasts.',
  },
  {
    id: 'iot-hackathon-eee',
    title: 'IoT Prototype Hackathon - EEE Department',
    date: '2026-07-15',
    category: 'WORKSHOPS',
    description: 'Student engineering teams designed functional automated IoT microgrid prototypes. Winners were awarded cash prizes and corporate internship credits.',
  }
];
