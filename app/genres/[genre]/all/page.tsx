import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getMoviesByGenre } from "../../../../lib/database";
import MovieCard from "../../../components/MovieCard";

interface Props {
  params: Promise<{ genre: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { genre } = await params;
  const genreName = genre
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `All ${genreName} Movies |SimilarMovie.me`,
    description: `Complete collection of ${genreName.toLowerCase()} movies. Browse all films in ${genreName.toLowerCase()} genre sorted by popularity.`,
    openGraph: {
      title: `All ${genreName} Movies |SimilarMovie.me`,
      description: `Complete collection of ${genreName.toLowerCase()} movies. Browse all films in ${genreName.toLowerCase()} genre sorted by popularity.`,
    },
  };
}

export default async function AllGenreMoviesPage({ params }: Props) {
  const { genre } = await params;
  const genreName = genre
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  const movies = await getMoviesByGenre(genreName, 500); // Get more movies for "all" page

  if (movies.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-400 hover:text-gray-500">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <Link
                    href="/genres"
                    className="ml-4 text-gray-400 hover:text-gray-500"
                  >
                    Genres
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <Link
                    href={`/genres/${genre}`}
                    className="ml-4 text-gray-400 hover:text-gray-500"
                  >
                    Best {genreName}
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-gray-900">
                    All Movies
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">All {genreName} Movies</h1>
          <p className="text-xl text-indigo-100">
            Complete collection of {movies.length} {genreName.toLowerCase()}{" "}
            movies
          </p>

          <div className="mt-6">
            <Link
              href={`/genres/${genre}`}
              className="inline-flex items-center px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              ← View Top 25 {genreName} Movies
            </Link>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            All {genreName} Movies ({movies.length})
          </h2>
          <p className="text-gray-600">
            Complete collection sorted by rating and popularity
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}
