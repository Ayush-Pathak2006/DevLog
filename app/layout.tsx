import "./globals.css"
import { Inter } from "next/font/google"
import AppShell from "@/components/app-shell"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen bg-gray-50 antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}