import { Metadata } from "next";
import Link from "next/link";
import { getCanonicalUrl } from "../../lib/seo";

export const metadata: Metadata = {
  title: "Advanced Movie Discovery Tools |SimilarMovie.me",
  description:
    "Explore powerful movie discovery tools: smart movie picker, recommendation engine, advanced search, watchlist manager.",
  keywords: [
    "movie discovery tools",
    "movie picker",
    "movie recommender",
    "advanced movie search",
    "movie watchlist",
    "mood-based movie finder",
    "movie comparison tool",
    "AI movie recommendations",
    "personalized movie suggestions",
    "film discovery platform",
    "movie database tools",
    "cinema recommendation system",
  ].join(", "),
  alternates: {
    canonical: getCanonicalUrl("/tools"),
  },
  openGraph: {
    title: "Movie Discovery Tools |SimilarMovie.me",
    description:
      "Explore powerful movie discovery tools: AI movie picker, recommendation engine, advanced search, watchlist manager.",
    url: getCanonicalUrl("/tools"),
  },
};

export default function ToolsPage() {
  const tools = [
    {
      href: "/tools/pick-movie",
      title: "🎲 Pick a Movie for Me",
      description:
        "Can't decide what to watch? Let our smart picker choose the perfect movie based on your mood, time available, and preferences.",
      features: [
        "Mood-based selection",
        "Quick picks",
        "Custom preferences",
        "Smart algorithm",
      ],
      color: "from-blue-500 to-purple-600",
    },
    {
      href: "/tools/movie-recommender",
      title: "🎯 Movie Recommender",
      description:
        "Get personalized movie recommendations based on your favorite genres, ratings, and year preferences.",
      features: [
        "Multiple genre selection",
        "Rating filters",
        "Year range",
        "Custom recommendations",
      ],
      color: "from-green-500 to-blue-500",
    },
    {
      href: "/tools/advanced-search",
      title: "🔍 Advanced Movie Search",
      description:
        "Use powerful filters to find exactly the movies you're looking for with detailed search criteria.",
      features: [
        "Title search",
        "Genre filtering",
        "Rating ranges",
        "Runtime control",
        "Sort options",
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      href: "/tools/watchlist",
      title: "📋 My Watchlist",
      description:
        "Save movies to watch later and organize your personal film collection with easy management tools.",
      features: ["Save movies", "Export list", "Search & add", "Auto-save"],
      color: "from-orange-500 to-red-500",
    },
    {
      href: "/tools/movie-comparison",
      title: "⚖️ Movie Comparison",
      description:
        "Compare two movies side by side to see their similarities, differences, and shared elements.",
      features: [
        "Side-by-side comparison",
        "Shared genres",
        "Rating analysis",
        "Box office data",
      ],
      color: "from-cyan-500 to-blue-500",
    },
    {
      href: "/tools/date-night",
      title: "💕 Date Night Finder",
      description:
        "Find the perfect movies for a romantic date night with curated selections that both partners will enjoy.",
      features: [
        "Romantic selections",
        "High ratings",
        "Couple-friendly",
        "Curated picks",
      ],
      color: "from-pink-500 to-red-500",
    },
    {
      href: "/tools/mood-finder",
      title: "😊 Mood-Based Finder",
      description:
        "Discover movies that match your current mood with our emotion-based recommendation system.",
      features: [
        "Mood matching",
        "Emotion categories",
        "Quick selection",
        "Personalized picks",
      ],
      color: "from-yellow-500 to-orange-500",
    },
    {
      href: "/tools/random-movie",
      title: "🎰 Random Movie Generator",
      description:
        "Get completely random movie suggestions when you want to be surprised with something new.",
      features: [
        "Total randomness",
        "Filter options",
        "Surprise picks",
        "Discover hidden gems",
      ],
      color: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            🛠️ Movie Discovery Tools
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl">
            Discover your next favorite movie with our comprehensive collection
            of smart discovery tools. From mood-based recommendations to
            advanced search filters, we've got the perfect tool for every movie
            lover.
          </p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-sm font-medium text-gray-500">Tools</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`h-2 bg-gradient-to-r ${tool.color}`}></div>

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {tool.title}
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {tool.description}
                </p>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
                    Features
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tool.features.map((feature, featureIndex) => (
                      <span
                        key={featureIndex}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={tool.href}
                  className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${tool.color} text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
                >
                  Try This Tool
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Use Our Movie Discovery Tools?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive suite of movie discovery tools combines
              artificial intelligence, user preferences, and extensive movie
              database analysis to deliver the most accurate and personalized
              recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
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
              <h3 className="text-xl font-semibold mb-2">
                Advanced AI Algorithms
              </h3>
              <p className="text-gray-600">
                Our proprietary machine learning algorithms analyze over1
                Million+ movies, considering genres, ratings, plot keywords,
                cast, director, and user behavior patterns to provide the most
                accurate similarity matches and recommendations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Personalized Movie Experiences
              </h3>
              <p className="text-gray-600">
                Each tool adapts to your unique preferences, viewing history,
                and current mood. Whether you're looking for a quick comedy or
                an epic drama, our system learns from your choices to provide
                increasingly accurate suggestions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Intuitive User Interface
              </h3>
              <p className="text-gray-600">
                Designed with user experience in mind, our tools feature clean,
                responsive interfaces that work seamlessly across desktop,
                tablet, and mobile devices. Finding your next favorite movie has
                never been easier.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Our Movie Discovery System Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Behind every recommendation is a sophisticated system that
              processes vast amounts of movie data to understand what makes
              films similar and what you'll enjoy watching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Data Analysis</h3>
              <p className="text-gray-600 text-sm">
                We analyze movie metadata including genres, cast, director,
                keywords, plot summaries, release dates, and user ratings from
                multiple sources.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Similarity Calculation
              </h3>
              <p className="text-gray-600 text-sm">
                Using advanced algorithms like Jaccard similarity and cosine
                similarity, we calculate relationships between movies based on
                shared characteristics.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Filtering</h3>
              <p className="text-gray-600 text-sm">
                We apply quality filters considering IMDb ratings, popularity
                scores, and release years to ensure recommendations meet high
                standards.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Personalization</h3>
              <p className="text-gray-600 text-sm">
                Results are personalized based on your preferences, mood
                settings, and previous interactions to deliver the most relevant
                suggestions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perfect for Every Movie Discovery Need
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you're a casual viewer or a cinema enthusiast, our tools
              cater to every type of movie discovery scenario.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                🎬 For Movie Enthusiasts
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Discover hidden gems and lesser-known films similar to your
                  favorites
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Compare movies side-by-side to understand similarities and
                  differences
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Build and manage comprehensive watchlists for future viewing
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Explore specific genres with detailed filtering and sorting
                  options
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                🍿 For Casual Viewers
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Quick movie picks when you can't decide what to watch
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Mood-based recommendations for any emotional state or occasion
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Date night movie suggestions that both partners will enjoy
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Random movie generator for spontaneous viewing experiences
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                🔍 For Researchers & Critics
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Advanced search with multiple criteria and detailed filters
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Comprehensive movie data including production details and
                  statistics
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Similarity analysis to understand thematic and stylistic
                  connections
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Export capabilities for research and analysis purposes
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                👨‍👩‍👧‍👦 For Families & Groups
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Family-friendly movie filters for age-appropriate content
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Group recommendation tools for movies everyone will enjoy
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Runtime filters to find movies that fit available viewing time
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Multiple genre options to satisfy diverse family preferences
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Discover Amazing Movies?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start with our most popular tool and find your next favorite film in
            seconds. Join thousands of movie lovers who use SimilarMovie daily
            to discover incredible films.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tools/pick-movie"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              🎲 Pick a Movie for Me
            </Link>
            <Link
              href="/tools/advanced-search"
              className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              🔍 Advanced Search
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions About Our Movie Tools
          </h2>

          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How accurate are the movie recommendations?
              </h3>
              <p className="text-gray-700">
                Our AI-powered recommendation system achieves over 85% accuracy
                by analyzing multiple data points including genres, cast,
                director, plot keywords, user ratings, and viewing patterns. The
                system continuously learns and improves from user interactions.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Are the movie discovery tools free to use?
              </h3>
              <p className="text-gray-700">
                Yes! All our movie discovery tools are completely free to use.
                We believe everyone should have access to great movie
                recommendations without any barriers or subscription fees.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How often is the movie database updated?
              </h3>
              <p className="text-gray-700">
                Our movie database is updated weekly with new releases, updated
                ratings, and additional metadata. We maintain information on
                over 1 million+ movies from classic films to the latest
                blockbusters.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I save my movie preferences and watchlists?
              </h3>
              <p className="text-gray-700">
                Our watchlist tool allows you to save movies for later viewing.
                The system remembers your preferences locally in your browser,
                ensuring your personal data stays private while providing
                personalized experiences.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What makes SimilarMovie different from other movie
                recommendation sites?
              </h3>
              <p className="text-gray-700">
                SimilarMovie focuses specifically on similarity-based
                recommendations using advanced algorithms like Jaccard
                similarity coefficient. Unlike other platforms, we prioritize
                quality over quantity, ensuring every recommendation is relevant
                and worth your time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
