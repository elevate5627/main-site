'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import { 
  BookOpen, 
  Search,
  Filter,
  Star,
  Calendar,
  FileText,
  Eye
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function StudyMaterialsPage() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

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

  // Sample study materials data (view-only mode)
  const studyMaterials = [
    {
      id: 1,
      title: 'Data Structures and Algorithms',
      subject: 'Computer Science',
      description: 'Comprehensive notes covering arrays, linked lists, trees, graphs, and sorting algorithms.',
      pages: 45,
      downloads: 2300, // Actually represents views
      rating: 4.8,
      lastUpdated: '2024-01-15',
      category: 'Notes'
    },
    {
      id: 2,
      title: 'Database Management Systems',
      subject: 'Computer Science',
      description: 'Complete guide to DBMS concepts, SQL, normalization, and transaction management.',
      pages: 38,
      downloads: 1800, // Actually represents views
      rating: 4.7,
      lastUpdated: '2024-01-10',
      category: 'Notes'
    },
    {
      id: 3,
      title: 'Operating Systems Concepts',
      subject: 'Computer Science',
      description: 'Process management, memory management, file systems, and system calls explained.',
      pages: 52,
      downloads: 2100, // Actually represents views
      rating: 4.9,
      lastUpdated: '2024-01-20',
      category: 'Notes'
    },
    {
      id: 4,
      title: 'Computer Networks',
      subject: 'Computer Science',
      description: 'Networking fundamentals, protocols, OSI model, and network security basics.',
      pages: 41,
      downloads: 1500, // Actually represents views
      rating: 4.6,
      lastUpdated: '2024-01-12',
      category: 'Notes'
    }
  ]

  const filteredMaterials = studyMaterials.filter(material =>
    material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <BookOpen className="h-8 w-8 text-[#4DB748]" />
            <h1 className="text-3xl font-bold text-gray-900">Study Materials</h1>
          </div>
          <p className="text-gray-600">Access all your learning resources in one place</p>
        </div>
        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search study materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="sm:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Study Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-[#4DB748]" />
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      {material.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{material.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-lg">{material.title}</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {material.subject}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {material.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>{material.pages} pages</span>
                  <span>{material.downloads.toLocaleString()} views</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(material.lastUpdated).toLocaleDateString()}
                  </div>
                  <Button size="sm" className="bg-[#4DB748] hover:bg-[#45a63f]">
                    View Material
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
            <p className="text-gray-600">Try adjusting your search query</p>
          </div>
        )}
      </div>
    </div>
  )
}
