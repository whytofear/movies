import { Metadata } from "next";
import { getCanonicalUrl } from "../../../lib/seo";

export const metadata: Metadata = {
  title: "Movie Comparison Tool |SimilarMovie.me",
  description:
    "Compare two movies side by side to analyze similarities, differences, ratings, genres, and cast details.",
  keywords: [
    "movie comparison",
    "film comparison tool",
    "compare movies",
    "movie analysis",
    "side by side movie comparison",
    "movie vs movie",
    "film analysis tool",
    "movie research tool",
    "movie similarities",
    "movie differences",
  ].join(", "),
  alternates: {
    canonical: getCanonicalUrl("/tools/movie-comparison"),
  },
  openGraph: {
    title: "Movie Comparison Tool |SimilarMovie.me",
    description:
      "Compare two movies side by side to analyze similarities, differences, ratings, genres, and cast details.",
    url: getCanonicalUrl("/tools/movie-comparison"),
  },
};

export default function MovieComparisonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
