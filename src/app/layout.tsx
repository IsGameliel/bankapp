import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  weight: ['400', '700'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'HuntingtonsBank - Global Banking Solutions',
  description:
    'HuntingtonsBank offers secure multi-currency accounts, fast global transfers, and competitive rates for seamless banking worldwide.',
  openGraph: {
    title: 'HuntingtonsBank - Your World of Banking',
    description: 'Manage your finances globally with HuntingtonsBank’s secure and efficient banking solutions.',
    url: 'https://your-huntingtonsbank-url.com', // Replace with your domain
    siteName: 'HuntingtonsBank',
    images: [
      {
        url: 'https://images.pexels.com/photos/6802048/pexels-photo-6802048.jpeg?auto=compress&cs=tinysrgb&w=1920',
        width: 1200,
        height: 630,
        alt: 'HuntingtonsBank Global Banking',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}