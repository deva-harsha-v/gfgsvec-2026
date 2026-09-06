export interface ProgramInfo {
  name: string;
  intake: number;
}

export interface LabInfo {
  name: string;
  description: string;
}

export interface Department {
  id: string;
  name: string;
  shortName: string;
  description: string;
  vision: string;
  mission: string[];
  hodName: string;
  hodTitle: string;
  hodMessage: string;
  programs: ProgramInfo[];
  labs: LabInfo[];
  researchAreas: string[];
  contactEmail: string;
  contactPhone: string;
}

export const DEPARTMENTS: Department[] = [
  {
    id: 'cse',
    name: 'Computer Science & Engineering',
    shortName: 'CSE',
    description: 'The Department of Computer Science & Engineering offers a highly competitive learning environment focusing on algorithms, software design, artificial intelligence, cyber security, and data science, preparing students for leadership in the global IT sector.',
    vision: 'To build technically competent, ethical, and socially responsible computer science professionals capable of developing innovative solutions to meet global challenges.',
    mission: [
      'To provide state-of-the-art infrastructure and collaborative environments for engineering education.',
      'To inculcate critical thinking, problem-solving, and lifelong learning capabilities through hands-on technical training.',
      'To foster professional ethics, teamwork, and entrepreneurial mindset among students.'
    ],
    hodName: 'Dr. V. Srinivasa Rao',
    hodTitle: 'Professor & HOD',
    hodMessage: 'Welcome to the Department of CSE at SVEC. Our academic curriculum, backed by state-of-the-art computer networks and industry partnerships, ensures our students are equipped to lead the technology sector of tomorrow.',
    programs: [
      { name: 'B.Tech - Computer Science & Engineering', intake: 240 },
      { name: 'B.Tech - CSE (Artificial Intelligence & Machine Learning)', intake: 120 },
      { name: 'M.Tech - Computer Science & Engineering', intake: 18 }
    ],
    labs: [
      { name: 'Advanced Software Engineering Lab', description: 'Equipped with dual-core workstations, specialized IDEs, and version control tools.' },
      { name: 'Database Management Systems Lab', description: 'Supports enterprise-grade Oracle, PostgreSQL, and MySQL setups.' },
      { name: 'AI & Deep Learning Computing Lab', description: 'Features GPU-accelerated computing nodes for artificial neural networks.' },
      { name: 'Web Technologies and Internet of Things Lab', description: 'Facilitates practical design in IoT hardware interfaces and web development frameworks.' }
    ],
    researchAreas: [
      'Machine Learning & Deep Learning',
      'Cloud Computing & Big Data Analytics',
      'Cyber Security & Cryptography',
      'Wireless Sensor Networks'
    ],
    contactEmail: 'hod_cse@srivasaviengg.ac.in',
    contactPhone: '+91-8818-284355 Ext. 201'
  },
  {
    id: 'ece',
    name: 'Electronics & Communication Engineering',
    shortName: 'ECE',
    description: 'The Electronics & Communication Engineering department is dedicated to providing students with solid fundamentals in signal processing, telecommunication networks, embedded systems, VLSI design, and optical communications.',
    vision: 'To be a center of excellence in electronics and communication engineering by producing globally competent engineers who can solve complex society-driven problems.',
    mission: [
      'To deliver high quality pedagogical training in core electronic designs and digital networking.',
      'To promote active research, industrial partnerships, and consultancy services.',
      'To nurture moral values and leadership skills for collective economic progress.'
    ],
    hodName: 'Dr. E. Kusuma Kumari',
    hodTitle: 'Professor & HOD',
    hodMessage: 'ECE at Sri Vasavi Engineering College bridges the gap between hardware architecture and communication networks. Our labs and VLSI toolsets provide excellent foundations for research and industrial placements.',
    programs: [
      { name: 'B.Tech - Electronics & Communication Engineering', intake: 180 },
      { name: 'M.Tech - VLSI & Embedded Systems', intake: 18 }
    ],
    labs: [
      { name: 'VLSI Design & Simulation Lab', description: 'Equipped with Cadence tool suites and FPGA development boards.' },
      { name: 'Embedded Systems & Microprocessor Lab', description: 'Supports design cycles on ARM, 8086, and PIC microcontrollers.' },
      { name: 'Analog & Digital Communication Lab', description: 'Features digital storage oscilloscopes, RF components, and signal modules.' }
    ],
    researchAreas: [
      'VLSI Physical Design & Testing',
      'Digital Signal & Image Processing',
      'RF & Smart Antenna Systems',
      'Internet of Things & Embedded Systems'
    ],
    contactEmail: 'hod_ece@srivasaviengg.ac.in',
    contactPhone: '+91-8818-284355 Ext. 202'
  },
  {
    id: 'eee',
    name: 'Electrical & Electronics Engineering',
    shortName: 'EEE',
    description: 'The Department of EEE focuses on power electronics, electrical machinery, smart grid technology, and renewable energy resources, preparing students to drive sustainable engineering solutions.',
    vision: 'To generate competent and green technological experts in electrical engineering to support national power and industrial domains.',
    mission: [
      'To provide quality instruction in power systems, electrical machines, and control engines.',
      'To build collaboration with energy distribution centers and research laboratories.',
      'To motivate community service and green power initiatives.'
    ],
    hodName: 'Dr. Sudha Rani',
    hodTitle: 'Professor & HOD',
    hodMessage: 'Welcome to EEE. Our graduates work in power networks, electric vehicle manufacturing, control engineering, and automation. We emphasize practical validation and safety standards.',
    programs: [
      { name: 'B.Tech - Electrical & Electronics Engineering', intake: 120 },
      { name: 'M.Tech - Power Systems', intake: 18 }
    ],
    labs: [
      { name: 'Electrical Machines Lab', description: 'Includes a complete range of AC/DC motors, alternators, and transformers.' },
      { name: 'Power Electronics & Drives Lab', description: 'Supports testing of choppers, inverters, and speed control systems.' },
      { name: 'Control Systems & Simulation Lab', description: 'Facilitates feedback control loop designs using MATLAB/Simulink.' }
    ],
    researchAreas: [
      'Smart Microgrids and Renewable Energy Systems',
      'Electric Vehicles and Battery Storage Management',
      'Power Quality Control and Grid Integration'
    ],
    contactEmail: 'hod_eee@srivasaviengg.ac.in',
    contactPhone: '+91-8818-284355 Ext. 203'
  },
  {
    id: 'mech',
    name: 'Mechanical Engineering',
    shortName: 'ME',
    description: 'The Mechanical Engineering department offers comprehensive courses in thermodynamics, machine design, CAD/CAM, fluid mechanics, and robotic systems, driving engineering design innovation.',
    vision: 'To be a premier mechanical engineering hub that nurtures competitive design and research engineers.',
    mission: [
      'To offer standard industrial exposure in CAD design, workshop operations, and heat engines.',
      'To foster industry-academia interactive models and collaborative projects.',
      'To promote teamwork and green mechanical techniques.'
    ],
    hodName: 'Dr. T. Sujan',
    hodTitle: 'Professor & HOD',
    hodMessage: 'Mechanical engineering is the mother of all design disciplines. At SVEC, we combine traditional machining with digital automation and finite element analysis.',
    programs: [
      { name: 'B.Tech - Mechanical Engineering', intake: 120 }
    ],
    labs: [
      { name: 'CAD/CAM Laboratory', description: 'Features software licenses for SolidWorks, ANSYS, and AutoCAD.' },
      { name: 'Thermal Engineering Lab', description: 'Includes multi-cylinder engines and variable compression testing setups.' },
      { name: 'Fluid Mechanics & Hydraulic Machines Lab', description: 'Features turbines, centrifugal pumps, and flow measurement setups.' }
    ],
    researchAreas: [
      'Additive Manufacturing & 3D Printing',
      'Composite Materials Characterization',
      'Computational Fluid Dynamics (CFD)'
    ],
    contactEmail: 'hod_mech@srivasaviengg.ac.in',
    contactPhone: '+91-8818-284355 Ext. 204'
  },
  {
    id: 'civil',
    name: 'Civil Engineering',
    shortName: 'CE',
    description: 'The Civil Engineering department trains students in structural engineering, concrete technology, surveying, geotechnical engineering, and water resource management, supporting infrastructural growth.',
    vision: 'To produce infrastructural design experts possessing technical capability and environmental sense.',
    mission: [
      'To deliver state-of-the-art structural and geological modeling knowledge.',
      'To facilitate research in eco-friendly concrete and material recycling.',
      'To impart professional project management skills for large-scale developments.'
    ],
    hodName: 'Dr. G. Radhakrishnan',
    hodTitle: 'Professor & HOD',
    hodMessage: 'Infrastructural safety, green structures, and smart city models are central to CE today. Our labs provide testing services and structural validation experience.',
    programs: [
      { name: 'B.Tech - Civil Engineering', intake: 60 }
    ],
    labs: [
      { name: 'Geotechnical Engineering Lab', description: 'Features soil core testing, shear testing, and consolidation equipment.' },
      { name: 'Concrete Technology & Materials Lab', description: 'Equipped with compression testing machines and concrete mixes.' },
      { name: 'Surveying & GIS Lab', description: 'Includes digital total stations, level systems, and map compilers.' }
    ],
    researchAreas: [
      'Self-compacting and Geopolymer Green Concrete',
      'Structural Seismic Analysis and Retofitting',
      'Geographical Surveying and GIS Mapping'
    ],
    contactEmail: 'hod_civil@srivasaviengg.ac.in',
    contactPhone: '+91-8818-284355 Ext. 205'
  }
];
