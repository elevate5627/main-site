'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import { FileText, Download, Star, Eye, Calendar, Search, Filter, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'

// MOCK DATA - Remove when real data is integrated
const MOCK_NOTES = [
  {
    id: 1,
    title: 'Data Structures and Algorithms - Complete Notes',
    subject: 'Computer Science',
    semester: 3,
    description: 'Comprehensive notes covering arrays, linked lists, trees, graphs, sorting, and searching algorithms with examples.',
    pages: 85,
    size: '12.5 MB',
    format: 'PDF',
    downloads: 2340,
    views: 5680,
    rating: 4.8,
    lastUpdated: '2024-01-15',
    topics: ['Arrays', 'Trees', 'Graphs', 'Sorting', 'Dynamic Programming'],
    difficulty: 'Medium',
    author: 'Prof. John Doe'
  },
  {
    id: 2,
    title: 'Database Management Systems - Theory & Practice',
    subject: 'Computer Science',
    semester: 4,
    description: 'Complete DBMS notes with SQL queries, normalization, transactions, and database design principles.',
    pages: 92,
    size: '15.3 MB',
    format: 'PDF',
    downloads: 3120,
    views: 7200,
    rating: 4.9,
    lastUpdated: '2024-01-18',
    topics: ['SQL', 'Normalization', 'Transactions', 'ER Diagrams', 'ACID Properties'],
    difficulty: 'Medium',
    author: 'Dr. Sarah Smith'
  },
  {
    id: 3,
    title: 'Operating Systems Concepts',
    subject: 'Computer Science',
    semester: 4,
    description: 'Detailed notes on process management, memory management, file systems, and concurrency.',
    pages: 78,
    size: '11.2 MB',
    format: 'PDF',
    downloads: 1890,
    views: 4320,
    rating: 4.7,
    lastUpdated: '2024-01-12',
    topics: ['Processes', 'Threads', 'Memory', 'File Systems', 'Deadlocks'],
    difficulty: 'Hard',
    author: 'Prof. Michael Brown'
  },
  {
    id: 4,
    title: 'Computer Networks - OSI & TCP/IP',
    subject: 'Computer Science',
    semester: 5,
    description: 'Network fundamentals, protocols, routing algorithms, and network security basics.',
    pages: 68,
    size: '9.8 MB',
    format: 'PDF',
    downloads: 1650,
    views: 3890,
    rating: 4.6,
    lastUpdated: '2024-01-10',
    topics: ['OSI Model', 'TCP/IP', 'Routing', 'DNS', 'Network Security'],
    difficulty: 'Medium',
    author: 'Dr. Emily White'
  },
  {
    id: 5,
    title: 'Object-Oriented Programming with Java',
    subject: 'Computer Science',
    semester: 3,
    description: 'OOP concepts, Java programming, design patterns, and practical examples.',
    pages: 95,
    size: '14.7 MB',
    format: 'PDF',
    downloads: 2780,
    views: 6120,
    rating: 4.8,
    lastUpdated: '2024-01-20',
    topics: ['OOP Concepts', 'Java', 'Design Patterns', 'Collections', 'Exception Handling'],
    difficulty: 'Medium',
    author: 'Prof. David Lee'
  },
  {
    id: 6,
    title: 'Software Engineering - SDLC & Agile',
    subject: 'Computer Science',
    semester: 5,
    description: 'Software development lifecycle, agile methodologies, testing, and project management.',
    pages: 72,
    size: '10.5 MB',
    format: 'PDF',
    downloads: 1420,
    views: 3210,
    rating: 4.5,
    lastUpdated: '2024-01-08',
    topics: ['SDLC', 'Agile', 'Testing', 'UML', 'Version Control'],
    difficulty: 'Easy',
    author: 'Dr. Lisa Taylor'
  },
  {
    id: 7,
    title: 'Web Technologies - HTML, CSS, JavaScript',
    subject: 'Computer Science',
    semester: 4,
    description: 'Frontend development basics, responsive design, and modern JavaScript concepts.',
    pages: 88,
    size: '13.2 MB',
    format: 'PDF',
    downloads: 3450,
    views: 8120,
    rating: 4.9,
    lastUpdated: '2024-01-22',
    topics: ['HTML5', 'CSS3', 'JavaScript', 'DOM', 'React Basics'],
    difficulty: 'Easy',
    author: 'Prof. Chris Anderson'
  },
  {
    id: 8,
    title: 'Artificial Intelligence & Machine Learning',
    subject: 'Computer Science',
    semester: 6,
    description: 'AI fundamentals, ML algorithms, neural networks, and practical applications.',
    pages: 102,
    size: '16.8 MB',
    format: 'PDF',
    downloads: 2890,
    views: 6780,
    rating: 4.9,
    lastUpdated: '2024-01-25',
    topics: ['AI Concepts', 'ML Algorithms', 'Neural Networks', 'Deep Learning', 'NLP'],
    difficulty: 'Hard',
    author: 'Dr. Robert Chen'
  }
]

export default function NotesPage() {
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

  const filteredNotes = MOCK_NOTES.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesSemester = semesterFilter === 'all' || note.semester === semesterFilter
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
                placeholder="Search notes by title, topic, or description..."
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <FileText className="h-8 w-8 text-[#4DB748] mx-auto mb-2" />
                <p className="text-2xl font-bold">{MOCK_NOTES.length}</p>
                <p className="text-sm text-gray-500">Total Notes</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Download className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{MOCK_NOTES.reduce((sum, n) => sum + n.downloads, 0).toLocaleString()}</p>
                <p className="text-sm text-gray-500">Downloads</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{(MOCK_NOTES.reduce((sum, n) => sum + n.rating, 0) / MOCK_NOTES.length).toFixed(1)}</p>
                <p className="text-sm text-gray-500">Avg. Rating</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <BookOpen className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{MOCK_NOTES.reduce((sum, n) => sum + n.pages, 0)}</p>
                <p className="text-sm text-gray-500">Total Pages</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      Semester {note.semester}
                    </Badge>
                    <Badge className={getDifficultyColor(note.difficulty)}>
                      {note.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{note.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-lg">{note.title}</CardTitle>
                <CardDescription className="text-sm">
                  {note.subject} • {note.author}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {note.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {note.topics.slice(0, 3).map((topic, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {note.topics.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{note.topics.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <FileText className="h-3 w-3 mr-1" />
                      {note.pages} pages
                    </div>
                    <div>{note.size}</div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Download className="h-3 w-3 mr-1" />
                      {note.downloads.toLocaleString()} downloads
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {note.views.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    Updated {new Date(note.lastUpdated).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    className="flex-1 bg-[#4DB748] hover:bg-[#45a63f]"
                    size="sm"
                    onClick={() => alert('View notes functionality')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => alert('Download notes functionality')}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
