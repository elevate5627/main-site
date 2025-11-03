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

// MOCK DATA - Remove when real data is integrated
const MOCK_LAB_NOTES = [
  {
    id: 1,
    title: 'Data Structures Lab - Complete Practicals',
    subject: 'Computer Science',
    semester: 3,
    description: 'All lab programs including arrays, linked lists, stacks, queues, trees, and graphs with code and output.',
    experiments: 12,
    size: '8.5 MB',
    format: 'PDF + Code',
    downloads: 1890,
    views: 4320,
    rating: 4.7,
    lastUpdated: '2024-01-15',
    topics: ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees', 'Graphs'],
    language: 'C/C++',
    difficulty: 'Medium'
  },
  {
    id: 2,
    title: 'DBMS Lab Manual - SQL & PL/SQL',
    subject: 'Computer Science',
    semester: 4,
    description: 'Database lab exercises covering DDL, DML, joins, triggers, cursors, and procedures.',
    experiments: 10,
    size: '6.8 MB',
    format: 'PDF + SQL',
    downloads: 2340,
    views: 5120,
    rating: 4.8,
    lastUpdated: '2024-01-18',
    topics: ['DDL', 'DML', 'Joins', 'Triggers', 'Stored Procedures', 'Cursors'],
    language: 'SQL/PL-SQL',
    difficulty: 'Medium'
  },
  {
    id: 3,
    title: 'Operating Systems Lab Programs',
    subject: 'Computer Science',
    semester: 4,
    description: 'OS lab programs including scheduling algorithms, memory management, and system calls.',
    experiments: 11,
    size: '7.2 MB',
    format: 'PDF + Code',
    downloads: 1560,
    views: 3890,
    rating: 4.6,
    lastUpdated: '2024-01-12',
    topics: ['CPU Scheduling', 'Memory Management', 'File Systems', 'System Calls', 'Deadlocks'],
    language: 'C',
    difficulty: 'Hard'
  },
  {
    id: 4,
    title: 'Computer Networks Lab - Packet Tracer',
    subject: 'Computer Science',
    semester: 5,
    description: 'Network simulation exercises using Cisco Packet Tracer and Wireshark analysis.',
    experiments: 8,
    size: '15.4 MB',
    format: 'PDF + .pkt files',
    downloads: 1120,
    views: 2890,
    rating: 4.5,
    lastUpdated: '2024-01-10',
    topics: ['Network Topology', 'Routing', 'TCP/IP', 'DHCP', 'DNS', 'VLANs'],
    language: 'Packet Tracer',
    difficulty: 'Medium'
  },
  {
    id: 5,
    title: 'Java Programming Lab - OOP Concepts',
    subject: 'Computer Science',
    semester: 3,
    description: 'Java lab programs covering OOP concepts, exception handling, collections, and GUI.',
    experiments: 15,
    size: '9.7 MB',
    format: 'PDF + Java Code',
    downloads: 2680,
    views: 5890,
    rating: 4.9,
    lastUpdated: '2024-01-20',
    topics: ['Classes', 'Inheritance', 'Polymorphism', 'Exception Handling', 'Collections', 'Swing'],
    language: 'Java',
    difficulty: 'Medium'
  },
  {
    id: 6,
    title: 'Web Technologies Lab - Full Stack',
    subject: 'Computer Science',
    semester: 4,
    description: 'Complete web development lab including HTML, CSS, JavaScript, PHP, and MySQL.',
    experiments: 14,
    size: '11.3 MB',
    format: 'PDF + Code',
    downloads: 3120,
    views: 6780,
    rating: 4.8,
    lastUpdated: '2024-01-22',
    topics: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL', 'AJAX'],
    language: 'HTML/CSS/JS/PHP',
    difficulty: 'Easy'
  },
  {
    id: 7,
    title: 'Python Programming Lab Manual',
    subject: 'Computer Science',
    semester: 3,
    description: 'Python lab exercises covering basics to advanced topics including NumPy and Pandas.',
    experiments: 13,
    size: '8.9 MB',
    format: 'PDF + .py files',
    downloads: 2450,
    views: 5320,
    rating: 4.9,
    lastUpdated: '2024-01-25',
    topics: ['Python Basics', 'Functions', 'OOP', 'File Handling', 'NumPy', 'Pandas'],
    language: 'Python',
    difficulty: 'Easy'
  },
  {
    id: 8,
    title: 'Computer Graphics Lab - OpenGL',
    subject: 'Computer Science',
    semester: 5,
    description: 'Graphics programming lab with OpenGL covering 2D and 3D transformations.',
    experiments: 10,
    size: '10.2 MB',
    format: 'PDF + Code',
    downloads: 890,
    views: 2110,
    rating: 4.4,
    lastUpdated: '2024-01-08',
    topics: ['2D Shapes', '3D Objects', 'Transformations', 'Lighting', 'Textures', 'Animation'],
    language: 'C/OpenGL',
    difficulty: 'Hard'
  },
  {
    id: 9,
    title: 'Microprocessor Lab - 8086 Programs',
    subject: 'Computer Science',
    semester: 4,
    description: 'Assembly language programming for 8086 microprocessor with practical examples.',
    experiments: 12,
    size: '7.5 MB',
    format: 'PDF + ASM',
    downloads: 1340,
    views: 3210,
    rating: 4.3,
    lastUpdated: '2024-01-05',
    topics: ['8086 Architecture', 'Assembly', 'Arithmetic Operations', 'String Operations', 'Interrupts'],
    language: 'Assembly',
    difficulty: 'Hard'
  }
]

export default function LabsNotePage() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [semesterFilter, setSemesterFilter] = useState<number | 'all'>('all')

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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <FlaskConical className="h-8 w-8 text-[#4DB748] mx-auto mb-2" />
                <p className="text-2xl font-bold">{MOCK_LAB_NOTES.length}</p>
                <p className="text-sm text-gray-500">Lab Manuals</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Code className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{MOCK_LAB_NOTES.reduce((sum, l) => sum + l.experiments, 0)}</p>
                <p className="text-sm text-gray-500">Total Experiments</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Download className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{MOCK_LAB_NOTES.reduce((sum, l) => sum + l.downloads, 0).toLocaleString()}</p>
                <p className="text-sm text-gray-500">Downloads</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{(MOCK_LAB_NOTES.reduce((sum, l) => sum + l.rating, 0) / MOCK_LAB_NOTES.length).toFixed(1)}</p>
                <p className="text-sm text-gray-500">Avg. Rating</p>
              </div>
            </CardContent>
          </Card>
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

                <div className="flex space-x-2">
                  <Button 
                    className="flex-1 bg-[#4DB748] hover:bg-[#45a63f]"
                    size="sm"
                    onClick={() => alert('View lab manual functionality')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => alert('Download lab manual functionality')}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
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
