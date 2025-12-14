'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, AlertCircle } from 'lucide-react'
import { formatTime } from '@/lib/mock-test-rules'

interface MockTestTimerProps {
  startTime: string
  duration: number // in minutes
  onTimeUp: () => void
}

export function MockTestTimer({ startTime, duration, onTimeUp }: MockTestTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(duration * 60)
  const [warning, setWarning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const start = new Date(startTime).getTime()
      const now = new Date().getTime()
      const elapsed = Math.floor((now - start) / 1000)
      const remaining = Math.max(0, (duration * 60) - elapsed)

      setTimeLeft(remaining)

      // Warning when 10 minutes left
      if (remaining <= 600 && remaining > 0) {
        setWarning(true)
      }

      // Time's up
      if (remaining === 0) {
        clearInterval(interval)
        onTimeUp()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime, duration, onTimeUp])

  const minutes = Math.floor(timeLeft / 60)
  const isLowTime = minutes < 10

  return (
    <Card className={`sticky top-20 ${warning ? 'border-2 border-red-500 animate-pulse' : ''}`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className={`h-5 w-5 ${isLowTime ? 'text-red-600' : 'text-[#4DB748]'}`} />
            <span className="text-sm font-medium text-gray-700">Time Remaining</span>
          </div>
          <Badge 
            variant={isLowTime ? 'destructive' : 'default'} 
            className={`text-lg font-mono px-4 py-1 ${!isLowTime && 'bg-[#4DB748]'}`}
          >
            {formatTime(timeLeft)}
          </Badge>
        </div>
        {warning && (
          <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>Less than {minutes} minute{minutes !== 1 ? 's' : ''} remaining!</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
