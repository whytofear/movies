import { Metadata } from "next";
import Link from "next/link";
import { getPopularMovies } from "../../../lib/database";
import MovieCard from "../../components/MovieCard";
import { getCanonicalUrl } from "../../../lib/seo";

export const metadata: Metadata = {
  title: "Popular Movies - Most Watched Films |SimilarMovie.me",
  description:
    "Discover the most popular movies ranked by audience engagement. Find your next favorite film from trending titles.",
  keywords:
    "popular movies, trending films, most watched movies, popular cinema, trending movies, audience favorites, movie rankings",
  alternates: {
    canonical: getCanonicalUrl("/movies/popular"),
  },
  openGraph: {
    title: "Popular Movies - Most Watched Films |SimilarMovie.me",
    description:
      "Discover the most popular movies ranked by audience engagement. Find your next favorite film.",
    url: getCanonicalUrl("/movies/popular"),
    type: "website",
  },
};

export default async function PopularMoviesPage() {
  const movies = await getPopularMovies(100);

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
                    href="/movies"
                    className="ml-4 text-gray-400 hover:text-gray-500"
                  >
                    Movies
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
                    Popular Movies
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Popular Movies</h1>
          <p className="text-xl text-blue-100">
            Discover the most trending and popular movies ranked by audience
            engagement
          </p>
        </div>
      </div>

      {/* ⭐ How We Calculate Popularity */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ⭐ How We Calculate Popularity
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our popularity algorithm combines multiple factors to rank movies
              by their current audience engagement and cultural impact.
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-blue-800">
                    <strong>Engagement Score (40%)</strong> - Views, searches
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-blue-800">
                    <strong>Rating Quality (30%)</strong> - User ratings
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-blue-800">
                    <strong>Recency Factor (20%)</strong> - Recent releases
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-blue-800">
                    <strong>Cultural Impact (10%)</strong> - Social mentions
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {movies.length} Popular Movies
          </h2>
          <p className="text-gray-600">
            Movies ranked by current popularity and audience engagement
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} showWatchButton={true} />
          ))}
        </div>
      </div>

      {/* What Makes Movies Popular Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Understanding Movie Popularity
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              What makes a movie truly popular? It's more than just box office
              numbers - it's about cultural impact, audience engagement, and
              lasting appeal.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Audience Engagement
              </h3>
              <p className="text-gray-600">
                High viewership numbers, social media buzz, streaming
                popularity, and word-of-mouth recommendations drive a movie's
                popularity score.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Cultural Impact
              </h3>
              <p className="text-gray-600">
                Movies that influence trends, spawn franchises, create memorable
                quotes, and become part of popular culture achieve lasting
                popularity.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Universal Appeal
              </h3>
              <p className="text-gray-600">
                Popular movies often feature compelling stories, relatable
                characters, and themes that resonate across different
                demographics and cultures.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popularity Metrics Explanation */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              🧮 How We Calculate Popularity
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Our Popularity Algorithm
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">
                      <strong>Engagement Score (40%)</strong> - Views, searches,
                      and interactions
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">
                      <strong>Rating Quality (30%)</strong> - User ratings and
                      review scores
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">
                      <strong>Recency Factor (20%)</strong> - Recent releases
                      get slight boost
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">
                      <strong>Social Buzz (10%)</strong> - Cultural relevance
                      and discussions
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Why This Matters
                </h3>
                <p className="text-gray-600 mb-4">
                  Our popularity ranking isn't just about box office success. We
                  consider ongoing engagement, streaming numbers, and cultural
                  relevance to identify movies that are truly capturing audience
                  attention right now.
                </p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Pro Tip:</strong> Popular movies are great starting
                    points for discovering new genres or finding films that most
                    people enjoy. They're also perfect for group movie nights!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Movie Categories */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Types of Popular Movies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Popular movies come in many forms. Here's what you'll find in our
              collection.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6">
              <div className="text-3xl mb-3">🦸‍♂️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Blockbusters</h3>
              <p className="text-gray-600 text-sm">
                Big-budget spectacles with massive audiences, stunning visuals,
                and star-studded casts.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
              <div className="text-3xl mb-3">📺</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Streaming Hits
              </h3>
              <p className="text-gray-600 text-sm">
                Movies that gained popularity through streaming platforms and
                binge-watching culture.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
              <div className="text-3xl mb-3">🏆</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Award Winners
              </h3>
              <p className="text-gray-600 text-sm">
                Critically acclaimed films that gained popularity through
                prestigious awards and recognition.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
              <div className="text-3xl mb-3">🌍</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Cultural Phenomena
              </h3>
              <p className="text-gray-600 text-sm">
                Movies that became part of global culture, spawning memes,
                quotes, and lasting impact.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Finding Your Next Popular Movie */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Finding Your Next Popular Movie
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Start with High Rankings
                    </h3>
                    <p className="text-gray-600">
                      Movies in the top 50 are guaranteed crowd-pleasers with
                      broad appeal.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-green-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Check Recent Releases
                    </h3>
                    <p className="text-gray-600">
                      New movies often have fresh perspectives and current
                      cultural relevance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-purple-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Explore Different Genres
                    </h3>
                    <p className="text-gray-600">
                      Popular movies span all genres - don't limit yourself to
                      one type.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-orange-600 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Use Similar Movie Features
                    </h3>
                    <p className="text-gray-600">
                      Found a popular movie you love? Use our similarity tool to
                      find more like it.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                📈 Popular Movie Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Popular Movies:</span>
                  <span className="font-bold text-blue-600">
                    {movies.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Rating:</span>
                  <span className="font-bold text-green-600">
                    {movies.length > 0
                      ? (
                          movies.reduce((sum, m) => sum + m.vote_average, 0) /
                          movies.length
                        ).toFixed(1)
                      : "N/A"}
                    /10
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Updated:</span>
                  <span className="font-bold text-purple-600">Daily</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Popularity Threshold:</span>
                  <span className="font-bold text-orange-600">
                    High Engagement
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  🎬 Quick Discovery
                </h4>
                <p className="text-blue-800 text-sm">
                  Can't decide? Start with movies ranked 1-10 for guaranteed
                  entertainment, or explore 11-25 for hidden gems that are
                  gaining popularity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {movies.length} Popular Movies
          </h2>
          <p className="text-gray-600">
            Movies ranked by popularity score and audience engagement
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} showWatchButton={true} />
          ))}
        </div>
      </div>
    </div>
  );
}
