import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
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
    default: "KiroCode Mentor",
    template: "%s | KiroCode Mentor",
  },
  description: "Plateforme d'apprentissage révolutionnaire avec IA pour développeurs - Mentor personnel adaptatif",
  keywords: [
    "apprentissage",
    "développement",
    "programmation",
    "IA",
    "mentor",
    "code",
    "formation",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js"
  ],
  authors: [{ name: "KiroCode Team" }],
  creator: "KiroCode",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://kirocode-mentor.com",
    title: "KiroCode Mentor",
    description: "Plateforme d'apprentissage révolutionnaire avec IA pour développeurs",
    siteName: "KiroCode Mentor",
  },
  twitter: {
    card: "summary_large_image",
    title: "KiroCode Mentor",
    description: "Plateforme d'apprentissage révolutionnaire avec IA pour développeurs",
    creator: "@kirocode",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
