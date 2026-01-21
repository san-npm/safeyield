import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy for Cap.app API to bypass CORS restrictions
 * Usage: /api/proxy/cap?networkId=1&token=USDC
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const networkId = searchParams.get('networkId');
  const token = searchParams.get('token');

  if (!networkId || !token) {
    return NextResponse.json(
      { error: 'Missing networkId or token parameter' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.cap.app/v1/lender/${networkId}/metrics/${token}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Cap API returned ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Cap proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from Cap API' },
      { status: 500 }
    );
  }
}
