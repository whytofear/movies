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
        {/* Compact Hero Section */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />

          {/* Background Images */}
          {(posterUrl || additionalImageUrl) && (
            <div className="absolute inset-0 opacity-20">
              <Image
                src={additionalImageUrl || posterUrl || "/placeholder.jpg"}
                alt={`${movie.title} backdrop`}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            </div>
          )}

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              {/* Compact Poster */}
              <div className="lg:col-span-1">
                <div className="aspect-[2/3] bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-2xl max-w-[200px] mx-auto lg:mx-0">
                  {posterUrl ? (
                    <Image
                      src={posterUrl}
                      alt={`${movie.title} poster`}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 200px, 200px"
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
                </div>
              </div>

              {/* Compact Movie Info */}
              <div className="lg:col-span-3 space-y-4">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                    {movie.title}
                  </h1>
                  {movie.tagline && (
                    <p className="text-lg text-blue-200 italic">
                      {movie.tagline}
                    </p>
                  )}
                </div>

                {/* Key Stats Row */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-yellow-400 mr-1">⭐</span>
                    <span className="font-semibold">
                      {movie.vote_average > 0
                        ? movie.vote_average.toFixed(1)
                        : "N/A"}
                    </span>
                    {movie.vote_count > 0 && (
                      <span className="text-blue-200 ml-1">
                        ({movie.vote_count.toLocaleString()})
                      </span>
                    )}
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="font-semibold">
                      {getYear(movie.release_date)}
                    </span>
                  </div>

                  {movie.runtime > 0 && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="font-semibold">
                        {formatRuntime(movie.runtime)}
                      </span>
                    </div>
                  )}

                  {movie.status && (
                    <div className="bg-green-500/20 text-green-200 rounded-full px-3 py-1">
                      <span className="font-semibold">{movie.status}</span>
                    </div>
                  )}

                  {movie.original_language && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="font-semibold">
                        {movie.original_language.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                {movie.genres && (
                  <div className="flex flex-wrap gap-2">
                    {movie.genres
                      .split(",")
                      .slice(0, 5)
                      .map((genre, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm font-medium border border-blue-400/30"
                        >
                          {genre.trim()}
                        </span>
                      ))}
                  </div>
                )}

                {/* Description */}
                {movie.description && (
                  <p className="text-gray-200 leading-relaxed text-sm lg:text-base line-clamp-3 lg:line-clamp-none">
                    {movie.description}
                  </p>
                )}

                {/* Production Info Compact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {movie.production_companies && (
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                      <div className="text-blue-200 font-medium mb-1">
                        Production
                      </div>
                      <div className="text-white text-xs">
                        {movie.production_companies}
                      </div>
                    </div>
                  )}

                  {(movie.budget > 0 || movie.revenue > 0) && (
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                      <div className="text-blue-200 font-medium mb-1">
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
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                      <div className="text-blue-200 font-medium mb-1">
                        Languages
                      </div>
                      <div className="text-white text-xs">
                        {movie.spoken_languages}
                      </div>
                    </div>
                  )}

                  {movie.production_countries && (
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                      <div className="text-blue-200 font-medium mb-1">
                        Countries
                      </div>
                      <div className="text-white text-xs">
                        {movie.production_countries}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {movie.homepage && (
                    <a
                      href={movie.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
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

                  {movie.keywords && (
                    <button className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors duration-200 text-sm border border-white/20">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Keywords
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Movie Details - Compact Rich Content */}
        {(movie.keywords || movie.popularity) && (
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                {movie.keywords && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.94l1-4H9.03z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Keywords
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {movie.keywords
                        .split(",")
                        .slice(0, 8)
                        .map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                          >
                            {keyword.trim()}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {movie.popularity && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2 flex items-center">
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
                  </div>
                )}

                {movie.adult !== undefined && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2 flex items-center">
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
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {movie.adult ? "Adult Content" : "Family Friendly"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Similar Movies Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Movies Similar to {movie.title}
            </h2>
            <p className="text-gray-600 text-sm lg:text-base">
              Discovered {similarMovies.length} movies with similar genres,
              themes, and ratings
            </p>
          </div>

          {similarMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
