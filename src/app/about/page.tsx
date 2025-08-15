import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About HuntingtonBank - Global Banking Solutions',
  description:
    'Learn about HuntingtonBank’s mission, values, and achievements in providing secure and innovative global banking solutions.',
  openGraph: {
    title: 'About HuntingtonBank',
    description: 'Discover how HuntingtonBank empowers global financial freedom with innovative banking solutions.',
    url: 'https://your-HuntingtonBank-url.com/about',
    siteName: 'HuntingtonBank',
    images: [
      {
        url: 'https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=1920',
        width: 1200,
        height: 630,
        alt: 'About HuntingtonBank',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <main className="bg-gray-100 text-gray-900 pt-16">
      <Navbar />
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 bg-blue-900 text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="About HuntingtonBank"
            layout="fill"
            objectFit="cover"
            className="opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-blue-900/60"></div>
        </div>
        <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          About HuntingtonBank
        </h1>
        <p className="relative text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed">
          Empowering global financial freedom with innovative, secure, and seamless banking solutions.
        </p>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-blue-900">
          Our Mission
        </h2>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            At HuntingtonBank, our mission is to simplify global banking by providing secure, efficient, and accessible financial services to individuals and businesses worldwide. We strive to break down barriers in international finance, offering multi-currency accounts, competitive rates, and cutting-edge technology to empower our customers.
          </p>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-blue-900">
          Our Core Values
        </h2>
        <div className="grid gap-8 sm:gap-10 md:grid-cols-3 max-w-7xl mx-auto">
          {[
            {
              title: 'Transparency',
              description: 'We believe in clear, honest communication with no hidden fees or surprises.',
              image: 'https://images.pexels.com/photos/6802048/pexels-photo-6802048.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            {
              title: 'Innovation',
              description: 'We leverage cutting-edge technology to deliver seamless banking experiences.',
              image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
            {
              title: 'Security',
              description: 'Your funds and data are protected with industry-leading security measures.',
              image: 'https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=600',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-xl p-6 text-center border border-gray-200 hover:scale-105 hover:shadow-xl transition-transform duration-300"
            >
              <div className="mb-4">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={600}
                  height={400}
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-blue-900">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Achievements Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-blue-900">
          Our Achievements
        </h2>
        <div className="grid gap-8 sm:gap-10 md:grid-cols-3 max-w-7xl mx-auto text-center">
          {[
            { metric: '1M+', label: 'Customers Worldwide' },
            { metric: '210+', label: 'Regions Covered' },
            { metric: '$50B+', label: 'Total Transaction Value' },
          ].map((item, index) => (
            <div key={index} className="p-6">
              <h3 className="text-4xl font-bold text-red-600 mb-2">{item.metric}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-blue-900 text-white text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Join HuntingtonBank Today
        </h2>
        <p className="text-base sm:text-lg max-w-3xl mx-auto mb-8">
          Experience global banking with ease and security. Sign up now to start managing your finances worldwide.
        </p>
        <Link
          href="/auth/register"
          className="bg-red-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg shadow-lg hover:bg-red-700 hover:shadow-xl transition duration-300"
          aria-label="Sign up for HuntingtonBank"
        >
          Get Started
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