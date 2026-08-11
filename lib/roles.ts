export interface RecruitmentRole {
  key: string;
  num: string;
  displayName: string;
  category: 'TECHNICAL' | 'NON_TECHNICAL';
  shortLabel: string;
  focus: string;
  description: string;
  areas: string[];
  order: number;
}

export const RECRUITMENT_ROLES: RecruitmentRole[] = [
  {
    key: 'DIGITAL_DEVELOPMENT',
    num: '01',
    displayName: 'Digital Development',
    category: 'TECHNICAL',
    shortLabel: 'Web · Mobile · Architecture',
    focus: 'Web development, mobile application development, and software architecture.',
    description: 'Build and maintain software experiences across web and mobile while exploring modern development practices, application architecture, APIs, and scalable software systems.',
    areas: [
      'Web Development',
      'Mobile Application Development',
      'Backend Development',
      'Frontend Development',
      'Software Architecture',
      'APIs and Integration'
    ],
    order: 1
  },
  {
    key: 'COMPETITIVE_PROGRAMMING',
    num: '02',
    displayName: 'Competitive Programming',
    category: 'TECHNICAL',
    shortLabel: 'DSA · Problem Solving · Contests',
    focus: 'Data Structures & Algorithms, problem solving, and coding contests.',
    description: 'Sharpen problem-solving skills through Data Structures & Algorithms, algorithmic thinking, competitive coding practice, and the organization of coding contests.',
    areas: [
      'Data Structures & Algorithms',
      'Problem Solving',
      'Competitive Coding',
      'Algorithmic Thinking',
      'Coding Contests'
    ],
    order: 2
  },
  {
    key: 'DESIGN',
    num: '03',
    displayName: 'Design',
    category: 'NON_TECHNICAL',
    shortLabel: 'Graphics · UI/UX · Visuals',
    focus: 'Poster design, graphics, UI/UX, and visual assets.',
    description: 'Shape the visual identity of the club through posters, graphics, UI/UX designs, and other creative visual assets.',
    areas: [
      'Poster Design',
      'Graphic Design',
      'UI/UX',
      'Figma',
      'Social Media Creatives',
      'Visual Branding'
    ],
    order: 3
  },
  {
    key: 'SOCIAL_MEDIA_MARKETING',
    num: '04',
    displayName: 'Social Media & Marketing',
    category: 'NON_TECHNICAL',
    shortLabel: 'Content · Campaigns · Publicity',
    focus: 'Official social media handles, content creation, and publicity campaigns.',
    description: 'Build the club\'s online presence through social media management, content creation, campaign planning, and digital publicity.',
    areas: [
      'Social Media Management',
      'Content Creation',
      'Campaign Planning',
      'Publicity',
      'Digital Marketing',
      'Social Media Strategy'
    ],
    order: 4
  },
  {
    key: 'PUBLIC_RELATIONS_OUTREACH',
    num: '05',
    displayName: 'Public Relations & Outreach',
    category: 'NON_TECHNICAL',
    shortLabel: 'Partnerships · Speakers · Communication',
    focus: 'Corporate collaborations, speaker invitations, partnerships, and student communication.',
    description: 'Build meaningful connections beyond the club by working on collaborations, speaker outreach, partnerships, and communication with students and external organizations.',
    areas: [
      'Corporate Outreach',
      'Speaker Relations',
      'Partnerships',
      'Collaboration',
      'Student Communication',
      'External Relations'
    ],
    order: 5
  },
  {
    key: 'EVENT_MANAGEMENT',
    num: '06',
    displayName: 'Event Management',
    category: 'NON_TECHNICAL',
    shortLabel: 'Logistics · Scheduling · Coordination',
    focus: 'Workshop logistics, scheduling, and on-ground coordination.',
    description: 'Turn ideas into successful events by handling planning, scheduling, logistics, coordination, and on-ground execution.',
    areas: [
      'Event Planning',
      'Workshop Coordination',
      'Scheduling',
      'Logistics',
      'Team Coordination',
      'On-ground Operations'
    ],
    order: 6
  }
];

export const ROLE_DISPLAY_NAMES: Record<string, string> = {
  DIGITAL_DEVELOPMENT: 'Digital Development',
  COMPETITIVE_PROGRAMMING: 'Competitive Programming',
  DESIGN: 'Design',
  SOCIAL_MEDIA_MARKETING: 'Social Media & Marketing',
  PUBLIC_RELATIONS_OUTREACH: 'Public Relations & Outreach',
  EVENT_MANAGEMENT: 'Event Management',
};
