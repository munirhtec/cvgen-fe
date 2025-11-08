import { useState, useRef, useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { LinkButton } from "./LinkButton";
import { MobileMenu } from "./MobileMenu";
import { Link } from "react-router";

const navLinks = [
  { label: "Chat", href: "/chat" },
  { label: "Best candidates", href: "/best-matches" },
];

export function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkWidth = () => {
      if (containerRef.current)
        setIsMobile(containerRef.current.offsetWidth < 768);
    };
    checkWidth();
    const observer = new ResizeObserver(checkWidth);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={containerRef}
      className={cn(
        "fixed top-0 z-50 w-full border-b bg-background/30 shadow-md backdrop-blur supports-[backdrop-filter]:bg-background/30 px-4 md:px-8"
      )}
    >
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {isMobile && <MobileMenu />}
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          {!isMobile && (
            <NavigationMenu>
              <NavigationMenuList className="flex gap-2">
                {navLinks.map(({ label, href }, idx) => (
                  <NavigationMenuItem key={idx}>
                    <NavigationMenuLink asChild>
                      <LinkButton
                        href={href}
                        className={cn(
                          "text-foreground/80 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                          "hover:bg-accent hover:text-accent-foreground",
                          "focus:bg-accent focus:text-accent-foreground focus:outline-none"
                        )}
                      >
                        {label}
                      </LinkButton>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>

        <div className="flex items-center gap-3"></div>

        {isMobile && (
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "h-9 w-9 rounded-md text-foreground/80 hover:bg-accent hover:text-accent-foreground transition-colors"
                )}
              >
                ☰
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-48 p-2">
              <NavigationMenu>
                <NavigationMenuList className="flex flex-col gap-1">
                  {navLinks.map(({ label, href }, idx) => (
                    <NavigationMenuItem key={idx}>
                      <LinkButton
                        href={href}
                        className={cn(
                          "block w-full rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors",
                          "hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        {label}
                      </LinkButton>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </header>
  );
}
