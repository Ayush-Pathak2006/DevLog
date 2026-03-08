import "./globals.css"
import AppShell from "@/components/app-shell"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-50">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}