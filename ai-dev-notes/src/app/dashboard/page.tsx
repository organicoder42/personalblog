"use client";

import { useState, useEffect } from 'react';
import { LearningProgress, Assessment } from '@/types/dashboard';
import ProgressCard from '@/components/dashboard/ProgressCard';
import AssessmentChatbot from '@/components/dashboard/AssessmentChatbot';
import RecommendationsList from '@/components/dashboard/RecommendationsList';
import LearningStats from '@/components/dashboard/LearningStats';
import ProgressExporter from '@/components/dashboard/ProgressExporter';

// Initialize default progress data
const defaultProgress: LearningProgress = {
  userId: 'user-1',
  assessments: [],
  skillLevels: {
    react: {
      name: 'React',
      level: 3,
      progress: 30,
      lastAssessed: new Date(),
      assessmentCount: 0
    },
    nextjs: {
      name: 'Next.js',
      level: 2,
      progress: 20,
      lastAssessed: new Date(),
      assessmentCount: 0
    },
    aiTools: {
      name: 'AI Tools',
      level: 1,
      progress: 10,
      lastAssessed: new Date(),
      assessmentCount: 0
    }
  },
  recommendations: [],
  streak: {
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: new Date(),
    totalDays: 0
  },
  tokenUsage: {
    totalTokens: 0,
    tokensToday: 0,
    estimatedCost: 0,
    lastReset: new Date()
  },
  goals: [
    {
      targetSkillLevel: 7,
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      description: 'Achieve intermediate React proficiency for medtech applications'
    }
  ],
  lastUpdated: new Date(),
  totalAssessments: 0,
  averageScore: 0
};

export default function DashboardPage() {
  const [progress, setProgress] = useState<LearningProgress>(defaultProgress);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'assessment' | 'recommendations'>('overview');

  useEffect(() => {
    // Load progress from localStorage or API
    const savedProgress = localStorage.getItem('learningProgress');
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      // Convert date strings back to Date objects
      parsed.lastUpdated = new Date(parsed.lastUpdated);
      parsed.skillLevels.react.lastAssessed = new Date(parsed.skillLevels.react.lastAssessed);
      parsed.skillLevels.nextjs.lastAssessed = new Date(parsed.skillLevels.nextjs.lastAssessed);
      parsed.skillLevels.aiTools.lastAssessed = new Date(parsed.skillLevels.aiTools.lastAssessed);
      parsed.streak.lastActivityDate = new Date(parsed.streak.lastActivityDate);
      parsed.tokenUsage.lastReset = new Date(parsed.tokenUsage.lastReset);
      
      setProgress(parsed);
    }
    setLoading(false);
  }, []);

  const updateProgress = (newProgress: LearningProgress) => {
    setProgress(newProgress);
    localStorage.setItem('learningProgress', JSON.stringify(newProgress));
  };

  const handleAssessmentComplete = (assessment: Assessment) => {
    const updatedProgress = {
      ...progress,
      assessments: [...progress.assessments, assessment],
      totalAssessments: progress.totalAssessments + 1,
      averageScore: ((progress.averageScore * progress.totalAssessments) + assessment.score) / (progress.totalAssessments + 1),
      lastUpdated: new Date(),
      tokenUsage: {
        ...progress.tokenUsage,
        totalTokens: progress.tokenUsage.totalTokens + assessment.openAITokensUsed,
        tokensToday: progress.tokenUsage.tokensToday + assessment.openAITokensUsed,
        estimatedCost: progress.tokenUsage.estimatedCost + (assessment.openAITokensUsed * 0.00015) // GPT-4o-mini pricing
      }
    };

    // Update skill levels based on assessment
    const topicMap: { [key: string]: keyof typeof progress.skillLevels } = {
      'react': 'react',
      'nextjs': 'nextjs',
      'ai-tools': 'aiTools'
    };

    assessment.topicsAssessed.forEach(topic => {
      const skillKey = topicMap[topic];
      if (skillKey && updatedProgress.skillLevels[skillKey]) {
        const currentSkill = updatedProgress.skillLevels[skillKey];
        const newLevel = Math.min(10, Math.max(1, Math.round((currentSkill.level + assessment.score) / 2)));
        const newProgress = Math.min(100, currentSkill.progress + (assessment.score * 2));
        
        updatedProgress.skillLevels[skillKey] = {
          ...currentSkill,
          level: newLevel,
          progress: newProgress,
          lastAssessed: new Date(),
          assessmentCount: currentSkill.assessmentCount + 1
        };
      }
    });

    updateProgress(updatedProgress);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Learning Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Track your progress in React, Next.js, and AI tools for medtech/pharma applications
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: '📊' },
            { id: 'assessment', name: 'Assessment', icon: '🎯' },
            { id: 'recommendations', name: 'Recommendations', icon: '💡' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'assessment' | 'recommendations')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Skills Progress Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProgressCard
              skill={progress.skillLevels.react}
              color="blue"
              description="Component patterns, hooks, state management"
            />
            <ProgressCard
              skill={progress.skillLevels.nextjs}
              color="purple"
              description="SSR/SSG, API routes, middleware, deployment"
            />
            <ProgressCard
              skill={progress.skillLevels.aiTools}
              color="green"
              description="RAG systems, embeddings, medtech integrations"
            />
          </div>

          {/* Learning Stats */}
          <LearningStats progress={progress} />

          {/* Progress Exporter */}
          <ProgressExporter progress={progress} />

          {/* Recent Assessments */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Recent Assessments
            </h3>
            {progress.assessments.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No assessments completed yet. Start with the Assessment tab to begin tracking your progress.
              </p>
            ) : (
              <div className="space-y-3">
                {progress.assessments.slice(-5).reverse().map((assessment) => (
                  <div key={assessment.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {assessment.topicsAssessed.join(', ')} Assessment
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {assessment.date.toLocaleDateString()} • {assessment.questions.length} questions
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {assessment.score.toFixed(1)}/10
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {Math.round(assessment.duration / 60)} min
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'assessment' && (
        <AssessmentChatbot
          progress={progress}
          onAssessmentComplete={handleAssessmentComplete}
        />
      )}

      {activeTab === 'recommendations' && (
        <RecommendationsList
          recommendations={progress.recommendations}
          skillLevels={progress.skillLevels}
          onUpdateRecommendations={(recommendations) => 
            updateProgress({ ...progress, recommendations, lastUpdated: new Date() })
          }
        />
      )}
    </div>
  );
}