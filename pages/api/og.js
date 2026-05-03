import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  try {
    const { searchParams } = new URL(req.url);

    // ?title=<title>&topic=<topic>
    const title = searchParams.has('title')
      ? searchParams.get('title').slice(0, 100)
      : 'Sughosh Dixit — Data Scientist & Writer';
    const topic = searchParams.get('topic') || 'Blog';

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: '#161513',
            backgroundSize: '150px 150px',
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '80px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Background decoration */}
          <div
            style={{
              position: 'absolute',
              top: '-10%',
              right: '-10%',
              width: '600px',
              height: '600px',
              backgroundColor: 'rgba(199, 70, 52, 0.1)',
              borderRadius: '50%',
              filter: 'blur(100px)',
            }}
          />
          
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                backgroundColor: '#C74634',
                color: 'white',
                padding: '8px 24px',
                borderRadius: '50px',
                fontSize: '24px',
                fontWeight: 'bold',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              {topic}
            </div>
          </div>

          <div
            style={{
              fontSize: '84px',
              fontWeight: '800',
              color: 'white',
              lineHeight: '1.1',
              marginBottom: '60px',
              maxWidth: '900px',
              fontFamily: 'serif',
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 'auto',
            }}
          >
            <img
              width="80"
              height="80"
              src={`${new URL(req.url).origin}/about.jpeg`}
              style={{
                borderRadius: '50%',
                marginRight: '24px',
                border: '3px solid #C74634',
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                Sughosh Dixit
              </div>
              <div
                style={{
                  fontSize: '24px',
                  color: '#B8B4B0',
                }}
              >
                Data Scientist & Writer
              </div>
            </div>
          </div>
          
          {/* URL decoration */}
          <div
            style={{
              position: 'absolute',
              bottom: '80px',
              right: '80px',
              fontSize: '24px',
              color: '#6E6B68',
              fontWeight: 'bold',
            }}
          >
            sughoshdixit.com
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
