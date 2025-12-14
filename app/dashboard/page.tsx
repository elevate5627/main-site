'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import { useUserProfile } from '@/hooks/use-user-profile'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { QuestionOfTheDay } from '@/components/dashboard/QuestionOfTheDay'
import { ResumePracticeCard } from '@/components/dashboard/ResumePracticeCard'
import { 
  BookOpen, 
  Brain,
  User as UserIcon,
  TrendingUp,
  Clock,
  Award,
  Target,
  Calendar,
  BarChart3,
  Zap,
  Trophy,
  Activity
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
        {/* Welcome Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student'}! 👋
          </h2>
          <p className="text-gray-600">
            {profile ? (
              profile.purpose === 'study-material' 
                ? `${profile.department || 'Your'} - ${profile.university || 'University'} - Semester ${profile.semester || ''}`
                : `${profile.faculty?.toUpperCase() || 'MCQ'} Preparation`
            ) : (
              "Let's continue your learning journey"
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Resume Practice & QOTD */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resume Practice Card */}
            <ResumePracticeCard />

            {/* Question of the Day */}
            {profile?.purpose === 'mcq-preparation' && <QuestionOfTheDay />}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Study Hours</p>
                      <p className="text-2xl font-bold">{stats?.totalStudyHours || 0}h</p>
                      <p className="text-xs text-[#4DB748]">
                        {stats?.studyHoursChange !== undefined && stats.studyHoursChange >= 0 ? '+' : ''}
                        {stats?.studyHoursChange || 0}h this week
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-[#4DB748] opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tests Taken</p>
                      <p className="text-2xl font-bold">{stats?.mcqTestsTaken || 0}</p>
                      <p className="text-xs text-[#4DB748]">
                        {stats?.mcqTestsChange !== undefined && stats.mcqTestsChange >= 0 ? '+' : ''}
                        {stats?.mcqTestsChange || 0} this week
                      </p>
                    </div>
                    <Brain className="h-8 w-8 text-blue-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Score</p>
                      <p className="text-2xl font-bold">{stats?.averageScore || 0}%</p>
                      <p className="text-xs text-[#4DB748]">
                        {stats?.scoreChange !== undefined && stats.scoreChange >= 0 ? '+' : ''}
                        {stats?.scoreChange || 0}% change
                      </p>
                    </div>
                    <Award className="h-8 w-8 text-orange-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Materials</p>
                      <p className="text-2xl font-bold">{stats?.materialsCompleted || 0}</p>
                      <p className="text-xs text-[#4DB748]">
                        {stats?.materialsChange !== undefined && stats.materialsChange >= 0 ? '+' : ''}
                        {stats?.materialsChange || 0} this week
                      </p>
                    </div>
                    <BookOpen className="h-8 w-8 text-purple-500 opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Progress & Goals */}
          <div className="space-y-6">
            {/* Weekly Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Target className="mr-2 h-5 w-5 text-[#4DB748]" />
                  Weekly Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goals && goals.length > 0 ? (
                    goals.map((goal) => (
                      <div key={goal.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{goal.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {goal.current}/{goal.target}
                          </span>
                        </div>
                        <Progress 
                          value={(goal.current / goal.target) * 100} 
                          className="h-2"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No goals set</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Activity Streak */}
            <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Study Streak</p>
                    <p className="text-3xl font-bold text-orange-600">7 Days</p>
                    <p className="text-xs text-gray-600 mt-1">Keep it up! 🔥</p>
                  </div>
                  <Zap className="h-12 w-12 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Learning Progress & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Learning Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-[#4DB748]" />
                Learning Progress
              </CardTitle>
              <CardDescription>Track your activity across different areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile?.purpose === 'mcq-preparation' ? (
                  <>
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
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-[#4DB748]" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest learning activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities && activities.length > 0 ? (
                  activities.slice(0, 5).map((activity) => {
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
                        className="flex items-start space-x-3"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6">
                    <Activity className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No activities yet</p>
                    <p className="text-xs text-muted-foreground">Start practicing to see your progress</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/dashboard/mcq-preparation')}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">MCQ Practice</h3>
                  <p className="text-xs text-muted-foreground">Test your knowledge</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/dashboard/study-materials')}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Study Materials</h3>
                  <p className="text-xs text-muted-foreground">Access resources</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/dashboard/mcq-preparation/mock-test')}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Mock Tests</h3>
                  <p className="text-xs text-muted-foreground">Full practice exams</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
