'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import { 
  Brain,
  Library,
  TestTube2,
  Database,
  ClipboardList,
  Clock,
  CheckCircle2,
  TrendingUp,
  Award
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

// MOCK DATA - Remove when real data is integrated
const MOCK_MCQ_STATS = {
  totalQuestions: 1000,
  attemptedQuestions: 485,
  correctAnswers: 392,
  accuracy: 81,
  averageTime: '45s',
  testsCompleted: 12,
  currentStreak: 5
}

const MOCK_RECENT_TESTS = [
  
  {
    id: 1,
    title: 'Chemistry - Organic Practice',
    date: '2024-01-18',
    score: 78,
    totalQuestions: 40,
    attempted: 40,
    timeTaken: '35 min'
  },
  {
    id: 2,
    title: 'Mathematics - Algebra Set',
    date: '2024-01-15',
    score: 92,
    totalQuestions: 30,
    attempted: 30,
    timeTaken: '28 min'
  }
]

const MOCK_CATEGORIES = [
  {
    id: 1,
    title: 'Subject Wise Questions',
    description: 'Practice questions organized by subjects and topics',
    icon: Library,
    href: '/dashboard/mcq-preparation/subject-wise',
    color: 'bg-blue-500',
    questionsCount: 450,
    completed: 180
  },
  {
    id: 2,
    title: 'Mock Test',
    description: 'Full-length mock tests to simulate real exam conditions',
    icon: TestTube2,
    href: '/dashboard/mcq-preparation/mock-test',
    color: 'bg-purple-500',
    questionsCount: 300,
    completed: 120
  },
  {
    id: 3,
    title: 'Question Bank',
    description: 'Extensive collection of questions from previous years',
    icon: Database,
    href: '/dashboard/mcq-preparation/question-bank',
    color: 'bg-green-500',
    questionsCount: 350,
    completed: 125
  },
  {
    id: 4,
    title: 'Practice Set',
    description: 'Daily practice sets to build consistency',
    icon: ClipboardList,
    href: '/dashboard/mcq-preparation/practice-set',
    color: 'bg-orange-500',
    questionsCount: 150,
    completed: 60
  }
]

export default function McqPreparationPage() {
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
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Brain className="h-8 w-8 text-[#4DB748]" />
            <h1 className="text-3xl font-bold text-gray-900">MCQ Preparation</h1>
          </div>
          <p className="text-gray-600">Practice and improve your skills with our comprehensive MCQ bank</p>
        </div>
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Questions Attempted</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{MOCK_MCQ_STATS.attemptedQuestions}</div>
              <p className="text-xs text-muted-foreground">
                of {MOCK_MCQ_STATS.totalQuestions} total
              </p>
              <Progress 
                value={(MOCK_MCQ_STATS.attemptedQuestions / MOCK_MCQ_STATS.totalQuestions) * 100} 
                className="mt-2" 
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{MOCK_MCQ_STATS.accuracy}%</div>
              <p className="text-xs text-muted-foreground">
                {MOCK_MCQ_STATS.correctAnswers} correct answers
              </p>
              <Progress value={MOCK_MCQ_STATS.accuracy} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{MOCK_MCQ_STATS.testsCompleted}</div>
              <p className="text-xs text-muted-foreground">
                Avg. Time: {MOCK_MCQ_STATS.averageTime}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{MOCK_MCQ_STATS.currentStreak} days</div>
              <p className="text-xs text-muted-foreground">Keep it up! 🔥</p>
            </CardContent>
          </Card>
        </div>

        {/* Categories Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Practice Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_CATEGORIES.map((category) => {
              const Icon = category.icon
              const completionPercentage = (category.completed / category.questionsCount) * 100
              
              return (
                <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(category.href)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-lg ${category.color} bg-opacity-10`}>
                          <Icon className={`h-6 w-6 ${category.color.replace('bg-', 'text-')}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.title}</CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {category.description}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">
                          {category.completed} / {category.questionsCount} questions
                        </span>
                      </div>
                      <Progress value={completionPercentage} className="h-2" />
                      <Button 
                        className="w-full bg-[#4DB748] hover:bg-[#45a63f]"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(category.href)
                        }}
                      >
                        Start Practice
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Recent Tests */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Tests</h2>
          <div className="grid grid-cols-1 gap-4">
            {MOCK_RECENT_TESTS.map((test) => (
              <Card key={test.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{test.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {test.timeTaken}
                        </div>
                        <div>
                          {test.attempted}/{test.totalQuestions} questions
                        </div>
                        <div>
                          {new Date(test.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#4DB748]">{test.score}%</div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>
                      <Badge 
                        variant={test.score >= 80 ? "default" : test.score >= 60 ? "secondary" : "destructive"}
                        className={test.score >= 80 ? "bg-green-500" : ""}
                      >
                        {test.score >= 80 ? "Excellent" : test.score >= 60 ? "Good" : "Needs Work"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

