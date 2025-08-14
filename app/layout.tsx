import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import TanstackQueryProvider from '@/components/providers/tanstackquery-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'KiroCode Mentor',
    template: '%s | KiroCode Mentor',
  },
  description:
    'Revolutionary AI-powered learning platform for developers - Adaptive personal mentor',
  keywords: [
    'learning',
    'development',
    'programming',
    'AI',
    'mentor',
    'code',
    'training',
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
  ],
  authors: [{ name: 'KiroCode Team' }],
  creator: 'KiroCode',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kirocode-mentor.com',
    title: 'KiroCode Mentor',
    description: 'Revolutionary AI-powered learning platform for developers',
    siteName: 'KiroCode Mentor',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KiroCode Mentor',
    description: 'Revolutionary AI-powered learning platform for developers',
    creator: '@kirocode',
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
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-scroll-behavior="smooth" lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TanstackQueryProvider>
            {children}
          </TanstackQueryProvider>
          
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
