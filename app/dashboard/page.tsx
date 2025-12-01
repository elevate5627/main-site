'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import { useUserProfile } from '@/hooks/use-user-profile'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { 
  BookOpen, 
  Brain,
  User as UserIcon,
  TrendingUp,
  Clock,
  Award,
  Target,
  Calendar,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default function DashboardPage() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { profile } = useUserProfile()
  const { stats, progress, goals, activities, loading: dataLoading } = useDashboardData()

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

  if (isLoading || dataLoading) {
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
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Study Hours</CardTitle>
              <Clock className="h-4 w-4 text-[#4DB748]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalStudyHours || 0}h</div>
              <p className="text-xs text-muted-foreground">
                {stats?.studyHoursChange !== undefined && stats.studyHoursChange >= 0 ? '+' : ''}
                {stats?.studyHoursChange || 0}h from last week
              </p>
              <Progress 
                value={stats?.totalStudyHours ? Math.min((stats.totalStudyHours / 50) * 100, 100) : 0} 
                className="mt-2 h-1" 
              />
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Materials Completed</CardTitle>
              <BookOpen className="h-4 w-4 text-[#4DB748]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.materialsCompleted || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.materialsChange !== undefined && stats.materialsChange >= 0 ? '+' : ''}
                {stats?.materialsChange || 0} from last week
              </p>
              <Progress 
                value={stats?.materialsCompleted ? Math.min((stats.materialsCompleted / 30) * 100, 100) : 0} 
                className="mt-2 h-1" 
              />
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">MCQ Tests Taken</CardTitle>
              <Brain className="h-4 w-4 text-[#4DB748]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.mcqTestsTaken || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.mcqTestsChange !== undefined && stats.mcqTestsChange >= 0 ? '+' : ''}
                {stats?.mcqTestsChange || 0} from last week
              </p>
              <Progress 
                value={stats?.mcqTestsTaken ? Math.min((stats.mcqTestsTaken / 25) * 100, 100) : 0} 
                className="mt-2 h-1" 
              />
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Award className="h-4 w-4 text-[#4DB748]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.averageScore || 0}%</div>
              <p className="text-xs text-muted-foreground">
                {stats?.scoreChange !== undefined && stats.scoreChange >= 0 ? '+' : ''}
                {stats?.scoreChange || 0}% from last week
              </p>
              <Progress 
                value={stats?.averageScore || 0} 
                className="mt-2 h-1" 
              />
            </CardContent>
          </Card>
        </div>

        {/* Learning Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-[#4DB748]" />
                Your Learning Progress
              </CardTitle>
              <CardDescription>Track your weekly study goals and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Study Materials</span>
                    <span className="text-sm text-muted-foreground">
                      {progress?.studyMaterials.current || 0} / {progress?.studyMaterials.target || 20}
                    </span>
                  </div>
                  <Progress 
                    value={progress?.studyMaterials ? (progress.studyMaterials.current / progress.studyMaterials.target) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">MCQ Practice</span>
                    <span className="text-sm text-muted-foreground">
                      {progress?.mcqPractice.current || 0} / {progress?.mcqPractice.target || 15}
                    </span>
                  </div>
                  <Progress 
                    value={progress?.mcqPractice ? (progress.mcqPractice.current / progress.mcqPractice.target) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Mock Tests</span>
                    <span className="text-sm text-muted-foreground">
                      {progress?.mockTests.current || 0} / {progress?.mockTests.target || 5}
                    </span>
                  </div>
                  <Progress 
                    value={progress?.mockTests ? (progress.mockTests.current / progress.mockTests.target) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Lab Assignments</span>
                    <span className="text-sm text-muted-foreground">
                      {progress?.labAssignments.current || 0} / {progress?.labAssignments.target || 10}
                    </span>
                  </div>
                  <Progress 
                    value={progress?.labAssignments ? (progress.labAssignments.current / progress.labAssignments.target) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-[#4DB748]" />
                Weekly Goals
              </CardTitle>
              <CardDescription>Stay on track with your targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goals && goals.length > 0 ? (
                  goals.map((goal) => (
                    <div key={goal.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${goal.completed ? 'bg-[#4DB748]' : 'bg-gray-300'}`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{goal.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {goal.current}/{goal.target} {goal.completed ? 'completed' : 'in progress'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No goals set for this week</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-[#4DB748]" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest learning activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities && activities.length > 0 ? (
                activities.map((activity, index) => {
                  const iconMap = {
                    book: { icon: BookOpen, color: 'bg-green-100 text-[#4DB748]' },
                    brain: { icon: Brain, color: 'bg-blue-100 text-blue-600' },
                    chart: { icon: BarChart3, color: 'bg-purple-100 text-purple-600' },
                    award: { icon: Award, color: 'bg-orange-100 text-orange-600' }
                  };
                  const Icon = iconMap[activity.type].icon;
                  const colorClass = iconMap[activity.type].color;

                  return (
                    <div 
                      key={activity.id} 
                      className={`flex items-start space-x-4 ${index < activities.length - 1 ? 'pb-4 border-b' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">No recent activities</p>
              )}
            </div>
          </CardContent>
        </Card>

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
