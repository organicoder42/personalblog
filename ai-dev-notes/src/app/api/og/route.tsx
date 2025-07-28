import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'AI Development Notes';
    const summary = searchParams.get('summary') || 'Insights, tutorials, and discoveries in AI development';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1a1a1a',
            backgroundImage: 'linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 100%)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Header */}
          <div
            style={{
              position: 'absolute',
              top: 60,
              left: 60,
              display: 'flex',
              alignItems: 'center',
              color: '#60a5fa',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
              }}
            >
              <span style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>AI</span>
            </div>
            <span style={{ fontSize: 24, fontWeight: 600 }}>Dev Notes</span>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '0 80px',
              maxWidth: '900px',
            }}
          >
            <h1
              style={{
                fontSize: title.length > 50 ? 48 : 64,
                fontWeight: 800,
                color: 'white',
                lineHeight: 1.1,
                marginBottom: 24,
                textAlign: 'center',
              }}
            >
              {title}
            </h1>
            
            {summary && (
              <p
                style={{
                  fontSize: 24,
                  color: '#9ca3af',
                  lineHeight: 1.4,
                  textAlign: 'center',
                  maxWidth: '600px',
                }}
              >
                {summary}
              </p>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: 60,
              left: 60,
              right: 60,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#6b7280',
              fontSize: 18,
            }}
          >
            <span>ai-dev-notes.vercel.app</span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  marginRight: 8,
                  animation: 'pulse 2s infinite',
                }}
              />
              <span>AI • Development • Insights</span>
            </div>
          </div>

          {/* Decorative elements */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 400,
              height: 400,
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: 300,
              height: 300,
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}