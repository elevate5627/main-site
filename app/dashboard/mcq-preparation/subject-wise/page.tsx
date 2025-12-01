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
  Circle,
  XCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
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

interface SubjectData {
  name: string
  icon: string
  totalQuestions: number
}

const MOCK_SUBJECTS_OLD = [
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
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [subjects, setSubjects] = useState<SubjectData[]>([])
  const [questions, setQuestions] = useState<MCQQuestion[]>([])
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)

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

      // Group by subject and count questions
      const subjectMap = new Map<string, number>()
      data?.forEach(item => {
        if (item.course_name) {
          subjectMap.set(item.course_name, (subjectMap.get(item.course_name) || 0) + 1)
        }
      })

      const subjectList: SubjectData[] = Array.from(subjectMap.entries()).map(([name, count]) => ({
        name,
        icon: getSubjectIcon(name),
        totalQuestions: count
      }))

      setSubjects(subjectList)
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
  }

  const fetchQuestionsForSubject = async (subjectName: string) => {
    try {
      const { data, error } = await supabase
        .from('mcq_questions')
        .select('*')
        .eq('course_name', subjectName)
        .order('marks', { ascending: true })
        .limit(50)

      if (error) throw error
      setQuestions(data || [])
      setSelectedAnswers({})
      setShowResults(false)
    } catch (error) {
      console.error('Error fetching questions:', error)
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

  const handleSubjectClick = (subjectName: string) => {
    setSelectedSubject(subjectName)
    fetchQuestionsForSubject(subjectName)
  }

  const handleAnswerSelect = (questionId: string, optionNumber: number) => {
    if (!showResults) {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: optionNumber
      }))
    }
  }

  const handleSubmit = () => {
    setShowResults(true)
  }

  const handleReset = () => {
    setSelectedAnswers({})
    setShowResults(false)
  }

  const getScore = () => {
    let correct = 0
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.answer_option_number) {
        correct++
      }
    })
    return {
      correct,
      total: questions.length,
      answered: Object.keys(selectedAnswers).length
    }
  }

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

  const score = getScore()

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {!selectedSubject ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Choose a Subject</h2>
              <p className="text-gray-600">Practice questions organized by subjects</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subjects.map((subject) => {
                return (
                  <Card 
                    key={subject.name} 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleSubjectClick(subject.name)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-4xl">{subject.icon}</div>
                          <div>
                            <CardTitle className="text-xl">{subject.name}</CardTitle>
                            <CardDescription>
                              {subject.totalQuestions} questions available
                            </CardDescription>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total Questions</span>
                          <span className="font-semibold text-gray-900">{subject.totalQuestions}</span>
                        </div>
                        <Button 
                          className="w-full bg-[#4DB748] hover:bg-[#45a63f]"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSubjectClick(subject.name)
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

            {subjects.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No subjects found</h3>
                    <p className="text-gray-600">Upload questions from the admin panel to get started</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <>
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedSubject(null)
                  setQuestions([])
                  setSelectedAnswers({})
                  setShowResults(false)
                }}
                className="mb-4"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Subjects
              </Button>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-4xl">{getSubjectIcon(selectedSubject)}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedSubject}</h2>
                    <p className="text-gray-600">{questions.length} questions</p>
                  </div>
                </div>
              </div>

              {/* Results Summary */}
              {showResults && (
                <Card className="mb-6 border-2 border-[#4DB748]">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Results</h3>
                        <p className="text-gray-600">
                          You got {score.correct} out of {score.total} questions correct
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold text-[#4DB748]">
                          {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
                        </div>
                        <Button onClick={handleReset} variant="outline" className="mt-2">
                          Try Again
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submit Button */}
              {!showResults && Object.keys(selectedAnswers).length > 0 && (
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600">
                        {Object.keys(selectedAnswers).length} of {questions.length} questions answered
                      </p>
                      <Button onClick={handleSubmit} className="bg-[#4DB748] hover:bg-[#45a63f]">
                        Submit Answers
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {questions.map((question, index) => {
                const selectedAnswer = selectedAnswers[question.id]
                const isCorrect = selectedAnswer === question.answer_option_number

                return (
                  <Card key={question.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">Question {index + 1}</Badge>
                            {question.difficulty && (
                              <Badge className={getDifficultyColor(question.difficulty)}>
                                {question.difficulty}
                              </Badge>
                            )}
                            {question.marks && (
                              <Badge variant="secondary">{question.marks} marks</Badge>
                            )}
                            {showResults && selectedAnswer && (
                              <Badge variant={isCorrect ? 'default' : 'destructive'} className={isCorrect ? 'bg-green-500' : ''}>
                                {isCorrect ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                                {isCorrect ? 'Correct' : 'Incorrect'}
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg">{question.question_text}</CardTitle>
                          {(question.chapter || question.topic) && (
                            <CardDescription className="mt-2">
                              {question.chapter && `Chapter: ${question.chapter}`}
                              {question.chapter && question.topic && ' • '}
                              {question.topic && `Topic: ${question.topic}`}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup
                        value={selectedAnswer?.toString()}
                        onValueChange={(value) => handleAnswerSelect(question.id, parseInt(value))}
                        disabled={showResults}
                      >
                        <div className="space-y-3">
                          {[1, 2, 3, 4].map(optionNum => {
                            const optionText = question[`option_${optionNum}` as keyof MCQQuestion]
                            if (!optionText) return null

                            const isSelected = selectedAnswer === optionNum
                            const isCorrectOption = question.answer_option_number === optionNum
                            const showCorrect = showResults && isCorrectOption

                            return (
                              <div
                                key={optionNum}
                                className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors ${
                                  showCorrect
                                    ? 'border-green-500 bg-green-50'
                                    : isSelected && showResults && !isCorrectOption
                                    ? 'border-red-500 bg-red-50'
                                    : isSelected
                                    ? 'border-[#4DB748] bg-green-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <RadioGroupItem value={optionNum.toString()} id={`${question.id}-${optionNum}`} />
                                <Label
                                  htmlFor={`${question.id}-${optionNum}`}
                                  className="flex-1 cursor-pointer"
                                >
                                  <span className="font-semibold mr-2">{optionNum}.</span>
                                  {optionText}
                                  {showCorrect && (
                                    <CheckCircle2 className="inline-block ml-2 h-4 w-4 text-green-600" />
                                  )}
                                </Label>
                              </div>
                            )
                          })}
                        </div>
                      </RadioGroup>
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
