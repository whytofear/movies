import { Metadata } from "next";
import { getCanonicalUrl } from "../../../lib/seo";

export const metadata: Metadata = {
  title: "Personal Movie Watchlist Manager |SimilarMovie.me",
  description:
    "Create and manage your personal movie watchlist. Save films to watch later, organize by genre or mood.",
  keywords: [
    "movie watchlist",
    "personal movie list",
    "save movies to watch",
    "movie collection manager",
    "film watchlist",
    "movie bookmark tool",
    "movie planning tool",
    "organize movies",
    "movie wish list",
    "movie tracker",
  ].join(", "),
  alternates: {
    canonical: getCanonicalUrl("/tools/watchlist"),
  },
  openGraph: {
    title: "Personal Movie Watchlist Manager |SimilarMovie.me",
    description:
      "Create and manage your personal movie watchlist. Save films to watch later, organize by genre or mood.",
    url: getCanonicalUrl("/tools/watchlist"),
  },
};

export default function WatchlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
