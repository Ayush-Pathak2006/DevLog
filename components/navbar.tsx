"use client"

import { useEffect, useState } from "react"
import { Menu, Moon, PanelLeftClose, PanelLeftOpen, Sun } from "lucide-react"
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

function getInitialTheme() {
  if (typeof window === "undefined") return "light" as const

  const storedTheme = localStorage.getItem("theme")
  if (storedTheme === "light" || storedTheme === "dark") return storedTheme

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(theme: "light" | "dark") {
  const root = document.documentElement
  root.classList.toggle("dark", theme === "dark")
  localStorage.setItem("theme", theme)
}

export default function Navbar({ isDesktopSidebarOpen, onToggleDesktopSidebar }: NavbarProps) {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return (
    <div className="flex items-center justify-between border-b bg-card px-4 py-3 text-card-foreground">
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
          className="hidden rounded-md border p-1.5 text-muted-foreground transition hover:bg-muted lg:inline-flex"
          onClick={onToggleDesktopSidebar}
          aria-label={isDesktopSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isDesktopSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>

        {!isDesktopSidebarOpen && <h1 className="text-lg font-semibold">DevLog</h1>}
      </div>

      <div className="flex items-center gap-3">
        <p className="hidden text-sm text-muted-foreground sm:block">Developer Journal</p>
        <button
          type="button"
          className="rounded-md border p-2 text-muted-foreground transition hover:bg-muted"
          onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
          aria-label="Toggle theme"
          title="Toggle dark mode"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </div>
  )
}
