import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif, Geist_Mono } from "next/font/google";
import { GlobalThemeProvider } from "./context/ThemeContext";
import "./globals.css";
import { Cursor } from "./components/ui/Cursor";
import { RESTART_ON_RELOAD_SCRIPT } from "./lib/navigation";

// Interface sans + display serif (the "exhibit" voice) + mono for numerals.
const instrumentSans = Instrument_Sans({
  variable: "--font-sans-ui",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { SITE_URL as siteUrl } from "./lib/site";
import { PROFILE, SKILLS } from "./data/profile";

// Structured data (JSON-LD): lets search and AI answer engines read this page
// as a person with a role, skills and profiles, not just a block of text.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: PROFILE.name,
    jobTitle: PROFILE.title,
    description: PROFILE.headline,
    image: `${siteUrl}${PROFILE.avatar}`,
    address: { "@type": "PostalAddress", addressLocality: "Colombo", addressCountry: "LK" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "University of Ruhuna" },
    knowsAbout: SKILLS.flatMap((s) => s.items),
    sameAs: [PROFILE.links.github, PROFILE.links.linkedin],
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Shashika Fernando | Software Engineer",
  description:
    "Portfolio of Shashika Fernando, a software engineer working across cybersecurity research, distributed systems and AI.",
  authors: [{ name: "Shashika Fernando" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Shashika Fernando | Software Engineer",
    description:
      "Projects, research, experience and certifications in cybersecurity, distributed systems and AI.",
    type: "website",
    images: ["/pic.jpeg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f8fafc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${instrumentSans.variable} ${instrumentSerif.variable} ${geistMono.variable} font-sans antialiased min-h-full flex flex-col`}
        suppressHydrationWarning
      >
        <script dangerouslySetInnerHTML={{ __html: RESTART_ON_RELOAD_SCRIPT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <GlobalThemeProvider>
          {children}
          <Cursor />
        </GlobalThemeProvider>
      </body>
    </html>
  );
}