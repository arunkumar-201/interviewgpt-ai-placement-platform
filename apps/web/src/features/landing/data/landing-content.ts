import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  BookOpen,
  Brain,
  Code2,
  FileText,
  Github,
  LayoutDashboard,
  MessageSquare,
  Target,
} from 'lucide-react';

export const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Companies', href: '#companies' },
  { label: 'FAQ', href: '#faq' },
] as const;

export const TRUSTED_COMPANIES = [
  { name: 'Google', category: 'FAANG' },
  { name: 'Amazon', category: 'FAANG' },
  { name: 'Microsoft', category: 'FAANG' },
  { name: 'Meta', category: 'FAANG' },
  { name: 'Adobe', category: 'Product' },
  { name: 'Atlassian', category: 'Product' },
  { name: 'Razorpay', category: 'Fintech' },
  { name: 'PhonePe', category: 'Fintech' },
  { name: 'Infosys', category: 'Service' },
  { name: 'TCS', category: 'Service' },
  { name: 'Walmart', category: 'Product' },
  { name: 'Goldman Sachs', category: 'Finance' },
] as const;

export interface FeatureItem {
  title: string;
  description: string;
  benefits: string[];
  icon: LucideIcon;
  gradient: string;
}

export const FEATURES: FeatureItem[] = [
  {
    title: 'DSA Coding Arena',
    description: 'Practice with an in-browser editor, hidden test cases, and instant verdicts.',
    benefits: ['Judge0 execution', 'Topic-wise filters', 'AI hints when stuck'],
    icon: Code2,
    gradient: 'from-violet-500/20 to-purple-600/5',
  },
  {
    title: 'AI Mock Interviewer',
    description: 'Technical, HR, and behavioral rounds tailored to your target company.',
    benefits: ['Company-specific questions', 'Real-time feedback', 'Session scoring'],
    icon: MessageSquare,
    gradient: 'from-blue-500/20 to-cyan-600/5',
  },
  {
    title: 'Resume Analyzer',
    description: 'Upload your PDF and get ATS score, keyword gaps, and AI rewrite tips.',
    benefits: ['ATS compatibility', 'Skill extraction', 'Role-based keywords'],
    icon: FileText,
    gradient: 'from-emerald-500/20 to-teal-600/5',
  },
  {
    title: 'GitHub Analyzer',
    description: 'Turn your profile into a measurable signal recruiters care about.',
    benefits: ['Repo quality score', 'Commit consistency', 'Contribution heatmap'],
    icon: Github,
    gradient: 'from-slate-500/20 to-zinc-600/5',
  },
  {
    title: 'LeetCode Tracker',
    description: 'Sync progress and see topic-wise breakdowns in one place.',
    benefits: ['Easy/Medium/Hard stats', 'Contest rating', 'Acceptance trends'],
    icon: BarChart3,
    gradient: 'from-orange-500/20 to-amber-600/5',
  },
  {
    title: 'Company Question Bank',
    description: 'Curated questions from top recruiters — filter, search, and bookmark.',
    benefits: ['8+ top companies', 'Topic filters', 'Personal bookmarks'],
    icon: BookOpen,
    gradient: 'from-rose-500/20 to-pink-600/5',
  },
  {
    title: 'Placement Dashboard',
    description: 'One readiness score combining DSA, resume, interviews, and GitHub.',
    benefits: ['Unified metrics', 'Weak area detection', 'AI roadmap'],
    icon: LayoutDashboard,
    gradient: 'from-indigo-500/20 to-violet-600/5',
  },
];

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Create Profile',
    description: 'Sign up in seconds with email or Google. Set your target role and college.',
    icon: Target,
  },
  {
    step: 2,
    title: 'Practice DSA',
    description: 'Solve curated problems across arrays, graphs, DP, and more with AI hints.',
    icon: Code2,
  },
  {
    step: 3,
    title: 'Take AI Interviews',
    description: 'Run mock technical and HR rounds with company-specific context.',
    icon: Brain,
  },
  {
    step: 4,
    title: 'Analyze Resume & GitHub',
    description: 'Boost ATS score and quantify your open-source impact.',
    icon: FileText,
  },
  {
    step: 5,
    title: 'Become Placement Ready',
    description: 'Get your readiness score, roadmap, and weekly AI suggestions.',
    icon: LayoutDashboard,
  },
] as const;

export interface CompanyCard {
  name: string;
  slug: string;
  questions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  readinessScore: number;
  accent: string;
}

export const COMPANY_CARDS: CompanyCard[] = [
  { name: 'Google', slug: 'google', questions: 120, difficulty: 'Hard', readinessScore: 72, accent: 'from-blue-500 to-green-500' },
  { name: 'Amazon', slug: 'amazon', questions: 95, difficulty: 'Mixed', readinessScore: 68, accent: 'from-orange-500 to-yellow-500' },
  { name: 'Microsoft', slug: 'microsoft', questions: 88, difficulty: 'Medium', readinessScore: 75, accent: 'from-sky-500 to-blue-600' },
  { name: 'Adobe', slug: 'adobe', questions: 54, difficulty: 'Medium', readinessScore: 70, accent: 'from-red-500 to-rose-600' },
  { name: 'Atlassian', slug: 'atlassian', questions: 42, difficulty: 'Medium', readinessScore: 65, accent: 'from-blue-600 to-indigo-600' },
  { name: 'Walmart', slug: 'walmart', questions: 38, difficulty: 'Mixed', readinessScore: 62, accent: 'from-blue-700 to-cyan-500' },
  { name: 'Infosys', slug: 'infosys', questions: 65, difficulty: 'Easy', readinessScore: 80, accent: 'from-indigo-600 to-violet-600' },
  { name: 'TCS', slug: 'tcs', questions: 58, difficulty: 'Easy', readinessScore: 82, accent: 'from-blue-800 to-teal-600' },
];

