"use client";

import Link from "next/link";
import Image from "next/image";
import { Movie } from "../../lib/supabase";
import {
  slugify,
  getYear,
  getValidPosterUrl,
  formatVoteCount,
} from "../../lib/utils";

interface MovieCardProps {
  movie: Movie;
  showSimilarity?: boolean;
  similarity?: number;
  sharedGenres?: string[];
  showWatchButton?: boolean;
}

export default function MovieCard({
  movie,
  showSimilarity,
  similarity,
  sharedGenres,
  showWatchButton = true,
}: MovieCardProps) {
  const posterUrl = getValidPosterUrl(
    movie.poster_path || movie.posterurl || ""
  );
  // Use the stored slug if available, fall back to generating from title if needed
  const movieSlug = movie.slug || slugify(movie.title);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1 w-full max-w-sm mx-auto">
      <Link href={`/similar-to/${movieSlug}`}>
        <div className="relative aspect-[2/3] bg-gradient-to-b from-gray-100 to-gray-200">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={`${movie.title} poster`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <svg
                  className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-xs sm:text-sm font-medium">No Image</p>
              </div>
            </div>
          )}

          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Rating Badge */}
          {movie.vote_average > 0 && (
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black/80 backdrop-blur-sm text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold flex items-center space-x-1 border border-white/20">
              <span className="text-yellow-400">⭐</span>
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
          )}

          {/* Similarity Badge */}
          {showSimilarity && similarity && (
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold backdrop-blur-sm border border-white/20">
              {(similarity * 100).toFixed(0)}% match
            </div>
          )}
        </div>
      </Link>

      <div className="p-3 sm:p-5">
        <Link href={`/similar-to/${movieSlug}`}>
          <h3 className="font-bold text-sm sm:text-lg text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2 sm:mb-3 leading-tight group-hover:text-blue-600">
            {movie.title}
          </h3>
        </Link>

        <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 space-x-2 sm:space-x-3">
          <span className="font-medium">{getYear(movie.release_date)}</span>
          {movie.runtime && (
            <>
              <span>•</span>
              <span>
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </span>
            </>
          )}
        </div>

        {movie.description && (
          <p className="text-gray-700 text-sm line-clamp-3 mb-4 leading-relaxed">
            {movie.description}
          </p>
        )}

        {/* Genres */}
        {movie.genres && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {movie.genres
              .split(",")
              .slice(0, 3)
              .map((genre, index) => {
                const trimmedGenre = genre.trim();
                const isShared = sharedGenres?.includes(
                  trimmedGenre.toLowerCase()
                );
                return (
                  <span
                    key={index}
                    className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                      isShared
                        ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {trimmedGenre}
                  </span>
                );
              })}
          </div>
        )}

        {/* Stats and Action */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {movie.vote_count > 0 && (
              <div className="flex items-center space-x-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                <span>{formatVoteCount(movie.vote_count)}</span>
              </div>
            )}
            {movie.popularity && (
              <div className="flex items-center space-x-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{Math.round(movie.popularity)}</span>
              </div>
            )}
          </div>

          <Link
            href={`/similar-to/${movieSlug}`}
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors flex items-center space-x-1 group"
          >
            <span>Find Similar</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
