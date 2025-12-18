'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import { FileText, Eye, Calendar, Search, BookOpen, Filter as FilterIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

interface StudyMaterial {
  id: string
  title: string
  description: string
  subject: string
  semester: number
  type: string
  file_url: string
  file_path: string
  file_size: number
  file_format: string
  topics: string[]
  difficulty: string | null
  downloads: number
  views: number
  rating: number
  created_at: string
  updated_at: string
}

export default function NotesPage() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [semesterFilter, setSemesterFilter] = useState<number | 'all'>('all')
  const [notes, setNotes] = useState<StudyMaterial[]>([])

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

  useEffect(() => {
    const fetchNotes = async () => {
      const { data, error } = await supabase
        .from('study_materials')
        .select('*')
        .eq('type', 'notes')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching notes:', error)
      } else {
        setNotes(data || [])
      }
    }

    if (user) {
      fetchNotes()
    }
  }, [user, supabase])

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (note.topics && note.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase())))
    const matchesSemester = semesterFilter === 'all' || note.semester === semesterFilter
    const matchesSubject = subjectFilter === 'all' || note.subject === subjectFilter
    return matchesSearch && matchesSemester && matchesSubject
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const handleView = async (note: StudyMaterial) => {
    // Increment view count
    await supabase
      .from('study_materials')
      .update({ views: note.views + 1 })
      .eq('id', note.id)

    // Open file in new tab
    window.open(note.file_url, '_blank')
  }

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

  const uniqueSemesters = [...new Set(notes.map(n => n.semester))].sort()
  const uniqueSubjects = [...new Set(notes.map(n => n.subject))].sort()
  const [subjectFilter, setSubjectFilter] = useState<string>('all')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-[#4DB748] rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Study Notes</h1>
              <p className="text-gray-600">Access your course materials and study resources</p>
            </div>
          </div>
          
          {/* Stats Bar */}
          {notes.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-[#4DB748]">{notes.length}</div>
                <div className="text-xs text-gray-600">Total Notes</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">{uniqueSemesters.length}</div>
                <div className="text-xs text-gray-600">Semesters</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-purple-600">{uniqueSubjects.length}</div>
                <div className="text-xs text-gray-600">Subjects</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-orange-600">
                  {notes.reduce((sum, n) => sum + n.views, 0).toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Total Views</div>
              </div>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by title, subject, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-10 py-6 text-base border-gray-300 focus:border-[#4DB748] focus:ring-[#4DB748]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Semester Filter */}
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-700 mb-2 block flex items-center">
                  <FilterIcon className="h-3 w-3 mr-1" />
                  SEMESTER
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={semesterFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSemesterFilter('all')}
                    className={semesterFilter === 'all' ? 'bg-[#4DB748] hover:bg-[#45a63f]' : 'hover:border-[#4DB748] hover:text-[#4DB748]'}
                  >
                    All
                  </Button>
                  {uniqueSemesters.map(sem => (
                    <Button
                      key={sem}
                      variant={semesterFilter === sem ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSemesterFilter(sem)}
                      className={semesterFilter === sem ? 'bg-[#4DB748] hover:bg-[#45a63f]' : 'hover:border-[#4DB748] hover:text-[#4DB748]'}
                    >
                      Semester {sem}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Subject Filter */}
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-700 mb-2 block flex items-center">
                  <FilterIcon className="h-3 w-3 mr-1" />
                  SUBJECT
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={subjectFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSubjectFilter('all')}
                    className={subjectFilter === 'all' ? 'bg-[#4DB748] hover:bg-[#45a63f]' : 'hover:border-[#4DB748] hover:text-[#4DB748]'}
                  >
                    All
                  </Button>
                  {uniqueSubjects.slice(0, 4).map(subject => (
                    <Button
                      key={subject}
                      variant={subjectFilter === subject ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSubjectFilter(subject)}
                      className={subjectFilter === subject ? 'bg-[#4DB748] hover:bg-[#45a63f]' : 'hover:border-[#4DB748] hover:text-[#4DB748]'}
                    >
                      {subject.split(' ')[0]}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchQuery || semesterFilter !== 'all' || subjectFilter !== 'all') && (
              <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                <span className="text-xs text-gray-600">Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="text-xs">
                    Search: {searchQuery}
                    <button onClick={() => setSearchQuery('')} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {semesterFilter !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    Semester {semesterFilter}
                    <button onClick={() => setSemesterFilter('all')} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {subjectFilter !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    {subjectFilter}
                    <button onClick={() => setSubjectFilter('all')} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results Header */}
        {filteredNotes.length > 0 && (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredNotes.length}</span> {filteredNotes.length === 1 ? 'note' : 'notes'}
            </p>
          </div>
        )}

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="group hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-[#4DB748] bg-white overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="outline" className="text-xs font-semibold border-[#4DB748] text-[#4DB748]">
                    Semester {note.semester}
                  </Badge>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Eye className="h-3 w-3" />
                    <span>{note.views.toLocaleString()}</span>
                  </div>
                </div>
                <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-[#4DB748] transition-colors line-clamp-2">
                  {note.title}
                </CardTitle>
                <CardDescription className="text-sm font-medium text-gray-600">
                  {note.subject}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                  {note.description}
                </p>

                {/* Meta Info */}
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center text-gray-500">
                      <FileText className="h-3.5 w-3.5 mr-1.5" />
                      <span className="font-medium">{note.file_format || 'PDF'}</span>
                    </div>
                    <span className="text-gray-600 font-semibold">{formatFileSize(note.file_size)}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    <span>Added {new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* View Button */}
                <Button 
                  className="w-full bg-[#4DB748] hover:bg-[#45a63f] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 group-hover:scale-105"
                  onClick={() => handleView(note)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Open & Study
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredNotes.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <FileText className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No notes found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || semesterFilter !== 'all' || subjectFilter !== 'all'
                  ? "We couldn't find any notes matching your filters. Try adjusting your search criteria."
                  : "No study notes available yet. Check back later!"}
              </p>
              {(searchQuery || semesterFilter !== 'all' || subjectFilter !== 'all') && (
                <Button 
                  onClick={() => {
                    setSearchQuery('')
                    setSemesterFilter('all')
                    setSubjectFilter('all')
                  }}
                  variant="outline"
                  className="border-[#4DB748] text-[#4DB748] hover:bg-[#4DB748] hover:text-white"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
