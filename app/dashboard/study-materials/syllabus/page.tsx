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

// MOCK DATA - Remove when real data is integrated
const MOCK_SYLLABUS = [
  {
    id: 1,
    title: 'Data Structures and Algorithms Syllabus',
    subject: 'Computer Science',
    semester: 3,
    description: 'Complete syllabus covering linear and non-linear data structures, searching and sorting algorithms.',
    units: 5,
    topics: 12,
    size: '2.4 MB',
    format: 'PDF',
    downloads: 3450,
    views: 7890,
    lastUpdated: '2024-01-15',
    academicYear: '2023-24',
    coverage: [
      { unit: 'Unit 1', name: 'Arrays and Strings', completed: true },
      { unit: 'Unit 2', name: 'Linked Lists', completed: true },
      { unit: 'Unit 3', name: 'Stacks and Queues', completed: false },
      { unit: 'Unit 4', name: 'Trees and Graphs', completed: false },
      { unit: 'Unit 5', name: 'Sorting and Searching', completed: false }
    ]
  },
  {
    id: 2,
    title: 'Database Management Systems Syllabus',
    subject: 'Computer Science',
    semester: 4,
    description: 'DBMS syllabus including relational model, SQL, normalization, transactions, and database design.',
    units: 5,
    topics: 15,
    size: '2.8 MB',
    format: 'PDF',
    downloads: 4120,
    views: 8950,
    lastUpdated: '2024-01-18',
    academicYear: '2023-24',
    coverage: [
      { unit: 'Unit 1', name: 'Introduction to DBMS', completed: true },
      { unit: 'Unit 2', name: 'Relational Model & SQL', completed: true },
      { unit: 'Unit 3', name: 'Normalization', completed: true },
      { unit: 'Unit 4', name: 'Transactions & Concurrency', completed: false },
      { unit: 'Unit 5', name: 'Database Design', completed: false }
    ]
  },
  {
    id: 3,
    title: 'Operating Systems Syllabus',
    subject: 'Computer Science',
    semester: 4,
    description: 'OS syllabus covering processes, threads, memory management, file systems, and deadlocks.',
    units: 5,
    topics: 14,
    size: '2.6 MB',
    format: 'PDF',
    downloads: 3680,
    views: 7230,
    lastUpdated: '2024-01-12',
    academicYear: '2023-24',
    coverage: [
      { unit: 'Unit 1', name: 'Introduction to OS', completed: true },
      { unit: 'Unit 2', name: 'Process Management', completed: true },
      { unit: 'Unit 3', name: 'Memory Management', completed: false },
      { unit: 'Unit 4', name: 'File Systems', completed: false },
      { unit: 'Unit 5', name: 'Deadlocks & Security', completed: false }
    ]
  },
  {
    id: 4,
    title: 'Computer Networks Syllabus',
    subject: 'Computer Science',
    semester: 5,
    description: 'Networking syllabus including OSI model, TCP/IP, routing protocols, and network security.',
    units: 5,
    topics: 13,
    size: '2.5 MB',
    format: 'PDF',
    downloads: 2890,
    views: 6120,
    lastUpdated: '2024-01-10',
    academicYear: '2023-24',
    coverage: [
      { unit: 'Unit 1', name: 'Network Fundamentals', completed: true },
      { unit: 'Unit 2', name: 'OSI & TCP/IP Model', completed: false },
      { unit: 'Unit 3', name: 'Data Link & Network Layer', completed: false },
      { unit: 'Unit 4', name: 'Transport Layer', completed: false },
      { unit: 'Unit 5', name: 'Application Layer & Security', completed: false }
    ]
  },
  {
    id: 5,
    title: 'Object-Oriented Programming Syllabus',
    subject: 'Computer Science',
    semester: 3,
    description: 'OOP syllabus covering classes, inheritance, polymorphism, and Java programming.',
    units: 5,
    topics: 11,
    size: '2.3 MB',
    format: 'PDF',
    downloads: 4560,
    views: 9340,
    lastUpdated: '2024-01-20',
    academicYear: '2023-24',
    coverage: [
      { unit: 'Unit 1', name: 'OOP Concepts', completed: true },
      { unit: 'Unit 2', name: 'Classes and Objects', completed: true },
      { unit: 'Unit 3', name: 'Inheritance', completed: true },
      { unit: 'Unit 4', name: 'Polymorphism', completed: false },
      { unit: 'Unit 5', name: 'Exception Handling', completed: false }
    ]
  },
  {
    id: 6,
    title: 'Software Engineering Syllabus',
    subject: 'Computer Science',
    semester: 5,
    description: 'SE syllabus including SDLC, agile methodologies, testing, and project management.',
    units: 5,
    topics: 12,
    size: '2.7 MB',
    format: 'PDF',
    downloads: 2340,
    views: 5670,
    lastUpdated: '2024-01-08',
    academicYear: '2023-24',
    coverage: [
      { unit: 'Unit 1', name: 'Introduction to SE', completed: true },
      { unit: 'Unit 2', name: 'SDLC Models', completed: false },
      { unit: 'Unit 3', name: 'Requirements Engineering', completed: false },
      { unit: 'Unit 4', name: 'Design & Testing', completed: false },
      { unit: 'Unit 5', name: 'Project Management', completed: false }
    ]
  },
  {
    id: 7,
    title: 'Web Technologies Syllabus',
    subject: 'Computer Science',
    semester: 4,
    description: 'Web tech syllabus covering HTML, CSS, JavaScript, PHP, and web frameworks.',
    units: 5,
    topics: 16,
    size: '2.9 MB',
    format: 'PDF',
    downloads: 5230,
    views: 10120,
    lastUpdated: '2024-01-22',
    academicYear: '2023-24',
    coverage: [
      { unit: 'Unit 1', name: 'HTML & CSS', completed: true },
      { unit: 'Unit 2', name: 'JavaScript Basics', completed: true },
      { unit: 'Unit 3', name: 'DOM & Events', completed: true },
      { unit: 'Unit 4', name: 'PHP & MySQL', completed: false },
      { unit: 'Unit 5', name: 'Web Frameworks', completed: false }
    ]
  },
  {
    id: 8,
    title: 'Artificial Intelligence Syllabus',
    subject: 'Computer Science',
    semester: 6,
    description: 'AI syllabus covering search algorithms, knowledge representation, machine learning, and neural networks.',
    units: 5,
    topics: 14,
    size: '3.1 MB',
    format: 'PDF',
    downloads: 3890,
    views: 7650,
    lastUpdated: '2024-01-25',
    academicYear: '2023-24',
    coverage: [
      { unit: 'Unit 1', name: 'AI Fundamentals', completed: false },
      { unit: 'Unit 2', name: 'Search Algorithms', completed: false },
      { unit: 'Unit 3', name: 'Knowledge Representation', completed: false },
      { unit: 'Unit 4', name: 'Machine Learning', completed: false },
      { unit: 'Unit 5', name: 'Neural Networks', completed: false }
    ]
  }
]

export default function SyllabusPage() {
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <ClipboardList className="h-8 w-8 text-[#4DB748] mx-auto mb-2" />
                <p className="text-2xl font-bold">{MOCK_SYLLABUS.length}</p>
                <p className="text-sm text-gray-500">Subjects</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{MOCK_SYLLABUS.reduce((sum, s) => sum + s.units, 0)}</p>
                <p className="text-sm text-gray-500">Total Units</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Download className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{MOCK_SYLLABUS.reduce((sum, s) => sum + s.downloads, 0).toLocaleString()}</p>
                <p className="text-sm text-gray-500">Downloads</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{Math.round((MOCK_SYLLABUS.reduce((sum, s) => sum + s.coverage.filter(c => c.completed).length, 0) / MOCK_SYLLABUS.reduce((sum, s) => sum + s.coverage.length, 0)) * 100)}%</p>
                <p className="text-sm text-gray-500">Coverage</p>
              </div>
            </CardContent>
          </Card>
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
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        className="flex-1 bg-[#4DB748] hover:bg-[#45a63f]"
                        size="sm"
                        onClick={() => alert('View syllabus functionality')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => alert('Download syllabus functionality')}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
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
