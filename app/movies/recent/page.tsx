import { Metadata } from "next";
import Link from "next/link";
import { getRecentMovies } from "../../../lib/database";
import MovieCard from "../../components/MovieCard";
import { getCanonicalUrl } from "../../../lib/seo";

export const metadata: Metadata = {
  title: "Recent Movies - Latest Releases |SimilarMovie.me",
  description:
    "Browse the latest movie releases and recent additions. Stay current with the newest films and latest cinema releases.",
  keywords:
    "recent movies, latest films, new releases, newest movies, latest cinema, recent releases, new films, current movies",
  alternates: {
    canonical: getCanonicalUrl("/movies/recent"),
  },
  openGraph: {
    title: "Recent Movies - Latest Releases |SimilarMovie.me",
    description:
      "Browse the latest movie releases and recent additions. Stay current with the newest films.",
    url: getCanonicalUrl("/movies/recent"),
    type: "website",
  },
};

export default async function RecentMoviesPage() {
  const movies = await getRecentMovies(100);

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
                    Recent Movies
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Recent Movies</h1>
          <p className="text-xl text-purple-100">
            Discover the latest movie releases and newest additions to our
            collection
          </p>
        </div>
      </div>

      {/* ⭐ How We Define Recent Movies */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ⭐ How We Define Recent Movies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our recent movies collection focuses on films released within the
              last 2-3 years, ensuring you have access to the freshest content
              in cinema.
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-6 max-w-4xl mx-auto">
            <h3 className="font-semibold text-purple-900 mb-3">
              🗓️ Our Recent Movie Criteria:
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-purple-800">
              <ul className="space-y-2">
                <li>• Released within the last 3 years</li>
                <li>• Recently added to our database</li>
              </ul>
              <ul className="space-y-2">
                <li>• Currently trending or gaining popularity</li>
                <li>• Available on major streaming platforms</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {movies.length} Recent Movies
          </h2>
          <p className="text-gray-600">
            Movies sorted by release date, newest first
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} showWatchButton={true} />
          ))}
        </div>
      </div>

      {/* Why Recent Movies Matter */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stay Current with Cinema
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Recent movies offer fresh perspectives, cutting-edge technology,
              and contemporary themes that reflect our current world.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🆕</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Latest Technology
              </h3>
              <p className="text-gray-600">
                Recent films showcase the newest filmmaking techniques, visual
                effects, and sound design innovations that push creative
                boundaries.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💭</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Current Themes
              </h3>
              <p className="text-gray-600">
                New movies address contemporary issues, social movements, and
                cultural conversations that resonate with today's audiences.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Fresh Voices
              </h3>
              <p className="text-gray-600">
                Recent releases often feature emerging talent, diverse
                perspectives, and innovative storytelling approaches from new
                filmmakers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Release Categories */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Types of Recent Releases
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From theatrical blockbusters to streaming exclusives, discover
              what's new in cinema.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">🎬</div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Theatrical Releases
              </h3>
              <p className="text-gray-600 text-sm">
                Big-screen experiences designed for cinemas, featuring
                spectacular visuals and immersive sound.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Streaming Originals
              </h3>
              <p className="text-gray-600 text-sm">
                Platform-exclusive content created specifically for streaming
                services and digital audiences.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">🏆</div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Festival Darlings
              </h3>
              <p className="text-gray-600 text-sm">
                Independent films and art house cinema that premiered at major
                film festivals worldwide.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">🌍</div>
              <h3 className="font-semibold text-gray-900 mb-3">
                International Cinema
              </h3>
              <p className="text-gray-600 text-sm">
                Foreign films and international co-productions bringing global
                perspectives to audiences.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How We Define "Recent" */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                How We Define "Recent"
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Our "recent movies" collection focuses on films released
                  within the last 2-3 years, ensuring you have access to the
                  freshest content in cinema. We prioritize movies that are
                  still culturally relevant and representative of current
                  filmmaking trends.
                </p>
                <p>
                  We also include newly added films to our database, even if
                  they're slightly older, as long as they offer contemporary
                  value or have gained recent popularity through streaming
                  platforms or cultural rediscovery.
                </p>
                <div className="bg-purple-50 rounded-lg p-4 mt-6">
                  <h3 className="font-semibold text-purple-900 mb-2">
                    🗓️ Our Recent Movie Criteria:
                  </h3>
                  <ul className="space-y-1 text-purple-800 text-sm">
                    <li>• Released within the last 3 years</li>
                    <li>• Recently added to our database</li>
                    <li>• Currently trending or gaining popularity</li>
                    <li>• Available on major streaming platforms</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                📊 Recent Movies by the Numbers
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Recent Movies:</span>
                  <span className="font-bold text-purple-600">
                    {movies.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Latest Release Year:</span>
                  <span className="font-bold text-pink-600">
                    {movies.length > 0
                      ? Math.max(
                          ...movies
                            .map((m) => new Date(m.release_date).getFullYear())
                            .filter((y) => !isNaN(y))
                        )
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Rating:</span>
                  <span className="font-bold text-indigo-600">
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
                  <span className="text-gray-600">Database Updates:</span>
                  <span className="font-bold text-green-600">Daily</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">
                  🎯 Perfect For
                </h4>
                <p className="text-purple-800 text-sm">
                  Movie enthusiasts who want to stay current with cinema,
                  discover new releases, and experience the latest in filmmaking
                  innovation and storytelling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Discovering Recent Movies */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Smart Ways to Explore Recent Movies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Make the most of new releases with these expert discovery
              strategies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-3">🔍</span>
                Discovery Strategies
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>
                    Sort by release date to see the absolute newest films first
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Check ratings to balance newness with quality</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>
                    Look for films with fresh perspectives on familiar genres
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>
                    Follow up on films from favorite directors or actors
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>
                    Explore international releases for global cinema trends
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-3">💡</span>
                Viewing Tips
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>
                    Read descriptions carefully - recent films often experiment
                    with format
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>
                    Be open to new storytelling approaches and cultural
                    perspectives
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>
                    Consider the viewing platform - some films are optimized for
                    streaming
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>
                    Join online discussions to enhance your viewing experience
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>
                    Keep track of your favorites to spot emerging trends
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {movies.length} Recent Movies
          </h2>
          <p className="text-gray-600">
            Movies sorted by release date, newest first
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
