import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GeeksforGeeks SVEC Student Chapter | Sri Vasavi Engineering College",
  description: "Official GeeksforGeeks Student Chapter portal at Sri Vasavi Engineering College (SVEC). Explore algorithmic workshops, web engineering initiatives, hackathons, and recruitment 2026.",
  keywords: ["GFG SVEC", "GeeksforGeeks Sri Vasavi", "SVEC Coding Club", "GFG Student Chapter", "SVEC Recruitment 2026"],
  authors: [{ name: "GFG SVEC Core Team" }],
  openGraph: {
    title: "GeeksforGeeks SVEC Student Chapter",
    description: "Empowering developers, algorithms enthusiasts, and designers at Sri Vasavi Engineering College.",
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
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
