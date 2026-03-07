import "./globals.css";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import Providers from "@/components/providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-50">
        {/* Sidebar visible only on large screens */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <div className="flex flex-col flex-1">
          <Navbar />

          <main className="p-4 md:p-6 flex-1">
            <Providers>{children}</Providers>
          </main>
        </div>
      </body>
    </html>
  );
}
