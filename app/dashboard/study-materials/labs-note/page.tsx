'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import { FlaskConical, Download, Star, Eye, Calendar, Search, Code, FileCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

// TODO: Integrate real lab notes data from database
const MOCK_LAB_NOTES: any[] = []

export default function LabsNotePage() {
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

  const filteredLabs = MOCK_LAB_NOTES.filter(lab => {
    const matchesSearch = lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lab.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lab.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesSemester = semesterFilter === 'all' || lab.semester === semesterFilter
    return matchesSearch && matchesSemester
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-orange-100 text-orange-800'
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
                placeholder="Search lab notes by title, topic, or language..."
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
            {[3, 4, 5].map(sem => (
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

        {/* Lab Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLabs.map((lab) => (
            <Card key={lab.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      Semester {lab.semester}
                    </Badge>
                    <Badge className={getDifficultyColor(lab.difficulty)}>
                      {lab.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{lab.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-lg">{lab.title}</CardTitle>
                <CardDescription className="text-sm flex items-center space-x-2">
                  <Code className="h-3 w-3" />
                  <span>{lab.language}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {lab.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {lab.topics.slice(0, 3).map((topic, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {lab.topics.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{lab.topics.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <FlaskConical className="h-3 w-3 mr-1" />
                      {lab.experiments} experiments
                    </div>
                    <div>{lab.size}</div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Download className="h-3 w-3 mr-1" />
                      {lab.downloads.toLocaleString()} downloads
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {lab.views.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <FileCode className="h-3 w-3 mr-1" />
                      {lab.format}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(lab.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>

                <div>
                  <Button 
                    className="w-full bg-[#4DB748] hover:bg-[#45a63f]"
                    size="sm"
                    onClick={() => alert('View lab manual functionality')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Lab Manual
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLabs.length === 0 && (
          <div className="text-center py-12">
            <FlaskConical className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lab notes found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
