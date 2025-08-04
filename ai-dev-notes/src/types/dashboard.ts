export interface SkillLevel {
  name: string;
  level: number; // 1-10 scale
  progress: number; // 0-100 percentage
  lastAssessed: Date;
  assessmentCount: number;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'open-ended' | 'scenario-based';
  topic: 'react' | 'nextjs' | 'ai-tools';
  difficulty: number; // 1-10
  question: string;
  options?: string[]; // for multiple choice
  correctAnswer?: string;
  userAnswer?: string;
  score?: number; // 1-10
  feedback?: string;
  timeSpent?: number; // in seconds
}

export interface Assessment {
  id: string;
  date: Date;
  questions: Question[];
  score: number;
  feedback: string;
  topicsAssessed: string[];
  openAITokensUsed: number;
  model: 'gpt-4o-mini';
  duration: number; // in seconds
  completionRate: number; // percentage of questions completed
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tokens?: number;
}

export interface Recommendation {
  id: string;
  type: 'exercise' | 'concept' | 'project' | 'resource';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  skillArea: 'react' | 'nextjs' | 'ai-tools';
  estimatedTime: number; // in minutes
  resources?: {
    title: string;
    url: string;
    type: 'documentation' | 'tutorial' | 'video' | 'article';
  }[];
  completed: boolean;
  dateGenerated: Date;
}

export interface LearningStreak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  totalDays: number;
}

export interface TokenUsage {
  totalTokens: number;
  tokensToday: number;
  estimatedCost: number;
  lastReset: Date;
}

export interface LearningProgress {
  userId: string;
  assessments: Assessment[];
  skillLevels: {
    react: SkillLevel;
    nextjs: SkillLevel;
    aiTools: SkillLevel;
  };
  recommendations: Recommendation[];
  streak: LearningStreak;
  tokenUsage: TokenUsage;
  goals: {
    targetSkillLevel: number;
    deadline?: Date;
    description: string;
  }[];
  lastUpdated: Date;
  totalAssessments: number;
  averageScore: number;
}

export interface ChatConfig {
  model: 'gpt-4o-mini';
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
}

export interface AssessmentSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  currentQuestionIndex: number;
  questions: Question[];
  responses: Question[];
  skillFocus: 'react' | 'nextjs' | 'ai-tools';
  difficultyLevel: number;
  isActive: boolean;
}