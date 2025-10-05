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
      <div className="flex items-center space-x-3 text-gray-900 group-hover:text-blue-800 transition-colors duration-300">
        <FileUser className="w-6 h-6" />

        <div className="flex flex-col leading-tight">
          <span className="text-lg tracking-wide leading-none">
            Engineer CV
          </span>
          <span className="flex items-center text-sm tracking-wide leading-none mt-0.5">
            by&nbsp;
            <span className="origin-left scale-50 inline-block">
              <HtecLogo />
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
