/**
 * Data structures and types for Training Feedback Application
 */

export interface QuestionDef {
  id: 'q1' | 'q2' | 'q3' | 'q4' | 'q5';
  number: number;
  title: string;
  shortLabel: string;
  desc: string;
}

export interface FeedbackRating {
  q1: number; // 1-5
  q2: number; // 1-5
  q3: number; // 1-5
  q4: number; // 1-5
  q5: number; // 1-5
}

export interface FeedbackEntry {
  id: string;
  timestamp: number;
  submittedAt: string;
  ratings: FeedbackRating;
  overallScore: number;
  comment?: string;
  deviceFingerprint?: string;
}

export interface QuestionSummary {
  id: 'q1' | 'q2' | 'q3' | 'q4' | 'q5';
  title: string;
  shortLabel: string;
  average: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  interpretation: string;
}

export interface DashboardStats {
  totalCount: number;
  overallAverage: number;
  overallInterpretation: {
    level: string;
    description: string;
    color: string;
    bgBadge: string;
  };
  highestQuestion: QuestionSummary | null;
  lowestQuestion: QuestionSummary | null;
  questionSummaries: QuestionSummary[];
  recentComments: Array<{
    id: string;
    comment: string;
    timestamp: number;
    submittedAt: string;
    averageScore: number;
  }>;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface FirebaseCustomConfig {
  apiKey?: string;
  authDomain?: string;
  databaseURL: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export type ActiveTab = 'survey' | 'dashboard' | 'qrcode' | 'guide';
