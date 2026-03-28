import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Gadi Ghar - Pakistan\'s Premier Car Marketplace';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #1a1a1a, #000000)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          {/* Simulated Logo */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: '#dc2626', // red-600
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 20,
              fontSize: 40,
              fontWeight: 'bold',
            }}
          >
            G
          </div>
          <div style={{ fontSize: 80, fontWeight: 900, letterSpacing: '-0.05em' }}>
            Gadi Ghar
          </div>
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 400,
            color: '#a1a1aa', // gray-400
            textAlign: 'center',
            maxWidth: '80%',
          }}
        >
          Pakistan&apos;s Premier AI-Powered Car Marketplace
        </div>
        <div
          style={{
            marginTop: 60,
            display: 'flex',
            gap: 40,
          }}
        >
           <div style={{ padding: '10px 20px', background: '#333', borderRadius: 10, fontSize: 24 }}>Buy</div>
           <div style={{ padding: '10px 20px', background: '#333', borderRadius: 10, fontSize: 24 }}>Sell</div>
           <div style={{ padding: '10px 20px', background: '#333', borderRadius: 10, fontSize: 24 }}>Finance</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
