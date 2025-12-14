'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import { useUserProfile } from '@/hooks/use-user-profile'
import { NotificationDropdown } from '@/components/dashboard/NotificationDropdown'
import Image from 'next/image'
import { 
  LogOut, 
  BookOpen, 
  Brain,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  User as UserIcon,
  Settings,
  Home,
  FileText,
  FlaskConical,
  ClipboardList,
  Library,
  TestTube2,
  Database
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [studyMaterialsOpen, setStudyMaterialsOpen] = useState(false)
  const [mcqPreparationOpen, setMcqPreparationOpen] = useState(false)
  const { profile } = useUserProfile()

  useEffect(() => {
    const getUser = async () => {
      // Skip authentication in development mode
      if (process.env.NODE_ENV === 'development') {
        setUser({
          id: 'dev-user',
          email: 'dev@localhost',
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString()
        } as User)
        setIsLoading(false)
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
        setIsLoading(false)
      }
    }

    getUser()
  }, [supabase, router])

  // Auto-expand submenus based on current path
  useEffect(() => {
    if (pathname.includes('/study-materials')) {
      setStudyMaterialsOpen(true)
    }
    if (pathname.includes('/mcq-preparation')) {
      setMcqPreparationOpen(true)
    }
  }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const getUserInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase()
  }

  // Filter sidebar items based on user profile
  const getFilteredSidebarItems = () => {
    const allItems = [
      {
        title: 'Study Materials',
        icon: BookOpen,
        href: '/dashboard/study-materials',
        hasSubmenu: true,
        isOpen: studyMaterialsOpen,
        setIsOpen: setStudyMaterialsOpen,
        showIf: !profile || profile.purpose === 'study-material',
        submenu: [
          {
            title: 'Syllabus',
            icon: ClipboardList,
            href: '/dashboard/study-materials/syllabus'
          },
          {
            title: 'Notes',
            icon: FileText,
            href: '/dashboard/study-materials/notes'
          },
          {
            title: 'Labs Note',
            icon: FlaskConical,
            href: '/dashboard/study-materials/labs-note'
          }
        ]
      },
      {
        title: 'MCQ Preparation',
        icon: Brain,
        href: '/dashboard/mcq-preparation',
        hasSubmenu: true,
        isOpen: mcqPreparationOpen,
        setIsOpen: setMcqPreparationOpen,
        showIf: !profile || profile.purpose === 'mcq-preparation',
        submenu: [
          {
            title: 'Subject Wise Questions',
            icon: Library,
            href: '/dashboard/mcq-preparation/subject-wise'
          },
          {
            title: 'Mock Test',
            icon: TestTube2,
            href: '/dashboard/mcq-preparation/mock-test'
          },
          {
            title: 'Question Bank',
            icon: Database,
            href: '/dashboard/mcq-preparation/question-bank'
          },
          {
            title: 'Practice Set',
            icon: ClipboardList,
            href: '/dashboard/mcq-preparation/practice-set'
          }
        ]
      }
    ]

    return allItems.filter(item => item.showIf)
  }

  const sidebarItems = getFilteredSidebarItems()

  // Check if current path is active
  const isActive = (href: string) => {
    return pathname === href
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4DB748]"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo & Menu */}
            <div className="flex items-center">
              <button
                type="button"
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link href="/" className="flex items-center ml-4 lg:ml-0">
                <div className="flex items-center justify-center w-10 h-10">
                  <Image 
                    src="/png/logo-new.png" 
                    alt="Elivate Logo" 
                    width={40} 
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div className="ml-3">
                  <h1 className="text-lg font-bold text-[#4DB748]">Elivate</h1>
                </div>
              </Link>
            </div>

            {/* Right side - Notifications & User menu */}
            <div className="flex items-center gap-2">
              {/* Notification Icon */}
              <NotificationDropdown />
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-3 hover:bg-gray-100">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || 'User'} />
                      <AvatarFallback className="bg-[#4DB748] text-white text-sm">
                        {getUserInitials(user.email || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside 
          className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            lg:translate-x-0 
            fixed lg:sticky lg:top-16 
            inset-y-0 lg:inset-y-auto
            left-0 z-40 
            w-64 
            bg-white 
            border-r border-gray-200 
            transform transition-transform duration-300 ease-in-out 
            lg:h-[calc(100vh-4rem)]
            overflow-y-auto
          `}
        >
          <div className="flex flex-col h-full">
            {/* Mobile close button */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                type="button"
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              <div className="mb-6">
                <Link
                  href="/dashboard"
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors w-full ${
                    pathname === '/dashboard'
                      ? 'bg-[#4DB748] text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Home className="mr-3 h-5 w-5" />
                  Dashboard Home
                </Link>
              </div>

              {sidebarItems.map((item) => {
                const Icon = item.icon
                const isItemActive = isActive(item.href)
                
                return (
                  <div key={item.title}>
                    {/* Main Menu Item */}
                    <button
                      onClick={() => {
                        if (item.hasSubmenu) {
                          item.setIsOpen(!item.isOpen)
                        } else {
                          router.push(item.href)
                          setSidebarOpen(false)
                        }
                      }}
                      className={`flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-colors w-full text-left ${
                        isItemActive
                          ? 'bg-[#4DB748] text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="mr-3 h-5 w-5" />
                        {item.title}
                      </div>
                      {item.hasSubmenu && (
                        item.isOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )
                      )}
                    </button>

                    {/* Submenu Items */}
                    {item.hasSubmenu && item.isOpen && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.submenu?.map((subItem) => {
                          const SubIcon = subItem.icon
                          const isSubItemActive = isActive(subItem.href)
                          
                          return (
                            <Link
                              key={subItem.title}
                              href={subItem.href}
                              onClick={() => setSidebarOpen(false)}
                              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors w-full ${
                                isSubItemActive
                                  ? 'bg-[#4DB748] text-white'
                                  : 'text-gray-600 hover:bg-[#4DB748] hover:text-white'
                              }`}
                            >
                              <SubIcon className="mr-3 h-4 w-4" />
                              {subItem.title}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <Link
                href="/"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors w-full"
                onClick={() => setSidebarOpen(false)}
              >
                <Home className="mr-3 h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 w-full lg:w-[calc(100%-16rem)]">
          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div 
              className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