export const TESTIMONIALS = [
  {
    name: 'Arjun Sharma',
    role: 'B.Tech CS, IIT Hyderabad',
    company: 'Placed at Google',
    quote:
      'InterviewGPT gave me one readiness number instead of guessing. The mock interviews felt eerily close to my actual Google rounds.',
    rating: 5,
    avatar: 'AS',
  },
  {
    name: 'Priya Nair',
    role: 'SDE-2 Switcher',
    company: 'Placed at Amazon',
    quote:
      'Resume analyzer alone improved my callback rate. Combined with DSA arena, I went from 40 to 180 problems in 3 months.',
    rating: 5,
    avatar: 'PN',
  },
  {
    name: 'Rahul Verma',
    role: 'Open Source Enthusiast',
    company: 'Placed at Microsoft',
    quote:
      'GitHub analyzer helped me highlight the right repos. Recruiters finally noticed my profile beyond just LeetCode count.',
    rating: 5,
    avatar: 'RV',
  },
  {
    name: 'Sneha Patel',
    role: 'Final Year, NIT Surat',
    company: 'Placed at Adobe',
    quote:
      'Company question bank saved weeks of scattered Google searches. Bookmarking by topic was a game changer.',
    rating: 5,
    avatar: 'SP',
  },
] as const;

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'Essential tools to start your placement journey.',
    features: [
      '5 DSA problems / day',
      '1 resume analysis / month',
      '1 mock interview / week',
      'Basic readiness score',
      'Company question browsing',
    ],
    cta: 'Get Started Free',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹499',
    period: '/month',
    description: 'For serious candidates targeting product companies.',
    features: [
      'Unlimited DSA practice',
      'Unlimited resume analyses',
      '10 mock interviews / month',
      'GitHub & LeetCode sync',
      'AI hints & roadmaps',
      'Priority support',
    ],
    highlighted: true,
    cta: 'Start Pro Trial',
  },
  {
    id: 'ultimate',
    name: 'Ultimate Placement',
    price: '₹1,999',
    period: '/3 months',
    description: 'Everything you need for campus & off-campus season.',
    features: [
      'Everything in Pro',
      'Unlimited mock interviews',
      'Company-specific study plans',
      'Advanced readiness analytics',
      '1:1 placement strategy AI',
      'Early access to new features',
    ],
    cta: 'Go Ultimate',
  },
];

export const PRICING_COMPARISON = [
  { feature: 'DSA Coding Arena', free: true, pro: true, ultimate: true },
  { feature: 'AI Mock Interviewer', free: 'Limited', pro: '10/mo', ultimate: 'Unlimited' },
  { feature: 'Resume Analyzer', free: '1/mo', pro: 'Unlimited', ultimate: 'Unlimited' },
  { feature: 'GitHub Analyzer', free: false, pro: true, ultimate: true },
  { feature: 'LeetCode Tracker', free: false, pro: true, ultimate: true },
  { feature: 'Company Question Bank', free: 'Browse', pro: 'Full', ultimate: 'Full + Plans' },
  { feature: 'Placement Readiness Engine', free: 'Basic', pro: 'Advanced', ultimate: 'Advanced + AI' },
] as const;

export const FAQ_ITEMS = [
  {
    question: 'Is InterviewGPT suitable for beginners?',
    answer:
      'Yes. Start with easy DSA problems and guided AI hints. The readiness engine adapts recommendations to your current level.',
  },
  {
    question: 'How accurate is the resume ATS score?',
    answer:
      'Our analyzer combines rule-based ATS checks with AI suggestions. It highlights missing keywords and section gaps for your target role.',
  },
  {
    question: 'Can I practice company-specific interviews?',
    answer:
      'Absolutely. Select your target company and role — our AI interviewer adapts questions to match real interview patterns.',
  },
  {
    question: 'Do I need a LeetCode premium account?',
    answer:
      'No. Link your public LeetCode username to sync stats. All DSA practice happens in our built-in coding arena.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Passwords are bcrypt-hashed, tokens are stored securely in httpOnly cookies, and resumes are stored in private cloud storage.',
  },
  {
    question: 'Can colleges use InterviewGPT for batches?',
    answer:
      'Enterprise batch onboarding is on our roadmap. Contact us for early access for placement cells.',
  },
] as const;

export const FOOTER_LINKS = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Companies', href: '#companies' },
    { label: 'FAQ', href: '#faq' },
  ],
  company: [
    { label: 'About', href: '#about' },
    { label: 'Contact', href: 'mailto:hello@interviewgpt.dev' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
  ],
} as const;
