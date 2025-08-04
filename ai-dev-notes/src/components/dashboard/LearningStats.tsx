"use client";

import { LearningProgress } from '@/types/dashboard';

interface LearningStatsProps {
  progress: LearningProgress;
}

export default function LearningStats({ progress }: LearningStatsProps) {
  const formatCost = (cost: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4
    }).format(cost);
  };

  const getStreakIcon = (streak: number) => {
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '⚡';
    if (streak >= 7) return '🎯';
    if (streak >= 3) return '📈';
    return '🌱';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Learning Streak */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Learning Streak</h4>
          <span className="text-2xl">{getStreakIcon(progress.streak.currentStreak)}</span>
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {progress.streak.currentStreak} days
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Longest: {progress.streak.longestStreak} days
        </div>
      </div>

      {/* Total Assessments */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Assessments</h4>
          <span className="text-2xl">📝</span>
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {progress.totalAssessments}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Avg Score: {progress.averageScore.toFixed(1)}/10
        </div>
      </div>

      {/* Token Usage */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">AI Usage (GPT-4o-mini)</h4>
          <span className="text-2xl">🤖</span>
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {progress.tokenUsage.totalTokens.toLocaleString()}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Cost: {formatCost(progress.tokenUsage.estimatedCost)}
        </div>
      </div>

      {/* Goals Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Goals</h4>
          <span className="text-2xl">🎯</span>
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {progress.goals.length}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {progress.goals.filter(goal => {
            const avgLevel = (progress.skillLevels.react.level + 
                            progress.skillLevels.nextjs.level + 
                            progress.skillLevels.aiTools.level) / 3;
            return avgLevel >= goal.targetSkillLevel;
          }).length} completed
        </div>
      </div>
    </div>
  );
}