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
  XCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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

const MOCK_PRACTICE_SETS_REMOVED = [
  {
    id: 1,
    title: 'Daily Practice - Day 1',
    description: 'Mixed questions from Physics, Chemistry, and Mathematics',
    totalQuestions: 30,
    duration: 45,
    difficulty: 'Medium',
    date: '2024-01-20',
    completed: false,
    score: null,
    topics: ['Mechanics', 'Organic Chemistry', 'Calculus']
  },
  {
    id: 2,
    title: 'Daily Practice - Day 2',
    description: 'Focus on challenging concepts from yesterday',
    totalQuestions: 30,
    duration: 45,
    difficulty: 'Medium',
    date: '2024-01-19',
    completed: true,
    score: 82,
    topics: ['Thermodynamics', 'Chemical Bonding', 'Trigonometry']
  },
  {
    id: 3,
    title: 'Weekly Challenge - Week 1',
    description: 'Comprehensive practice set covering all subjects',
    totalQuestions: 50,
    duration: 75,
    difficulty: 'Hard',
    date: '2024-01-15',
    completed: true,
    score: 76,
    topics: ['Physics', 'Chemistry', 'Mathematics']
  },
  {
    id: 4,
    title: 'Quick Practice - Set 1',
    description: 'Quick 15-minute practice for busy days',
    totalQuestions: 15,
    duration: 15,
    difficulty: 'Easy',
    date: '2024-01-18',
    completed: true,
    score: 90,
    topics: ['Basic Concepts']
  },
  {
    id: 5,
    title: 'Daily Practice - Day 3',
    description: 'Today\'s curated practice set',
    totalQuestions: 30,
    duration: 45,
    difficulty: 'Medium',
    date: '2024-01-21',
    completed: false,
    score: null,
    topics: ['Electromagnetism', 'Equilibrium', 'Algebra']
  },
  {
    id: 6,
    title: 'Advanced Practice - Set 1',
    description: 'For students aiming for top scores',
    totalQuestions: 40,
    duration: 60,
    difficulty: 'Expert',
    date: '2024-01-17',
    completed: false,
    score: null,
    topics: ['Advanced Topics']
  }
]

export default function PracticeSetPage() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Questions state
  const [questions, setQuestions] = useState<MCQQuestion[]>([])
  const [questionsLoading, setQuestionsLoading] = useState(true)
  
  // Filter states
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Answer states
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

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

  // Fetch questions from database
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setQuestionsLoading(true)
        const { data, error } = await supabase
          .from('mcq_questions')
          .select('*')
          .limit(50)
          .order('created_at', { ascending: false })

        if (error) throw error
        
        setQuestions(data || [])
      } catch (error) {
        console.error('Error fetching questions:', error)
      } finally {
        setQuestionsLoading(false)
      }
    }

    if (user) {
      fetchQuestions()
    }
  }, [user, supabase])

  // Get unique subjects and difficulties
  const subjects = ['all', ...Array.from(new Set(questions.map(q => q.course_name).filter(Boolean) as string[]))]
  const difficulties = ['all', ...Array.from(new Set(questions.map(q => q.difficulty).filter(Boolean) as string[]))]

  // Filter questions
  const filteredQuestions = questions.filter(q => {
    const matchesSubject = selectedSubject === 'all' || q.course_name === selectedSubject
    const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty
    const matchesSearch = searchQuery === '' || 
      q.question_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.chapter?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic?.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesSubject && matchesDifficulty && matchesSearch
  })

  const handleAnswerSelect = (questionId: string, optionNumber: number) => {
    if (!showResults) {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: optionNumber
      }))
    }
  }

  const handleSubmit = () => {
    let correctCount = 0
    filteredQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.answer_option_number) {
        correctCount++
      }
    })
    setScore(Math.round((correctCount / filteredQuestions.length) * 100))
    setShowResults(true)
  }

  const handleReset = () => {
    setSelectedAnswers({})
    setShowResults(false)
    setScore(0)
  }

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAnswerFeedback = (question: MCQQuestion) => {
    const selectedAnswer = selectedAnswers[question.id]
    if (!selectedAnswer || !showResults) return null

    const isCorrect = selectedAnswer === question.answer_option_number
    return isCorrect ? (
      <div className="flex items-center gap-2 text-green-600 mt-2">
        <CheckCircle2 className="h-5 w-5" />
        <span className="font-medium">Correct!</span>
      </div>
    ) : (
      <div className="flex items-center gap-2 text-red-600 mt-2">
        <XCircle className="h-5 w-5" />
        <span className="font-medium">Incorrect. Correct answer: Option {question.answer_option_number}</span>
      </div>
    )
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
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Brain className="h-8 w-8 text-[#4DB748]" />
            Practice Set Questions
          </h1>
          <p className="text-gray-600">Practice with real questions from the database</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search
                </label>
                <Input
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Subject Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Subject
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DB748]"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>
                      {subject === 'all' ? 'All Subjects' : subject}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Difficulty
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DB748]"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty === 'all' ? 'All Difficulties' : difficulty}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        {showResults && (
          <Card className="mb-6 border-2 border-[#4DB748]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Your Score</h3>
                  <p className="text-3xl font-bold text-[#4DB748]">{score}%</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {Object.keys(selectedAnswers).length} / {filteredQuestions.length} questions answered
                  </p>
                </div>
                <Button onClick={handleReset} variant="outline">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Questions List */}
        {questionsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4DB748]"></div>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
                <p className="text-gray-600">Try adjusting your filters or upload questions from the admin panel</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredQuestions.map((question, index) => (
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
                    value={selectedAnswers[question.id]?.toString()}
                    onValueChange={(value) => handleAnswerSelect(question.id, parseInt(value))}
                    disabled={showResults}
                  >
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map(optionNum => {
                        const optionText = question[`option_${optionNum}` as keyof MCQQuestion]
                        if (!optionText) return null

                        const isSelected = selectedAnswers[question.id] === optionNum
                        const isCorrect = question.answer_option_number === optionNum
                        const showCorrectAnswer = showResults && isCorrect

                        return (
                          <div
                            key={optionNum}
                            className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors ${
                              showCorrectAnswer
                                ? 'border-green-500 bg-green-50'
                                : isSelected && showResults && !isCorrect
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
                              {optionText}
                            </Label>
                          </div>
                        )
                      })}
                    </div>
                  </RadioGroup>
                  {getAnswerFeedback(question)}
                </CardContent>
              </Card>
            ))}

            {/* Submit Button */}
            {!showResults && filteredQuestions.length > 0 && (
              <div className="flex justify-center pt-4">
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={Object.keys(selectedAnswers).length === 0}
                  className="bg-[#4DB748] hover:bg-[#45a63f] px-8"
                >
                  Submit Answers
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
