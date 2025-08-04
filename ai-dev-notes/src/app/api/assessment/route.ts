import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { ChatConfig } from '@/types/dashboard';

const chatConfig: ChatConfig = {
  model: 'gpt-4o-mini',
  temperature: 0.7,
  max_tokens: 1000,
  top_p: 0.9,
  frequency_penalty: 0.3,
  presence_penalty: 0.3,
};

export async function POST(request: NextRequest) {
  try {
    const { action, payload } = await request.json();

    console.log('Assessment API called with action:', action);

    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is missing');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    switch (action) {
      case 'generate_questions':
        return await generateQuestions(openai, payload);
      case 'evaluate_answer':
        return await evaluateAnswer(openai, payload);
      case 'generate_recommendations':
        return await generateRecommendations(openai, payload);
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Assessment API error:', error);
    
    let errorMessage = 'Failed to process request';
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'OpenAI API key is not properly configured';
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
      } else if (error.message.includes('quota')) {
        errorMessage = 'API quota exceeded. Please contact the administrator.';
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

async function generateQuestions(openai: OpenAI, payload: { skillArea: string; currentLevel: number; difficulty: number; questionCount?: number }) {
  const { skillArea, currentLevel, difficulty, questionCount = 5 } = payload;
  
  console.log('Generating questions for:', { skillArea, currentLevel, difficulty, questionCount });
  
  const systemPrompt = `You are an expert technical interviewer specializing in ${skillArea} for medtech/pharma applications. 

Current Context:
- Skill Area: ${skillArea}
- User's Current Level: ${currentLevel}/10
- Target Difficulty: ${difficulty}/10
- Industry Focus: Medtech/Pharma applications with emphasis on HIPAA compliance, patient data handling, and regulatory requirements

Generate ${questionCount} assessment questions that progressively test knowledge. Include:
1. Practical scenario-based questions relevant to healthcare technology
2. Questions about best practices for handling sensitive medical data
3. Integration challenges with systems like Podio CRM
4. Real-world implementation scenarios

For each question, provide:
- Clear question text
- Question type (multiple-choice, open-ended, or scenario-based)
- Difficulty level (1-10)
- If multiple-choice, provide 4 options with one correct answer
- Key concepts being tested

Return valid JSON with this structure:
{
  "questions": [
    {
      "id": "string",
      "type": "multiple-choice|open-ended|scenario-based",
      "question": "string",
      "difficulty": number,
      "options": ["string"] (if multiple-choice),
      "correctAnswer": "string" (if multiple-choice),
      "keyTopics": ["string"]
    }
  ]
}`;

  const userPrompt = `Generate ${questionCount} ${skillArea} assessment questions for a user at level ${currentLevel}/10, targeting difficulty ${difficulty}/10. Focus on medtech/pharma applications.`;

  try {
    const completion = await openai.chat.completions.create({
      ...chatConfig,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
    });

    console.log('OpenAI completion created, tokens used:', completion.usage?.total_tokens);

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      console.error('No response content from OpenAI');
      throw new Error('No response from OpenAI');
    }

    console.log('OpenAI response received, length:', response.length);

    try {
      const parsedResponse = JSON.parse(response);
      console.log('Successfully parsed response, questions count:', parsedResponse.questions?.length);
      
      return NextResponse.json({
        questions: parsedResponse.questions || [],
        tokensUsed: completion.usage?.total_tokens || 0,
        model: chatConfig.model
      });
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', response);
      console.error('Parse error:', parseError);
      
      // Fallback: create a simple question if parsing fails
      const fallbackQuestions = [{
        id: 'fallback-1',
        type: 'open-ended',
        question: `Explain a key concept in ${skillArea} that's important for medtech/pharma applications.`,
        difficulty: currentLevel,
        keyTopics: [skillArea]
      }];
      
      return NextResponse.json({
        questions: fallbackQuestions,
        tokensUsed: completion.usage?.total_tokens || 0,
        model: chatConfig.model,
        warning: 'Used fallback question due to parsing error'
      });
    }
  } catch (openaiError) {
    console.error('OpenAI API error:', openaiError);
    throw new Error(`OpenAI API error: ${openaiError instanceof Error ? openaiError.message : 'Unknown error'}`);
  }
}

async function evaluateAnswer(openai: OpenAI, payload: { question: { question: string; type: string; correctAnswer?: string }; userAnswer: string; skillArea: string; currentLevel: number }) {
  const { question, userAnswer, skillArea, currentLevel } = payload;

  const systemPrompt = `You are an expert technical evaluator for ${skillArea} in medtech/pharma contexts.

Evaluation Criteria:
- Technical accuracy and depth of understanding
- Practical application in healthcare/medtech environments
- Consideration of HIPAA compliance and security best practices
- Problem-solving approach and reasoning
- Knowledge of industry-specific challenges

User's current skill level: ${currentLevel}/10

Provide detailed feedback including:
1. Score (1-10 scale)
2. Specific strengths in the answer
3. Areas for improvement
4. Suggestions for learning resources
5. Industry-specific considerations they missed or included well

Return valid JSON:
{
  "score": number,
  "feedback": "string",
  "strengths": ["string"],
  "improvements": ["string"],
  "recommendations": ["string"]
}`;

  const userPrompt = `
Question: ${question.question}
${question.type === 'multiple-choice' ? `Correct Answer: ${question.correctAnswer}` : ''}
User's Answer: ${userAnswer}

Please evaluate this answer thoroughly.`;

  const completion = await openai.chat.completions.create({
    ...chatConfig,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) {
    throw new Error('No response from OpenAI');
  }

  try {
    const parsedResponse = JSON.parse(response);
    return NextResponse.json({
      evaluation: parsedResponse,
      tokensUsed: completion.usage?.total_tokens || 0,
      model: chatConfig.model
    });
  } catch {
    console.error('Failed to parse OpenAI response:', response);
    throw new Error('Invalid response format from AI');
  }
}

async function generateRecommendations(openai: OpenAI, payload: { skillLevels: { react?: { level: number }; nextjs?: { level: number }; aiTools?: { level: number } }; weakAreas?: string[] }) {
  const { skillLevels, weakAreas } = payload;

  const systemPrompt = `You are a personalized learning advisor specializing in React, Next.js, and AI tools for medtech/pharma applications.

User Profile:
- React Level: ${skillLevels.react?.level || 1}/10
- Next.js Level: ${skillLevels.nextjs?.level || 1}/10  
- AI Tools Level: ${skillLevels.aiTools?.level || 1}/10
- Identified Weak Areas: ${weakAreas?.join(', ') || 'None specified'}

Generate 5-8 personalized learning recommendations focusing on:
1. Addressing specific weak areas identified in assessments
2. Progressive skill building appropriate to current levels
3. Medtech/pharma industry applications and compliance requirements
4. Practical projects that combine multiple skill areas
5. Preparation for common healthcare technology challenges

Return valid JSON:
{
  "recommendations": [
    {
      "id": "string",
      "type": "exercise|concept|project|resource",
      "title": "string",
      "description": "string",
      "priority": "high|medium|low",
      "skillArea": "react|nextjs|ai-tools",
      "estimatedTime": number,
      "resources": [
        {
          "title": "string",
          "url": "string",
          "type": "documentation|tutorial|video|article"
        }
      ]
    }
  ]
}`;

  const completion = await openai.chat.completions.create({
    ...chatConfig,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Generate personalized learning recommendations based on my profile.' }
    ],
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) {
    throw new Error('No response from OpenAI');
  }

  try {
    const parsedResponse = JSON.parse(response);
    return NextResponse.json({
      recommendations: parsedResponse.recommendations,
      tokensUsed: completion.usage?.total_tokens || 0,
      model: chatConfig.model
    });
  } catch {
    console.error('Failed to parse OpenAI response:', response);
    throw new Error('Invalid response format from AI');
  }
}