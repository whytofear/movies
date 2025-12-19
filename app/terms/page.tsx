import { Metadata } from "next";
import Link from "next/link";
import { getCanonicalUrl } from "../../lib/seo";

export const metadata: Metadata = {
  title: "Terms & Conditions |SimilarMovie.me",
  description:
    "Read SimilarMovie.me's terms and conditions for using our movie recommendation platform and understanding user agreement.",
  keywords:
    "terms and conditions, service agreement, user terms, SimilarMovie legal terms, terms of use, platform terms, user agreement",
  alternates: {
    canonical: getCanonicalUrl("/terms"),
  },
  openGraph: {
    title: "Terms & Conditions |SimilarMovie.me",
    description:
      "Read SimilarMovie.me's terms and conditions for using our movie recommendation platform and understanding user agreement.",
    url: getCanonicalUrl("/terms"),
  },
};

export default function TermsPage() {
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
                    Terms & Conditions
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Please read these terms carefully before using our movie
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
              These Terms and Conditions ("Terms") govern your use of the
              SimilarMovie website and services operated by SimilarMovie ("we,"
              "us," or "our").
            </p>
          </div>

          {/* Acceptance of Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ✅ Acceptance of Terms
            </h2>
            <p className="text-gray-700 mb-4">
              By accessing and using SimilarMovie, you accept and agree to be
              bound by the terms and provision of this agreement. If you do not
              agree to abide by the above, please do not use this service.
            </p>
          </section>

          {/* Description of Service */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🎬 Description of Service
            </h2>
            <p className="text-gray-700 mb-4">
              SimilarMovie is a movie recommendation platform that helps users
              discover films similar to their favorites using advanced
              algorithms. Our services include:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Movie similarity search and recommendations</li>
              <li>Genre-based movie browsing and discovery</li>
              <li>Movie rating and review information</li>
              <li>
                Specialized recommendation tools (mood-based, date night, etc.)
              </li>
              <li>Movie database and information services</li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              👤 User Responsibilities
            </h2>
            <p className="text-gray-700 mb-4">
              As a user of SimilarMovie, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Use the service only for lawful purposes</li>
              <li>Not attempt to gain unauthorized access to our systems</li>
              <li>Not interfere with or disrupt the service or servers</li>
              <li>
                Not use automated systems to access the service excessively
              </li>
              <li>Respect intellectual property rights</li>
              <li>Provide accurate information when contacting us</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🏛️ Intellectual Property Rights
            </h2>
            <p className="text-gray-700 mb-4">
              The service and its original content, features, and functionality
              are and will remain the exclusive property of SimilarMovie and its
              licensors. The service is protected by copyright, trademark, and
              other laws.
            </p>
            <p className="text-gray-700">
              Movie data, images, and related content are sourced from public
              databases and are used in accordance with fair use principles for
              informational and recommendation purposes.
            </p>
          </section>

          {/* Prohibited Uses */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🚫 Prohibited Uses
            </h2>
            <p className="text-gray-700 mb-4">You may not use our service:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                For any unlawful purpose or to solicit others to perform
                unlawful acts
              </li>
              <li>
                To violate any international, federal, provincial, or state
                regulations, rules, laws, or local ordinances
              </li>
              <li>
                To infringe upon or violate our intellectual property rights or
                the intellectual property rights of others
              </li>
              <li>
                To harass, abuse, insult, harm, defame, slander, disparage,
                intimidate, or discriminate
              </li>
              <li>To submit false or misleading information</li>
              <li>
                To upload or transmit viruses or any other type of malicious
                code
              </li>
              <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
              <li>For any obscene or immoral purpose</li>
            </ul>
          </section>

          {/* Content Accuracy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📊 Content Accuracy and Availability
            </h2>
            <p className="text-gray-700 mb-4">
              We strive to provide accurate and up-to-date movie information and
              recommendations. However:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                We do not guarantee the accuracy, completeness, or timeliness of
                any information
              </li>
              <li>
                Movie data is sourced from third-party databases and may contain
                errors
              </li>
              <li>
                Recommendations are algorithmic and may not always match
                personal preferences
              </li>
              <li>
                We reserve the right to modify or discontinue features at any
                time
              </li>
            </ul>
          </section>

          {/* Disclaimers */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ⚠️ Disclaimers
            </h2>
            <p className="text-gray-700 mb-4">
              The information on this website is provided on an "as is" basis.
              To the fullest extent permitted by law, this Company:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                Excludes all representations and warranties relating to this
                website and its contents
              </li>
              <li>
                Does not warrant that the service will be uninterrupted or
                error-free
              </li>
              <li>Does not guarantee the accuracy of movie recommendations</li>
              <li>
                Excludes all liability for damages arising out of or in
                connection with your use of this website
              </li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🛡️ Limitation of Liability
            </h2>
            <p className="text-gray-700">
              SimilarMovie shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, including without
              limitation, loss of profits, data, use, goodwill, or other
              intangible losses, resulting from your use of the service.
            </p>
          </section>

          {/* Indemnification */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🔒 Indemnification
            </h2>
            <p className="text-gray-700">
              You agree to defend, indemnify, and hold harmless SimilarMovie and
              its licensee and licensors, and their employees, contractors,
              agents, officers and directors, from and against any and all
              claims, damages, obligations, losses, liabilities, costs or debt,
              and expenses (including but not limited to attorney's fees).
            </p>
          </section>

          {/* Termination */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🔚 Termination
            </h2>
            <p className="text-gray-700">
              We may terminate or suspend your access immediately, without prior
              notice or liability, for any reason whatsoever, including without
              limitation if you breach the Terms. Upon termination, your right
              to use the service will cease immediately.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ⚖️ Governing Law
            </h2>
            <p className="text-gray-700">
              These Terms shall be interpreted and governed by the laws of the
              jurisdiction in which SimilarMovie operates, without regard to its
              conflict of law provisions. Our failure to enforce any right or
              provision of these Terms will not be considered a waiver of those
              rights.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📝 Changes to Terms
            </h2>
            <p className="text-gray-700">
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material, we will try to
              provide at least 30 days notice prior to any new terms taking
              effect. What constitutes a material change will be determined at
              our sole discretion.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📧 Contact Information
            </h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms and Conditions, please
              contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Email:</strong> legal@SimilarMovie.me
                <br />
                <strong>Subject:</strong> Terms and Conditions Inquiry
              </p>
            </div>
          </section>

          {/* Related Pages */}
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">
              Related Legal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/privacy"
                className="text-purple-600 hover:text-purple-800 underline"
              >
                Privacy Policy
              </Link>
              <Link
                href="/contact"
                className="text-purple-600 hover:text-purple-800 underline"
              >
                Contact Us
              </Link>
              <Link
                href="/disclaimer"
                className="text-purple-600 hover:text-purple-800 underline"
              >
                Disclaimer
              </Link>
              <Link
                href="/about"
                className="text-purple-600 hover:text-purple-800 underline"
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
