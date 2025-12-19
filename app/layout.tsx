import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { getCanonicalUrl } from "../lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://SimilarMovie.me"),
  title: {
    default: "Find Movies Similar to Your Favorites",
    template: "%s",
  },
  description:
    "Discover movies similar to your favorites based on genres, ratings, and more. Find your next favorite film with our intelligent movie recommendation system.",
  keywords: [
    "movie recommendations",
    "similar movies",
    "movie database",
    "film suggestions",
  ],
  authors: [{ name: "SimilarMovie" }],
  creator: "SimilarMovie",
  publisher: "SimilarMovie",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SimilarMovie",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@SimilarMovie",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navigation />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
