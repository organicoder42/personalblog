import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
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
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}