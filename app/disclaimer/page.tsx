import { Metadata } from "next";
import Link from "next/link";
import { getCanonicalUrl } from "../../lib/seo";

export const metadata: Metadata = {
  title: "Disclaimer |SimilarMovie.me",
  description:
    "Important disclaimers about SimilarMovie.me movie recommendations, content accuracy, and service limitations.",
  keywords:
    "disclaimer, movie recommendations disclaimer, content accuracy, service limitations, SimilarMovie legal, movie database disclaimer",
  alternates: {
    canonical: getCanonicalUrl("/disclaimer"),
  },
  openGraph: {
    title: "Disclaimer |SimilarMovie.me",
    description:
      "Important disclaimers about SimilarMovie.me movie recommendations, content accuracy, and service limitations.",
    url: getCanonicalUrl("/disclaimer"),
  },
};

export default function DisclaimerPage() {
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
                    Disclaimer
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Disclaimer</h1>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto">
            Important information about the limitations and scope of our movie
            recommendation service.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <p className="text-gray-600 mb-4">
              <strong>Last updated:</strong> June 6, 2025
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              The following disclaimer applies to the SimilarMovie website and
              all related services. Please read this information carefully
              before using our platform.
            </p>
          </div>

          {/* General Disclaimer */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ⚠️ General Disclaimer
            </h2>
            <p className="text-gray-700 mb-4">
              The information contained on SimilarMovie is for general
              information purposes only. The information is provided by
              SimilarMovie and while we endeavor to keep the information up to
              date and correct, we make no representations or warranties of any
              kind, express or implied, about the completeness, accuracy,
              reliability, suitability or availability with respect to the
              website or the information, products, services, or related
              graphics contained on the website for any purpose.
            </p>
            <p className="text-gray-700">
              Any reliance you place on such information is therefore strictly
              at your own risk.
            </p>
          </section>

          {/* Movie Recommendations */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🎬 Movie Recommendations Disclaimer
            </h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Important:</strong> Movie recommendations are
                    algorithmic suggestions based on similarity calculations and
                    should not be considered professional movie reviews or
                    critical assessments.
                  </p>
                </div>
              </div>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                Our recommendations are generated using automated algorithms and
                may not reflect personal taste preferences
              </li>
              <li>
                Similarity scores are calculated based on available data and may
                not capture all aspects of movie quality or appeal
              </li>
              <li>
                We do not endorse or guarantee the quality, appropriateness, or
                enjoyment of any recommended movies
              </li>
              <li>
                Individual viewing preferences vary significantly, and
                recommendations may not be suitable for all users
              </li>
              <li>
                Content ratings and descriptions are sourced from third parties
                and may not be comprehensive
              </li>
            </ul>
          </section>

          {/* Content Accuracy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📊 Content Accuracy and Sources
            </h2>
            <p className="text-gray-700 mb-4">
              SimilarMovie aggregates movie information from various public
              sources and databases. While we strive for accuracy:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                Movie data, ratings, and descriptions are sourced from
                third-party databases and may contain errors
              </li>
              <li>
                Release dates, cast information, and plot summaries may be
                incomplete or outdated
              </li>
              <li>
                User ratings and review counts are provided for informational
                purposes only
              </li>
              <li>
                We do not verify the accuracy of all movie information displayed
                on our platform
              </li>
              <li>
                Information may change without notice as we update our database
              </li>
            </ul>
          </section>

          {/* Age Appropriateness */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🔞 Age Appropriateness and Content Warnings
            </h2>
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    <strong>Parental Guidance:</strong> Users are responsible
                    for verifying the appropriateness of movie content for
                    themselves and their families.
                  </p>
                </div>
              </div>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                We display content ratings when available, but these may not be
                comprehensive or current
              </li>
              <li>
                Movies may contain content unsuitable for certain age groups
              </li>
              <li>
                Parents and guardians should independently verify movie ratings
                and content before viewing with children
              </li>
              <li>
                Content warnings and descriptions may not capture all
                potentially sensitive material
              </li>
              <li>
                We recommend checking official movie ratings and reviews before
                viewing
              </li>
            </ul>
          </section>

          {/* Third-Party Content */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🔗 Third-Party Content and Links
            </h2>
            <p className="text-gray-700 mb-4">
              SimilarMovie may include links to third-party websites, services,
              or content:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                We do not control or endorse third-party websites or services
              </li>
              <li>
                External links are provided for convenience and informational
                purposes only
              </li>
              <li>
                We are not responsible for the content, privacy practices, or
                terms of third-party sites
              </li>
              <li>
                Movie posters and images are used under fair use principles for
                informational purposes
              </li>
              <li>Clicking external links is at your own risk</li>
            </ul>
          </section>

          {/* Technical Limitations */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🔧 Technical Limitations
            </h2>
            <p className="text-gray-700 mb-4">
              Our service may experience technical limitations:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                Website availability is not guaranteed and may be interrupted
                for maintenance
              </li>
              <li>
                Recommendation algorithms may produce unexpected or inaccurate
                results
              </li>
              <li>
                Search functionality may not return complete or relevant results
              </li>
              <li>
                Database queries may be slow or time out during high traffic
                periods
              </li>
              <li>
                Mobile compatibility may vary across different devices and
                browsers
              </li>
            </ul>
          </section>

          {/* No Professional Advice */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🎓 No Professional Advice
            </h2>
            <p className="text-gray-700">
              SimilarMovie provides entertainment recommendations only and does
              not constitute professional advice of any kind. Our
              recommendations are not substitutes for professional film
              criticism, academic film study, or expert entertainment guidance.
              Users should make their own informed decisions about movie viewing
              choices.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🛡️ Limitation of Liability
            </h2>
            <p className="text-gray-700">
              In no event will SimilarMovie be liable for any loss or damage
              including without limitation, indirect or consequential loss or
              damage, or any loss or damage whatsoever arising from loss of data
              or profits arising out of, or in connection with, the use of this
              website.
            </p>
          </section>

          {/* User Responsibility */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              👤 User Responsibility
            </h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                🎯 You are responsible for:
              </h3>
              <ul className="list-disc list-inside text-blue-800 space-y-2">
                <li>
                  Verifying movie content appropriateness for your viewing
                  preferences
                </li>
                <li>
                  Checking current ratings, reviews, and content warnings
                  independently
                </li>
                <li>Making informed decisions about movie viewing choices</li>
                <li>
                  Understanding that recommendations are suggestions, not
                  guarantees
                </li>
                <li>
                  Using the service in accordance with applicable laws and
                  regulations
                </li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📧 Questions About This Disclaimer
            </h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this disclaimer, please contact
              us:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Email:</strong> legal@SimilarMovie.me
                <br />
                <strong>Subject:</strong> Disclaimer Inquiry
              </p>
            </div>
          </section>

          {/* Related Pages */}
          <div className="bg-orange-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-orange-900 mb-4">
              Related Legal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/terms"
                className="text-orange-600 hover:text-orange-800 underline"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy"
                className="text-orange-600 hover:text-orange-800 underline"
              >
                Privacy Policy
              </Link>
              <Link
                href="/contact"
                className="text-orange-600 hover:text-orange-800 underline"
              >
                Contact Us
              </Link>
              <Link
                href="/about"
                className="text-orange-600 hover:text-orange-800 underline"
              >
                About SimilarMovie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
