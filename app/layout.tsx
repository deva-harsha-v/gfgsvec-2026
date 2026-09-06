import type { Metadata } from "next";
import { Outfit, DM_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700", "800", "900"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "GeeksforGeeks SVEC Student Chapter | Sri Vasavi Engineering College",
  description: "Official GeeksforGeeks Student Chapter portal at Sri Vasavi Engineering College (SVEC). Algorithmic workshops, web engineering initiatives, hackathons, and executive recruitment.",
  keywords: ["GFG SVEC", "GeeksforGeeks Sri Vasavi", "SVEC Coding Club", "GFG Student Chapter", "SVEC Recruitment"],
  authors: [{ name: "GFG SVEC Core Team" }],
  openGraph: {
    title: "GeeksforGeeks SVEC Student Chapter",
    description: "Empowering developers, algorithm enthusiasts, and designers at Sri Vasavi Engineering College.",
    url: "https://gfgsvec-2026.vercel.app",
    siteName: "GFG SVEC Student Chapter",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${dmSans.variable} ${spaceMono.variable}`}>
      <body className="bg-[#0c0e12] text-[#f1f5f9] font-body selection:bg-[#00b964]/30 selection:text-[#00e575] antialiased">
        {children}
      </body>
    </html>
  );
}
