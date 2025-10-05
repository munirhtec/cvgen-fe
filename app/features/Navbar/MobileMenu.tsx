import * as React from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";

import { Logo } from "./Logo";
import { LinkButton } from "./LinkButton";

const allLinks = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Test chat", href: "/test" },
];

export function MobileMenu() {
  const [open, setOpen] = React.useState(false);

  function handleLinkClick() {
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Open menu"
          className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <MenuIcon className="w-6 h-6 text-gray-700" />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="p-6">
        <SheetHeader className="flex items-center justify-between">
          <Logo />
        </SheetHeader>

        <nav className="mt-8 flex flex-col space-y-4">
          {allLinks.map(({ label, href }) => (
            <LinkButton
              key={href}
              href={href}
              className="w-full text-left text-lg"
              onClick={handleLinkClick}
            >
              {label}
            </LinkButton>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
