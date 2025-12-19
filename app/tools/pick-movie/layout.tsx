import { Metadata } from "next";
import { getCanonicalUrl } from "../../../lib/seo";

export const metadata: Metadata = {
  title: "Pick a Movie for Me |SimilarMovie.me",
  description:
    "Can't decide what to watch? Our smart movie picker analyzes your mood, preferences, and time to select the perfect film.",
  keywords: [
    "movie picker",
    "smart movie selection",
    "what movie to watch",
    "random movie picker",
    "movie recommendation tool",
    "film selector",
    "movie decision maker",
    "personalized movie picker",
    "smart movie chooser",
    "instant movie suggestions",
  ].join(", "),
  alternates: {
    canonical: getCanonicalUrl("/tools/pick-movie"),
  },
  openGraph: {
    title: "Smart Movie Picker |SimilarMovie.me",
    description:
      "Can't decide what to watch? Our smart movie picker analyzes your mood, preferences, and time to select the perfect film.",
    url: getCanonicalUrl("/tools/pick-movie"),
  },
};

export default function PickMovieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}