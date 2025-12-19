import { Metadata } from "next";
import { getCanonicalUrl } from "../../../lib/seo";

export const metadata: Metadata = {
  title: "Movie Recommendation Engine |SimilarMovie.me",
  description:
    "Get personalized movie recommendations based on your preferences. Filter by genre, rating, year, and discover films.",
  keywords: [
    "movie recommendations",
    "personalized movie suggestions",
    "movie recommendation engine",
    "film recommendations",
    "movie filter tool",
    "custom movie search",
    "movie discovery engine",
    "tailored movie picks",
    "movie preference matching",
    "smart movie finder",
  ].join(", "),
  alternates: {
    canonical: getCanonicalUrl("/tools/movie-recommender"),
  },
  openGraph: {
    title: "Movie Recommendation Engine |SimilarMovie.me",
    description:
      "Get personalized movie recommendations based on your preferences. Filter by genre, rating, year, and discover films.",
    url: getCanonicalUrl("/tools/movie-recommender"),
  },
};

export default function MovieRecommenderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
