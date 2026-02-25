
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
    "A complete toolkit for searching, drafting, and reviewing grants for non-profit organizations powered by AI.",

  openGraph: {
    title: "Docs4All",
    description:
      "A complete toolkit for searching, drafting, and reviewing grants for non-profit organizations powered by AI.",
    url: new URL("https://www.docs4all.online"),
    siteName: "Docs4All",
    images: [
      {
        url: "https://www.docs4all.online/docs4all.png",
        width: 1894,
        height: 990,
        alt: "Docs4All",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Docs4All",
    description:
      "A complete toolkit for searching, drafting, and reviewing grants for non-profit organizations powered by AI.",
    images: ["https://www.docs4all.online/docs4all.png"],
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
