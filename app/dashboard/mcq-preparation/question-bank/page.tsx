'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import { Database, BookOpen, ChevronRight, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SubjectStats {
  name: string
  count: number
  icon: string
}

export default function QuestionBankPage() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [subjects, setSubjects] = useState<SubjectStats[]>([])

  useEffect(() => {
    const getUser = async () => {
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
        fetchSubjects()
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
        setIsLoading(false)
        fetchSubjects()
      }
    }

    getUser()
  }, [supabase, router])

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('mcq_questions')
        .select('course_name')

      if (error) throw error

      const subjectMap = new Map<string, number>()
      data?.forEach(item => {
        if (item.course_name) {
          subjectMap.set(item.course_name, (subjectMap.get(item.course_name) || 0) + 1)
        }
      })

      const subjectList: SubjectStats[] = Array.from(subjectMap.entries()).map(([name, count]) => ({
        name,
        count,
        icon: getSubjectIcon(name)
      }))

      setSubjects(subjectList)
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
  }

  const getSubjectIcon = (subjectName: string) => {
    const name = subjectName?.toLowerCase() || ''
    if (name.includes('mathematic')) return '📐'
    if (name.includes('physic')) return '⚛️'
    if (name.includes('chemist')) return '🧪'
    if (name.includes('biolog')) return '🧬'
    if (name.includes('anatomy')) return '🫀'
    if (name.includes('physiolog')) return '💉'
    return '📚'
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

  const totalQuestions = subjects.reduce((sum, s) => sum + s.count, 0)

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Database className="h-8 w-8 text-[#4DB748]" />
            <h1 className="text-3xl font-bold text-gray-900">Question Bank</h1>
          </div>
          <p className="text-gray-600">Browse and practice from our complete question database</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Questions</p>
                  <p className="text-3xl font-bold text-[#4DB748]">{totalQuestions}</p>
                </div>
                <Brain className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Subjects</p>
                  <p className="text-3xl font-bold text-purple-600">{subjects.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <p className="text-lg font-bold text-green-600">Active</p>
                </div>
                <Database className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Browse by Subject</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((subject) => (
            <Card 
              key={subject.name} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push('/dashboard/mcq-preparation/subject-wise')}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl">{subject.icon}</div>
                    <div>
                      <CardTitle className="text-xl">{subject.name}</CardTitle>
                      <CardDescription>
                        {subject.count} questions available
                      </CardDescription>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-[#4DB748] hover:bg-[#45a63f]"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push('/dashboard/mcq-preparation/subject-wise')
                  }}
                >
                  Practice Questions
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {subjects.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
                <p className="text-gray-600">Upload questions from the admin panel to get started</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
