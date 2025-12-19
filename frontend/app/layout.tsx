"use client"
import { Roboto } from "next/font/google"
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
