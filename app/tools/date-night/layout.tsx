import { Metadata } from "next";
import { getCanonicalUrl } from "../../../lib/seo";

export const metadata: Metadata = {
  title: "Date Night Movie Finder |SimilarMovie.me",
  description:
    "Find perfect movies for date night with our curated selection tool. Romantic comedies, adventures, and couple-friendly films.",
  keywords: [
    "date night movies",
    "romantic movies",
    "couples movie night",
    "movies for two",
    "date night film recommendations",
    "romantic movie finder",
    "perfect date movies",
    "couple-friendly films",
    "romantic evening movies",
    "date night entertainment",
  ].join(", "),
  alternates: {
    canonical: getCanonicalUrl("/tools/date-night"),
  },
  openGraph: {
    title: "Date Night Movie Finder |SimilarMovie.me",
    description:
      "Find perfect movies for date night with our curated selection tool. Romantic comedies, adventures, and couple-friendly films.",
    url: getCanonicalUrl("/tools/date-night"),
  },
};

export default function DateNightLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
