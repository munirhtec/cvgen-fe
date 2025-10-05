import { Link } from "react-router";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

export function LinkButton({
  href,
  children,
  className = "",
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      to={href}
      className={`${navigationMenuTriggerStyle()} ${className}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
