"use client"

import Link from "next/link"

export default function Sidebar() {
  return (
    <div className="w-64 h-full border-r p-4">
      <h1 className="text-xl font-bold mb-6">DevLog</h1>

      <nav className="flex flex-col gap-3">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/projects">Projects</Link>

      </nav>
    </div>
  )
}