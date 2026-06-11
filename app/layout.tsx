import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GlobalThemeProvider } from "../app/context/ThemeContext"; 
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
  title: "Shashika Fernando | Portfolio",
  description: "Software Engineer Portfolio with interactive aesthetic design engine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full flex flex-col`} 
        suppressHydrationWarning
      >
        <GlobalThemeProvider>
          {children}
        </GlobalThemeProvider>
      </body>
    </html>
  );
}