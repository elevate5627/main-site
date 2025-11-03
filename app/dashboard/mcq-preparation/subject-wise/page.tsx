'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import { 
  Library,
  BookOpen,
  Play,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Circle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

// MOCK DATA - Remove when real data is integrated
const MOCK_SUBJECTS = [
  {
    id: 1,
    name: 'Physics',
    icon: '⚛️',
    totalQuestions: 450,
    completedQuestions: 180,
    accuracy: 78,
    topics: [
      { id: 1, name: 'Mechanics', questions: 120, completed: 60, difficulty: 'Medium' },
      { id: 2, name: 'Thermodynamics', questions: 80, completed: 40, difficulty: 'Hard' },
      { id: 3, name: 'Electromagnetism', questions: 100, completed: 35, difficulty: 'Hard' },
      { id: 4, name: 'Optics', questions: 70, completed: 25, difficulty: 'Medium' },
      { id: 5, name: 'Modern Physics', questions: 80, completed: 20, difficulty: 'Expert' }
    ]
  },
  {
    id: 2,
    name: 'Chemistry',
    icon: '🧪',
    totalQuestions: 400,
    completedQuestions: 165,
    accuracy: 82,
    topics: [
      { id: 1, name: 'Organic Chemistry', questions: 150, completed: 75, difficulty: 'Hard' },
      { id: 2, name: 'Inorganic Chemistry', questions: 120, completed: 50, difficulty: 'Medium' },
      { id: 3, name: 'Physical Chemistry', questions: 130, completed: 40, difficulty: 'Hard' }
    ]
  },
  {
    id: 3,
    name: 'Mathematics',
    icon: '📐',
    totalQuestions: 500,
    completedQuestions: 250,
    accuracy: 85,
    topics: [
      { id: 1, name: 'Calculus', questions: 150, completed: 90, difficulty: 'Hard' },
      { id: 2, name: 'Algebra', questions: 130, completed: 80, difficulty: 'Medium' },
      { id: 3, name: 'Trigonometry', questions: 100, completed: 50, difficulty: 'Medium' },
      { id: 4, name: 'Coordinate Geometry', questions: 120, completed: 30, difficulty: 'Hard' }
    ]
  },
  {
    id: 4,
    name: 'Biology',
    icon: '🧬',
    totalQuestions: 350,
    completedQuestions: 120,
    accuracy: 76,
    topics: [
      { id: 1, name: 'Botany', questions: 175, completed: 60, difficulty: 'Medium' },
      { id: 2, name: 'Zoology', questions: 175, completed: 60, difficulty: 'Medium' }
    ]
  }
]

export default function SubjectWisePage() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null)

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-orange-100 text-orange-800'
      case 'Expert': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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

  const currentSubject = MOCK_SUBJECTS.find(s => s.id === selectedSubject)

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {!selectedSubject ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Choose a Subject</h2>
              <p className="text-gray-600">Practice questions organized by subjects and topics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_SUBJECTS.map((subject) => {
                const completionPercentage = (subject.completedQuestions / subject.totalQuestions) * 100
                
                return (
                  <Card 
                    key={subject.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedSubject(subject.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-4xl">{subject.icon}</div>
                          <div>
                            <CardTitle className="text-xl">{subject.name}</CardTitle>
                            <CardDescription>
                              {subject.topics.length} topics available
                            </CardDescription>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 mb-1">Questions</p>
                            <p className="font-semibold text-gray-900">{subject.totalQuestions}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">Accuracy</p>
                            <p className="font-semibold text-[#4DB748]">{subject.accuracy}%</p>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">
                              {subject.completedQuestions} / {subject.totalQuestions}
                            </span>
                          </div>
                          <Progress value={completionPercentage} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => setSelectedSubject(null)}
                className="mb-4"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Subjects
              </Button>
              
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-4xl">{currentSubject?.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{currentSubject?.name}</h2>
                  <p className="text-gray-600">Choose a topic to practice</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Total Questions</p>
                        <p className="text-2xl font-bold">{currentSubject?.totalQuestions}</p>
                      </div>
                      <BookOpen className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Completed</p>
                        <p className="text-2xl font-bold">{currentSubject?.completedQuestions}</p>
                      </div>
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Accuracy</p>
                        <p className="text-2xl font-bold text-[#4DB748]">{currentSubject?.accuracy}%</p>
                      </div>
                      <Library className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-4">
              {currentSubject?.topics.map((topic) => {
                const topicCompletion = (topic.completed / topic.questions) * 100
                const isCompleted = topic.completed === topic.questions

                return (
                  <Card key={topic.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {isCompleted ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-300" />
                            )}
                            <h3 className="font-semibold text-lg text-gray-900">{topic.name}</h3>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{topic.questions} questions</span>
                            <Badge className={getDifficultyColor(topic.difficulty)}>
                              {topic.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          className="bg-[#4DB748] hover:bg-[#45a63f]"
                          onClick={() => alert('Topic practice will start here')}
                        >
                          {topic.completed > 0 ? 'Continue' : 'Start'}
                        </Button>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">
                            {topic.completed} / {topic.questions} completed
                          </span>
                        </div>
                        <Progress value={topicCompletion} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
