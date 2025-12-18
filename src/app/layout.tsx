import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/providers/AuthProvider";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ShowSales.pk - Pakistan's #1 Sale Aggregator",
  description: "Discover the best sales and discounts from all major Pakistani clothing and shoes brands. Khaadi, Gul Ahmed, Sapphire, Servis, Bata and more!",
  keywords: "Pakistan sale, clothing sale, shoes sale, Khaadi sale, Gul Ahmed sale, discount Pakistan, fashion sale",
  openGraph: {
    title: "ShowSales.pk - Never Miss a Sale Again!",
    description: "All sales from Pakistan's top brands in one place. Save money on your favorite clothing and shoes.",
    type: "website",
    locale: "en_PK",
    siteName: "ShowSales.pk",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AuthProvider>
          <Header />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
