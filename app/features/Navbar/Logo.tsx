import { Link } from "react-router";
import { FileUser } from "lucide-react";
import { HtecLogo } from "./HtecLogo";

export function Logo() {
  return (
    <Link
      to="/"
      className="group select-none"
      aria-label="Engineer CV Generator Home"
    >
      <div className="flex items-center space-x-3 text-gray-800 transition-colors duration-300">
        <FileUser className="w-7 h-7" />
        <div className="flex flex-col leading-tight">
          <span className="text-md tracking-wide leading-none font-semibold">
            Engineer CV Generator
          </span>
          <span className="flex items-center text-xs tracking-wide leading-none mt-0.5 text-gray-400">
            by&nbsp;
            <span className="origin-left scale-40 inline-block">
              <HtecLogo />
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
