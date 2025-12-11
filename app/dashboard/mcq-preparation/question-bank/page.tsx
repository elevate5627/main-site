'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useUserProfile } from '@/hooks/use-user-profile'
import { User } from '@supabase/supabase-js'
import { 
  Database, 
  Play, 
  Settings, 
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
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

export default function QuestionBankPage() {
  const router = useRouter()
  const { profile } = useUserProfile()
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Subjects
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [subjectCounts, setSubjectCounts] = useState<{ [key: string]: number }>({})
  
  // Set Configuration
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [questionCount, setQuestionCount] = useState(20)
  const [difficulty, setDifficulty] = useState<string>('all')
  const [timeLimit, setTimeLimit] = useState<number | null>(null)
  const [enableTimer, setEnableTimer] = useState(false)
  
  // Practice Mode
  const [isPracticing, setIsPracticing] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState<MCQQuestion[]>([])
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [timerActive, setTimerActive] = useState(false)

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

  // Timer countdown
  useEffect(() => {
    if (timerActive && timeRemaining !== null && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            setTimerActive(false)
            handleAutoSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timerActive, timeRemaining])

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

  const handleSubjectToggle = (subjectName: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectName) 
        ? prev.filter(s => s !== subjectName)
        : [...prev, subjectName]
    )
  }

  const handleGenerateSet = async () => {
    if (selectedSubjects.length === 0) {
      alert('Please select at least one subject')
      return
    }

    try {
      setIsLoading(true)
      const institution = profile?.faculty === 'ioe' ? 'IOE' : 'IOM'

      // Build query
      let query = supabase
        .from('mcq_questions')
        .select('*')
        .eq('institution', institution)
        .in('subject', selectedSubjects)

      // Add difficulty filter if not 'all'
      if (difficulty !== 'all') {
        query = query.eq('difficulty', difficulty)
      }

      const { data, error } = await query

      if (error) throw error

      // Shuffle and limit questions
      const shuffled = (data || []).sort(() => Math.random() - 0.5)
      const limited = shuffled.slice(0, questionCount)

      setGeneratedQuestions(limited)
      setIsPracticing(true)
      setSelectedAnswers({})
      setShowResults(false)

      // Start timer if enabled
      if (enableTimer && timeLimit) {
        setTimeRemaining(timeLimit * 60) // Convert minutes to seconds
        setTimerActive(true)
      }
    } catch (error) {
      console.error('Error generating set:', error)
      alert('Failed to generate question set. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSelect = (questionId: string, optionNumber: number) => {
    if (!showResults) {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: optionNumber
      }))
    }
  }

  const handleAutoSubmit = () => {
    if (!showResults) {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    setShowResults(true)
    setTimerActive(false)
  }

  const handleReset = () => {
    setIsPracticing(false)
    setGeneratedQuestions([])
    setSelectedAnswers({})
    setShowResults(false)
    setTimeRemaining(null)
    setTimerActive(false)
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

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
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

  const calculateScore = () => {
    let correct = 0
    generatedQuestions.forEach(question => {
      if (selectedAnswers[question.id] === question.answer_option_number) {
        correct++
      }
    })
    return Math.round((correct / generatedQuestions.length) * 100)
  }

  if (isLoading && !isPracticing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4DB748]"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Practice Mode View
  if (isPracticing) {
    return (
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header with Timer */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Practice Set</h1>
              <p className="text-sm text-gray-600">
                {generatedQuestions.length} questions • {selectedSubjects.join(', ')}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {enableTimer && timeRemaining !== null && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  timeRemaining < 60 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  <Clock className="h-5 w-5" />
                  <span className="font-bold text-lg">{formatTime(timeRemaining)}</span>
                </div>
              )}
              <Button variant="outline" onClick={handleReset}>
                ← Back to Settings
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          {showResults && (
            <Card className="mb-6 border-2 border-[#4DB748] bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Your Score</h3>
                    <p className="text-4xl font-bold text-[#4DB748] mb-2">{calculateScore()}%</p>
                    <p className="text-sm text-gray-600">
                      {Object.keys(selectedAnswers).length} / {generatedQuestions.length} questions answered
                    </p>
                  </div>
                  <Button onClick={handleReset} className="bg-[#4DB748] hover:bg-[#45a63f]">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    New Set
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Questions */}
          <div className="space-y-6">
            {generatedQuestions.map((question, index) => (
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
                        {question.subject && (
                          <Badge variant="secondary">
                            {getSubjectIcon(question.subject)} {question.subject}
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
                    value={selectedAnswers[question.id]?.toString()}
                    onValueChange={(value) => handleAnswerSelect(question.id, parseInt(value))}
                    disabled={showResults}
                  >
                    {[1, 2, 3, 4].map(optionNum => {
                      const optionText = question[`option_${optionNum}` as keyof MCQQuestion]
                      if (!optionText) return null

                      const isSelected = selectedAnswers[question.id] === optionNum
                      const isCorrect = question.answer_option_number === optionNum
                      const showCorrect = showResults && isCorrect
                      const showWrong = showResults && isSelected && !isCorrect

                      return (
                        <div
                          key={optionNum}
                          className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors ${
                            showCorrect ? 'border-green-500 bg-green-50' :
                            showWrong ? 'border-red-500 bg-red-50' :
                            isSelected ? 'border-[#4DB748] bg-green-50' :
                            'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <RadioGroupItem value={optionNum.toString()} id={`${question.id}-${optionNum}`} />
                          <Label
                            htmlFor={`${question.id}-${optionNum}`}
                            className="flex-1 cursor-pointer"
                          >
                            {optionText}
                          </Label>
                          {showCorrect && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                          {showWrong && <XCircle className="h-5 w-5 text-red-600" />}
                        </div>
                      )
                    })}
                  </RadioGroup>
                  {getAnswerFeedback(question)}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Submit Button */}
          {!showResults && (
            <div className="flex justify-center mt-8">
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={Object.keys(selectedAnswers).length === 0}
                className="bg-[#4DB748] hover:bg-[#45a63f] px-12 py-6 text-lg"
              >
                Submit Answers
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Configuration View
  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Database className="h-8 w-8 text-[#4DB748]" />
            Question Bank - Set Generator
          </h1>
          <p className="text-gray-600">Create custom practice sets with your preferred subjects, difficulty, and question count</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subject Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Subjects</CardTitle>
                <CardDescription>Choose one or more subjects for your practice set</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedSubjects.includes(subject.subject_name)
                          ? 'border-[#4DB748] bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleSubjectToggle(subject.subject_name)}
                    >
                      <Checkbox
                        checked={selectedSubjects.includes(subject.subject_name)}
                        onCheckedChange={() => handleSubjectToggle(subject.subject_name)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getSubjectIcon(subject.subject_name)}</span>
                          <span className="font-medium">{subject.subject_name}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {subjectCounts[subject.subject_name] || 0} questions available
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Question Count */}
            <Card>
              <CardHeader>
                <CardTitle>Number of Questions</CardTitle>
                <CardDescription>Select how many questions you want to practice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {[10, 20, 30, 40, 50].map(count => (
                    <button
                      key={count}
                      onClick={() => setQuestionCount(count)}
                      className={`p-4 rounded-lg border-2 font-bold transition-all ${
                        questionCount === count
                          ? 'border-[#4DB748] bg-green-50 text-[#4DB748]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Difficulty Level */}
            <Card>
              <CardHeader>
                <CardTitle>Difficulty Level</CardTitle>
                <CardDescription>Choose the difficulty of questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 'all', label: 'All Levels', color: 'border-gray-300 hover:bg-gray-50' },
                    { value: 'Easy', label: 'Easy', color: 'border-green-300 hover:bg-green-50' },
                    { value: 'Medium', label: 'Medium', color: 'border-yellow-300 hover:bg-yellow-50' },
                    { value: 'Hard', label: 'Hard', color: 'border-red-300 hover:bg-red-50' }
                  ].map(({ value, label, color }) => (
                    <button
                      key={value}
                      onClick={() => setDifficulty(value)}
                      className={`p-4 rounded-lg border-2 font-medium transition-all ${
                        difficulty === value
                          ? 'border-[#4DB748] bg-green-50 text-[#4DB748] scale-105'
                          : `${color}`
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Time Limit */}
            <Card>
              <CardHeader>
                <CardTitle>Time Limit (Optional)</CardTitle>
                <CardDescription>Set a time limit for your practice session</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={enableTimer}
                      onCheckedChange={(checked) => setEnableTimer(checked as boolean)}
                    />
                    <label className="text-sm font-medium">Enable Timer</label>
                  </div>
                  
                  {enableTimer && (
                    <div className="grid grid-cols-4 gap-3">
                      {[15, 30, 45, 60].map(mins => (
                        <button
                          key={mins}
                          onClick={() => setTimeLimit(mins)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            timeLimit === mins
                              ? 'border-[#4DB748] bg-green-50 text-[#4DB748]'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-bold">{mins}</div>
                          <div className="text-xs">mins</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Set Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Subjects</div>
                  <div className="font-medium">
                    {selectedSubjects.length > 0 
                      ? selectedSubjects.join(', ')
                      : 'None selected'
                    }
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600 mb-1">Questions</div>
                  <div className="font-bold text-2xl text-[#4DB748]">{questionCount}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600 mb-1">Difficulty</div>
                  <Badge className={getDifficultyColor(difficulty !== 'all' ? difficulty : null)}>
                    {difficulty === 'all' ? 'All Levels' : difficulty}
                  </Badge>
                </div>
                
                {enableTimer && timeLimit && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Time Limit</div>
                    <div className="flex items-center gap-2 font-medium">
                      <Clock className="h-4 w-4" />
                      {timeLimit} minutes
                    </div>
                  </div>
                )}

                <Button
                  size="lg"
                  onClick={handleGenerateSet}
                  disabled={selectedSubjects.length === 0 || isLoading}
                  className="w-full bg-[#4DB748] hover:bg-[#45a63f] mt-4"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Generate & Start Practice
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Faculty Switcher */}
        {process.env.NODE_ENV === 'development' && <FacultySwitcher />}
      </div>
    </div>
  )
}
