import { Metadata } from "next";
import { getCanonicalUrl } from "../../lib/seo";

export const metadata: Metadata = {
  title: "Movie Search Results |SimilarMovie.me",
  description:
    "Search our extensive movie database by title, cast, director, or keywords. Find any film with our powerful search engine.",
  keywords: [
    "movie search",
    "film search",
    "movie database search",
    "find movies",
    "search by actor",
    "search by director",
    "movie title search",
    "film database",
    "movie finder",
    "cinema search",
  ].join(", "),
  alternates: {
    canonical: getCanonicalUrl("/search"),
  },
  openGraph: {
    title: "Movie Search Results |SimilarMovie.me",
    description:
      "Search our extensive movie database by title, cast, director, or keywords. Find any film with our powerful search engine.",
    url: getCanonicalUrl("/search"),
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
