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

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 left-0 right-0 h-16 bg-white z-50">
      <div className="container mx-auto h-full px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <MobileMenu />
          <Logo />
        </div>

        <nav className="hidden md:flex gap-6">
          {navLinks.map(({ label, href }) => (
            <LinkButton key={href} href={href} className="text-sm font-medium">
              {label}
            </LinkButton>
          ))}
        </nav>

        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/test-chat">Test chat</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
}
