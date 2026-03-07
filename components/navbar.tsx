"use client"

import { Menu } from "lucide-react"
import Sidebar from "@/components/sidebar"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function Navbar() {
  return (
    <div className="flex items-center justify-between border-b bg-white px-4 py-3">

      {/* Mobile sidebar trigger */}
      <Sheet>
        <SheetTrigger className="lg:hidden">
          <Menu size={22} />
        </SheetTrigger>

        <SheetContent side="left" className="p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <h1 className="font-semibold text-lg">
        DevLog
      </h1>

      <div className="text-sm text-gray-500">
        Developer Journal
      </div>

    </div>
  )
}