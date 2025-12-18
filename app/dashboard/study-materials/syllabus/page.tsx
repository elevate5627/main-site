'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import { ClipboardList, Download, Eye, Calendar, Search, BookOpen, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'

// TODO: Integrate real syllabus data from database
const MOCK_SYLLABUS: any[] = []

export default function SyllabusPage() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [semesterFilter, setSemesterFilter] = useState<number | 'all'>('all')

  useEffect(() => {
    const getUser = async () => {
      // Skip authentication in development mode
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

  const filteredSyllabus = MOCK_SYLLABUS.filter(syl => {
    const matchesSearch = syl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         syl.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSemester = semesterFilter === 'all' || syl.semester === semesterFilter
    return matchesSearch && matchesSemester
  })

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
                placeholder="Search syllabus by subject or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Semester Filter */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Semester:</span>
            <Button
              variant={semesterFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSemesterFilter('all')}
              className={semesterFilter === 'all' ? 'bg-[#4DB748] hover:bg-[#45a63f]' : ''}
            >
              All
            </Button>
            {[3, 4, 5, 6].map(sem => (
              <Button
                key={sem}
                variant={semesterFilter === sem ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSemesterFilter(sem)}
                className={semesterFilter === sem ? 'bg-[#4DB748] hover:bg-[#45a63f]' : ''}
              >
                Sem {sem}
              </Button>
            ))}
          </div>
        </div>

        {/* Syllabus Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSyllabus.map((syl) => {
            const completedUnits = syl.coverage.filter(c => c.completed).length
            const completionPercentage = (completedUnits / syl.coverage.length) * 100

            return (
              <Card key={syl.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        Semester {syl.semester}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {syl.academicYear}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-[#4DB748]">
                        {completedUnits}/{syl.units} Units
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{syl.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {syl.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Course Progress</span>
                        <span className="font-medium">{Math.round(completionPercentage)}%</span>
                      </div>
                      <Progress value={completionPercentage} className="h-2" />
                    </div>

                    {/* Units List */}
                    <div className="space-y-2">
                      {syl.coverage.map((unit, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm">
                          {unit.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                          )}
                          <span className={unit.completed ? 'text-gray-900' : 'text-gray-500'}>
                            {unit.unit}: {unit.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                      <div className="text-xs text-gray-500">
                        <div className="flex items-center">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {syl.topics} topics
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        <div className="flex items-center">
                          <Download className="h-3 w-3 mr-1" />
                          {syl.downloads.toLocaleString()} downloads
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {syl.size}
                      </div>
                      <div className="text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1 inline" />
                        {new Date(syl.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2">
                      <Button 
                        className="w-full bg-[#4DB748] hover:bg-[#45a63f]"
                        size="sm"
                        onClick={() => alert('View syllabus functionality')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Syllabus
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredSyllabus.length === 0 && (
          <div className="text-center py-12">
            <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No syllabus found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
