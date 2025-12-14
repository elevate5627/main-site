'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import { useUserProfile } from '@/hooks/use-user-profile'
import { MockTestInstructions } from '@/components/mock-test/MockTestInstructions'
import { MockTestTimer } from '@/components/mock-test/MockTestTimer'
import { QuestionNavigator } from '@/components/mock-test/QuestionNavigator'
import { 
  getTestRules, 
  calculateScore, 
  getSubjectWiseProgress,
  MockTestRules 
} from '@/lib/mock-test-rules'
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Send
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface MCQQuestion {
  id: string
  question_text: string
  subject: string
  institution: string
  program: string
  option_1: string
  option_2: string
  option_3: string
  option_4: string
  answer_option_number: number
  explanation?: string
  difficulty?: string
  marks?: number
}

export default function MockTestPage() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { profile } = useUserProfile()
  
  // Test state
  const [testRules, setTestRules] = useState<MockTestRules | null>(null)
  const [questions, setQuestions] = useState<MCQQuestion[]>([])
  const [questionsLoading, setQuestionsLoading] = useState(true)
  const [testStarted, setTestStarted] = useState(false)
  const [testStartTime, setTestStartTime] = useState<string>('')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  
  // Answer tracking
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [markedForReview, setMarkedForReview] = useState<string[]>([])
  
  // Results
  const [showResults, setShowResults] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [testSubmitted, setTestSubmitted] = useState(false)

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

  useEffect(() => {
    if (profile?.faculty) {
      const rules = getTestRules(profile.faculty)
      setTestRules(rules)
      fetchQuestions(profile.faculty, rules)
    }
  }, [profile])

  const fetchQuestions = async (faculty: 'ioe' | 'mbbs', rules: MockTestRules) => {
    try {
      setQuestionsLoading(true)
      // Map faculty to institution
      const institution = faculty === 'ioe' ? 'IOE' : 'IOM'
      
      // Fetch questions based on institution and subject distribution
      const allQuestions: MCQQuestion[] = []
      
      for (const subject of rules.subjectDistribution) {
        const { data, error } = await supabase
          .from('mcq_questions')
          .select('*')
          .eq('institution', institution)
          .eq('subject', subject.subject)
          .limit(subject.questions)

        if (error) {
          console.error(`Error fetching ${subject.subject} questions:`, error)
        } else if (data) {
          allQuestions.push(...data)
        }
      }

      // Shuffle questions
      const shuffled = allQuestions.sort(() => Math.random() - 0.5)
      setQuestions(shuffled.slice(0, rules.totalQuestions))
      console.log(`Loaded ${shuffled.length} questions for ${institution} mock test`)
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setQuestionsLoading(false)
    }
  }

  const handleStartTest = () => {
    setTestStarted(true)
    setTestStartTime(new Date().toISOString())
    setAnswers({})
    setMarkedForReview([])
    setShowResults(false)
    setCurrentQuestionIndex(0)
  }

  const handleNavigate = (index: number) => {
    setCurrentQuestionIndex(index)
    // Scroll to the question
    const questionElement = document.getElementById(`question-${index}`)
    if (questionElement) {
      questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  // Update current question index based on scroll position
  useEffect(() => {
    if (!testStarted || showResults) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.id.split('-')[1])
            if (!isNaN(index)) {
              setCurrentQuestionIndex(index)
            }
          }
        })
      },
      { threshold: 0.5, rootMargin: '-100px 0px' }
    )

    questions.forEach((_, index) => {
      const element = document.getElementById(`question-${index}`)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [questions, testStarted, showResults])

  const handleTimeUp = () => {
    if (!testSubmitted) {
      handleSubmitTest(true)
    }
  }

  const handleSubmitTest = async (autoSubmit: boolean = false) => {
    if (!testRules) return

    setTestSubmitted(true)
    setShowSubmitDialog(false)
    
    const score = calculateScore(questions, answers, testRules)
    
    // Save test attempt to database
    try {
      await supabase.from('mcq_attempts').insert({
        user_id: user?.id,
        test_type: 'mock-test',
        test_name: `${testRules.faculty.toUpperCase()} Mock Test`,
        score: score.percentage,
        total_questions: questions.length,
        correct_answers: score.correct,
        time_taken_minutes: testRules.duration
      })

      // Create achievement notification if passed
      if (score.passed && user) {
        await supabase.from('notifications').insert({
          user_id: user.id,
          title: 'Mock Test Completed! 🎉',
          message: `You scored ${score.percentage.toFixed(2)}% and ${score.passed ? 'PASSED' : 'need more practice'}`,
          type: score.passed ? 'success' : 'info',
          icon_type: 'trophy',
          action_url: '/dashboard/mcq-preparation/mock-test'
        })
      }
    } catch (error) {
      console.error('Error saving test attempt:', error)
    }

    setShowResults(true)
  }

  if (isLoading || !profile || !testRules || questionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4DB748] mx-auto mb-4"></div>
          <p className="text-gray-600">
            {questionsLoading ? 'Loading questions...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Check if questions are loaded
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Questions Available</CardTitle>
            <CardDescription>
              There are no questions available for this mock test. Please contact support or try again later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard')} className="w-full">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Instructions Screen
  if (!testStarted) {
    return (
      <div className="p-6">
        <MockTestInstructions
          rules={testRules}
          onStartTest={handleStartTest}
          totalQuestions={questions.length}
        />
      </div>
    )
  }

  // Results Screen
  if (showResults) {
    const score = calculateScore(questions, answers, testRules)
    const subjectProgress = getSubjectWiseProgress(questions, answers, true)

    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Results Header */}
          <Card className={`border-2 ${score.passed ? 'border-green-500 bg-green-50' : 'border-orange-500 bg-orange-50'}`}>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Test Results</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-gray-700">Correct Answers:</span>
                      <span className="text-xl font-bold text-green-600">{score.correct}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-gray-700">Wrong Answers:</span>
                      <span className="text-xl font-bold text-red-600">{score.wrong}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-gray-700">Unanswered:</span>
                      <span className="text-xl font-bold text-gray-600">{score.unanswered}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="text-6xl font-bold text-[#4DB748] mb-2">
                    {score.percentage.toFixed(2)}%
                  </div>
                  <p className="text-xl mb-4">
                    {score.totalMarks.toFixed(2)} / {testRules.totalMarks} marks
                  </p>
                  <Badge 
                    variant={score.passed ? 'default' : 'destructive'}
                    className={`text-lg px-6 py-2 ${score.passed ? 'bg-green-500' : ''}`}
                  >
                    {score.passed ? '✓ PASSED' : '✗ NOT PASSED'}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-2">
                    Passing: {testRules.passingPercentage}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subject-wise Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjectProgress.map((subject, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{subject.subject}</span>
                      <span className="text-sm text-gray-600">
                        {subject.correct}/{subject.total} correct • {subject.marks?.toFixed(2)} marks
                      </span>
                    </div>
                    <Progress 
                      value={((subject.correct || 0) / subject.total) * 100} 
                      className="h-2" 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button onClick={() => window.location.reload()} className="flex-1" variant="outline">
              Take New Test
            </Button>
            <Button onClick={() => router.push('/dashboard')} className="flex-1 bg-[#4DB748]">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Test in Progress - Display all questions
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - All Questions */}
          <div className="lg:col-span-3 space-y-4">
            {/* Timer */}
            <MockTestTimer
              startTime={testStartTime}
              duration={testRules.duration}
              onTimeUp={handleTimeUp}
            />

            {/* All Questions */}
            <div className="space-y-6">
              {questions.map((question, index) => {
                const questionAnswer = answers[question.id]
                const isQuestionMarked = markedForReview.includes(question.id)

                return (
                  <Card key={question.id} id={`question-${index}`} className="scroll-mt-6">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-lg px-4 py-1">
                            Question {index + 1} of {questions.length}
                          </Badge>
                          <Badge variant="secondary">{question.subject}</Badge>
                          {questionAnswer && (
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Answered
                            </Badge>
                          )}
                          {isQuestionMarked && (
                            <Badge className="bg-blue-100 text-blue-700">
                              <Bookmark className="h-3 w-3 mr-1" />
                              Marked
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant={isQuestionMarked ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            if (isQuestionMarked) {
                              setMarkedForReview(prev => prev.filter(id => id !== question.id))
                            } else {
                              setMarkedForReview(prev => [...prev, question.id])
                            }
                          }}
                          className={isQuestionMarked ? 'bg-blue-500' : ''}
                        >
                          <Bookmark className="h-4 w-4 mr-2" />
                          {isQuestionMarked ? 'Marked' : 'Mark'}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="text-lg font-medium mb-6">{question.question_text}</h3>

                      <RadioGroup
                        value={questionAnswer ? String(questionAnswer) : ''}
                        onValueChange={(val) => {
                          const optionNum = parseInt(val)
                          setAnswers(prev => ({ ...prev, [question.id]: optionNum }))
                        }}
                      >
                        <div className="space-y-3">
                          {[1, 2, 3, 4].map((optionNum) => {
                            const optionKey = `option_${optionNum}` as keyof MCQQuestion
                            const optionText = question[optionKey] as string
                            if (!optionText) return null

                            const isSelected = questionAnswer === optionNum
                            const optionLetter = String.fromCharCode(64 + optionNum) // 1=A, 2=B, 3=C, 4=D

                            return (
                              <div
                                key={optionNum}
                                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'border-[#4DB748] bg-green-50'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                                onClick={() => setAnswers(prev => ({ ...prev, [question.id]: optionNum }))}
                              >
                                <RadioGroupItem value={String(optionNum)} id={`q${index}-option-${optionNum}`} />
                                <Label
                                  htmlFor={`q${index}-option-${optionNum}`}
                                  className="flex-1 cursor-pointer text-base"
                                >
                                  <span className="font-semibold mr-3">{optionLetter}.</span>
                                  {optionText}
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

          {/* Sidebar - Fixed Question Navigator & Submit */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Question Navigator */}
              <QuestionNavigator
                totalQuestions={questions.length}
                answers={answers}
                markedForReview={markedForReview}
                currentIndex={currentQuestionIndex}
                questionIds={questions.map(q => q.id)}
                onNavigate={handleNavigate}
              />

              {/* Submit Button */}
              <Button
                variant="destructive"
                onClick={() => setShowSubmitDialog(true)}
                className="w-full py-6 text-lg font-semibold"
                size="lg"
              >
                <Send className="h-5 w-5 mr-2" />
                Submit Test
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Mock Test?</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit the test? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 my-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span>Total Questions:</span>
              <span className="font-bold">{questions.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded">
              <span>Answered:</span>
              <span className="font-bold text-green-700">{Object.keys(answers).length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded">
              <span>Unanswered:</span>
              <span className="font-bold text-red-700">{questions.length - Object.keys(answers).length}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleSubmitTest(false)} className="bg-[#4DB748]">
              Submit Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
