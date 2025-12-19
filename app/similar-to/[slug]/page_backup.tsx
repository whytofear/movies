import { notFound } from "next/navigation";
import Head from "next/head";
import { Metadata } from "next";
import { Movie } from "../../../lib/supabase";
import { getMovieBySlug, getAllMovies } from "../../../lib/database";
import {
  getSimilarMovies,
  getSharedGenres,
  formatCurrency,
  formatRuntime,
  getYear,
  generateMovieTitle,
  generateMovieDescription,
  getValidPosterUrl,
  slugify,
} from "../../../lib/utils";
import MovieCard from "../../components/MovieCard";
import Image from "next/image";

interface SimilarPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: SimilarPageProps): Promise<Metadata> {
  const movie = await getMovieBySlug(params.slug);

  if (!movie) {
    return {
      title: "Movie Not Found | SimilarMovie",
      description: "The requested movie could not be found.",
    };
  }

  const allMovies = await getAllMovies();
  const similarMovies = getSimilarMovies(movie, allMovies, 50);
  const title = generateMovieTitle(movie, similarMovies.length);
  const description = generateMovieDescription(movie, similarMovies.length);

  return {
    title,
    description,
    keywords: [
      movie.title,
      "similar movies",
      "movie recommendations",
      ...(movie.genres ? movie.genres.split(",").map((g) => g.trim()) : []),
      "films like",
      "movies similar to",
    ].join(", "),
    openGraph: {
      title,
      description,
      images: movie.posterurl ? [{ url: movie.posterurl }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: movie.posterurl ? [movie.posterurl] : [],
    },
    alternates: {
      canonical: `/similar-to/${params.slug}`,
    },
  };
}

export default async function SimilarMoviePage({ params }: SimilarPageProps) {
  // Fetch the target movie
  const movie = await getMovieBySlug(params.slug);

  if (!movie) {
    notFound();
  }

  // Fetch all movies and calculate similarities
  const allMovies = await getAllMovies();
  const similarMovies = getSimilarMovies(movie, allMovies, 50);

  const posterUrl = getValidPosterUrl(movie.posterurl);
  const additionalImageUrl = getValidPosterUrl(movie.additional_image);

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Movie",
        name: movie.title,
        description: movie.description,
        datePublished: movie.release_date,
        genre: movie.genres ? movie.genres.split(",").map((g) => g.trim()) : [],
        aggregateRating:
          movie.vote_average > 0
            ? {
                "@type": "AggregateRating",
                ratingValue: movie.vote_average,
                ratingCount: movie.vote_count,
                bestRating: 10,
                worstRating: 0,
              }
            : undefined,
        duration: movie.runtime ? `PT${movie.runtime}M` : undefined,
        image: posterUrl,
        url: movie.homepage || undefined,
      },
      {
        "@type": "ItemList",
        name: `Movies Similar to ${movie.title}`,
        description: `Discover ${similarMovies.length} movies like ${movie.title} based on genres, ratings, and production info.`,
        numberOfItems: similarMovies.length,
        itemListElement: similarMovies.map((similarMovie, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Movie",
            name: similarMovie.title,
            description: similarMovie.description,
            datePublished: similarMovie.release_date,
            genre: similarMovie.genres
              ? similarMovie.genres.split(",").map((g) => g.trim())
              : [],
            aggregateRating:
              similarMovie.vote_average > 0
                ? {
                    "@type": "AggregateRating",
                    ratingValue: similarMovie.vote_average,
                    ratingCount: similarMovie.vote_count,
                    bestRating: 10,
                    worstRating: 0,
                  }
                : undefined,
          },
        })),
      },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Main Movie Section */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Movie Poster */}
              <div className="lg:col-span-1">
                <div className="aspect-[2/3] bg-gradient-to-b from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-lg">
                  {posterUrl ? (
                    <Image
                      src={posterUrl}
                      alt={`${movie.title} poster`}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <svg
                          className="w-16 h-16 mx-auto mb-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p className="text-sm font-medium">No Image</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Movie Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title and Tagline */}
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {movie.title}
                  </h1>
                  {movie.tagline && (
                    <p className="text-xl text-gray-600 italic">
                      {movie.tagline}
                    </p>
                  )}
                </div>

                {/* Genres */}
                {movie.genres && (
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.split(",").map((genre, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {genre.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Key Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Status
                    </h3>
                    <p className="text-lg font-semibold text-gray-900">
                      {movie.status || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Release Date
                    </h3>
                    <p className="text-lg font-semibold text-gray-900">
                      {getYear(movie.release_date)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Runtime
                    </h3>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatRuntime(movie.runtime)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Rating
                    </h3>
                    <p className="text-lg font-semibold text-gray-900 flex items-center">
                      <span className="text-yellow-500 mr-1">⭐</span>
                      {movie.vote_average > 0
                        ? movie.vote_average.toFixed(1)
                        : "N/A"}
                      {movie.vote_count > 0 && (
                        <span className="text-sm text-gray-500 ml-1">
                          ({movie.vote_count.toLocaleString()})
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {movie.description && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      Overview
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {movie.description}
                    </p>
                  </div>
                )}

                {/* Financial Info */}
                {(movie.budget > 0 || movie.revenue > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {movie.budget > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                          Budget
                        </h3>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(movie.budget)}
                        </p>
                      </div>
                    )}
                    {movie.revenue > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                          Revenue
                        </h3>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(movie.revenue)}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Production Details */}
                <div className="space-y-3">
                  {movie.original_language && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Original Language:{" "}
                      </span>
                      <span className="text-sm text-gray-900">
                        {movie.original_language.toUpperCase()}
                      </span>
                    </div>
                  )}
                  {movie.production_companies && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Production Companies:{" "}
                      </span>
                      <span className="text-sm text-gray-900">
                        {movie.production_companies}
                      </span>
                    </div>
                  )}
                  {movie.production_countries && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Production Countries:{" "}
                      </span>
                      <span className="text-sm text-gray-900">
                        {movie.production_countries}
                      </span>
                    </div>
                  )}
                  {movie.spoken_languages && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Spoken Languages:{" "}
                      </span>
                      <span className="text-sm text-gray-900">
                        {movie.spoken_languages}
                      </span>
                    </div>
                  )}
                </div>

                {/* Homepage Link */}
                {movie.homepage && (
                  <div>
                    <a
                      href={movie.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-1a1 1 0 10-2 0v1H5V7h1a1 1 0 000-2H5z" />
                      </svg>
                      Visit Homepage
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Image */}
            {additionalImageUrl && (
              <div className="mt-8">
                <div className="aspect-video bg-gradient-to-b from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={additionalImageUrl}
                    alt={`${movie.title} additional image`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Movies Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Movies Similar to {movie.title}
            </h2>
            <p className="text-gray-600">
              Discovered {similarMovies.length} movies with similar genres,
              themes, and ratings
            </p>
          </div>

          {similarMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {similarMovies.map((similarMovie) => {
                const sharedGenres = getSharedGenres(movie, similarMovie);
                return (
                  <MovieCard
                    key={similarMovie.id}
                    movie={similarMovie}
                    showSimilarity={true}
                    similarity={similarMovie.similarity}
                    sharedGenres={sharedGenres}
                    showWatchButton={true}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Similar Movies Found
              </h3>
              <p className="text-gray-600">
                We couldn't find any movies similar to {movie.title} at this
                time.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
