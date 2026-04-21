import type { Metadata } from "next";
import { Fraunces, Chivo } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const chivo = Chivo({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Grant Toolkit. Designed for Impact.",
  description: "A precision instrument for writing, analyzing, and discovering grant proposals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${chivo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
