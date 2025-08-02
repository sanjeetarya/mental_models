"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Brain, Search, Compass, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: Brain },
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/discover", label: "Discover", icon: Search },
    { href: "/match", label: "Match", icon: Zap },
  ]

  return (
    <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-400" />
            <span className="font-bold text-xl">Mental Models</span>
          </Link>

          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-blue-600/20 text-blue-400"
                      : "text-gray-300 hover:text-white hover:bg-gray-800",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="md:hidden">
            <div className="flex space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      pathname === item.href
                        ? "bg-blue-600/20 text-blue-400"
                        : "text-gray-300 hover:text-white hover:bg-gray-800",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
