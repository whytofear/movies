import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getMoviesByGenre } from "../../../lib/database";
import MovieCard from "../../components/MovieCard";
import { getCanonicalUrl } from "../../../lib/seo";

interface Props {
  params: Promise<{ genre: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { genre } = await params;
  const genreName = genre
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `Best ${genreName} Movies |SimilarMovie.me`,
    description: `Discover the best ${genreName.toLowerCase()} movies ranked by rating and popularity. Find top-rated films in the genre.`,
    keywords: `${genreName.toLowerCase()} movies, best ${genreName.toLowerCase()} films, ${genreName.toLowerCase()} movie recommendations, ${genreName.toLowerCase()} genre, top ${genreName.toLowerCase()} movies`,
    alternates: {
      canonical: getCanonicalUrl(`/genres/${genre}`),
    },
    openGraph: {
      title: `Best ${genreName} Movies |SimilarMovie.me`,
      description: `Discover the best ${genreName.toLowerCase()} movies ranked by rating and popularity. Find top-rated films.`,
      url: getCanonicalUrl(`/genres/${genre}`),
      type: "website",
    },
  };
}

export default async function GenrePage({ params }: Props) {
  const { genre } = await params;
  const genreName = genre
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  const movies = await getMoviesByGenre(genreName, 100);

  if (movies.length === 0) {
    notFound();
  }

  // Custom ranking algorithm for "Best" movies in genre
  const rankedMovies = movies
    .map((movie) => ({
      ...movie,
      score:
        movie.vote_average * 0.7 +
        Math.min(movie.popularity / 100, 1) * 3 +
        Math.min(movie.vote_count / 1000, 1) * 0.3,
    }))
    .sort((a, b) => b.score - a.score);

  // Get genre emoji
  const getGenreEmoji = (genre: string): string => {
    const emojiMap: { [key: string]: string } = {
      action: "🎬",
      adventure: "🗺️",
      animation: "🎨",
      comedy: "😂",
      crime: "🕵️",
      documentary: "📹",
      drama: "🎭",
      family: "👨‍👩‍👧‍👦",
      fantasy: "🧙‍♂️",
      history: "📚",
      horror: "👻",
      music: "🎵",
      mystery: "🔍",
      romance: "💕",
      "science fiction": "🚀",
      thriller: "😰",
      war: "⚔️",
      western: "🤠",
    };
    return emojiMap[genre.toLowerCase()] || "🎬";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950">
      {/* Hero Section */}
      <div className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-black via-gray-900 to-red-950 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='0.08'%3E%3Cpath d='M40 0l20 20-20 20-20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Film Strip Decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 opacity-60"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <div className="text-6xl sm:text-7xl lg:text-8xl mb-4">
              {getGenreEmoji(genreName)}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Best{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-yellow-400 to-red-500">
                {genreName}
              </span>{" "}
              Movies
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto text-gray-300 leading-relaxed">
              Discover the top-rated {genreName.toLowerCase()} movies, curated by
              ratings, popularity, and cinematic excellence.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="bg-red-900/30 px-4 py-2 rounded-full border border-red-800/50">
                📊 {rankedMovies.length} Movies
              </span>
              <span className="bg-red-900/30 px-4 py-2 rounded-full border border-red-800/50">
                ⭐ Top Rated
              </span>
              <span className="bg-red-900/30 px-4 py-2 rounded-full border border-red-800/50">
                🎯 AI Curated
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-red-400 transition-colors">
            🏠 Home
          </Link>
          <span>/</span>
          <Link href="/genres" className="hover:text-red-400 transition-colors">
            🎭 Genres
          </Link>
          <span>/</span>
          <span className="text-red-400 font-medium">{genreName}</span>
        </nav>
      </div>

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {rankedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Load More Section */}
        <div className="mt-16 text-center">
          <Link
            href={`/genres/${genre}/all`}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-red-500/25 hover:scale-105 border border-red-500/50"
          >
            🎬 View All {genreName} Movies
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
