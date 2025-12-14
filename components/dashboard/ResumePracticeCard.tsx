'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlayCircle, BookOpen, Brain, FileText, RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Progress } from '@/components/ui/progress'

interface LastActivity {
  activity_type: string
  subject_name?: string
  set_name?: string
  progress_percentage: number
  last_question_index?: number
  total_questions?: number
  url: string
  updated_at: string
}

export function ResumePracticeCard() {
  const [lastActivity, setLastActivity] = useState<LastActivity | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchLastActivity()
  }, [])

  const fetchLastActivity = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('user_last_activity')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!error && data) {
        setLastActivity(data)
      }
    } catch (error) {
      console.error('Error fetching last activity:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResume = () => {
    if (lastActivity?.url) {
      router.push(lastActivity.url)
    }
  }

  const getActivityIcon = () => {
    if (!lastActivity) return Brain

    switch (lastActivity.activity_type) {
      case 'practice':
        return Brain
      case 'mock-test':
        return FileText
      case 'study-material':
        return BookOpen
      default:
        return Brain
    }
  }

  const getActivityTitle = () => {
    if (!lastActivity) return 'Start Your Practice'

    switch (lastActivity.activity_type) {
      case 'practice':
        return 'Continue Practice'
      case 'mock-test':
        return 'Resume Mock Test'
      case 'study-material':
        return 'Continue Reading'
      default:
        return 'Continue Learning'
    }
  }

  const getActivityDescription = () => {
    if (!lastActivity) {
      return 'Begin your learning journey with MCQ practice or study materials'
    }

    const parts = []
    if (lastActivity.subject_name) parts.push(lastActivity.subject_name)
    if (lastActivity.set_name) parts.push(lastActivity.set_name)
    
    if (lastActivity.total_questions && lastActivity.last_question_index !== undefined) {
      parts.push(`Question ${lastActivity.last_question_index + 1} of ${lastActivity.total_questions}`)
    }

    return parts.join(' • ')
  }

  const Icon = getActivityIcon()

  if (loading) {
    return null
  }

  return (
    <Card className="hover:shadow-lg transition-all border-2 border-[#4DB748]">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon className="mr-2 h-5 w-5 text-[#4DB748]" />
          {getActivityTitle()}
        </CardTitle>
        <CardDescription>
          {getActivityDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lastActivity && lastActivity.progress_percentage > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(lastActivity.progress_percentage)}%
                </span>
              </div>
              <Progress value={lastActivity.progress_percentage} className="h-2" />
            </div>
          )}

          {lastActivity ? (
            <div className="flex gap-3">
              <Button
                onClick={handleResume}
                className="flex-1 bg-[#4DB748] hover:bg-[#45a63f] text-white"
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Resume
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/mcq-preparation')}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => router.push('/dashboard/mcq-preparation/practice-set')}
                className="bg-[#4DB748] hover:bg-[#45a63f] text-white"
              >
                <Brain className="mr-2 h-4 w-4" />
                MCQ Practice
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/study-materials')}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Study Materials
              </Button>
            </div>
          )}

          {lastActivity && (
            <p className="text-xs text-muted-foreground text-center">
              Last active {new Date(lastActivity.updated_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
