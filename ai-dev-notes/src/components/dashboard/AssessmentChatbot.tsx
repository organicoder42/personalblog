"use client";

import { useState, useEffect, useRef } from 'react';
import { LearningProgress, Assessment, Question, AssessmentSession } from '@/types/dashboard';

interface AssessmentChatbotProps {
  progress: LearningProgress;
  onAssessmentComplete: (assessment: Assessment) => void;
}

type AssessmentState = 'idle' | 'starting' | 'questioning' | 'evaluating' | 'completed';

export default function AssessmentChatbot({ progress, onAssessmentComplete }: AssessmentChatbotProps) {
  const [state, setState] = useState<AssessmentState>('idle');
  const [currentSession, setCurrentSession] = useState<AssessmentSession | null>(null);
  const [messages, setMessages] = useState<Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSkillArea, setSelectedSkillArea] = useState<'react' | 'nextjs' | 'ai-tools'>('react');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startAssessment = async () => {
    setState('starting');
    setIsLoading(true);

    const skillKey = selectedSkillArea === 'ai-tools' ? 'aiTools' : selectedSkillArea;
    const skillData = progress.skillLevels[skillKey as keyof typeof progress.skillLevels];
    const currentLevel = skillData?.level ?? 1;
    const targetDifficulty = Math.min(10, currentLevel + 1);

    console.log('Debug info:');
    console.log('- selectedSkillArea:', selectedSkillArea);
    console.log('- skillKey:', skillKey);
    console.log('- progress.skillLevels:', progress.skillLevels);
    console.log('- skillData:', skillData);
    console.log('- currentLevel:', currentLevel);
    console.log('- targetDifficulty:', targetDifficulty);

    try {
      console.log('Starting assessment for:', selectedSkillArea, 'at level:', currentLevel);
      
      const requestPayload = {
        action: 'generate_questions',
        payload: {
          skillArea: selectedSkillArea,
          currentLevel,
          difficulty: targetDifficulty,
          questionCount: 5
        }
      };

      console.log('Request payload:', requestPayload);

      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API error response:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to generate questions`);
      }

      const data = await response.json();
      console.log('Assessment data received:', data);

      if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error('No questions received from API');
      }
      
      const session: AssessmentSession = {
        id: `session-${Date.now()}`,
        startTime: new Date(),
        currentQuestionIndex: 0,
        questions: data.questions,
        responses: [],
        skillFocus: selectedSkillArea,
        difficultyLevel: targetDifficulty,
        isActive: true
      };

      setCurrentSession(session);
      setState('questioning');
      
      const initialMessage = {
        role: 'assistant' as const,
        content: `Great! I've prepared ${data.questions.length} questions to assess your ${selectedSkillArea} skills for medtech/pharma applications. We'll start with the basics and adapt based on your responses. Let's begin!`,
        timestamp: new Date()
      };
      
      setMessages([initialMessage]);
      
      // Show first question
      setTimeout(() => {
        showCurrentQuestion(session);
      }, 1000);

    } catch (error) {
      console.error('Error starting assessment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setMessages([{
        role: 'assistant',
        content: `Sorry, I encountered an error starting the assessment: ${errorMessage}. Please check the console for more details and ensure your OpenAI API key is configured.`,
        timestamp: new Date()
      }]);
      setState('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const showCurrentQuestion = (session: AssessmentSession) => {
    const currentQuestion = session.questions[session.currentQuestionIndex];
    if (!currentQuestion) return;

    const questionMessage = {
      role: 'assistant' as const,
      content: `**Question ${session.currentQuestionIndex + 1}/${session.questions.length}**\n\n${currentQuestion.question}${
        currentQuestion.type === 'multiple-choice' && currentQuestion.options 
          ? '\n\n' + currentQuestion.options.map((option, idx) => `${String.fromCharCode(65 + idx)}. ${option}`).join('\n')
          : ''
      }\n\n*Difficulty: ${currentQuestion.difficulty}/10*`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, questionMessage]);
  };

  const submitAnswer = async () => {
    if (!currentSession || !currentAnswer.trim()) return;

    setIsLoading(true);
    const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
    const skillKey = selectedSkillArea === 'ai-tools' ? 'aiTools' : selectedSkillArea;
    
    // Add user's answer to messages
    const userMessage = {
      role: 'user' as const,
      content: currentAnswer,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Evaluate the answer
      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate_answer',
          payload: {
            question: currentQuestion,
            userAnswer: currentAnswer,
            skillArea: selectedSkillArea,
            currentLevel: progress.skillLevels[skillKey as keyof typeof progress.skillLevels].level
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to evaluate answer');
      }

      const data = await response.json();
      
      // Store the evaluated response
      const evaluatedQuestion: Question = {
        ...currentQuestion,
        userAnswer: currentAnswer,
        score: data.evaluation.score,
        feedback: data.evaluation.feedback
      };

      const updatedSession = {
        ...currentSession,
        responses: [...currentSession.responses, evaluatedQuestion],
        currentQuestionIndex: currentSession.currentQuestionIndex + 1
      };

      setCurrentSession(updatedSession);
      setCurrentAnswer('');

      // Show feedback
      const feedbackMessage = {
        role: 'assistant' as const,
        content: `**Score: ${data.evaluation.score}/10**\n\n${data.evaluation.feedback}${
          data.evaluation.strengths?.length > 0 
            ? '\n\n**Strengths:**\n' + data.evaluation.strengths.map((s: string) => `• ${s}`).join('\n')
            : ''
        }${
          data.evaluation.improvements?.length > 0
            ? '\n\n**Areas for improvement:**\n' + data.evaluation.improvements.map((i: string) => `• ${i}`).join('\n')
            : ''
        }`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, feedbackMessage]);

      // Check if assessment is complete
      if (updatedSession.currentQuestionIndex >= updatedSession.questions.length) {
        // Complete the assessment
        setTimeout(() => completeAssessment(updatedSession), 2000);
      } else {
        // Show next question
        setTimeout(() => showCurrentQuestion(updatedSession), 2000);
      }

    } catch (error) {
      console.error('Error evaluating answer:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error evaluating your answer. Let\'s continue with the next question.',
        timestamp: new Date()
      }]);
      
      // Continue to next question without evaluation
      const nextIndex = currentSession.currentQuestionIndex + 1;
      if (nextIndex < currentSession.questions.length) {
        const updatedSession = { ...currentSession, currentQuestionIndex: nextIndex };
        setCurrentSession(updatedSession);
        setTimeout(() => showCurrentQuestion(updatedSession), 1000);
      } else {
        completeAssessment(currentSession);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const completeAssessment = (session: AssessmentSession) => {
    setState('completed');
    
    const totalScore = session.responses.reduce((sum, q) => sum + (q.score || 0), 0) / session.responses.length;
    const duration = Math.floor((Date.now() - session.startTime.getTime()) / 1000);
    
    const assessment: Assessment = {
      id: session.id,
      date: new Date(),
      questions: session.responses,
      score: totalScore,
      feedback: `Completed ${selectedSkillArea} assessment with an average score of ${totalScore.toFixed(1)}/10`,
      topicsAssessed: [selectedSkillArea],
      openAITokensUsed: session.responses.length * 150, // Estimate
      model: 'gpt-4o-mini',
      duration,
      completionRate: (session.responses.length / session.questions.length) * 100
    };

    onAssessmentComplete(assessment);

    const completionMessage = {
      role: 'assistant' as const,
      content: `🎉 **Assessment Complete!**\n\nYour ${selectedSkillArea} assessment is finished!\n\n**Results:**\n• Overall Score: ${totalScore.toFixed(1)}/10\n• Questions Answered: ${session.responses.length}/${session.questions.length}\n• Time Taken: ${Math.floor(duration / 60)} minutes\n\nYour progress has been updated and new recommendations will be generated based on your performance. Great work!`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, completionMessage]);
  };

  const resetAssessment = () => {
    setState('idle');
    setCurrentSession(null);
    setMessages([]);
    setCurrentAnswer('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (state === 'questioning' && !isLoading) {
        submitAnswer();
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {state === 'idle' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🤖 AI-Powered Assessment
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Take an adaptive assessment powered by GPT-4o-mini to evaluate your skills in React, Next.js, 
              and AI tools for medtech/pharma applications. Questions adapt to your level and provide detailed feedback.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Choose your focus area:
            </label>
            <select
              value={selectedSkillArea}
              onChange={(e) => setSelectedSkillArea(e.target.value as 'react' | 'nextjs' | 'ai-tools')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="react">React (Level {progress.skillLevels.react.level}/10)</option>
              <option value="nextjs">Next.js (Level {progress.skillLevels.nextjs.level}/10)</option>
              <option value="ai-tools">AI Tools (Level {progress.skillLevels.aiTools.level}/10)</option>
            </select>
          </div>

          <div className="space-y-4">
            <button
              onClick={startAssessment}
              disabled={isLoading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors text-lg font-medium"
            >
              {isLoading ? 'Preparing Assessment...' : 'Start Assessment'}
            </button>
            
            <button
              onClick={async () => {
                console.log('Testing API connection...');
                try {
                  const response = await fetch('/api/assessment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      action: 'generate_questions',
                      payload: { skillArea: 'react', currentLevel: 3, difficulty: 4, questionCount: 1 }
                    })
                  });
                  const data = await response.json();
                  console.log('Test API response:', data);
                  alert('API test successful! Check console for details.');
                } catch (error) {
                  console.error('Test API error:', error);
                  alert(`API test failed: ${error}`);
                }
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm"
            >
              Test API Connection
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            <p>💡 Assessment typically takes 10-15 minutes</p>
            <p>🔒 Powered by GPT-4o-mini for cost-effective, high-quality evaluation</p>
          </div>
        </div>
      )}

      {(state === 'starting' || state === 'questioning' || state === 'evaluating' || state === 'completed') && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedSkillArea.charAt(0).toUpperCase() + selectedSkillArea.slice(1)} Assessment
                </h3>
                {currentSession && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Question {currentSession.currentQuestionIndex + 1} of {currentSession.questions.length}
                  </p>
                )}
              </div>
              <button
                onClick={resetAssessment}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-2xl px-4 py-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 max-w-xs lg:max-w-2xl px-4 py-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          {state === 'questioning' && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex space-x-3">
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your answer here..."
                  rows={3}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none"
                  disabled={isLoading}
                />
                <button
                  onClick={submitAnswer}
                  disabled={isLoading || !currentAnswer.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-start"
                >
                  Submit
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Press Enter to submit, Shift+Enter for new line
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}