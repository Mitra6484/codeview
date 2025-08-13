"use client"

import Link from "next/link"
import { ModeToggle } from "./ModeToggle"
import { SignedIn, UserButton, useUser } from "@clerk/nextjs"
import DashBoardButton from "./DashBoardButton"
import { NotificationBell } from "./NotificationBell"
import { Button } from "./ui/button"
import { CrownIcon } from "lucide-react"
import { useSubscription } from "@/hooks/useSubscription"

function Navbar() {
  const { isSignedIn } = useUser()
  const { isPremium, isLoading } = useSubscription()

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        {/* LEFT SIDE -LOGO */}
        <Link
          href={isSignedIn ? "/dashboard" : "/"}
          className="flex items-center gap-2 font-semibold text-2xl mr-6 font-mono hover:opacity-80 transition-opacity"
        >
          <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            //Code_View
          </span>
        </Link>

        {/* RIGHT SIDE - ACTIONS */}
        <SignedIn>
          <div className="flex items-center space-x-4 ml-auto">
            <NotificationBell />

            {/* Premium Badge or Upgrade Button */}
            {!isLoading &&
              (isPremium ? (
                <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 rounded-full text-sm font-medium">
                  <CrownIcon className="h-4 w-4" />
                  Premium
                </div>
              ) : (
                <Link href="/pricing">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <CrownIcon className="h-4 w-4" />
                    Upgrade
                  </Button>
                </Link>
              ))}

            <DashBoardButton />
            <ModeToggle />
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </nav>
  )
}
export default Navbar
