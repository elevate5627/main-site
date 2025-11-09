'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, BookOpen, MessageSquare, FileQuestion, BookMarked, FileText, Microscope, FlaskConical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'

const resourceLinks = [
  { name: 'Notes', icon: BookOpen },
  { name: 'Q&A', icon: MessageSquare },
  { name: 'MCQs', icon: FileQuestion },
  { name: 'Syllabus', icon: BookMarked },
  { name: 'Last 10 Years\' Question Papers', icon: FileText },
  { name: 'Case Studies', icon: Microscope },
  { name: 'Lab Notes', icon: FlaskConical },
]

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isResourcesOpen, setIsResourcesOpen] = useState(false)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [supabase] = useState(() => createClient())

  // Check user authentication status
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      if (session) {
        setUser(session.user)
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
    }
  }, [hoverTimeout])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center group">
            <Image
              src="/png/logo-new.png"
              alt="Elivate"
              width={140}
              height={36}
              className="h-9 w-auto transition-transform group-hover:scale-105"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center justify-center flex-1 space-x-6 lg:space-x-8">
            <Link href="/" className="text-sm lg:text-base text-gray-700 hover:text-[#4DB748] transition-colors font-medium">
              Home
            </Link>
            <Link href="#about" className="text-sm lg:text-base text-gray-700 hover:text-[#4DB748] transition-colors font-medium">
              About Us
            </Link>

            <div
              className="relative group"
              onMouseEnter={() => {
                if (hoverTimeout) {
                  clearTimeout(hoverTimeout)
                  setHoverTimeout(null)
                }
                setIsResourcesOpen(true)
              }}
              onMouseLeave={() => {
                const timeout = setTimeout(() => {
                  setIsResourcesOpen(false)
                }, 150) // 150ms delay to allow navigation to submenu
                setHoverTimeout(timeout)
              }}
            >
              <button className="text-sm lg:text-base text-gray-700 hover:text-[#4DB748] transition-colors font-medium">
                Resources
              </button>

              {isResourcesOpen && (
                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[500px] max-w-[calc(100vw-2rem)] p-6 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200"
                  onMouseEnter={() => {
                    if (hoverTimeout) {
                      clearTimeout(hoverTimeout)
                      setHoverTimeout(null)
                    }
                  }}
                  onMouseLeave={() => {
                const timeout = setTimeout(() => {
                  setIsResourcesOpen(false)
                }, 150)
                setHoverTimeout(timeout)
              }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    {resourceLinks.map((resource) => {
                      const Icon = resource.icon
                      return (
                        <Link
                          key={resource.name}
                          href="#"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#4DB748]/10 transition-all duration-200 group/item hover:scale-105"
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#4DB748]/10 group-hover/item:bg-[#4DB748] transition-colors">
                            <Icon className="h-5 w-5 text-[#4DB748] group-hover/item:text-white transition-colors" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 group-hover/item:text-[#4DB748]">
                            {resource.name}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          <Link href={user ? "/dashboard" : "/login"} className="ml-4">
            <Button className="bg-[#4DB748] hover:bg-[#45a840] text-white text-sm lg:text-base font-medium px-5 lg:px-6 transition-all duration-200 hover:scale-105">
              {user ? "Dashboard" : "Login"}
            </Button>
          </Link>

          <button
            className="md:hidden text-gray-700 ml-3"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 animate-in slide-in-from-top duration-200">
            <Link
              href="/"
              className="block py-2 text-base text-gray-700 hover:text-[#4DB748] transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="#about"
              className="block py-2 text-base text-gray-700 hover:text-[#4DB748] transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Us
            </Link>

            <div className="space-y-2 pt-2">
              <p className="text-sm font-semibold text-gray-900 py-2">Resources</p>
              {resourceLinks.map((resource) => {
                const Icon = resource.icon
                return (
                  <Link
                    key={resource.name}
                    href="#"
                    className="flex items-center space-x-3 p-2.5 rounded-lg hover:bg-[#4DB748]/10 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 text-[#4DB748]" />
                    <span className="text-sm text-gray-700">{resource.name}</span>
                  </Link>
                )
              })}
            </div>

            <div className="pt-2">
              <Link href={user ? "/dashboard" : "/login"} onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-[#4DB748] hover:bg-[#45a840] text-white font-medium">
                  {user ? "Dashboard" : "Login"}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
