export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  departmentId: string;
  qualification: string;
  specialization: string;
  photoUrl?: string;
}

export const FACULTY_MEMBERS: FacultyMember[] = [
  {
    id: 'srinivasa-rao',
    name: 'Dr. V. Srinivasa Rao',
    designation: 'Professor & HOD',
    departmentId: 'cse',
    qualification: 'M.Tech, Ph.D.',
    specialization: 'Cloud Computing, Machine Learning',
  },
  {
    id: 'ece-hod',
    name: 'Dr. E. Kusuma Kumari',
    designation: 'Professor & HOD',
    departmentId: 'ece',
    qualification: 'M.Tech, Ph.D.',
    specialization: 'VLSI Design, Signal Processing',
  },
  {
    id: 'eee-hod',
    name: 'Dr. Sudha Rani',
    designation: 'Professor & HOD',
    departmentId: 'eee',
    qualification: 'M.Tech, Ph.D.',
    specialization: 'Power Electronics, Smart Grids',
  },
  {
    id: 'mech-hod',
    name: 'Dr. T. Sujan',
    designation: 'Professor & HOD',
    departmentId: 'mech',
    qualification: 'M.Tech, Ph.D.',
    specialization: 'Industrial Automation, Materials Science',
  },
  {
    id: 'civil-hod',
    name: 'Dr. G. Radhakrishnan',
    designation: 'Professor & HOD',
    departmentId: 'civil',
    qualification: 'M.Tech, Ph.D.',
    specialization: 'Geotechnical Engineering, Concrete Technology',
  },
  {
    id: 'g-srinivasa-rao',
    name: 'Sri G. Srinivasa Rao',
    designation: 'Associate Professor',
    departmentId: 'cse',
    qualification: 'M.Tech, (Ph.D.)',
    specialization: 'Data Mining, Database Systems',
  },
  {
    id: 'k-sireesha',
    name: 'Smt. K. Sireesha',
    designation: 'Assistant Professor',
    departmentId: 'cse',
    qualification: 'M.Tech',
    specialization: 'Information Security, Python Frameworks',
  },
  {
    id: 'p-rama-krishna',
    name: 'Sri P. Rama Krishna',
    designation: 'Associate Professor',
    departmentId: 'ece',
    qualification: 'M.Tech',
    specialization: 'Embedded Systems, Microcontrollers',
  }
];
