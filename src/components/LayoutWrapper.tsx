"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Menu, Moon, Sun, X } from "lucide-react";

const themeChangeEvent = "app-theme-change";

function getThemeSnapshot() {
  if (typeof window === "undefined") {
    return false;
  }

  const savedTheme = window.localStorage.getItem("theme");

  if (savedTheme) {
    return savedTheme === "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function subscribeTheme(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(themeChangeEvent, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(themeChangeEvent, callback);
  };
}

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isDarkMode = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    const nextIsDarkMode = !getThemeSnapshot();
    document.documentElement.classList.toggle("dark", nextIsDarkMode);
    window.localStorage.setItem("theme", nextIsDarkMode ? "dark" : "light");
    window.dispatchEvent(new Event(themeChangeEvent));
  };

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
    <div className="flex h-screen bg-gray-100 overflow-hidden relative transition-colors duration-200">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4.5 border-b flex justify-between items-center">
          <Link href="/"><h1 className="text-xl font-bold text-blue-600 truncate">APPLICATION_UI</h1></Link>
          <button
            className="text-gray-500 hover:text-blue-600 transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 overflow-y-auto h-[calc(100vh-64px)]">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path} className="mb-2">
                <Link
                  href={item.path}
                  onClick={() => {
                    // Only close on mobile after clicking a link
                    if (window.innerWidth < 768) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className="block p-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "md:ml-64" : "ml-0"
        }`}
      >
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              aria-label="Open sidebar"
              className={`text-gray-500 hover:text-blue-600 transition-all ${isSidebarOpen ? "md:opacity-0 md:pointer-events-none" : "opacity-100"}`}
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 ml-4">System Dashboard</h2>
          </div>
          <button
            type="button"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            title={isDarkMode ? "Light mode" : "Dark mode"}
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
