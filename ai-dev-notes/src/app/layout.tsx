import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Horse & Panda",
    template: "%s | Horse & Panda"
  },
  description: "Personal blog of Horse & Panda",
  keywords: ["AI", "artificial intelligence", "development", "machine learning", "programming", "tutorials", "blog"],
  authors: [{ name: "Horse & Panda", url: "https://ai-dev-notes.vercel.app" }],
  creator: "Horse & Panda",
  publisher: "Horse & Panda",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ai-dev-notes.vercel.app'),
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [
        { url: '/rss.xml', title: 'Horse & Panda RSS Feed' },
        { url: '/atom.xml', title: 'Horse & Panda Atom Feed' },
      ],
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ai-dev-notes.vercel.app",
    title: "Horse & Panda",
    description: "Personal blog of Horse & Panda",
    siteName: "Horse & Panda",
    images: [
      {
        url: "/api/og?title=Horse & Panda&summary=Personal blog of Horse & Panda",
        width: 1200,
        height: 630,
        alt: "Horse & Panda",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Horse & Panda",
    description: "Personal blog of Horse & Panda",
    images: ["/api/og?title=Horse & Panda&summary=Personal blog of Horse & Panda"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
