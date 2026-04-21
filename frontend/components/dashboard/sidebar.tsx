"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  Bookmark,
  Bot,
  UserCircle,
  Folder
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Organization", href: "/dashboard/organization", icon: Building2 },
  { name: "Saved Grants", href: "/dashboard/saved", icon: Bookmark },
  { name: "Agents", href: "/dashboard/agents", icon: Bot },
  { name: "Projects", href: "/dashboard/project", icon: Folder }
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  return (
    <aside className="w-72 hidden md:flex flex-col border-r-[2px] border-foreground bg-background h-screen sticky top-0">
      <div className="p-6 border-b-[2px] border-foreground flex items-center gap-3">
        <div className="h-4 w-4 bg-primary" />
        <span className="font-heading font-black text-sm uppercase tracking-widest text-foreground">Grant Toolkit</span>
      </div>

      <div className="flex-1 flex flex-col pt-6 px-4 gap-8 overflow-y-auto">
        <div className="space-y-2">
          <span className="px-2 text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Main Menu</span>
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${isActive
                    ? "bg-foreground text-background"
                    : "text-foreground hover:bg-secondary hover:text-secondary-foreground"
                    }`}
                >
                  <item.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>


      </div>

      <div className="mt-auto border-t-[2px] border-foreground p-4">
        <Link href="/dashboard/profile" className="flex items-center gap-3 p-2 hover:bg-muted transition-colors">
          <UserCircle className="h-8 w-8 text-foreground" />
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-wide">
              {loading ? "Loading..." : user ? user.fullname : "Guest User"}
            </span>
            <span className="text-xs text-secondary">
              {loading ? "" : user ? user.email : "Not signed in"}
            </span>
          </div>
        </Link>
      </div>
    </aside>
  );
}
