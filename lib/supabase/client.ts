import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export type HeroSlide = {
  id: string;
  image_url: string;
  alt: string;
  title: string;
  subtitle: string;
  order_index: number;
  active: boolean;
  is_campaign: boolean;
  campaign_label: string | null;
  campaign_ends_at: string | null;
  created_at: string;
};
