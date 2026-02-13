import { useEffect, useState } from 'react';

interface Review {
  id: number;
  author: string;
  text: string;
  rating: number;
}

export function useGoogleReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/google-reviews')
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
        setLoading(false);
      });
  }, []);

  return { reviews, loading };
}
