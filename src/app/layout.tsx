import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Farhan Tanvir | Professional Graphic Designer",
  description: "Portfolio of Farhan Tanvir, a professional graphic designer focused on visual storytelling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-[#0a0a0a] text-white selection:bg-[#d2b48c]/30 selection:text-[#d2b48c] min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
