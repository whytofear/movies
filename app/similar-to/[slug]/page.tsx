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
import { getCanonicalUrl } from "../../../lib/seo";
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
  // Make sure params is properly awaited
  const slug = await Promise.resolve(params.slug);
  const movie = await getMovieBySlug(slug);

  if (!movie) {
    return {
      title: "Movie Not Found |SimilarMovie.me",
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
    openGraph: {
      title,
      description,
      images:
        movie.poster_path || movie.posterurl
          ? [{ url: movie.poster_path || movie.posterurl }]
          : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images:
        movie.poster_path || movie.posterurl
          ? [movie.poster_path || movie.posterurl]
          : [],
    },
    alternates: {
      canonical: getCanonicalUrl(`/similar-to/${slug}`),
    },
  };
}

export default async function SimilarMoviePage({ params }: SimilarPageProps) {
  // Fetch the target movie - ensure params is properly awaited
  const slug = await Promise.resolve(params.slug);
  const movie = await getMovieBySlug(slug);

  if (!movie) {
    notFound();
  }

  // Fetch all movies and calculate similarities
  const allMovies = await getAllMovies();
  const similarMovies = getSimilarMovies(movie, allMovies, 50);

  const posterUrl = getValidPosterUrl(
    movie.poster_path || movie.posterurl || ""
  );
  const additionalImageUrl = getValidPosterUrl(
    movie.backdrop_path || movie.additional_image || ""
  );

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
        {/* New Hero Section - Split Design */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-900 text-white relative">
          {/* Poster as decorative element - not as background */}
          <div className="absolute top-0 right-0 w-1/4 h-full opacity-10 overflow-hidden hidden lg:block">
            {posterUrl && (
              <div className="w-full h-full relative transform rotate-6 scale-150 translate-x-1/4 translate-y-1/4">
                <Image
                  src={posterUrl}
                  alt=""
                  fill
                  className="object-cover blur-sm"
                  priority={false}
                />
              </div>
            )}
          </div>

          <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 md:py-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left side - Poster with visual treatments */}
              <div className="md:w-1/4 flex-shrink-0">
                <div
                  className="relative mx-auto md:mx-0"
                  style={{ maxWidth: "240px" }}
                >
                  {/* Poster outline decoration */}
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 via-white to-yellow-400 opacity-50 blur-sm rounded-xl transform rotate-1"></div>

                  {/* Actual poster */}
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-slate-800 shadow-2xl border border-slate-700">
                    {posterUrl ? (
                      <Image
                        src={posterUrl}
                        alt={`${movie.title} poster`}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 240px, 240px"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <svg
                          className="w-12 h-12"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}

                    {/* Rating badge overlay */}
                    {movie.vote_average > 0 && (
                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md rounded-full p-1 w-10 h-10 flex items-center justify-center border border-yellow-500">
                        <div className="text-xs font-bold text-yellow-400">
                          {movie.vote_average.toFixed(1)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right side - Movie info in a card format */}
              <div className="md:w-3/4 flex flex-col gap-4">
                {/* Title and tagline in highlight box */}
                <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-slate-700">
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                    {movie.title}
                  </h1>
                  {movie.tagline && (
                    <p className="text-lg text-blue-200 italic">
                      {movie.tagline}
                    </p>
                  )}
                </div>

                {/* Key Stats Row in neat pills */}
                <div className="flex flex-wrap gap-3 text-sm">
                  {movie.vote_count > 0 && (
                    <div className="flex items-center bg-slate-800/90 border border-yellow-600 rounded-full px-3 py-1.5 shadow-md">
                      <span className="text-yellow-400 mr-1.5">⭐</span>
                      <span className="font-semibold text-white">
                        {movie.vote_count.toLocaleString()} votes
                      </span>
                    </div>
                  )}

                  <div className="bg-slate-800/90 border border-blue-700 rounded-full px-3 py-1.5 shadow-md">
                    <span className="font-semibold text-white">
                      {getYear(movie.release_date)}
                    </span>
                  </div>

                  {movie.runtime > 0 && (
                    <div className="bg-slate-800/90 border border-blue-700 rounded-full px-3 py-1.5 shadow-md">
                      <span className="font-semibold text-white">
                        {formatRuntime(movie.runtime)}
                      </span>
                    </div>
                  )}

                  {movie.status && (
                    <div className="bg-green-800/90 border border-green-600 text-green-100 rounded-full px-3 py-1.5 shadow-md">
                      <span className="font-semibold">{movie.status}</span>
                    </div>
                  )}

                  {movie.original_language && (
                    <div className="bg-slate-800/90 border border-blue-700 rounded-full px-3 py-1.5 shadow-md">
                      <span className="font-semibold text-white">
                        {movie.original_language.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Genres in a styled container */}
                {movie.genres && (
                  <div className="flex flex-wrap gap-2 bg-slate-800/70 backdrop-blur-sm p-3 rounded-lg border border-slate-700">
                    <div className="w-full text-blue-300 text-xs uppercase tracking-wider font-semibold mb-1.5">
                      Genres
                    </div>
                    {movie.genres
                      .split(",")
                      .slice(0, 5)
                      .map((genre, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-900/80 text-blue-100 rounded-full text-sm font-medium border border-blue-700 shadow-md hover:bg-blue-800/80 transition-colors duration-150"
                        >
                          {genre.trim()}
                        </span>
                      ))}
                  </div>
                )}

                {/* Description in styled container */}
                {movie.description && (
                  <div className="bg-slate-800/90 backdrop-blur-sm p-4 rounded-lg border border-slate-700 shadow-md">
                    <div className="text-blue-300 text-xs uppercase tracking-wider font-semibold mb-2">
                      Synopsis
                    </div>
                    <p className="text-white leading-relaxed text-sm lg:text-base">
                      {movie.description}
                    </p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3 mt-1">
                  {movie.homepage && (
                    <a
                      href={movie.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm shadow-lg"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M8 5v10l7-5-7-5z" />
                      </svg>
                      Watch Now
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Production details in a tabular grid */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {movie.production_companies && (
                <div className="bg-slate-800/90 rounded-lg p-3 border border-slate-700 shadow-md">
                  <div className="text-blue-300 font-medium mb-1">
                    Production
                  </div>
                  <div className="text-white text-xs">
                    {movie.production_companies}
                  </div>
                </div>
              )}

              {(movie.budget > 0 || movie.revenue > 0) && (
                <div className="bg-slate-800/90 rounded-lg p-3 border border-slate-700 shadow-md">
                  <div className="text-blue-300 font-medium mb-1">
                    Box Office
                  </div>
                  <div className="text-white text-xs space-y-1">
                    {movie.budget > 0 && (
                      <div>Budget: {formatCurrency(movie.budget)}</div>
                    )}
                    {movie.revenue > 0 && (
                      <div>Revenue: {formatCurrency(movie.revenue)}</div>
                    )}
                  </div>
                </div>
              )}

              {movie.spoken_languages && (
                <div className="bg-slate-800/90 rounded-lg p-3 border border-slate-700 shadow-md">
                  <div className="text-blue-300 font-medium mb-1">
                    Languages
                  </div>
                  <div className="text-white text-xs">
                    {movie.spoken_languages}
                  </div>
                </div>
              )}

              {movie.production_countries && (
                <div className="bg-slate-800/90 rounded-lg p-3 border border-slate-700 shadow-md">
                  <div className="text-blue-300 font-medium mb-1">
                    Countries
                  </div>
                  <div className="text-white text-xs">
                    {movie.production_countries}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Movie Details - Stats Cards */}
        {(movie.popularity ||
          movie.adult !== undefined ||
          movie.vote_count > 1000) && (
          <div className="bg-gradient-to-r from-slate-100 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                More About This Movie
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                {movie.popularity && (
                  <div className="bg-white rounded-lg p-4 shadow-md border border-slate-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                    <h3 className="font-medium text-slate-800 mb-2 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-purple-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Popularity Score
                    </h3>
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(movie.popularity)}
                    </div>
                    <div className="mt-2 text-slate-600 text-xs">
                      Based on trending metrics
                    </div>
                  </div>
                )}

                {movie.adult !== undefined && (
                  <div className="bg-white rounded-lg p-4 shadow-md border border-slate-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                    <h3 className="font-medium text-slate-800 mb-2 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-orange-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Content Rating
                    </h3>
                    <div
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        movie.adult
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : "bg-green-100 text-green-800 border border-green-200"
                      }`}
                    >
                      {movie.adult ? "Adult Content" : "Family Friendly"}
                    </div>
                    <div className="mt-2 text-slate-600 text-xs">
                      {movie.adult
                        ? "This movie contains adult themes or content"
                        : "Suitable for general audiences"}
                    </div>
                  </div>
                )}

                {movie.vote_count > 1000 && (
                  <div className="bg-white rounded-lg p-4 shadow-md border border-slate-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                    <h3 className="font-medium text-slate-800 mb-2 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                      </svg>
                      Community Engagement
                    </h3>
                    <div className="text-2xl font-bold text-green-600">
                      {movie.vote_count.toLocaleString()}
                    </div>
                    <div className="mt-2 text-slate-600 text-xs">
                      Number of votes received from users
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Similar Movies Section */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
          <div className="bg-slate-800 px-4 py-4 rounded-lg mb-6 shadow-lg border border-slate-700">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
              Movies Similar to {movie.title}
            </h2>
            <p className="text-blue-200 text-sm lg:text-base flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 9H7a1 1 0 110-2h7.586l-3.293-3.293A1 1 0 0112 2z"
                  clipRule="evenodd"
                />
              </svg>
              Discovered {similarMovies.length} movies with similar genres,
              themes, and ratings
            </p>
          </div>

          {similarMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {similarMovies.map((similarMovie) => {
                const sharedGenres = getSharedGenres(movie, similarMovie);
                return (
                  <MovieCard
                    key={similarMovie.id}
                    movie={similarMovie}
                    showSimilarity={true}
                    similarity={similarMovie.similarity}
                    sharedGenres={sharedGenres}
                    showWatchButton={false}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md border border-slate-200">
              <div className="text-blue-400 mb-4">
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
