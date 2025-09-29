import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Layout } from "@/components/layout/Layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ZAARA - Modern Islamic Fashion",
  description: "Modern Islamic fashion for the contemporary Muslim woman. Discover our collection of elegant Borkas designed with style, comfort, and modesty in mind.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
