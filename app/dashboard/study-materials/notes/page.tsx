'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import { FileText, Eye, Calendar, Search, BookOpen, Sparkles, X } from 'lucide-react'
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

interface SubjectGroup {
  subject: string
  count: number
  totalViews: number
  semester: number
  notes: StudyMaterial[]
  icon: string
  color: string
}

export default function NotesPage() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [semesterFilter, setSemesterFilter] = useState<number | 'all'>('all')
  const [notes, setNotes] = useState<StudyMaterial[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'subjects' | 'notes'>('subjects')

  useEffect(() => {
    const getUser = async () => {
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
    const matchesSubject = !selectedSubject || note.subject === selectedSubject
    return matchesSearch && matchesSemester && matchesSubject
  })

  const subjectGroups: SubjectGroup[] = Object.values(
    filteredNotes.reduce((acc, note) => {
      if (!acc[note.subject]) {
        acc[note.subject] = {
          subject: note.subject,
          count: 0,
          totalViews: 0,
          semester: note.semester,
          notes: [],
          icon: getSubjectIcon(note.subject),
          color: getSubjectColor(note.subject)
        }
      }
      acc[note.subject].count++
      acc[note.subject].totalViews += note.views
      acc[note.subject].notes.push(note)
      return acc
    }, {} as Record<string, SubjectGroup>)
  )

  function getSubjectIcon(subject: string): string {
    const iconMap: Record<string, string> = {
      'Computer Engineering': '💻',
      'Computer Science': '🖥️',
      'Civil Engineering': '🏗️',
      'Mechanical Engineering': '⚙️',
      'Electrical Engineering': '⚡',
      'Mathematics': '📐',
      'Physics': '⚛️',
      'Chemistry': '🧪',
      'Biology': '🧬'
    }
    return iconMap[subject] || '📚'
  }

  function getSubjectColor(subject: string): string {
    const colorMap: Record<string, string> = {
      'Computer Engineering': 'from-blue-500 to-cyan-500',
      'Computer Science': 'from-purple-500 to-pink-500',
      'Civil Engineering': 'from-orange-500 to-red-500',
      'Mechanical Engineering': 'from-gray-600 to-gray-800',
      'Electrical Engineering': 'from-yellow-500 to-orange-500',
      'Mathematics': 'from-green-500 to-emerald-500',
      'Physics': 'from-indigo-500 to-blue-500',
      'Chemistry': 'from-teal-500 to-cyan-500',
      'Biology': 'from-lime-500 to-green-500'
    }
    return colorMap[subject] || 'from-[#4DB748] to-[#45a63f]'
  }

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject)
    setViewMode('notes')
  }

  const handleBackToSubjects = () => {
    setSelectedSubject(null)
    setViewMode('subjects')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const handleView = async (note: StudyMaterial) => {
    await supabase
      .from('study_materials')
      .update({ views: note.views + 1 })
      .eq('id', note.id)

    window.open(note.file_url, '_blank')
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Hard': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-green-50/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#4DB748] mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading notes...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-[#4DB748] to-[#45a63f] rounded-xl shadow-lg">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {viewMode === 'subjects' ? 'Study Notes' : selectedSubject}
                </h1>
                <p className="text-gray-600 mt-1">
                  {viewMode === 'subjects' 
                    ? 'Browse by subject and access your study materials'
                    : `${filteredNotes.length} ${filteredNotes.length === 1 ? 'note' : 'notes'} available`
                  }
                </p>
              </div>
            </div>
            {viewMode === 'notes' && (
              <Button
                onClick={handleBackToSubjects}
                variant="outline"
                className="border-[#4DB748] text-[#4DB748] hover:bg-[#4DB748]/10"
              >
                <X className="h-4 w-4 mr-2" />
                Back to Subjects
              </Button>
            )}
          </div>
        </div>

        {/* Stats Bar - Only show on subjects view */}
        {notes.length > 0 && viewMode === 'subjects' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-[#4DB748] hover:shadow-md transition-shadow bg-gradient-to-br from-white to-green-50/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Notes</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{notes.length}</p>
                  </div>
                  <div className="p-3 bg-[#4DB748]/10 rounded-lg">
                    <FileText className="h-8 w-8 text-[#4DB748]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-blue-50/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Views</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {notes.reduce((sum, n) => sum + n.views, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Eye className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-purple-50/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Subjects</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {subjectGroups.length}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Sparkles className="h-8 w-8 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filter Section */}
        <Card className="shadow-sm border border-gray-100">
          <CardContent className="pt-6 space-y-5">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by title, subject, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base border-gray-200 focus:border-[#4DB748] focus:ring-[#4DB748]"
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

            {/* Semester Filter Pills */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700">Filter by Semester</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={semesterFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSemesterFilter('all')}
                  className={`rounded-full transition-all ${
                    semesterFilter === 'all' 
                      ? 'bg-[#4DB748] hover:bg-[#45a63f] shadow-md' 
                      : 'hover:border-[#4DB748] hover:text-[#4DB748]'
                  }`}
                >
                  All Semesters
                </Button>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <Button
                    key={sem}
                    variant={semesterFilter === sem ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSemesterFilter(sem)}
                    className={`rounded-full transition-all ${
                      semesterFilter === sem 
                        ? 'bg-[#4DB748] hover:bg-[#45a63f] shadow-md' 
                        : 'hover:border-[#4DB748] hover:text-[#4DB748]'
                    }`}
                  >
                    Semester {sem}
                  </Button>
                ))}
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchQuery || semesterFilter !== 'all') && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Active Filters:</p>
                <div className="flex flex-wrap items-center gap-2">
                  {searchQuery && (
                    <Badge variant="secondary" className="gap-1.5 bg-white">
                      <Search className="h-3 w-3" />
                      "{searchQuery}"
                    </Badge>
                  )}
                  {semesterFilter !== 'all' && (
                    <Badge variant="secondary" className="bg-white">
                      Semester {semesterFilter}
                    </Badge>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSemesterFilter('all')
                  }}
                  className="ml-auto text-sm text-[#4DB748] hover:text-[#45a63f] font-medium hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subject Cards View */}
        {viewMode === 'subjects' && subjectGroups.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {subjectGroups.map((group) => (
              <Card
                key={group.subject}
                className="cursor-pointer hover:shadow-lg"
                onClick={() => handleSubjectClick(group.subject)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-5xl">
                      {group.icon}
                    </div>
                    <Badge className="bg-[#4DB748] text-white">
                      Semester {group.semester}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {group.subject}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-[#4DB748]" />
                        <span className="text-xs text-gray-600">Notes</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900">{group.count}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Eye className="h-4 w-4 text-gray-600" />
                        <span className="text-xs text-gray-600">Views</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900">{group.totalViews}</p>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-[#4DB748] hover:bg-[#45a63f] text-white"
                  >
                    View {group.count} {group.count === 1 ? 'Note' : 'Notes'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Notes Grid View */}
        {viewMode === 'notes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes.map((note) => (
            <Card 
              key={note.id} 
              className="hover:shadow-lg"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-[#4DB748] text-white">
                    Semester {note.semester}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Eye className="h-3 w-3" />
                    <span>{note.views}</span>
                  </div>
                </div>
                
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {note.subject}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  {note.title}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                  <span>{note.file_format || 'PDF'} • {formatFileSize(note.file_size)}</span>
                </div>

                <Button 
                  className="w-full bg-[#4DB748] hover:bg-[#45a63f] text-white"
                  onClick={() => handleView(note)}
                >
                  View Note
                </Button>
              </CardContent>
            </Card>
          ))}
          </div>
        )}

        {/* Empty State */}
        {((viewMode === 'subjects' && subjectGroups.length === 0) || 
          (viewMode === 'notes' && filteredNotes.length === 0)) && (
          <Card className="border-2 border-dashed border-gray-200">
            <CardContent className="text-center py-20">
              <div className="max-w-md mx-auto space-y-6">
                <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-full p-8 w-32 h-32 mx-auto flex items-center justify-center shadow-inner">
                  <FileText className="h-16 w-16 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">No notes found</h3>
                  <p className="text-gray-600 text-lg">
                    {searchQuery || semesterFilter !== 'all' 
                      ? "We couldn't find any notes matching your search. Try adjusting your filters."
                      : "No study notes available at the moment. Check back soon!"}
                  </p>
                </div>
                {(searchQuery || semesterFilter !== 'all') && (
                  <Button
                    onClick={() => {
                      setSearchQuery('')
                      setSemesterFilter('all')
                    }}
                    className="bg-[#4DB748] hover:bg-[#45a63f] text-white shadow-lg"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}