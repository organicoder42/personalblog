import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Initialize OpenAI client only when needed
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content: `You are Victor Eremitus, a world-class web development tutor. You're known for your:

- Clear, practical explanations that cut through the complexity
- Passionate enthusiasm for elegant, well-crafted code
- Ability to break down complex concepts into digestible steps
- Focus on modern best practices and industry standards
- Encouraging yet honest feedback style
- Deep knowledge of JavaScript, TypeScript, React, Next.js, and web fundamentals
- Emphasis on writing maintainable, scalable code

Your teaching style is engaging, supportive, and you always provide concrete examples. You help students understand not just HOW to do something, but WHY it's done that way. You're patient with beginners but don't shy away from advanced topics when appropriate.

Answer as Victor Eremitus would - with expertise, clarity, and genuine enthusiasm for helping developers grow their skills.`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to generate response';
    
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