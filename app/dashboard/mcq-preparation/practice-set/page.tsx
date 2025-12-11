'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useUserProfile } from '@/hooks/use-user-profile'
import { User } from '@supabase/supabase-js'
import { 
  Brain,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  BookOpen
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import FacultySwitcher from '@/components/FacultySwitcher'

interface Subject {
  id: string
  subject_name: string
  institution: string
  is_active: boolean
  display_order: number
}

interface MCQQuestion {
  id: string
  question_text: string
  institution: string
  program: string
  subject: string
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
  const { profile } = useUserProfile()
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Subjects state
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>('Physics')
  const [subjectCounts, setSubjectCounts] = useState<{ [key: string]: number }>({})
  
  // Questions state
  const [allQuestions, setAllQuestions] = useState<MCQQuestion[]>([])
  const [currentBatch, setCurrentBatch] = useState<MCQQuestion[]>([])
  const [questionsLoading, setQuestionsLoading] = useState(false)
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0)
  const [batchSize] = useState(20)
  
  // Filter states
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Answer states
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [batchScores, setBatchScores] = useState<number[]>([])
  const [currentScore, setCurrentScore] = useState(0)

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

  // Fetch subjects when user and profile are ready
  useEffect(() => {
    if (user && profile?.faculty) {
      fetchSubjects()
    }
  }, [user?.id, profile?.faculty])

  // Auto-load Physics questions on mount
  useEffect(() => {
    if (user && profile?.faculty && subjects.length > 0 && selectedSubject === 'Physics') {
      const physicsSubject = subjects.find(s => s.subject_name === 'Physics')
      if (physicsSubject) {
        fetchQuestionsForSubject('Physics')
      }
    }
  }, [user?.id, profile?.faculty, subjects])

  const fetchSubjects = async () => {
    try {
      const institution = profile?.faculty === 'ioe' ? 'IOE' : 'IOM'

      const { data: subjectsData, error: subjectsError } = await supabase
        .from('subjects')
        .select('*')
        .eq('institution', institution)
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (subjectsError) throw subjectsError

      setSubjects(subjectsData || [])

      // Get question counts for each subject
      const counts: { [key: string]: number } = {}
      for (const subject of subjectsData || []) {
        const { count } = await supabase
          .from('mcq_questions')
          .select('*', { count: 'exact', head: true })
          .eq('institution', institution)
          .eq('subject', subject.subject_name)

        counts[subject.subject_name] = count || 0
      }
      setSubjectCounts(counts)
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
  }

  const fetchQuestionsForSubject = async (subjectName: string) => {
    try {
      setQuestionsLoading(true)
      setSelectedSubject(subjectName)
      setSelectedAnswers({})
      setShowResults(false)
      setCurrentBatchIndex(0)
      setBatchScores([])
      setCurrentScore(0)

      const institution = profile?.faculty === 'ioe' ? 'IOE' : 'IOM'

      const { data, error } = await supabase
        .from('mcq_questions')
        .select('*')
        .eq('institution', institution)
        .eq('subject', subjectName)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      const fetchedQuestions = data || []
      setAllQuestions(fetchedQuestions)
      
      // Load first batch
      setCurrentBatch(fetchedQuestions.slice(0, batchSize))
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setQuestionsLoading(false)
    }
  }

  const loadNextBatch = () => {
    const nextIndex = currentBatchIndex + 1
    const start = nextIndex * batchSize
    const end = start + batchSize
    
    setCurrentBatch(allQuestions.slice(start, end))
    setCurrentBatchIndex(nextIndex)
    setSelectedAnswers({})
    setShowResults(false)
    setCurrentScore(0)
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Get unique difficulties from current batch
  const difficulties = ['all', ...Array.from(new Set(currentBatch.map(q => q.difficulty).filter(Boolean) as string[]))]

  // Filter questions in current batch
  const filteredQuestions = currentBatch.filter(q => {
    const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty
    const matchesSearch = searchQuery === '' || 
      q.question_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.chapter?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic?.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesDifficulty && matchesSearch
  })

  const totalBatches = Math.ceil(allQuestions.length / batchSize)
  const hasMoreBatches = currentBatchIndex < totalBatches - 1

  const handleAnswerSelect = (questionId: string, optionNumber: number) => {
    if (!showResults) {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: optionNumber
      }))
    }
  }

  const handleSubmit = () => {
    let correct = 0
    filteredQuestions.forEach(question => {
      if (selectedAnswers[question.id] === question.answer_option_number) {
        correct++
      }
    })
    const percentage = Math.round((correct / Object.keys(selectedAnswers).length) * 100) || 0
    setCurrentScore(percentage)
    setShowResults(true)
    
    // Save score for this batch
    const newScores = [...batchScores]
    newScores[currentBatchIndex] = percentage
    setBatchScores(newScores)
  }

  const handleReset = () => {
    setSelectedAnswers({})
    setShowResults(false)
    setCurrentScore(0)
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

  const getSubjectIcon = (subjectName: string) => {
    const name = subjectName.toLowerCase()
    if (name.includes('physics')) return '⚛️'
    if (name.includes('chemistry')) return '🧪'
    if (name.includes('mathematics') || name.includes('math')) return '📐'
    if (name.includes('english')) return '📚'
    if (name.includes('botany')) return '🌿'
    if (name.includes('zoology')) return '🦋'
    if (name.includes('mat')) return '🧠'
    return '📖'
  }

  const getSubjectColor = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-700 hover:bg-blue-200',
      'bg-green-100 text-green-700 hover:bg-green-200',
      'bg-purple-100 text-purple-700 hover:bg-purple-200',
      'bg-orange-100 text-orange-700 hover:bg-orange-200',
      'bg-pink-100 text-pink-700 hover:bg-pink-200',
      'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
      'bg-teal-100 text-teal-700 hover:bg-teal-200',
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Brain className="h-8 w-8 text-[#4DB748]" />
            Practice Set Questions
          </h1>
          <p className="text-gray-600">Select a subject to start practicing</p>
        </div>

        {/* Subject Tabs */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {subjects.map((subject, index) => {
                const isSelected = selectedSubject === subject.subject_name
                return (
                  <button
                    key={subject.id}
                    onClick={() => fetchQuestionsForSubject(subject.subject_name)}
                    className={`
                      flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all
                      ${isSelected 
                        ? 'border-[#4DB748] bg-green-50 shadow-md scale-105' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <span className="text-3xl mb-2">{getSubjectIcon(subject.subject_name)}</span>
                    <span className={`font-medium text-sm mb-1 ${isSelected ? 'text-[#4DB748]' : 'text-gray-700'}`}>
                      {subject.subject_name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {subjectCounts[subject.subject_name] || 0} Qs
                    </span>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Questions Section */}
        {selectedSubject && currentBatch.length > 0 && (
          <>
            {/* Subject Header with Batch Info */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getSubjectIcon(selectedSubject)}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedSubject}</h2>
                    <p className="text-sm text-gray-600">
                      Batch {currentBatchIndex + 1} of {totalBatches} • Questions {currentBatchIndex * batchSize + 1}-{Math.min((currentBatchIndex + 1) * batchSize, allQuestions.length)} of {allQuestions.length}
                    </p>
                  </div>
                </div>
                
                {/* Batch Scores */}
                {batchScores.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Previous Scores:</span>
                    {batchScores.map((score, idx) => (
                      <Badge 
                        key={idx} 
                        variant={idx === currentBatchIndex ? "default" : "outline"}
                        className={idx === currentBatchIndex ? "bg-[#4DB748]" : ""}
                      >
                        Batch {idx + 1}: {score}%
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Card className="mb-6 border-2 border-[#4DB748] bg-gradient-to-r from-green-50 to-emerald-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Batch {currentBatchIndex + 1} Score</h3>
                  <p className="text-4xl font-bold text-[#4DB748] mb-2">{currentScore}%</p>
                  <p className="text-sm text-gray-600">
                    {Object.keys(selectedAnswers).length} / {filteredQuestions.length} questions answered
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleReset} variant="outline">
                    Try Again
                  </Button>
                  {hasMoreBatches && (
                    <Button 
                      onClick={loadNextBatch} 
                      className="bg-[#4DB748] hover:bg-[#45a63f]"
                    >
                      Next Batch →
                    </Button>
                  )}
                </div>
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
            {!showResults && (
              <div className="flex justify-center mt-8">
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={Object.keys(selectedAnswers).length === 0}
                  className="bg-[#4DB748] hover:bg-[#45a63f] px-12 py-6 text-lg"
                >
                  Submit Batch {currentBatchIndex + 1} Answers
                </Button>
              </div>
            )}
            
            {showResults && !hasMoreBatches && (
              <div className="text-center mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">🎉 All Batches Completed!</h3>
                <p className="text-gray-600 mb-4">
                  Average Score: {Math.round(batchScores.reduce((a, b) => a + b, 0) / batchScores.length)}%
                </p>
                <Button
                  onClick={() => {
                    setCurrentBatchIndex(0)
                    setCurrentBatch(allQuestions.slice(0, batchSize))
                    setBatchScores([])
                    setSelectedAnswers({})
                    setShowResults(false)
                    setCurrentScore(0)
                  }}
                  className="bg-[#4DB748] hover:bg-[#45a63f]"
                >
                  Restart from Beginning
                </Button>
              </div>
            )}
          </div>
        )}
          </>
        )}

        {/* Faculty Switcher */}
        {process.env.NODE_ENV === 'development' && <FacultySwitcher />}
      </div>
    </div>
  )
}
