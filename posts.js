// posts.js — single source of truth for all blog post metadata.
// Newest post goes at the TOP of the array.
// Add a new entry here + create posts/[slug].html from the template to publish a post.

const POSTS = [
  {
    slug: 'why-design-strategy-comes-first',
    title: 'Why design strategy comes before pixels',
    subtitle: 'The instinct to jump straight into Figma is strong. Here\'s why slowing down to define the problem first leads to better outcomes every time.',
    date: '2025-03-15',
    dateDisplay: '15 March 2025',
    tags: ['UX Strategy', 'Process'],
    coverImage: '',
    coverAlt: '',
    placeholderIndex: 1,
    draft: false,
  },
  {
    slug: 'design-systems-legacy-product',
    title: 'Building a design system for a legacy enterprise product',
    subtitle: 'What I learned from introducing component libraries into a codebase that predates design tokens — and the decisions that made adoption actually stick.',
    date: '2025-01-22',
    dateDisplay: '22 January 2025',
    tags: ['Design Systems'],
    coverImage: '',
    coverAlt: '',
    placeholderIndex: 2,
    draft: false,
  },
  {
    slug: 'research-stakeholders-actually-read',
    title: 'Research that stakeholders actually read',
    subtitle: 'Most research reports go unread. A few small changes to how you frame findings can turn a deliverable into a decision-making tool.',
    date: '2024-11-08',
    dateDisplay: '08 November 2024',
    tags: ['UX Research', 'Stakeholders'],
    coverImage: '',
    coverAlt: '',
    placeholderIndex: 3,
    draft: false,
  },
  {
    slug: 'detail-separates-good-from-great',
    title: 'The detail that separates good design from great design',
    subtitle: 'Craft isn\'t about adding more — it\'s about caring more about what\'s already there. Reflections on attention to detail after eight years of shipping products.',
    date: '2024-09-03',
    dateDisplay: '03 September 2024',
    tags: ['UI Design', 'Craft'],
    coverImage: '',
    coverAlt: '',
    placeholderIndex: 4,
    draft: false,
  },
];
