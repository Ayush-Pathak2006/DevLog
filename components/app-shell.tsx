"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Navbar from "@/components/navbar"
import Providers from "@/components/providers"

type AppShellProps = {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true)

  return (
    <>
      {isDesktopSidebarOpen && (
        <div className="hidden lg:block">
          <Sidebar />
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <Navbar
          isDesktopSidebarOpen={isDesktopSidebarOpen}
          onToggleDesktopSidebar={() => setIsDesktopSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 p-4 md:p-6">
          <Providers>{children}</Providers>
        </main>
      </div>
    </>
  )
}