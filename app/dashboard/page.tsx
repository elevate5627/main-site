'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import { useUserProfile } from '@/hooks/use-user-profile'
import { 
  GraduationCap, 
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
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function DashboardPage() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [studyMaterialsOpen, setStudyMaterialsOpen] = useState(false)
  const [mcqPreparationOpen, setMcqPreparationOpen] = useState(false)
  const { profile, isLoading: profileLoading } = useUserProfile()

  useEffect(() => {
    const getUser = async () => {
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
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center ml-4 lg:ml-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#4DB748]">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-lg font-bold text-[#4DB748]">Elevate</h1>
                </div>
              </div>
            </div>

            {/* Right side - User menu */}
            <div className="flex items-center">
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
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:transform-none`}>
          <div className="flex flex-col h-full">
            {/* Mobile close button */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                type="button"
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              <div className="mb-8">
                <button
                  onClick={() => router.push('/')}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors w-full text-left"
                >
                  <Home className="mr-3 h-5 w-5" />
                  Back to Home
                </button>
              </div>

              {sidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title}>
                    {/* Main Menu Item */}
                    <button
                      onClick={() => {
                        if (item.hasSubmenu) {
                          item.setIsOpen(!item.isOpen)
                        } else {
                          router.push(item.href)
                        }
                      }}
                      className="flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-colors w-full text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900"
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
                          return (
                            <button
                              key={subItem.title}
                              onClick={() => {
                                router.push(subItem.href)
                                setSidebarOpen(false)
                              }}
                              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-[#4DB748] hover:text-white transition-colors w-full text-left"
                            >
                              <SubIcon className="mr-3 h-4 w-4" />
                              {subItem.title}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 lg:ml-0">
          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div 
              className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}

          <main className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student'}!
                </h2>
                <p className="text-gray-600">
                  {profile ? (
                    profile.purpose === 'study-material' 
                      ? `${profile.department || 'Your'} - ${profile.university || 'University'} - Semester ${profile.semester || ''}`
                      : `${profile.faculty?.toUpperCase() || 'MCQ'} Preparation`
                  ) : (
                    "Here's what's happening with your learning journey"
                  )}
                </p>
              </div>

              {/* Profile Completion Banner - Show only if profile is incomplete */}
              {!profile && (
                <Card className="mb-6 border-2 border-[#4DB748] bg-gradient-to-r from-green-50 to-blue-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-full bg-[#4DB748] flex items-center justify-center flex-shrink-0">
                          <UserIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            Complete Your Profile
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            Help us personalize your learning experience by completing your profile.
                          </p>
                          <Button
                            onClick={() => router.push('/dashboard/profile')}
                            className="bg-[#4DB748] hover:bg-[#45a63f] text-white"
                          >
                            Complete Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Study Hours</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24h</div>
                    <p className="text-xs text-muted-foreground">+2h from last week</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Materials Completed</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">+3 from last week</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">MCQ Tests Taken</CardTitle>
                    <Brain className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">+1 from last week</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                    <Brain className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">85%</div>
                    <p className="text-xs text-muted-foreground">+5% from last week</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {(!profile || profile.purpose === 'study-material') && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BookOpen className="mr-2 h-5 w-5 text-[#4DB748]" />
                        Study Materials
                      </CardTitle>
                      <CardDescription>
                        {profile?.department && profile?.university 
                          ? `${profile.department} - ${profile.university}`
                          : 'Access your learning resources and track your progress'
                        }
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Button 
                          className="w-full bg-[#4DB748] hover:bg-[#45a63f] text-white"
                          onClick={() => router.push('/dashboard/study-materials')}
                        >
                          Browse Materials
                        </Button>
                        <div className="grid grid-cols-2 gap-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push('/dashboard/study-materials/notes')}
                          >
                            Notes
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push('/dashboard/study-materials/labs-note')}
                          >
                            Labs
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {(!profile || profile.purpose === 'mcq-preparation') && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Brain className="mr-2 h-5 w-5 text-[#4DB748]" />
                        MCQ Preparation
                      </CardTitle>
                      <CardDescription>
                        {profile?.faculty 
                          ? `${profile.faculty.toUpperCase()} Entrance Exam Preparation`
                          : 'Practice with multiple choice questions and improve your skills'
                        }
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Button 
                          className="w-full bg-[#4DB748] hover:bg-[#45a63f] text-white"
                          onClick={() => router.push('/dashboard/mcq-preparation')}
                        >
                          Start Practice
                        </Button>
                        <div className="grid grid-cols-2 gap-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push('/dashboard/mcq-preparation/mock-test')}
                          >
                            Mock Test
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push('/dashboard/mcq-preparation/practice-set')}
                          >
                            Practice
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
