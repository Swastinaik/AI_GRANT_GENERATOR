
import { Roboto } from "next/font/google"
import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./client-layout"


const roboto = Roboto({
  weight: ["400", "500", "700"], // You can add '100', '300', '900' etc.
  subsets: ["latin"],
  display: "swap", // Ensures text is visible while font loads
  variable: "--font-roboto", // Optional: create a CSS variable
});

export const metadata: Metadata = {
  verification: {
    google: "-iWU8KsllBQE1FylqyfNzkxlzvATAmDnYEurNUGArOc",
  },

  title: "Docs4All",
  description:
    "An Unified Platform for AI Agents to get things done",

  openGraph: {
    title: "Docs4All",
    description:
      "An Unified Platform for AI Agents to get things done",
    url: new URL("https://ai-grant-generator.vercel.app"),
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




  return (
    <html lang="en" suppressHydrationWarning>
      <body

        className={`${roboto.variable} font-sans`}
      >
        <ClientLayout>
          {children}
        </ClientLayout>

      </body>
    </html>
  );
}
