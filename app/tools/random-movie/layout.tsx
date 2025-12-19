import { Metadata } from "next";
import { getCanonicalUrl } from "../../../lib/seo";

export const metadata: Metadata = {
  title: "Random Movie Generator |SimilarMovie.me",
  description:
    "Generate random movie suggestions when you want to be surprised. Quality films from our extensive database for viewing.",
  keywords: [
    "random movie generator",
    "random movie picker",
    "surprise movie selection",
    "random film generator",
    "unexpected movie suggestions",
    "spontaneous movie choice",
    "random movie discovery",
    "surprise movie finder",
    "random cinema suggestions",
    "unpredictable movie picks",
  ].join(", "),
  alternates: {
    canonical: getCanonicalUrl("/tools/random-movie"),
  },
  openGraph: {
    title: "Random Movie Generator |SimilarMovie.me",
    description:
      "Generate random movie suggestions when you want to be surprised. Quality films from our extensive database for viewing.",
    url: getCanonicalUrl("/tools/random-movie"),
  },
};

export default function RandomMovieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
