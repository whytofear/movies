import { Metadata } from "next";
import Link from "next/link";
import { getCanonicalUrl } from "../../lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy |SimilarMovie.me",
  description:
    "Learn about SimilarMovie.me's privacy policy, data protection practices, and commitment to user data security.",
  keywords:
    "privacy policy, data protection, personal information, SimilarMovie privacy, user data security, data privacy, GDPR compliance",
  alternates: {
    canonical: getCanonicalUrl("/privacy"),
  },
  openGraph: {
    title: "Privacy Policy |SimilarMovie.me",
    description:
      "Learn about SimilarMovie.me's privacy policy, data protection practices, and commitment to user data security.",
    url: getCanonicalUrl("/privacy"),
  },
};

export default function PrivacyPage() {
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
                    Privacy Policy
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and
            protect your information.
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
              This Privacy Policy describes how SimilarMovie ("we," "us," or
              "our") collects, uses, and shares information when you use our
              website and services.
            </p>
          </div>

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🔍 Information We Collect
            </h2>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Information You Provide
            </h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>
                Contact information when you reach out to us (name, email
                address)
              </li>
              <li>
                Feedback and suggestions you submit through our contact forms
              </li>
              <li>Any other information you choose to provide to us</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Information We Collect Automatically
            </h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>
                Usage information (pages visited, features used, search queries)
              </li>
              <li>
                Device information (browser type, operating system, IP address)
              </li>
              <li>Analytics data to help us improve our service</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🎯 How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Provide and improve our movie recommendation services</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Develop new features and improve existing functionality</li>
              <li>Ensure the security and integrity of our platform</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🤝 Information Sharing
            </h2>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or otherwise transfer your personal
              information to third parties, except in the following
              circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>Service Providers:</strong> We may share information
                with trusted third-party service providers who assist us in
                operating our website and providing our services
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose information
                when required by law or to protect our rights and safety
              </li>
              <li>
                <strong>Business Transfers:</strong> In the event of a merger,
                acquisition, or sale of assets, user information may be
                transferred
              </li>
              <li>
                <strong>Consent:</strong> We may share information with your
                explicit consent
              </li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🔒 Data Security
            </h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational measures to
              protect your personal information against unauthorized access,
              alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication measures</li>
              <li>Secure hosting and infrastructure</li>
            </ul>
            <p className="text-gray-700 mt-4">
              However, no method of transmission over the internet or electronic
              storage is 100% secure. While we strive to protect your
              information, we cannot guarantee its absolute security.
            </p>
          </section>

          {/* Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🍪 Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar tracking technologies to enhance your
              experience on our website. Cookies are small data files stored on
              your device that help us:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Remember your preferences and settings</li>
              <li>Understand how you use our website</li>
              <li>Improve our services and user experience</li>
              <li>Provide relevant content and recommendations</li>
            </ul>
            <p className="text-gray-700 mt-4">
              You can control cookies through your browser settings. However,
              disabling cookies may affect some functionality of our website.
            </p>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              👤 Your Rights and Choices
            </h2>
            <p className="text-gray-700 mb-4">
              Depending on your location, you may have certain rights regarding
              your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>Access:</strong> Request access to the personal
                information we hold about you
              </li>
              <li>
                <strong>Correction:</strong> Request correction of inaccurate or
                incomplete information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your personal
                information
              </li>
              <li>
                <strong>Portability:</strong> Request a copy of your data in a
                structured format
              </li>
              <li>
                <strong>Objection:</strong> Object to certain processing of your
                information
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              To exercise these rights, please contact us using the information
              provided below.
            </p>
          </section>

          {/* Third-Party Links */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🔗 Third-Party Links
            </h2>
            <p className="text-gray-700">
              Our website may contain links to third-party websites or services.
              We are not responsible for the privacy practices or content of
              these external sites. We encourage you to review the privacy
              policies of any third-party sites you visit.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              👶 Children's Privacy
            </h2>
            <p className="text-gray-700">
              Our service is not intended for children under the age of 13. We
              do not knowingly collect personal information from children under
              13. If we become aware that we have collected personal information
              from a child under 13, we will take steps to delete such
              information.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📝 Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last updated" date. We encourage you
              to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📧 Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy or our privacy
              practices, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Email:</strong> privacy@SimilarMovie.me
                <br />
                <strong>Subject:</strong> Privacy Policy Inquiry
              </p>
            </div>
          </section>

          {/* Related Pages */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Related Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/terms"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/contact"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Contact Us
              </Link>
              <Link
                href="/disclaimer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Disclaimer
              </Link>
              <Link
                href="/about"
                className="text-blue-600 hover:text-blue-800 underline"
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
