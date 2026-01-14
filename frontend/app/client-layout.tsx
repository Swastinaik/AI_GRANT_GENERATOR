"use client"

import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"
import NavBar from "@/components/NavBar"
import { usePathname } from "next/navigation"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const HIDE_NAV_ROUTES = ["/landing-pages", "/login", "/register"]

const hideNavbar = HIDE_NAV_ROUTES.some(route =>
  pathname.startsWith(route)
)

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {!hideNavbar && <NavBar />}
      {children}
      <Toaster />
    </ThemeProvider>
  )
}
