"use client"

import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import Sidebar from "@/components/sidebar"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

type NavbarProps = {
  isDesktopSidebarOpen: boolean
  onToggleDesktopSidebar: () => void
}

export default function Navbar({ isDesktopSidebarOpen, onToggleDesktopSidebar }: NavbarProps) {
  return (
    <div className="flex items-center justify-between border-b bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger className="lg:hidden">
            <Menu size={22} />
          </SheetTrigger>

          <SheetContent side="left" className="p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>

        <button
          className="hidden rounded-md border p-1.5 text-gray-600 transition hover:bg-gray-100 lg:inline-flex"
          onClick={onToggleDesktopSidebar}
          aria-label={isDesktopSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isDesktopSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>

        {!isDesktopSidebarOpen && <h1 className="text-lg font-semibold">DevLog</h1>}
      </div>

      <div className="text-sm text-gray-500">Developer Journal</div>
    </div>
  )
}