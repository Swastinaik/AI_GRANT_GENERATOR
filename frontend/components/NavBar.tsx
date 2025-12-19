"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ThemeToggle from "../app/components/ToggleTheme";
import { navLinks, AgentsNavigation } from "../app/constants/constants";
import useAuthStore from "@/app/store/AuthStore";
import NavigationMenuComponent from "./NavigationMenu";
import { AuthButton } from "./AuthButton";
import { FileText } from "lucide-react";

const NavBar = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`
        sticky top-0 z-50 w-full
        border-b border-border/40
        bg-background/95 backdrop-blur
        supports-[backdrop-filter]:bg-background/60
        transition-colors
      `}
    >
      <div className="container mx-auto h-16 px-4 md:px-6 flex items-center justify-between">
        
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary-foreground" />
          </div>
          <span>Docs4All</span>
        </Link>

        {/* Center: Navigation */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <NavigationMenuComponent components={AgentsNavigation} />

          {navLinks.map((link) => (
            <Link
              key={link.link}
              href={link.link}
              className="hover:text-foreground transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </header>
  );
};

export default NavBar;
