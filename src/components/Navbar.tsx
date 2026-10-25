"use client";

import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { SignedIn, UserButton } from "@clerk/nextjs";
import DashBoardButton from "./DashBoardButton";
import { NotificationBell } from "./NotificationBell";
import { Code2 } from "lucide-react";

function Navbar() {
  return (
    <nav className="glass-nav sticky top-0 z-50 transition-all">
      <div className="flex h-16 items-center px-4 sm:px-6 container mx-auto justify-between">
        {/* LEFT SIDE - BRAND LOGO */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
            <div className="w-full h-full bg-slate-950/80 backdrop-blur-md rounded-[10px] flex items-center justify-center">
              <Code2 className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
              Codeview
            </span>
            <span className="text-[9px] font-medium tracking-wider uppercase text-indigo-400/80 -mt-1">
              Workspace
            </span>
          </div>
        </Link>

        {/* RIGHT SIDE - ACTIONS */}
        <SignedIn>
          <div className="flex items-center space-x-3.5">
            <NotificationBell />
            <DashBoardButton />
            <ModeToggle />
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 ring-2 ring-white/10 hover:ring-indigo-500/40 transition-all"
                }
              }}
            />
          </div>
        </SignedIn>
      </div>
    </nav>
  );
}

export default Navbar;