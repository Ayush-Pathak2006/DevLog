"use client"

import Link from "next/link"

export default function Sidebar() {
  return (
    <div className="h-full w-64 border-r bg-card p-4 text-card-foreground">
      <h1 className="mb-6 text-xl font-bold">DevLog</h1>

      <nav className="flex flex-col gap-3 text-sm">
        <Link className="rounded px-2 py-1 transition hover:bg-muted" href="/dashboard">Dashboard</Link>
        <Link className="rounded px-2 py-1 transition hover:bg-muted" href="/projects">Projects</Link>
      </nav>
    </div>
  )
}