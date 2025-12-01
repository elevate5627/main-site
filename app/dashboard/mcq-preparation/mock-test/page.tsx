'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import { TestTube2, Clock, CheckCircle2, XCircle, Brain } from 'lucide-react'
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
  const [questions, setQuestions] = useState<MCQQuestion[]>([])
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [testStarted, setTestStarted] = useState(false)

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
        .limit(50)

      if (error) throw error
      setQuestions(data || [])
    } catch (error) {
      console.error('Error fetching questions:', error)
    }
  }

  const handleStartTest = () => {
    setTestStarted(true)
    setSelectedAnswers({})
    setShowResults(false)
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

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
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

  if (!testStarted) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <TestTube2 className="h-8 w-8 text-[#4DB748]" />
              <h1 className="text-3xl font-bold text-gray-900">Mock Test</h1>
            </div>
            <p className="text-gray-600">Complete mock test with all available questions</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Test Instructions</CardTitle>
              <CardDescription>Please read the following before starting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-blue-500" />
                  <span><strong>{questions.length}</strong> questions total</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <span>No time limit - practice at your own pace</span>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">Instructions:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
                    <li>Select one answer for each question</li>
                    <li>You can skip questions and come back later</li>
                    <li>Click "Submit Answers" when you're done</li>
                    <li>Correct answers will be highlighted in green</li>
                  </ul>
                </div>
                <Button 
                  onClick={handleStartTest}
                  className="w-full bg-[#4DB748] hover:bg-[#45a63f]"
                  size="lg"
                >
                  Start Mock Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mock Test in Progress</h1>
              <p className="text-gray-600">{questions.length} questions</p>
            </div>
          </div>

          {showResults && (
            <Card className="mb-6 border-2 border-[#4DB748]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Test Results</h3>
                    <p className="text-gray-600">
                      You got {score.correct} out of {score.total} questions correct
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-[#4DB748]">
                      {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
                    </div>
                    <Button onClick={() => {
                      setTestStarted(false)
                      setSelectedAnswers({})
                      setShowResults(false)
                    }} variant="outline" className="mt-2">
                      Restart Test
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
                          {question.course_name && `${question.course_name}`}
                          {question.chapter && ` • Chapter: ${question.chapter}`}
                          {question.topic && ` • Topic: ${question.topic}`}
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
      </div>
    </div>
  )
}
