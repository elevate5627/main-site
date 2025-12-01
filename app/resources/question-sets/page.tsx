'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { FileText, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QuestionSet {
  id: string
  institution_type: string
  program: string
  subject: string
  year: number | null
  marks: number | null
  question_text: string
  question_number: number | null
  section: string | null
  difficulty: string | null
  topic: string | null
  created_at: string
}

export default function QuestionSetsPage() {
  const [supabase] = useState(() => createClient())
  const [questions, setQuestions] = useState<QuestionSet[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    institution: 'all',
    subject: 'all',
    year: 'all',
    difficulty: 'all',
    searchQuery: ''
  })

  const [subjects, setSubjects] = useState<string[]>([])
  const [years, setYears] = useState<number[]>([])

  useEffect(() => {
    fetchQuestions()
  }, [filters])

  const fetchQuestions = async () => {
    setLoading(true)

    try {
      let query = supabase
        .from('question_sets')
        .select('*')
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.institution !== 'all') {
        query = query.eq('institution_type', filters.institution)
      }
      if (filters.subject !== 'all') {
        query = query.eq('subject', filters.subject)
      }
      if (filters.year !== 'all') {
        query = query.eq('year', parseInt(filters.year))
      }
      if (filters.difficulty !== 'all') {
        query = query.eq('difficulty', filters.difficulty)
      }
      if (filters.searchQuery) {
        query = query.ilike('question_text', `%${filters.searchQuery}%`)
      }

      const { data, error } = await query.limit(100)

      if (error) {
        console.error('Error fetching questions:', error)
      } else {
        setQuestions(data || [])
        
        // Extract unique subjects and years for filters
        if (data) {
          const uniqueSubjects = Array.from(new Set(data.map(q => q.subject).filter(Boolean)))
          const uniqueYears = Array.from(new Set(data.map(q => q.year).filter(Boolean))).sort((a, b) => b - a)
          setSubjects(uniqueSubjects as string[])
          setYears(uniqueYears as number[])
        }
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    setFilters({
      institution: 'all',
      subject: 'all',
      year: 'all',
      difficulty: 'all',
      searchQuery: ''
    })
  }

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'hard':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Question Sets</h1>
          <p className="text-gray-600">Browse IOE Engineering and IOM MBBS question papers</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="search">Search Questions</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by question text..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Institution Type */}
              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Select
                  value={filters.institution}
                  onValueChange={(value) => setFilters({ ...filters, institution: value })}
                >
                  <SelectTrigger id="institution">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="IOE">IOE</SelectItem>
                    <SelectItem value="IOM">IOM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select
                  value={filters.subject}
                  onValueChange={(value) => setFilters({ ...filters, subject: value })}
                >
                  <SelectTrigger id="subject">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Year */}
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select
                  value={filters.year}
                  onValueChange={(value) => setFilters({ ...filters, year: value })}
                >
                  <SelectTrigger id="year">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {loading ? 'Loading...' : `Found ${questions.length} question${questions.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-4 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </CardContent>
              </Card>
            ))
          ) : questions.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
                  <p className="text-gray-600">Try adjusting your filters or upload some question sets</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            questions.map((question) => (
              <Card key={question.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="font-semibold">
                          {question.institution_type}
                        </Badge>
                        <Badge variant="secondary">
                          {question.subject}
                        </Badge>
                        {question.year && (
                          <Badge variant="secondary">
                            {question.year}
                          </Badge>
                        )}
                        {question.difficulty && (
                          <Badge className={getDifficultyColor(question.difficulty)}>
                            {question.difficulty}
                          </Badge>
                        )}
                      </div>
                      
                      {question.question_number && (
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Question {question.question_number}
                          {question.section && ` (Section ${question.section})`}
                        </p>
                      )}
                      
                      <p className="text-gray-900 mb-2">
                        {question.question_text}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {question.marks && (
                          <span className="font-medium">Marks: {question.marks}</span>
                        )}
                        {question.topic && (
                          <span>Topic: {question.topic}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
