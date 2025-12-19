import { Metadata } from "next";
import Link from "next/link";
import { getTopRatedMovies } from "../../../lib/database";
import MovieCard from "../../components/MovieCard";
import { getCanonicalUrl } from "../../../lib/seo";

export const metadata: Metadata = {
  title: "Top Rated Movies - Best Films Ever |SimilarMovie.me",
  description:
    "Explore the highest-rated movies based on user reviews and critical acclaim. Discover must-watch films with ratings.",
  keywords:
    "top rated movies, best movies, highest rated films, movie ratings, critically acclaimed movies, best films ever, movie reviews, award winning movies",
  alternates: {
    canonical: getCanonicalUrl("/movies/top-rated"),
  },
  openGraph: {
    title: "Top Rated Movies - Best Films Ever |SimilarMovie.me",
    description:
      "Explore the highest-rated movies based on user reviews and critical acclaim. Discover must-watch films.",
    url: getCanonicalUrl("/movies/top-rated"),
    type: "website",
  },
};

export default async function TopRatedMoviesPage() {
  const movies = await getTopRatedMovies(100);

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
                    Top Rated
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Top Rated Movies</h1>
          <p className="text-xl text-amber-100">
            Discover the highest-rated movies based on user reviews and critical
            acclaim
          </p>
        </div>
      </div>

      {/* Rating Explanation */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-amber-900 mb-2">
              ⭐ How We Rank Top Rated Movies
            </h2>
            <p className="text-amber-800">
              Our top-rated movies are selected based on user ratings with a
              minimum of 100 reviews to ensure reliability. Movies are ranked by
              their average user score, highlighting films that have
              consistently impressed audiences and critics alike.
            </p>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {movies.length} Top Rated Movies
          </h2>
          <p className="text-gray-600">
            Movies with the highest average ratings (minimum 100 votes)
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie, index) => (
            <div key={movie.id} className="relative">
              {/* Rating Badge */}
              <div className="absolute top-2 left-2 z-10 bg-amber-500 text-white rounded-full px-2 py-1 text-xs font-bold">
                ⭐ {movie.vote_average.toFixed(1)}
              </div>
              <MovieCard movie={movie} showWatchButton={true} />
            </div>
          ))}
        </div>
      </div>

      {/* What Makes a Movie Top-Rated */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Makes a Movie Top-Rated?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Excellence in cinema isn't just about entertainment—it's about
              storytelling mastery, technical brilliance, and lasting cultural
              impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎬</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Masterful Storytelling
              </h3>
              <p className="text-gray-600 text-sm">
                Compelling narratives with well-developed characters, meaningful
                themes, and emotional resonance that stays with viewers long
                after the credits roll.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎭</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Outstanding Performances
              </h3>
              <p className="text-gray-600 text-sm">
                Exceptional acting that brings characters to life, creating
                authentic and memorable performances that elevate the entire
                film experience.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📽️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Technical Excellence
              </h3>
              <p className="text-gray-600 text-sm">
                Superior cinematography, sound design, editing, and production
                values that demonstrate the highest standards of filmmaking
                craftsmanship.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Cultural Impact
              </h3>
              <p className="text-gray-600 text-sm">
                Films that influence other movies, shape cultural conversations,
                and stand the test of time as important works of cinema art.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rating System Deep Dive */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Understanding Our Rating System
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Our top-rated movies list represents the pinnacle of cinematic
                  achievement based on audience appreciation. We use a rigorous
                  selection process that ensures only the most consistently
                  excellent films make the cut.
                </p>
                <p>
                  Each movie must meet strict criteria: a minimum of 100 user
                  ratings to ensure statistical reliability, and an average
                  score that places it among the top percentile of all films in
                  our database.
                </p>

                <div className="bg-amber-50 rounded-lg p-6 mt-6">
                  <h3 className="font-semibold text-amber-900 mb-3">
                    🔍 Our Quality Standards:
                  </h3>
                  <ul className="space-y-2 text-amber-800">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                      Minimum 100 verified user ratings
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                      Average rating of 7.5+ out of 10
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                      Consistent positive reviews over time
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                      Cross-demographic appeal and acclaim
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                📊 Top-Rated Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Top-Rated Movies:</span>
                  <span className="font-bold text-amber-600">
                    {movies.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Rating Range:</span>
                  <span className="font-bold text-yellow-600">
                    {movies.length > 0
                      ? `${Math.min(
                          ...movies.map((m) => m.vote_average)
                        ).toFixed(1)} - ${Math.max(
                          ...movies.map((m) => m.vote_average)
                        ).toFixed(1)}`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Minimum Vote Threshold:</span>
                  <span className="font-bold text-orange-600">
                    100+ Reviews
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Quality Percentile:</span>
                  <span className="font-bold text-red-600">Top 10%</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg border border-amber-200">
                <h4 className="font-semibold text-amber-900 mb-2">
                  🏆 Why These Ratings Matter
                </h4>
                <p className="text-amber-800 text-sm">
                  These aren't just high numbers—they represent movies that have
                  consistently moved, inspired, and entertained audiences across
                  different cultures and time periods.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories of Excellence */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Categories of Cinematic Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Top-rated movies span every genre and era, each excelling in their
              unique way.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">
                  Artistic Masterpieces
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                Films that push creative boundaries, experiment with form and
                style, and create unique visual and narrative experiences that
                influence cinema as an art form.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎪</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">
                  Entertainment Classics
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                Movies that perfectly balance entertainment value with quality
                storytelling, creating experiences that are both thoroughly
                enjoyable and cinematically excellent.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💭</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">
                  Thought-Provoking Cinema
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                Films that challenge viewers intellectually and emotionally,
                exploring complex themes and offering profound insights into
                human nature and society.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">
                  Cultural Treasures
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                International films and diverse voices that offer unique
                cultural perspectives and expand our understanding of different
                societies and storytelling traditions.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">
                  Technical Innovators
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                Movies that showcase groundbreaking technical achievements in
                cinematography, effects, sound design, or editing that advance
                the medium of cinema.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">❤️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">
                  Emotional Resonance
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                Films that create powerful emotional connections with audiences,
                telling stories that touch hearts and create lasting memories
                and meaningful experiences.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How to Explore Top-Rated Movies */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Guide to Top-Rated Cinema
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Make the most of these cinematic treasures with expert viewing
              strategies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-3">🎯</span>
                Strategic Viewing
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  <span>
                    Start with movies rated 8.5+ for guaranteed excellence
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  <span>
                    Mix different decades to appreciate cinema's evolution
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  <span>
                    Read descriptions to prepare for the movie's tone and style
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  <span>Consider watching director or actor filmographies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  <span>
                    Use our similarity tool to discover related masterpieces
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-3">🌟</span>
                Maximizing Your Experience
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>
                    Watch without distractions to fully appreciate the
                    craftsmanship
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>
                    Pay attention to technical elements like cinematography and
                    sound
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>
                    Discuss with others or read reviews to gain new perspectives
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>
                    Keep a viewing journal to track your favorites and insights
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>
                    Explore the cultural and historical context of older films
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg p-8 shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Explore More Movies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/movies/popular"
                className="text-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="text-blue-600 font-medium">Popular Movies</div>
                <div className="text-sm text-gray-600">
                  Trending and most watched
                </div>
              </Link>
              <Link
                href="/movies/recent"
                className="text-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <div className="text-purple-600 font-medium">Recent Movies</div>
                <div className="text-sm text-gray-600">Latest releases</div>
              </Link>
              <Link
                href="/genres"
                className="text-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="text-green-600 font-medium">
                  Browse by Genre
                </div>
                <div className="text-sm text-gray-600">
                  Find movies by category
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
