import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Application UI - 10 Requirements",
  description: "Next.js + .NET 9 Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menuItems = [
    { name: "1. User Management", path: "/req1" },
    { name: "2. Auth (Login/Register)", path: "/req2" },
    { name: "3. Doc Approval", path: "/req3" },
    { name: "4. Profile & Validation", path: "/req4" },
    { name: "5. Queue Management", path: "/req5" },
    { name: "6. Barcode (16 chars)", path: "/req6" },
    { name: "7. QRCode (36 chars)", path: "/req7" },
    { name: "8. Manage Exams", path: "/req8" },
    { name: "9. Comments", path: "/req9" },
    { name: "10. Exam Execution", path: "/req10" },
  ];

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-100">
          {/* Sidebar */}
          <aside className="w-64 bg-white shadow-md">
            <div className="p-4 border-b">
              <h1 className="text-xl font-bold text-blue-600">APPLICATION_UI</h1>
            </div>
            <nav className="p-4 overflow-y-auto h-[calc(100vh-64px)]">
              <ul>
                {menuItems.map((item) => (
                  <li key={item.path} className="mb-2">
                    <Link
                      href={item.path}
                      className="block p-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-8">
            <div className="bg-white p-6 rounded-lg shadow-sm min-h-full">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
