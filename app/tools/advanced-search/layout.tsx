import { Metadata } from "next";
import { getCanonicalUrl } from "../../../lib/seo";

export const metadata: Metadata = {
  title: "Advanced Movie Search |SimilarMovie.me",
  description:
    "Search our extensive movie database with advanced filters including genre, rating, year, runtime, cast, and director.",
  keywords: [
    "advanced movie search",
    "movie database search",
    "film search engine",
    "movie filter tool",
    "detailed movie search",
    "movie search by genre",
    "movie search by rating",
    "movie search by year",
    "comprehensive movie search",
    "professional movie search",
  ].join(", "),
  alternates: {
    canonical: getCanonicalUrl("/tools/advanced-search"),
  },
  openGraph: {
    title: "Advanced Movie Search |SimilarMovie.me",
    description:
      "Search our extensive movie database with advanced filters including genre, rating, year, runtime, cast, and director.",
    url: getCanonicalUrl("/tools/advanced-search"),
  },
};

export default function AdvancedSearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
