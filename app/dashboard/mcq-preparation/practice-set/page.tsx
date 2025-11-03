'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import { ClipboardList, Clock, Play, CheckCircle2, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

// MOCK DATA - Remove when real data is integrated
const MOCK_PRACTICE_SETS = [
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

const MOCK_STATS = {
  totalCompleted: 15,
  currentStreak: 5,
  averageScore: 82,
  totalTime: '12h 30m'
}

export default function PracticeSetPage() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all')

  useEffect(() => {
    const getUser = async () => {
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

  const filteredSets = MOCK_PRACTICE_SETS.filter(set => {
    if (filter === 'completed') return set.completed
    if (filter === 'pending') return !set.completed
    return true
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-orange-100 text-orange-800'
      case 'Expert': return 'bg-red-100 text-red-800'
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

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Completed Sets</p>
                <p className="text-3xl font-bold text-[#4DB748]">{MOCK_STATS.totalCompleted}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Current Streak</p>
                <p className="text-3xl font-bold text-orange-500">{MOCK_STATS.currentStreak} days</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Average Score</p>
                <p className="text-3xl font-bold text-blue-500">{MOCK_STATS.averageScore}%</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Total Time</p>
                <p className="text-3xl font-bold text-purple-500">{MOCK_STATS.totalTime}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex items-center space-x-4">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-[#4DB748] hover:bg-[#45a63f]' : ''}
          >
            All Sets
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
            className={filter === 'pending' ? 'bg-[#4DB748] hover:bg-[#45a63f]' : ''}
          >
            Pending
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
            className={filter === 'completed' ? 'bg-[#4DB748] hover:bg-[#45a63f]' : ''}
          >
            Completed
          </Button>
        </div>

        {/* Practice Sets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSets.map((set) => (
            <Card key={set.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{set.title}</CardTitle>
                    <CardDescription>{set.description}</CardDescription>
                  </div>
                  {set.completed && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge className={getDifficultyColor(set.difficulty)}>
                    {set.difficulty}
                  </Badge>
                  {set.topics.slice(0, 2).map((topic, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {set.topics.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{set.topics.length - 2} more
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <ClipboardList className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{set.totalQuestions} Questions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{set.duration} min</span>
                    </div>
                  </div>

                  {set.completed && set.score !== null && (
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-green-900">
                          Score: {set.score}%
                        </span>
                        <div className="flex items-center text-xs text-gray-600">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(set.date).toLocaleDateString()}
                        </div>
                      </div>
                      <Progress value={set.score} className="h-2" />
                    </div>
                  )}

                  <Button 
                    className="w-full bg-[#4DB748] hover:bg-[#45a63f]"
                    onClick={() => alert('Practice set will start here')}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {set.completed ? 'Practice Again' : 'Start Practice'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSets.length === 0 && (
          <div className="text-center py-12">
            <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No practice sets found</h3>
            <p className="text-gray-600">Try selecting a different filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
