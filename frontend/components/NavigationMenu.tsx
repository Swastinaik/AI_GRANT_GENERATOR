"use client"
import * as React from "react"
import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,

  NavigationMenuTrigger,

} from "@/components/ui/navigation-menu"



const Agents = [
  {
    title: "Grant Agent",
    description: "Generate tailored grant proposals based on your organization's data.",
    href: "/landing-pages/grant-agent",
  },
  {
    title: "Grant Search Agent",
    description: "Search for grants matching your organization's profile.",
    href: "/landing-pages/search-grant-agent",
  },
  {
    title: "Podcast Agent",
    description: "Create engaging podcast scripts with AI assistance.",
    href: "/landing-pages/podcast-agent",
  },
  {
    title: "Reviewer Agent",
    description: "Review grant proposals and provide feedback.",
    href: "/landing-pages/grant-reviewer",
  }
]
interface NavigationMenuItem {
  title: string;
  description: string;
  href: string;
}
function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

const NavigationMenuComponent = ({ components }: { components: NavigationMenuItem[] }) => {
  return (
    <NavigationMenu className="z-50">
      <NavigationMenuItem>
        <NavigationMenuTrigger>Agents</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
            {components.map((component) => (
              <ListItem
                key={component.title}
                title={component.title}
                href={component.href}
              >
                {component.description}
              </ListItem>
            ))}
          </ul>

        </NavigationMenuContent>
      </NavigationMenuItem >
    </NavigationMenu>
  )
}

export default NavigationMenuComponent