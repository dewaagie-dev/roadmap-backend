import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Backend Remote Job Roadmap — Junior to Senior",
  description: "365-day plan to grow from Junior to Senior Backend Engineer with daily goals, exercises, and progress tracking",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
