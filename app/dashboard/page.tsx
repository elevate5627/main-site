'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import { useUserProfile } from '@/hooks/use-user-profile'
import { 
  BookOpen, 
  Brain,
  User as UserIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { profile } = useUserProfile()

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
    <div className="p-6">
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
    </div>
  )
}
