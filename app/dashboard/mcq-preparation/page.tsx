'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import { 
  Brain,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  ChevronRight
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

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
  created_at: string
}

interface UserAnswer {
  [questionId: string]: string
}

interface AnswerStatus {
  [questionId: string]: 'correct' | 'incorrect' | null
}

export default function McqPreparationPage() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [questions, setQuestions] = useState<MCQQuestion[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<MCQQuestion[]>([])
  const [userAnswers, setUserAnswers] = useState<UserAnswer>({})
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>({})
  const [subjects, setSubjects] = useState<string[]>([])
  const [filters, setFilters] = useState({
    course: 'all',
    subject: 'all',
    difficulty: 'all',
    searchQuery: ''
  })
  const [courses, setCourses] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      // Skip auth in development
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
        fetchQuestions()
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
        setIsLoading(false)
        fetchQuestions()
      }
    }

    getUser()
  }, [supabase, router])

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('mcq_questions')
        .select('*')
        .order('course_name', { ascending: true })
        .order('marks', { ascending: true })
        .limit(100)

      if (error) {
        console.error('Error fetching questions:', error)
      } else if (data) {
        setQuestions(data)
        setFilteredQuestions(data)
        
        // Extract unique courses and subjects
        const uniqueCourses = Array.from(new Set(data.map(q => q.course_name).filter(Boolean)))
        const uniqueSubjects = Array.from(new Set(data.map(q => q.course_name).filter(Boolean)))
        setSubjects(uniqueSubjects as string[])
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    let filtered = questions

    if (filters.subject !== 'all') {
      filtered = filtered.filter(q => q.course_name === filters.subject)
    }

    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === filters.difficulty)
    }

    if (filters.searchQuery) {
      filtered = filtered.filter(q => 
        q.question_text?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        q.topic?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        q.chapter?.toLowerCase().includes(filters.searchQuery.toLowerCase())
      )
    }

    setFilteredQuestions(filtered)
  }, [filters, questions])

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
    setAnswerStatus(prev => ({
      ...prev,
      [questionId]: null
    }))
  }

  const checkAnswer = (questionId: string) => {
    const question = questions.find(q => q.id === questionId)
    const userAnswer = userAnswers[questionId]
    
    if (question && userAnswer) {
      const isCorrect = parseInt(userAnswer) === question.answer_option_number
      setAnswerStatus(prev => ({
        ...prev,
        [questionId]: isCorrect ? 'correct' : 'incorrect'
      }))
    }
  }

  const checkAllAnswers = () => {
    const newStatus: AnswerStatus = {}
    filteredQuestions.forEach(question => {
      const userAnswer = userAnswers[question.id]
      if (userAnswer) {
        newStatus[question.id] = parseInt(userAnswer) === question.answer_option_number ? 'correct' : 'incorrect'
      }
    })
    setAnswerStatus(newStatus)
    setShowResults(true)
  }

  const resetQuiz = () => {
    setUserAnswers({})
    setAnswerStatus({})
    setShowResults(false)
  }

  const getScore = () => {
    const answered = Object.keys(userAnswers).length
    const correct = Object.values(answerStatus).filter(status => status === 'correct').length
    return { answered, correct, total: filteredQuestions.length }
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
  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'hard':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Brain className="h-8 w-8 text-[#4DB748]" />
            <h1 className="text-3xl font-bold text-gray-900">MCQ Practice</h1>
          </div>
          <p className="text-gray-600">Practice questions from your uploaded database</p>
        </div>

        {/* Results Summary */}
        {showResults && (
          <Card className="mb-6 border-2 border-[#4DB748]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Results</h3>
                  <p className="text-gray-600">
                    You got {score.correct} out of {score.answered} questions correct
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-[#4DB748]">
                    {score.answered > 0 ? Math.round((score.correct / score.answered) * 100) : 0}%
                  </div>
                  <Button onClick={resetQuiz} variant="outline" className="mt-2">
                    Try Again
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search questions..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Subject Filter */}
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select
                  value={filters.subject}
                  onValueChange={(value) => setFilters({ ...filters, subject: value })}
                >
                  <SelectTrigger id="subject">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty Filter */}
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={filters.difficulty}
                  onValueChange={(value) => setFilters({ ...filters, difficulty: value })}
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
              </p>
              {Object.keys(userAnswers).length > 0 && !showResults && (
                <Button onClick={checkAllAnswers} className="bg-[#4DB748] hover:bg-[#45a63f]">
                  Submit Answers ({Object.keys(userAnswers).length}/{filteredQuestions.length})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        <div className="space-y-6">
          {filteredQuestions.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
                  <p className="text-gray-600">Try adjusting your filters or upload some questions</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredQuestions.map((question, index) => {
              const userAnswer = userAnswers[question.id]
              const status = answerStatus[question.id]
              
              return (
                <Card key={question.id} className={`${status === 'correct' ? 'border-2 border-green-500' : status === 'incorrect' ? 'border-2 border-red-500' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-700">Q{index + 1}.</span>
                          {question.course_name && <Badge variant="outline">{question.course_name}</Badge>}
                          {question.marks && <Badge variant="secondary">{question.marks} marks</Badge>}
                          {question.difficulty && (
                            <Badge className={getDifficultyColor(question.difficulty)}>
                              {question.difficulty}
                            </Badge>
                          )}
                          {status && (
                            <Badge variant={status === 'correct' ? 'default' : 'destructive'} className={status === 'correct' ? 'bg-green-500' : ''}>
                              {status === 'correct' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                              {status === 'correct' ? 'Correct' : 'Incorrect'}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg font-medium text-gray-900">
                          {question.question_text}
                        </CardTitle>
                        {(question.chapter || question.topic) && (
                          <p className="text-sm text-gray-500 mt-1">
                            {question.chapter && `Chapter: ${question.chapter}`}
                            {question.chapter && question.topic && ' • '}
                            {question.topic && `Topic: ${question.topic}`}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={userAnswer || ''}
                      onValueChange={(value) => handleAnswerSelect(question.id, value)}
                      disabled={showResults}
                    >
                      <div className="space-y-3">
                        {[1, 2, 3, 4].map((optionNum) => {
                          const optionText = question[`option_${optionNum}` as keyof MCQQuestion]
                          if (!optionText) return null
                          
                          const optionKey = optionNum.toString()
                          const isCorrectAnswer = optionNum === question.answer_option_number
                          
                          return (
                            <div
                              key={optionNum}
                              className={`flex items-start space-x-3 p-3 rounded-lg border-2 transition-colors ${
                                status && isCorrectAnswer
                                  ? 'border-green-500 bg-green-50'
                                  : status && userAnswer === optionKey && !isCorrectAnswer
                                  ? 'border-red-500 bg-red-50'
                                  : userAnswer === optionKey
                                  ? 'border-[#4DB748] bg-[#4DB748]/5'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <RadioGroupItem value={optionKey} id={`${question.id}-${optionNum}`} className="mt-1" />
                              <Label
                                htmlFor={`${question.id}-${optionNum}`}
                                className="flex-1 cursor-pointer font-normal"
                              >
                                <span className="font-semibold mr-2">{optionNum}.</span>
                                {optionText}
                                {status && isCorrectAnswer && (
                                  <CheckCircle2 className="inline-block ml-2 h-4 w-4 text-green-600" />
                                )}
                              </Label>
                            </div>
                          )
                        })}
                      </div>
                    </RadioGroup>

                    {status && question.explanation && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-semibold text-blue-900 mb-1">Explanation:</p>
                        <p className="text-sm text-blue-800">{question.explanation}</p>
                      </div>
                    )}

                    {!showResults && userAnswer && (
                      <Button
                        onClick={() => checkAnswer(question.id)}
                        variant="outline"
                        className="mt-4"
                        size="sm"
                      >
                        Check Answer
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}