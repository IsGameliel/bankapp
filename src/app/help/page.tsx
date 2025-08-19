import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Center - HuntingtonBank Support',
  description:
    'Find answers to common questions or contact HuntingtonBank’s support team for assistance with your banking needs.',
  openGraph: {
    title: 'HuntingtonBank Help Center',
    description: 'Get help with your HuntingtonBank account through our FAQs or contact our support team.',
    url: 'https://your-HuntingtonBank-url.com/help',
    siteName: 'HuntingtonBank',
    images: [
      {
        url: 'https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=1920',
        width: 1200,
        height: 630,
        alt: 'HuntingtonBank Help Center',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function HelpPage() {
  return (
    <main className="bg-gray-100 text-gray-900">
      <Navbar />
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 bg-blue-900 text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Help Center"
            layout="fill"
            objectFit="cover"
            className="opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-blue-900/60"></div>
        </div>
        <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          Help Center
        </h1>
        <p className="relative text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed">
          Find answers to your questions or contact our support team for assistance.
        </p>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-blue-900">
          Frequently Asked Questions
        </h2>
        <div className="max-w-4xl mx-auto space-y-6">
          {[
            {
              question: 'How do I open a HuntingtonBank account?',
              answer: 'You can open an account by clicking "Sign Up" on our homepage and following the registration process. It takes just a few minutes to get started.',
            },
            {
              question: 'What currencies are supported?',
              answer: 'We support over 20 currencies for receiving funds and 100+ currencies for sending payments to 210+ regions.',
            },
            {
              question: 'Are there any fees for international transfers?',
              answer: 'HuntingtonBank offers competitive rates with low or no fees for international transfers, depending on the currency and destination.',
            },
            {
              question: 'How secure is my money with HuntingtonBank?',
              answer: 'We partner with leading banks and use industry-leading encryption to ensure your funds and data are secure.',
            },
          ].map((faq, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-xl p-6 border border-gray-200"
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-blue-900">
                {faq.question}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-blue-900 text-white text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Still Need Help?
        </h2>
        <p className="text-base sm:text-lg max-w-3xl mx-auto mb-8">
          Our support team is available 24/7 to assist you with any questions or issues.
        </p>
        <Link
          href="/contact"
          className="bg-red-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg shadow-lg hover:bg-red-700 hover:shadow-xl transition duration-300"
          aria-label="Contact HuntingtonBank Support"
        >
          Contact Support
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-blue-900 text-white text-center">
        <p className="text-sm sm:text-base">
          © 2025 HuntingtonBank. All rights reserved. Secure banking for a connected world.
        </p>
      </footer>
    </main>
  );
}