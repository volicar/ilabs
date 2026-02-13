import { NextResponse } from 'next/server';

const PLACE_ID = process.env.GOOGLE_PLACE_ID!;
const API_KEY = process.env.GOOGLE_API_KEY!;

export async function GET() {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,reviews,user_ratings_total&language=pt-BR&key=${API_KEY}`,
    { next: { revalidate: 86400 } } // cache 24h
  );

  const data = await res.json();

  const reviews =
    data.result?.reviews?.map((r: any) => ({
      id: r.time,
      author: r.author_name,
      text: r.text,
      rating: r.rating,
    })) || [];

  return NextResponse.json(reviews);
}
