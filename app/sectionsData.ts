import { Section } from './types';

/**
 * The six dashboard sections, in dial order. `subtitle` is the plain-language
 * description shown in the mobile navigation sheet.
 * Dial geometry (see WatchDial): section i sits at -55 + i * 22 degrees.
 */
export const SECTIONS: Section[] = [
  { id: 'welcome',    hour: 12, degree: 0,   title: 'Welcome',    subtitle: 'Featured work',          posText: "12:00" },
  { id: 'about',      hour: 1,  degree: 30,  title: 'About',      subtitle: 'Profile and toolbox',    posText: "01:00" },
  { id: 'education',  hour: 2,  degree: 60,  title: 'Education',  subtitle: 'Degree and coursework',  posText: "02:00" },
  { id: 'projects',   hour: 3,  degree: 90,  title: 'Projects',   subtitle: 'Case studies',           posText: "03:00" },
  { id: 'experience', hour: 4,  degree: 120, title: 'Experience', subtitle: 'Roles and impact',       posText: "04:00" },
  { id: 'contact',    hour: 5,  degree: 150, title: 'Contact',    subtitle: 'Get in touch',           posText: "05:00" },
];

/** Dial angle (degrees, 0 = pointing right, clockwise positive) for section i. */
export const DIAL_START = -55;
export const DIAL_STEP = 22;
export const dialAngle = (i: number) => DIAL_START + i * DIAL_STEP;
