'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import { Database, BookOpen, Calendar, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

// MOCK DATA - Remove when real data is integrated
const MOCK_QUESTION_BANKS = [
  {
    id: 1,
    title: 'JEE Previous Year Questions 2023',
    description: 'Complete question bank from JEE Main and Advanced 2023',
    year: 2023,
    exam: 'JEE',
    totalQuestions: 270,
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    difficulty: 'Hard',
    downloads: 1250
  },
  {
    id: 2,
    title: 'NEET Previous Year Questions 2023',
    description: 'All questions from NEET 2023 examination',
    year: 2023,
    exam: 'NEET',
    totalQuestions: 200,
    subjects: ['Physics', 'Chemistry', 'Biology'],
    difficulty: 'Hard',
    downloads: 980
  },
  {
    id: 3,
    title: 'JEE Main 2022 Question Bank',
    description: 'Complete collection of JEE Main 2022 questions with solutions',
    year: 2022,
    exam: 'JEE',
    totalQuestions: 300,
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    difficulty: 'Hard',
    downloads: 2100
  },
  {
    id: 4,
    title: 'NEET 2022 Question Bank',
    description: 'Full question bank from NEET 2022 with detailed explanations',
    year: 2022,
    exam: 'NEET',
    totalQuestions: 200,
    subjects: ['Physics', 'Chemistry', 'Biology'],
    difficulty: 'Hard',
    downloads: 1800
  },
  {
    id: 5,
    title: 'JEE Advanced 2021',
    description: 'Challenging questions from JEE Advanced 2021',
    year: 2021,
    exam: 'JEE',
    totalQuestions: 180,
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    difficulty: 'Expert',
    downloads: 1500
  },
  {
    id: 6,
    title: 'NEET 2021 Complete Bank',
    description: 'All NEET 2021 questions with answer keys',
    year: 2021,
    exam: 'NEET',
    totalQuestions: 200,
    subjects: ['Physics', 'Chemistry', 'Biology'],
    difficulty: 'Hard',
    downloads: 1650
  }
]

export default function QuestionBankPage() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedExam, setSelectedExam] = useState<'all' | 'JEE' | 'NEET'>('all')

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

  const filteredBanks = MOCK_QUESTION_BANKS.filter(bank => {
    const matchesSearch = bank.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bank.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesExam = selectedExam === 'all' || bank.exam === selectedExam
    return matchesSearch && matchesExam
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
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search question banks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center space-x-4">
            <Button
              variant={selectedExam === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedExam('all')}
              className={selectedExam === 'all' ? 'bg-[#4DB748] hover:bg-[#45a63f]' : ''}
            >
              All
            </Button>
            <Button
              variant={selectedExam === 'JEE' ? 'default' : 'outline'}
              onClick={() => setSelectedExam('JEE')}
              className={selectedExam === 'JEE' ? 'bg-[#4DB748] hover:bg-[#45a63f]' : ''}
            >
              JEE
            </Button>
            <Button
              variant={selectedExam === 'NEET' ? 'default' : 'outline'}
              onClick={() => setSelectedExam('NEET')}
              className={selectedExam === 'NEET' ? 'bg-[#4DB748] hover:bg-[#45a63f]' : ''}
            >
              NEET
            </Button>
          </div>
        </div>

        {/* Question Banks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBanks.map((bank) => (
            <Card key={bank.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="font-semibold">
                        {bank.exam}
                      </Badge>
                      <Badge variant="outline">{bank.year}</Badge>
                      <Badge className={getDifficultyColor(bank.difficulty)}>
                        {bank.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mb-2">{bank.title}</CardTitle>
                    <CardDescription>{bank.description}</CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {bank.subjects.map((subject, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{bank.totalQuestions} Questions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{bank.downloads.toLocaleString()} downloads</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      className="flex-1 bg-[#4DB748] hover:bg-[#45a63f]"
                      onClick={() => alert('Question bank practice will start here')}
                    >
                      Start Practice
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => alert('Download question bank')}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBanks.length === 0 && (
          <div className="text-center py-12">
            <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No question banks found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
