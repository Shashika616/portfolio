import { Section } from './types';

export const SECTIONS: Section[] = [
  { id: 'welcome',   hour: 12, degree: 0,   title: 'Welcome',      subtitle: 'System Initialization', posText: "12:00" },
  { id: 'about',     hour: 1,  degree: 30,  title: 'About Me',     subtitle: 'Core Architecture', posText: "01:00" },
  { id: 'education', hour: 2,  degree: 60,  title: 'Education',    subtitle: 'Formal Logic & Theory', posText: "02:00" },
  { id: 'projects',  hour: 3,  degree: 90,  title: 'Projects',     subtitle: 'Research & Development', posText: "03:00" },
  { id: 'experience',hour: 4,  degree: 120, title: 'Experience',   subtitle: 'Industrial Scale', posText: "04:00" },
  { id: 'contact',   hour: 5,  degree: 150, title: 'Contact',      subtitle: 'Establish Handshake', posText: "05:00" },
];