'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useUserProfile } from '@/hooks/use-user-profile'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Brain, CheckCircle2, XCircle, Clock, Trophy } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'

interface Question {
  id: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: string
  explanation?: string
}

interface QOTDData {
  id: string
  date: string
  faculty: string
  subject_name: string
  question_ids: string[]
  questions?: Question[]
}

export function QuestionOfTheDay() {
  const [open, setOpen] = useState(false)
  const [qotdData, setQotdData] = useState<QOTDData | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [submitted, setSubmitted] = useState(false)
  const [hasAttempted, setHasAttempted] = useState(false)
  const [loading, setLoading] = useState(true)
  const { profile } = useUserProfile()
  const supabase = createClient()

  useEffect(() => {
    fetchQOTD()
  }, [profile])

  const fetchQOTD = async () => {
    try {
      setLoading(true)
      if (!profile?.faculty) return

      const today = new Date().toISOString().split('T')[0]

      // Check if user has already attempted today
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: attempt } = await supabase
          .from('user_qotd_attempts')
          .select('id')
          .eq('user_id', user.id)
          .gte('completed_at', `${today}T00:00:00`)
          .single()

        if (attempt) {
          setHasAttempted(true)
          setLoading(false)
          return
        }
      }

      // Fetch today's QOTD
      const { data: qotd, error } = await supabase
        .from('question_of_the_day')
        .select('*')
        .eq('date', today)
        .eq('faculty', profile.faculty)
        .single()

      if (error || !qotd) {
        // No QOTD for today yet
        setLoading(false)
        return
      }

      // Fetch the actual questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('mcq_questions')
        .select('*')
        .in('id', qotd.question_ids)

      if (questionsError || !questionsData) {
        console.error('Error fetching questions:', questionsError)
        setLoading(false)
        return
      }

      setQotdData(qotd)
      setQuestions(questionsData)
      setLoading(false)
      
      // Auto-open popup if not attempted
      if (!hasAttempted && questionsData.length > 0) {
        setTimeout(() => setOpen(true), 2000) // Show after 2 seconds
      }
    } catch (error) {
      console.error('Error fetching QOTD:', error)
      setLoading(false)
    }
  }

  const handleAnswerSelect = (value: string) => {
    setAnswers({ ...answers, [currentIndex]: value })
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleSubmit = async () => {
    setSubmitted(true)

    // Calculate score
    let correct = 0
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct_answer) {
        correct++
      }
    })

    const score = (correct / questions.length) * 100

    // Save attempt to database
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user && qotdData) {
        await supabase.from('user_qotd_attempts').insert({
          user_id: user.id,
          qotd_id: qotdData.id,
          score,
          correct_answers: correct
        })

        // Create notification for achievement
        if (score === 100) {
          await supabase.from('notifications').insert({
            user_id: user.id,
            title: 'Perfect Score! 🎉',
            message: `You got all 5 questions correct in today's challenge!`,
            type: 'achievement',
            icon_type: 'trophy'
          })
        }
      }
    } catch (error) {
      console.error('Error saving QOTD attempt:', error)
    }
  }

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100

  if (loading || !profile || hasAttempted || questions.length === 0) {
    return null
  }

  const correctCount = Object.keys(answers).filter(
    (key) => answers[parseInt(key)] === questions[parseInt(key)]?.correct_answer
  ).length

  return (
    <>
      {/* Trigger Card */}
      <Card 
        className="cursor-pointer hover:shadow-lg transition-all border-2 border-[#4DB748] bg-gradient-to-br from-green-50 to-blue-50"
        onClick={() => setOpen(true)}
      >
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-[#4DB748] flex items-center justify-center flex-shrink-0">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                5 Important Questions of the Day
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Based on your activity in {qotdData?.subject_name || 'your subjects'}
              </p>
              <p className="text-xs text-[#4DB748] font-medium">
                Click to start challenge →
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <Trophy className="mr-2 h-6 w-6 text-[#4DB748]" />
              Daily Challenge - {qotdData?.subject_name}
            </DialogTitle>
            <DialogDescription>
              Test your knowledge with 5 carefully selected questions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Object.keys(answers).length} answered
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Question Card */}
            {currentQuestion && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-lg font-medium">{currentQuestion.question_text}</p>

                    <RadioGroup
                      value={answers[currentIndex] || ''}
                      onValueChange={handleAnswerSelect}
                      disabled={submitted}
                    >
                      {['a', 'b', 'c', 'd'].map((option) => {
                        const optionKey = `option_${option}` as keyof Question
                        const isCorrect = option === currentQuestion.correct_answer
                        const isSelected = answers[currentIndex] === option
                        const showResult = submitted

                        return (
                          <div
                            key={option}
                            className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                              showResult && isCorrect
                                ? 'border-green-500 bg-green-50'
                                : showResult && isSelected && !isCorrect
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <RadioGroupItem value={option} id={`q${currentIndex}-${option}`} />
                            <Label
                              htmlFor={`q${currentIndex}-${option}`}
                              className="flex-1 cursor-pointer"
                            >
                              {currentQuestion[optionKey] as string}
                            </Label>
                            {showResult && isCorrect && (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            )}
                            {showResult && isSelected && !isCorrect && (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                        )
                      })}
                    </RadioGroup>

                    {/* Explanation after submission */}
                    {submitted && currentQuestion.explanation && (
                      <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                        <p className="text-sm font-medium text-blue-900 mb-1">Explanation:</p>
                        <p className="text-sm text-blue-800">{currentQuestion.explanation}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Summary */}
            {submitted && (
              <Card className="bg-gradient-to-r from-green-50 to-blue-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Trophy className="h-12 w-12 text-[#4DB748] mx-auto mb-3" />
                    <h3 className="text-2xl font-bold mb-2">
                      Challenge Complete!
                    </h3>
                    <p className="text-lg mb-4">
                      You scored {correctCount} out of {questions.length}
                    </p>
                    <p className="text-4xl font-bold text-[#4DB748]">
                      {Math.round((correctCount / questions.length) * 100)}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentIndex === 0 || submitted}
              >
                Previous
              </Button>

              <div className="flex gap-2">
                {!submitted ? (
                  <>
                    {currentIndex < questions.length - 1 ? (
                      <Button
                        onClick={handleNext}
                        className="bg-[#4DB748] hover:bg-[#45a63f]"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        className="bg-[#4DB748] hover:bg-[#45a63f]"
                        disabled={Object.keys(answers).length !== questions.length}
                      >
                        Submit Challenge
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    {currentIndex < questions.length - 1 ? (
                      <Button
                        onClick={handleNext}
                        className="bg-[#4DB748] hover:bg-[#45a63f]"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setOpen(false)}
                        className="bg-[#4DB748] hover:bg-[#45a63f]"
                      >
                        Close
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
