'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import { GraduationCap, LogOut, Mail, Calendar, Shield, BookOpen, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

export default function DashboardPage() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4DB748]/5 via-white to-[#4DB748]/10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4DB748]"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4DB748]/5 via-white to-[#4DB748]/10">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#4DB748]">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#4DB748]">Elivate</h1>
                <p className="text-xs text-gray-600">Dashboard</p>
              </div>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-gray-300 hover:border-[#4DB748] hover:text-[#4DB748] transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-gray-600">Here's what's happening with your learning journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#4DB748]" />
                Profile Information
              </CardTitle>
              <CardDescription>Your account details and information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20 border-2 border-[#4DB748]">
                  <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || 'User'} />
                  <AvatarFallback className="bg-[#4DB748] text-white text-xl">
                    {getUserInitials(user.email || 'U')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student'}
                  </h3>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Member Since
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDate(user.created_at)}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Account Status
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    <p className="text-sm font-semibold text-gray-900">Active</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Authentication Method</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">
                    {user.app_metadata?.provider || 'Email'}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-gray-600">User ID</p>
                  <p className="text-sm font-mono text-gray-900 truncate">
                    {user.id.substring(0, 8)}...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#4DB748]" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Courses Enrolled</span>
                  <span className="text-2xl font-bold text-[#4DB748]">0</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Resources Accessed</span>
                  <span className="text-2xl font-bold text-[#4DB748]">0</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Study Hours</span>
                  <span className="text-2xl font-bold text-[#4DB748]">0h</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-[#4DB748] to-[#45a840] text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="text-4xl font-bold mb-2">0%</div>
                  <p className="text-sm text-white/80">Overall Completion</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Start exploring our resources to make the most of your learning experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 rounded-lg border border-gray-200 hover:border-[#4DB748] hover:bg-[#4DB748]/5 transition-all text-left group">
                <BookOpen className="h-8 w-8 text-[#4DB748] mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-gray-900 mb-1">Browse Resources</h4>
                <p className="text-sm text-gray-600">Access notes, papers, and study materials</p>
              </button>

              <button className="p-4 rounded-lg border border-gray-200 hover:border-[#4DB748] hover:bg-[#4DB748]/5 transition-all text-left group">
                <TrendingUp className="h-8 w-8 text-[#4DB748] mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-gray-900 mb-1">Track Progress</h4>
                <p className="text-sm text-gray-600">Monitor your learning journey and achievements</p>
              </button>

              <button className="p-4 rounded-lg border border-gray-200 hover:border-[#4DB748] hover:bg-[#4DB748]/5 transition-all text-left group">
                <Shield className="h-8 w-8 text-[#4DB748] mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-gray-900 mb-1">Account Settings</h4>
                <p className="text-sm text-gray-600">Manage your profile and preferences</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
