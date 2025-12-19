import { Metadata } from "next";
import Link from "next/link";
import { getCanonicalUrl } from "../../lib/seo";

export const metadata: Metadata = {
  title: "About Us |SimilarMovie.me",
  description:
    "Learn about SimilarMovie.me's advanced movie recommendation platform and intelligent algorithms for film discovery.",
  keywords:
    "about SimilarMovie, movie recommendations, film discovery, movie similarity algorithm, personalized movie suggestions, movie platform",
  alternates: {
    canonical: getCanonicalUrl("/about"),
  },
  openGraph: {
    title: "About Us |SimilarMovie.me",
    description:
      "Learn about SimilarMovie.me's advanced movie recommendation platform and intelligent algorithms for film discovery.",
    url: getCanonicalUrl("/about"),
  },
};

export default function AboutPage() {
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
                    About
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
          <h1 className="text-4xl font-bold mb-4">About SimilarMovie</h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Discover your next favorite film with our intelligent movie
            recommendation platform
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🎬 Our Mission
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            SimilarMovie exists to solve one of the most common problems movie
            lovers face: "What should I watch next?" We believe that great
            movies deserve to be discovered, and that finding your next favorite
            film shouldn't be left to chance.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Our platform uses advanced similarity algorithms to connect you with
            movies that match your tastes, helping you discover hidden gems and
            classics you might have missed.
          </p>
        </div>

        {/* How It Works Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🧠 How Our Algorithm Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                🎭 Genre Analysis
              </h3>
              <p className="text-blue-800">
                We analyze the genres of movies to find films with similar
                themes, moods, and storytelling styles.
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">
                🔍 Keyword Matching
              </h3>
              <p className="text-green-800">
                Our system examines plot keywords, themes, and content
                descriptors to identify movies with similar elements.
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">
                ⭐ Quality Weighting
              </h3>
              <p className="text-purple-800">
                We factor in ratings and popularity to ensure recommended movies
                meet quality standards while maintaining similarity.
              </p>
            </div>
            <div className="bg-orange-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-900 mb-3">
                🎯 Jaccard Similarity
              </h3>
              <p className="text-orange-800">
                We use the Jaccard similarity coefficient to measure the overlap
                between movies' characteristics and attributes.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            ✨ What Makes Us Different
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-indigo-600 font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Smart Similarity Algorithm
                </h3>
                <p className="text-gray-700">
                  Our advanced algorithm considers multiple factors including
                  genres, keywords, ratings, and popularity to find truly
                  similar movies.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-indigo-600 font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Comprehensive Database
                </h3>
                <p className="text-gray-700">
                  We maintain an extensive database of movies with detailed
                  metadata, ensuring accurate recommendations across all genres
                  and eras.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-indigo-600 font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Discovery Tools
                </h3>
                <p className="text-gray-700">
                  Beyond similarity search, we offer various tools like
                  mood-based finder, date night recommendations, and random
                  movie generator.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-indigo-600 font-semibold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Quality Focus
                </h3>
                <p className="text-gray-700">
                  We prioritize quality recommendations by considering user
                  ratings and review counts, ensuring you discover movies worth
                  watching.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">👥 Our Team</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            SimilarMovie is built by a passionate team of movie enthusiasts,
            data scientists, and software engineers who share a love for cinema
            and a belief that technology can enhance the movie discovery
            experience.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            We're constantly working to improve our algorithms, expand our
            database, and create new features that help movie lovers find their
            next great film.
          </p>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Questions or Feedback?</h2>
          <p className="text-indigo-100 mb-6">
            We'd love to hear from you! Whether you have suggestions, questions,
            or just want to share your movie discoveries.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Get in Touch
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
