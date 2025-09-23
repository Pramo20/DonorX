"use client"

import { Button } from "@/components/ui/button"
import { WalletConnect } from "@/components/wallet-connect"
import { Plus, Menu } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="font-bold text-xl ml-[10px]">DonorX</span>
            </Link>
        </div>

          <div className="flex items-center gap-2 pl-2">
          <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent" asChild>
            <Link href="/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Link>
          </Button>

          <WalletConnect variant="default" size="sm" showBalance />

          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
