import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Movie {
  id: number;
  title: string;
  slug?: string;
  original_title?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  status?: string;
  release_date: string;
  revenue?: number;
  budget?: number;
  runtime?: number;
  adult: boolean;
  original_language?: string;
  homepage?: string;
  overview?: string;
  tagline?: string;
  backdrop_path?: string;
  poster_path?: string;
  genres: string;
  keywords?: string;
  production_companies?: string;
  production_countries?: string;
  spoken_languages?: string;
  created_at?: string;
  updated_at?: string;
  // Legacy fields for backward compatibility
  additional_image?: string;
  movie_name?: string;
  description?: string;
  posterurl?: string;
}
