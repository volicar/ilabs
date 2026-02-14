// app/api/google-reviews/route.ts

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get('placeId');
  
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

  if (!apiKey || !placeId) {
    return NextResponse.json(
      { error: 'API Key ou Place ID não configurados' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}&language=pt-BR`
    );

    const data = await response.json();

    if (data.status === 'OK') {
      return NextResponse.json({
        reviews: data.result.reviews || [],
      });
    } else {
      return NextResponse.json(
        { error: 'Erro ao buscar reviews', details: data },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao conectar com Google Places API' },
      { status: 500 }
    );
  }
}