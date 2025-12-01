'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import { TestTube2, Clock, BookOpen, Play, Eye, Trophy, Calendar, CheckCircle2, XCircle, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

interface MCQQuestion {
  id: string
  question_text: string
  course_name: string | null
  chapter: string | null
  topic: string | null
  marks: number | null
  difficulty: string | null
  option_1: string | null
  option_2: string | null
  option_3: string | null
  option_4: string | null
  answer_option_number: number
  explanation: string | null
}

export default function MockTestPage() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'attempted' | 'new'>('all')

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

  const filteredTests = MOCK_TESTS.filter(test => {
    if (filter === 'attempted') return test.attempted
    if (filter === 'new') return !test.attempted
    return true
  })

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

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <TestTube2 className="h-8 w-8 text-[#4DB748]" />
            <h1 className="text-3xl font-bold text-gray-900">Mock Tests</h1>
          </div>
          <p className="text-gray-600">Full-length mock tests to simulate real exam conditions</p>
        </div>
        {/* Filter Tabs */}
        <div className="mb-6 flex items-center space-x-4">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-[#4DB748] hover:bg-[#45a63f]' : ''}
          >
            All Tests
          </Button>
          <Button
            variant={filter === 'new' ? 'default' : 'outline'}
            onClick={() => setFilter('new')}
            className={filter === 'new' ? 'bg-[#4DB748] hover:bg-[#45a63f]' : ''}
          >
            New
          </Button>
          <Button
            variant={filter === 'attempted' ? 'default' : 'outline'}
            onClick={() => setFilter('attempted')}
            className={filter === 'attempted' ? 'bg-[#4DB748] hover:bg-[#45a63f]' : ''}
          >
            Attempted
          </Button>
        </div>

        {/* Mock Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTests.map((test) => (
            <Card key={test.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{test.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {test.description}
                    </CardDescription>
                  </div>
                  <Badge className={getDifficultyColor(test.difficulty)}>
                    {test.difficulty}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {test.subjects.map((subject) => (
                    <Badge key={subject} variant="outline" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Test Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{test.totalQuestions} Questions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{test.duration} minutes</span>
                    </div>
                  </div>

                  {/* Previous Performance */}
                  {test.attempted && test.lastScore !== null && (
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Trophy className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-900">
                            Last Score: {test.lastScore}%
                          </span>
                        </div>
                        <span className="text-xs text-green-600">
                          {test.totalAttempts} {test.totalAttempts === 1 ? 'attempt' : 'attempts'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button 
                      className="flex-1 bg-[#4DB748] hover:bg-[#45a63f]"
                      onClick={() => alert('Mock test will start here')}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {test.attempted ? 'Retake Test' : 'Start Test'}
                    </Button>
                    {test.attempted && (
                      <Button 
                        variant="outline"
                        onClick={() => alert('View results and analysis')}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Results
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTests.length === 0 && (
          <div className="text-center py-12">
            <TestTube2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tests found</h3>
            <p className="text-gray-600">Try selecting a different filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
