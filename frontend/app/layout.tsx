
import { Roboto } from "next/font/google"
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"
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
          {children}
          <Toaster />
          </ThemeProvider>
      </body>
    </html>
  );
}
