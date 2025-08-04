"use client";

import { useState } from 'react';
import { Recommendation, SkillLevel } from '@/types/dashboard';

interface RecommendationsListProps {
  recommendations: Recommendation[];
  skillLevels: {
    react: SkillLevel;
    nextjs: SkillLevel;
    aiTools: SkillLevel;
  };
  onUpdateRecommendations: (recommendations: Recommendation[]) => void;
}

export default function RecommendationsList({ 
  recommendations, 
  skillLevels, 
  onUpdateRecommendations 
}: RecommendationsListProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [filter, setFilter] = useState<'all' | 'react' | 'nextjs' | 'ai-tools'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const generateRecommendations = async () => {
    setIsGenerating(true);
    
    try {
      // Analyze weak areas based on skill levels
      const weakAreas = [];
      if (skillLevels.react.level < 5) weakAreas.push('React fundamentals');
      if (skillLevels.nextjs.level < 5) weakAreas.push('Next.js architecture');
      if (skillLevels.aiTools.level < 5) weakAreas.push('AI integration patterns');

      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_recommendations',
          payload: {
            skillLevels,
            weakAreas
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate recommendations');
      }

      const data = await response.json();
      
      // Add metadata to recommendations
      const enhancedRecs: Recommendation[] = data.recommendations.map((rec: Omit<Recommendation, 'id' | 'completed' | 'dateGenerated'>) => ({
        ...rec,
        id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        completed: false,
        dateGenerated: new Date()
      }));

      onUpdateRecommendations(enhancedRecs);

    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Could add error state/notification here
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleCompleted = (id: string) => {
    const updated = recommendations.map(rec => 
      rec.id === id ? { ...rec, completed: !rec.completed } : rec
    );
    onUpdateRecommendations(updated);
  };

  const removeRecommendation = (id: string) => {
    const updated = recommendations.filter(rec => rec.id !== id);
    onUpdateRecommendations(updated);
  };

  const filteredRecommendations = recommendations.filter(rec => {
    const skillMatch = filter === 'all' || rec.skillArea === filter;
    const priorityMatch = priorityFilter === 'all' || rec.priority === priorityFilter;
    return skillMatch && priorityMatch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getSkillAreaColor = (skillArea: string) => {
    switch (skillArea) {
      case 'react': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'nextjs': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'ai-tools': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exercise': return '💪';
      case 'concept': return '🧠';
      case 'project': return '🚀';
      case 'resource': return '📚';
      default: return '📝';
    }
  };

  const completedCount = recommendations.filter(rec => rec.completed).length;
  const completionRate = recommendations.length > 0 ? (completedCount / recommendations.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Learning Recommendations
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            AI-generated suggestions tailored to your skill levels and medtech/pharma focus
          </p>
        </div>
        <button
          onClick={generateRecommendations}
          disabled={isGenerating}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {isGenerating ? 'Generating...' : 'Generate New Recommendations'}
        </button>
      </div>

      {/* Stats */}
      {recommendations.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Progress Overview</h3>
            <span className="text-2xl">📈</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{recommendations.length}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Recommendations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{completionRate.toFixed(0)}%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {recommendations.length > 0 && (
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Skill Area
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'react' | 'nextjs' | 'ai-tools')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Areas</option>
              <option value="react">React</option>
              <option value="nextjs">Next.js</option>
              <option value="ai-tools">AI Tools</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as 'all' | 'high' | 'medium' | 'low')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>
      )}

      {/* Recommendations List */}
      {filteredRecommendations.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {recommendations.length === 0 ? 'No Recommendations Yet' : 'No Matching Recommendations'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {recommendations.length === 0 
              ? 'Generate AI-powered learning recommendations based on your skill levels and assessment results.'
              : 'Try adjusting your filters to see more recommendations.'
            }
          </p>
          {recommendations.length === 0 && (
            <button
              onClick={generateRecommendations}
              disabled={isGenerating}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              {isGenerating ? 'Generating...' : 'Generate Recommendations'}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecommendations.map((rec) => (
            <div
              key={rec.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all ${
                rec.completed ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getTypeIcon(rec.type)}</div>
                  <div>
                    <h4 className={`text-lg font-semibold ${rec.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                      {rec.title}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                        {rec.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillAreaColor(rec.skillArea)}`}>
                        {rec.skillArea}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ~{rec.estimatedTime} min
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleCompleted(rec.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      rec.completed
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    title={rec.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {rec.completed ? '✓' : '○'}
                  </button>
                  <button
                    onClick={() => removeRecommendation(rec.id)}
                    className="p-2 rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                    title="Remove recommendation"
                  >
                    ×
                  </button>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {rec.description}
              </p>

              {rec.resources && rec.resources.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Resources:</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {rec.resources.map((resource, idx) => (
                      <a
                        key={idx}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm"
                      >
                        <span className="text-blue-600 dark:text-blue-400">
                          {resource.type === 'documentation' && '📖'}
                          {resource.type === 'tutorial' && '🎓'}
                          {resource.type === 'video' && '🎥'}
                          {resource.type === 'article' && '📰'}
                        </span>
                        <span className="text-gray-900 dark:text-gray-100 truncate">
                          {resource.title}
                        </span>
                        <span className="text-gray-400 dark:text-gray-500">↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}