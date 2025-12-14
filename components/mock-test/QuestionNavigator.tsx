'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Circle, Bookmark } from 'lucide-react'

interface QuestionNavigatorProps {
  totalQuestions: number
  answers: Record<string, number>
  markedForReview: string[]
  currentIndex: number
  questionIds: string[]
  onNavigate: (index: number) => void
}

export function QuestionNavigator({
  totalQuestions,
  answers,
  markedForReview,
  currentIndex,
  questionIds,
  onNavigate
}: QuestionNavigatorProps) {
  const answeredCount = Object.keys(answers).length
  const markedCount = markedForReview.length
  const unansweredCount = totalQuestions - answeredCount

  return (
    <Card className="sticky top-80">
      <CardHeader>
        <CardTitle className="text-lg">Question Navigator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-semibold">{answeredCount}/{totalQuestions}</span>
          </div>
          <Progress value={(answeredCount / totalQuestions) * 100} className="h-2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-green-50 rounded">
            <p className="text-xl font-bold text-green-700">{answeredCount}</p>
            <p className="text-xs text-green-600">Answered</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-xl font-bold text-gray-700">{unansweredCount}</p>
            <p className="text-xs text-gray-600">Unanswered</p>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded">
            <p className="text-xl font-bold text-blue-700">{markedCount}</p>
            <p className="text-xs text-blue-600">Marked</p>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-green-500 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-gray-700">Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center">
              <Circle className="h-5 w-5 text-gray-600" />
            </div>
            <span className="text-gray-700">Not Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center">
              <Bookmark className="h-5 w-5 text-white" />
            </div>
            <span className="text-gray-700">Marked for Review</span>
          </div>
        </div>

        {/* Question Grid */}
        <div className="border-t pt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Questions</p>
          <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto">
            {questionIds.map((qId, index) => {
              const isAnswered = !!answers[qId]
              const isMarked = markedForReview.includes(qId)
              const isCurrent = index === currentIndex

              return (
                <Button
                  key={qId}
                  onClick={() => onNavigate(index)}
                  variant="outline"
                  size="sm"
                  className={`
                    h-10 w-full p-0 relative
                    ${isCurrent ? 'ring-2 ring-[#4DB748] ring-offset-2' : ''}
                    ${isAnswered ? 'bg-green-500 text-white hover:bg-green-600' : ''}
                    ${isMarked && !isAnswered ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                    ${!isAnswered && !isMarked ? 'bg-gray-100 hover:bg-gray-200' : ''}
                  `}
                >
                  {index + 1}
                  {isMarked && (
                    <Bookmark className="absolute top-0 right-0 h-3 w-3" />
                  )}
                </Button>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
