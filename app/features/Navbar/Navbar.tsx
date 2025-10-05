import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { Logo } from "./Logo";
import { LinkButton } from "./LinkButton";
import { MobileMenu } from "./MobileMenu";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  return (
    <header
      className={cn(
        "sticky top-0 left-0 right-0 h-16 bg-gray-900/95 backdrop-blur-sm shadow-lg z-50 border-b border-gray-800"
      )}
    >
      <div
        className={cn(
          "container mx-auto h-full px-6 md:px-8 flex items-center justify-between"
        )}
      >
        <div className={cn("flex items-center gap-6")}>
          <MobileMenu />
          <Logo className={cn("w-32 md:w-36 filter brightness-150")} />
        </div>

        <nav className={cn("hidden md:flex gap-6")}>
          {navLinks.map(({ label, href }) => (
            <LinkButton
              key={href}
              href={href}
              className={cn(
                "text-sm font-semibold text-gray-400 px-4 py-2 rounded-lg",
                "hover:bg-indigo-600/30 hover:text-indigo-400",
                "transition-colors duration-300",
                "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
              )}
            >
              {label}
            </LinkButton>
          ))}
        </nav>

        <div className={cn("hidden md:block")}>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "rounded-lg",
                    "transition-transform duration-200",
                    "hover:scale-105 hover:bg-indigo-600/30",
                    "focus:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  )}
                >
                  <Link
                    to="/test-chat"
                    className={cn(
                      "text-gray-400 px-3 py-2 rounded-lg",
                      "hover:text-indigo-400 focus:outline-none",
                      "transition-colors duration-300"
                    )}
                  >
                    Test chat
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
}
