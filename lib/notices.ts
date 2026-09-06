export interface Notice {
  id: string;
  title: string;
  date: string;
  category: 'EXAMS' | 'ADMISSIONS' | 'ACADEMICS' | 'CIRCULARS';
  link?: string;
}

export const NOTICES: Notice[] = [
  {
    id: 'admissions-open-2026',
    title: 'Admissions Open for B.Tech & M.Tech Programs for AY 2026-27 under Category-B Management Quota',
    date: '2026-08-15',
    category: 'ADMISSIONS',
    link: '#'
  },
  {
    id: 'jntuk-exams-schedule',
    title: 'Notification for JNTUK II-Year B.Tech Semester-II External Examinations Time Table Released',
    date: '2026-08-20',
    category: 'EXAMS',
    link: '#'
  },
  {
    id: 'holiday-notice-ind',
    title: 'Independence Day Celebrations Circular and Holiday Notice',
    date: '2026-08-14',
    category: 'CIRCULARS',
    link: '#'
  },
  {
    id: 'placement-registration-notice',
    title: 'Notice for Mandatory Registration for Campus Recruitment Training (CRT) Sessions - 3rd B.Tech',
    date: '2026-08-01',
    category: 'ACADEMICS',
    link: '#'
  }
];
