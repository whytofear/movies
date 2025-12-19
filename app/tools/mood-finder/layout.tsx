import { Metadata } from "next";
import { getCanonicalUrl } from "../../../lib/seo";

export const metadata: Metadata = {
  title: "Mood Based Movie Finder |SimilarMovie.me",
  description:
    "Discover movies that perfectly match your current mood. Whether happy, sad, excited, or contemplative - find films for emotions.",
  keywords: [
    "mood-based movies",
    "movies by emotion",
    "emotional movie recommendations",
    "mood movie finder",
    "feel-good movies",
    "movies for different moods",
    "emotional film selection",
    "movie mood matcher",
    "therapeutic movies",
    "movies for every feeling",
  ].join(", "),
  alternates: {
    canonical: getCanonicalUrl("/tools/mood-finder"),
  },
  openGraph: {
    title: "Mood-Based Movie Finder |SimilarMovie.me",
    description:
      "Discover movies that perfectly match your current mood. Whether happy, sad, excited, or contemplative - find films for emotions.",
    url: getCanonicalUrl("/tools/mood-finder"),
  },
};

export default function MoodFinderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
