/** Static placeholders for UI sections not yet backed by API data. */

export const recentlySaved = [
  { id: 1, title: 'Collaboration sketches', seed: 'carousel1' },
  { id: 2, title: 'Design wall', seed: 'carousel2' },
  { id: 3, title: 'Ideation session', seed: 'carousel3' },
  { id: 4, title: 'Project notes', seed: 'carousel4' },
];

export const historyItems = [
  {
    id: 1,
    title: 'HOW TO TAKE NOTES: pretty, productive, effective note taking | TIPS',
    description: 'How many times have you looked at your notes when you are studying for an exam and couldn\'t figure out what your notes were saying. In this video, I am going to show you how to take notes effectively. If you use...',
    tags: ['Notes', 'Productive', 'Effectivity'],
    date: 'Wednesday, February 11',
    seed: 'notes1',
    hasStar: true,
  },
  {
    id: 2,
    title: 'In the mirror',
    description: 'About looking at oneself more deeply than what is seen from an outside appearance..',
    tags: ['Reflection', 'Life'],
    date: 'Tuesday, February 10',
    seed: 'mirror1',
  },
  {
    id: 3,
    title: 'What is UX Research: The Ultimate Guide for User Researchers',
    description: 'User experience research is a crucial component of the human-centered design process and an essential part of creating solutions that meet user expectations and deliver value to customers. This comprehensive....',
    tags: ['UX Research', 'Goals', 'Vision'],
    date: 'Wednesday, February 11',
    seed: 'ux1',
  },
];

export const memories = [
  { id: 1, label: '1 year ago', sub: 'JAN 9, 2025', seed: 'mem1', cta: 'MORE' },
  { id: 2, label: 'Exploring', sub: 'MAY 2025 TRIP', seed: 'mem2' },
  { id: 3, label: 'Weekly recap', sub: 'FEB 2026', seed: 'mem3' },
];

export const recommended = [
  { id: 1, icon: 'N', title: 'Notes from Notion', type: 'notion' },
  {
    id: 2,
    title: 'Sequence Diagram Tool',
    description: 'Elevate your development process with AI-powered code revie...',
    seed: 'rec2',
  },
  {
    id: 3,
    title: 'Highlights from Photo Memories',
    sub: 'Thesedays · December, 2025 - February, 2026',
    seed: 'rec3',
    isPhotoGrid: true,
  },
];

export const recaps = {
  weekly: [
    { id: 1, label: 'WEEKLY', month: 'Feb', range: '15 - 21' },
    { id: 2, label: 'WEEKLY', month: 'Feb', range: '8 - 14' },
    { id: 3, label: 'WEEKLY', month: 'Feb', range: '1 - 7' },
  ],
  monthly: [
    { id: 1, label: 'MONTHLY', month: 'January', year: '2026' },
    { id: 2, label: 'MONTHLY', month: 'Dec', year: '2025' },
  ],
};

export const becomingCards = [
  {
    id: 1,
    phrase: 'With the structure!',
    title: 'Architect',
    seed: 'architect',
  },
  {
    id: 2,
    phrase: 'Endless chain of thoughts',
    title: 'Overthinker',
    seed: 'overthinker',
  },
];

export const patternQuote = 'You design your world, even in your thoughts.';

export const insightStats = {
  month: 'January',
  year: '2026',
  topicCount: 5,
  topicPrev: 2,
  reflectionCount: 6,
  reflectionPrev: 4,
  reflectionBreakdown: [
    { label: 'Learning', words: 756, percent: 66 },
    { label: 'Creativity', words: 158, percent: 16 },
    { label: 'Authentic', words: 149, percent: 15 },
    { label: 'Identity', words: 19, percent: 3 },
    { label: 'Self', words: 5, percent: 0 },
    { label: 'Brand', words: 1, percent: 0 },
  ],
  topicLabels: [
    { name: 'Productivity', color: 'bg-purple-400' },
    { name: 'Note', color: 'bg-cyan-400' },
    { name: 'Application', color: 'bg-red-400' },
    { name: 'AI', color: 'bg-sky-300' },
    { name: 'Car', color: 'bg-amber-300' },
  ],
};
