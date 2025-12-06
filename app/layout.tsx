import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Cyber Simulation",
  description: "SCP / Hacker Aesthetic Simulation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-black text-[#00ff99] min-h-screen font-mono`}
      >
        {/* Header */}
            <header className="bg-black/90 border-b border-[#00ff99] backdrop-blur-md p-4 flex justify-end gap-8 text-sm tracking-widest shadow-lg">
          <Link
            href="/main_menu"
            className="hover:text-[#00ffcc] font-bold transition-colors"
          >
            MAIN MENU
          </Link>
          <Link
            href="/characters"
            className="hover:text-[#00ffcc] font-bold transition-colors"
          >
            TEST SUBJECTS
          </Link>
          <Link
            href="/arena"
            className="hover:text-[#00ffcc] font-bold transition-colors"
          >
            SIMULATION
          </Link>
        </header>

        {/* Page Content */}
        <main className="p-4 max-w-7xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
