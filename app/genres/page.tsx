import { Metadata } from "next";
import Link from "next/link";
import { getAllGenres } from "../../lib/database";
import { getCanonicalUrl } from "../../lib/seo";

export const metadata: Metadata = {
  title: "Movie Genres - Browse by Category |SimilarMovie.me",
  description:
    "Browse movies by genre. Explore action, comedy, drama, horror, romance, sci-fi, thriller, and more movie categories.",
  keywords:
    "movie genres, film categories, action movies, comedy films, drama movies, horror films, romance movies, sci-fi films, thriller movies, movie discovery by genre",
  alternates: {
    canonical: getCanonicalUrl("/genres"),
  },
  openGraph: {
    title: "Movie Genres - Browse by Category |SimilarMovie.me",
    description:
      "Discover movies by genre. Find the perfect film in any category from action and comedy to drama and horror.",
    url: getCanonicalUrl("/genres"),
    type: "website",
  },
};

export default async function GenresPage() {
  const genres = await getAllGenres();

  const genreColors = [
    "bg-red-100 text-red-800 hover:bg-red-200",
    "bg-blue-100 text-blue-800 hover:bg-blue-200",
    "bg-green-100 text-green-800 hover:bg-green-200",
    "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    "bg-purple-100 text-purple-800 hover:bg-purple-200",
    "bg-pink-100 text-pink-800 hover:bg-pink-200",
    "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
    "bg-gray-100 text-gray-800 hover:bg-gray-200",
  ];

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
                  <span className="ml-4 text-sm font-medium text-gray-900">
                    Genres
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
          <h1 className="text-4xl font-bold mb-4">Browse by Genre</h1>
          <p className="text-xl text-indigo-100">
            Explore our collection of {genres.length} different movie genres
          </p>
        </div>
      </div>

      {/* Genres Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            All Genres ({genres.length})
          </h2>
          <p className="text-gray-600">
            Click on any genre to explore movies in that category
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {genres.map((genre, index) => (
            <Link
              key={genre}
              href={`/genres/${genre.toLowerCase().replace(/\s+/g, "-")}`}
              className={`p-6 rounded-lg text-center font-medium transition-colors ${
                genreColors[index % genreColors.length]
              }`}
            >
              <div className="text-lg">{genre}</div>
            </Link>
          ))}
        </div>

        {/* Popular Genre Highlights */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Popular Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/genres/action" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                    🎬 Action Movies
                  </h3>
                  <p className="text-gray-600">
                    High-octane thrills, explosive action sequences, and
                    adrenaline-pumping adventures.
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/genres/comedy" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                    😂 Comedy Movies
                  </h3>
                  <p className="text-gray-600">
                    Laugh-out-loud moments, witty dialogue, and feel-good
                    entertainment.
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/genres/drama" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                    🎭 Drama Movies
                  </h3>
                  <p className="text-gray-600">
                    Emotional storytelling, character development, and
                    compelling narratives.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Genre Discovery Guide */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">
              🎯 How to Choose the Perfect Genre
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-3xl mx-auto">
              Not sure which genre to explore? Here's your guide to finding
              movies that match your mood and preferences.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl mb-3">🎬</div>
                <h3 className="font-bold mb-2">For Excitement</h3>
                <p className="text-blue-100 text-sm">
                  Action, Adventure, Thriller
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl mb-3">😄</div>
                <h3 className="font-bold mb-2">For Laughs</h3>
                <p className="text-blue-100 text-sm">Comedy, Romantic Comedy</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl mb-3">😱</div>
                <h3 className="font-bold mb-2">For Thrills</h3>
                <p className="text-blue-100 text-sm">
                  Horror, Mystery, Suspense
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl mb-3">💭</div>
                <h3 className="font-bold mb-2">For Depth</h3>
                <p className="text-blue-100 text-sm">
                  Drama, Biography, Documentary
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Comprehensive Genre Descriptions */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            📚 Complete Genre Guide
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                🎬 Action & Adventure
              </h3>
              <p className="text-gray-600 mb-4">
                High-energy films featuring physical stunts, chase sequences,
                fights, and spectacular set pieces. From superhero blockbusters
                to spy thrillers, these movies prioritize excitement and visual
                spectacle.
              </p>
              <div className="space-y-2">
                <div>
                  <strong>Popular Subgenres:</strong> Superhero, Spy, Military,
                  Martial Arts
                </div>
                <div>
                  <strong>Best For:</strong> Adrenaline seekers, fans of visual
                  effects
                </div>
                <div>
                  <strong>Examples:</strong> Marvel movies, James Bond, John
                  Wick
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                😂 Comedy
              </h3>
              <p className="text-gray-600 mb-4">
                Films designed to entertain and amuse through humor, wit, and
                comedic situations. From slapstick to satire, comedies span a
                wide range of styles and approaches to making audiences laugh.
              </p>
              <div className="space-y-2">
                <div>
                  <strong>Popular Subgenres:</strong> Romantic Comedy, Dark
                  Comedy, Parody, Satire
                </div>
                <div>
                  <strong>Best For:</strong> Light entertainment, stress relief,
                  date nights
                </div>
                <div>
                  <strong>Examples:</strong> The Office-style humor, Marvel
                  comedy, Classic rom-coms
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                🎭 Drama
              </h3>
              <p className="text-gray-600 mb-4">
                Character-driven stories that explore complex emotions,
                relationships, and real-life situations. Dramas focus on
                realistic portrayals of human experience and often tackle
                serious themes.
              </p>
              <div className="space-y-2">
                <div>
                  <strong>Popular Subgenres:</strong> Family Drama, Legal Drama,
                  Historical, Biographical
                </div>
                <div>
                  <strong>Best For:</strong> Emotional depth, character studies,
                  award-worthy performances
                </div>
                <div>
                  <strong>Examples:</strong> Oscar winners, character studies,
                  social issues
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                😱 Horror
              </h3>
              <p className="text-gray-600 mb-4">
                Films designed to frighten, unsettle, and create suspense.
                Horror movies explore fear through supernatural elements,
                psychological tension, or graphic violence to elicit strong
                emotional responses.
              </p>
              <div className="space-y-2">
                <div>
                  <strong>Popular Subgenres:</strong> Psychological Horror,
                  Supernatural, Slasher, Body Horror
                </div>
                <div>
                  <strong>Best For:</strong> Thrill seekers, fans of suspense
                  and scares
                </div>
                <div>
                  <strong>Examples:</strong> Supernatural scares, psychological
                  thrillers, monster movies
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                💕 Romance
              </h3>
              <p className="text-gray-600 mb-4">
                Stories centered around love relationships, romantic attraction,
                and emotional connections. These films explore the ups and downs
                of romantic relationships across various settings and time
                periods.
              </p>
              <div className="space-y-2">
                <div>
                  <strong>Popular Subgenres:</strong> Romantic Comedy,
                  Historical Romance, Contemporary Romance
                </div>
                <div>
                  <strong>Best For:</strong> Date nights, feel-good
                  entertainment, emotional stories
                </div>
                <div>
                  <strong>Examples:</strong> Classic love stories, modern
                  rom-coms, period pieces
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                🚀 Science Fiction
              </h3>
              <p className="text-gray-600 mb-4">
                Imaginative films exploring futuristic concepts, advanced
                technology, space exploration, and scientific phenomena. Sci-fi
                uses speculative elements to examine human nature and society.
              </p>
              <div className="space-y-2">
                <div>
                  <strong>Popular Subgenres:</strong> Space Opera, Cyberpunk,
                  Time Travel, Dystopian
                </div>
                <div>
                  <strong>Best For:</strong> Fans of technology, future
                  concepts, philosophical questions
                </div>
                <div>
                  <strong>Examples:</strong> Star Wars, Blade Runner, time
                  travel stories
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Movie Discovery Tips by Genre */}
        <div className="mt-20 bg-gray-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            💡 Expert Tips for Genre Discovery
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Mix Genres
              </h3>
              <p className="text-gray-600">
                Try hybrid genres like action-comedy or sci-fi horror. Genre
                blending often creates the most memorable and unique films.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Follow Your Mood
              </h3>
              <p className="text-gray-600">
                Choose genres based on how you're feeling. Action for energy,
                comedy for stress relief, drama for emotional connection.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Explore Subgenres
              </h3>
              <p className="text-gray-600">
                Dig deeper into specific subgenres within larger categories.
                Find your niche with psychological thrillers, space operas, or
                dark comedies.
              </p>
            </div>
          </div>
        </div>

        {/* Browse All Genres CTA */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-6">
              Start Your Genre Adventure Today
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              With {genres.length} genres to explore, you'll never run out of
              amazing movies to discover. Each genre offers its own unique
              storytelling style and emotional experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/tools/pick-movie"
                className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                🎲 Let AI Pick a Genre
              </Link>
              <Link
                href="/movies/popular"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
              >
                🔥 Browse Popular Movies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
