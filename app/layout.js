import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Clone Skynews Arabia",
  description: "the clone of skynews arabia website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f5f8f8]`}
      >
        <Header />
        <main className="max-w-full md:max-w-[1350px] mx-auto overflow-x-hidden md:overflow-x-visible">
          {children}
        </main>
      </body>
    </html>
  );
}
