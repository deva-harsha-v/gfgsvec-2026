export interface RecruitmentStatusData {
  hasActiveCycle: boolean;
  isOpen: boolean;
  isClosed: boolean;
  cycle?: {
    id: string;
    title: string;
    status: string;
    opensAt: string;
    closesAt: string;
  };
  serverTime?: string;
  startTime?: string;
  closeTime?: string;
}

export interface FaqTopic {
  id: string;
  chipLabel: string;
  question: string;
  keywords: string[];
  weightedKeywords?: string[]; // Higher priority terms (+3 points)
  getAnswer: (status?: RecruitmentStatusData | null) => string;
}

export const FAQ_TOPICS: FaqTopic[] = [
  {
    id: 'roles',
    chipLabel: 'What roles are open?',
    question: 'What roles are open?',
    keywords: ['roles', 'role', 'positions', 'position', 'technical', 'non-technical', 'teams', 'team', 'domain', 'domains', 'fields'],
    getAnswer: () =>
      'We hire across both Technical (Full-Stack Web, Competitive Programming, UI/UX Design, Cloud/DevOps) and Non-Technical (Event Management, Content & Media, Public Relations, Graphic Design) domains. You can choose up to 2 preferred fields in your application!',
  },
  {
    id: 'deadline',
    chipLabel: "When's the deadline?",
    question: 'When is the application deadline?',
    keywords: ['deadline', 'close', 'closing', 'due', 'date', 'last', 'time', 'when', 'ends', 'expire', 'expires'],
    weightedKeywords: ['deadline', 'closesat', 'close time', 'last date', 'due date', 'closing time'],
    getAnswer: (status) => {
      if (status?.hasActiveCycle && status?.cycle && status?.isOpen) {
        const dateStr = new Date(status.cycle.closesAt).toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short',
        });
        return `Applications for "${status.cycle.title}" close on ${dateStr} IST. Make sure to complete and submit your application before the countdown ends!`;
      }
      if (status?.isClosed) {
        return 'Applications for the recent recruitment drive are now closed. Follow our official channels for updates on future hiring cycles!';
      }
      return 'No active recruitment drive is open right now. Keep an eye on our announcements for upcoming application dates!';
    },
  },
  {
    id: 'process',
    chipLabel: 'How does selection work?',
    question: 'How does the interview process work?',
    keywords: ['process', 'interview', 'rounds', 'round', 'selection', 'screening', 'evaluation', 'steps', 'how'],
    getAnswer: () =>
      'Our selection process has 3 stages: 1) Initial application & resume screening, 2) Interactive domain/technical interview slot round, and 3) Final team onboarding & orientation!',
  },
  {
    id: 'eligibility',
    chipLabel: 'Who is eligible?',
    question: 'Who is eligible to apply?',
    keywords: ['eligibility', 'eligible', 'cgpa', 'year', 'years', 'branch', 'branches', 'who', 'apply', 'join', 'student', 'students'],
    getAnswer: () =>
      'All SVEC students in 2nd Year and 3rd Year across all branches are eligible to apply! We prioritize enthusiasm, problem-solving, and commitment to learning.',
  },
  {
    id: 'status',
    chipLabel: 'Is hiring open?',
    question: 'Is hiring currently open?',
    keywords: ['open', 'hiring', 'status', 'apply now', 'recruitment', 'active', 'start', 'started', 'is'],
    getAnswer: (status) => {
      if (status?.hasActiveCycle && status?.cycle && status?.isOpen) {
        return `Yes! Recruitment for "${status.cycle.title}" is currently OPEN. Click 'Apply Now' in the navbar to start your application!`;
      }
      if (status?.isClosed) {
        return 'Recruitment for the current cycle is now closed. Stay tuned for future drives!';
      }
      return 'Recruitment is currently closed as no active recruitment drive is published right now. Stay tuned to our announcement channels for upcoming drives!';
    },
  },
];

export function findMatchingFaqAnswer(query: string, status?: RecruitmentStatusData | null): { question?: string; answer: string } {
  const normalized = query.toLowerCase().trim();
  if (!normalized) {
    return {
      answer: 'Please type a question or select one of the suggested topics above!',
    };
  }

  let bestMatch: FaqTopic | null = null;
  let maxScore = 0;

  for (const topic of FAQ_TOPICS) {
    let score = 0;

    // Check weighted keywords (+3 score)
    if (topic.weightedKeywords) {
      for (const wk of topic.weightedKeywords) {
        if (normalized.includes(wk.toLowerCase())) {
          score += 3;
        }
      }
    }

    // Check standard keywords (+1 score)
    for (const kw of topic.keywords) {
      if (normalized.includes(kw.toLowerCase())) {
        score += 1;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = topic;
    }
  }

  if (bestMatch && maxScore > 0) {
    return {
      question: bestMatch.question,
      answer: bestMatch.getAnswer(status),
    };
  }

  return {
    answer: "I'm not sure about that yet — try selecting one of the suggested topics above, or reach out to us via the Contact page.",
  };
}
