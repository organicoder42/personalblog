"use client";

import { SkillLevel } from '@/types/dashboard';

interface ProgressCardProps {
  skill: SkillLevel;
  color: 'blue' | 'purple' | 'green';
  description: string;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    progress: 'bg-blue-500',
    text: 'text-blue-900 dark:text-blue-100',
    accent: 'text-blue-600 dark:text-blue-400'
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800',
    progress: 'bg-purple-500',
    text: 'text-purple-900 dark:text-purple-100',
    accent: 'text-purple-600 dark:text-purple-400'
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    progress: 'bg-green-500',
    text: 'text-green-900 dark:text-green-100',
    accent: 'text-green-600 dark:text-green-400'
  }
};

export default function ProgressCard({ skill, color, description }: ProgressCardProps) {
  const colors = colorClasses[color];
  
  const getLevelText = (level: number) => {
    if (level <= 2) return 'Beginner';
    if (level <= 5) return 'Intermediate';
    if (level <= 8) return 'Advanced';
    return 'Expert';
  };

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-lg p-6 transition-all hover:shadow-md`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className={`text-xl font-semibold ${colors.text}`}>
            {skill.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {description}
          </p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${colors.accent}`}>
            {skill.level}/10
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {getLevelText(skill.level)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className={colors.accent}>{skill.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`${colors.progress} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${skill.progress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between text-sm">
        <div>
          <span className="text-gray-500 dark:text-gray-400">Assessments: </span>
          <span className={colors.text}>{skill.assessmentCount}</span>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Last: </span>
          <span className={colors.text}>
            {skill.lastAssessed.toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}