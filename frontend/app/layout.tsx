"use client"
import { Roboto } from "next/font/google"
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"
import NavBar from "@/components/NavBar";
import { usePathname } from "next/navigation";
import path from "path";

const roboto = Roboto({
  weight: ["400", "500", "700"], // You can add '100', '300', '900' etc.
  subsets: ["latin"],
  display: "swap", // Ensures text is visible while font loads
  variable: "--font-roboto", // Optional: create a CSS variable
});

export const metadata: Metadata = {

  title: "Docs4All",
  description:
    "An Unified Platform for AI Agents to get things done",

  openGraph: {
    title: "Docs4All",
    description:
      "An Unified Platform for AI Agents to get things done",
    url: "https://ai-grant-generator.vercel.app/",
    siteName: "Docs4All",
    images: [
      {
        url: "https://ai-grant-generator.vercel.app/docs4all.png",
        width: 1894,
        height: 990,
        alt: "Docs4All",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Docs4All",
    description:
      "An Unified Platform for AI Agents to get things done",
    images: ["https://ai-grant-generator.vercel.app/docs4all.png"],
  },

};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname()
  const landingpage = pathname.startsWith('/landing-pages')
  const loginPage = pathname.startsWith('/login')
  const registerPage = pathname.startsWith('/register')



  return (
    <html lang="en" suppressHydrationWarning>
      <body

        className={roboto.className}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {!landingpage && !loginPage && !registerPage && <NavBar />}
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
