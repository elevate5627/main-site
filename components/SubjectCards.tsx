'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useUserProfile } from '@/hooks/use-user-profile'
import { 
  BookOpen, 
  Brain,
  ChevronRight,
  GraduationCap,
  Loader2
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Subject {
  id: string
  institution: 'IOE' | 'IOM'
  program: string
  subject_name: string
  subject_code: string | null
  description: string | null
  is_active: boolean
  display_order: number
}

export default function SubjectCards() {
  const router = useRouter()
  const { profile, isLoading: profileLoading } = useUserProfile()
  const [supabase] = useState(() => createClient())
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [questionCounts, setQuestionCounts] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    if (profileLoading) return
    if (!profile || profile.purpose !== 'mcq-preparation') {
      setIsLoading(false)
      return
    }

    // Reset state when faculty changes
    setSubjects([])
    setQuestionCounts({})
    setIsLoading(true)
    
    const fetchSubjects = async () => {
      if (!profile?.faculty) {
        console.warn('⚠️ NO FACULTY - Cannot fetch subjects')
        return
      }

      try {
        // Map faculty to institution
        const institution = profile.faculty === 'ioe' ? 'IOE' : 'IOM'
        
        console.warn('='.repeat(80))
        console.warn('🔍 FETCHING SUBJECTS')
        console.warn('Faculty:', profile.faculty)
        console.warn('Institution:', institution)
        console.warn('Time:', new Date().toISOString())
        console.warn('='.repeat(80))
      
        // Fetch subjects for the user's institution
        const { data: subjectsData, error: subjectsError } = await supabase
          .from('subjects')
          .select('*')
          .eq('institution', institution)
          .eq('is_active', true)
          .order('display_order', { ascending: true })

        console.warn('='.repeat(80))
        console.warn('📊 SUBJECTS FETCHED')
        console.warn('Institution:', institution)
        console.warn('Count:', subjectsData?.length)
        console.warn('Subjects:', subjectsData?.map(s => s.subject_name))
        console.warn('Error:', subjectsError)
        console.warn('='.repeat(80))

        if (subjectsError) {
          console.error('Error fetching subjects:', subjectsError)
          return
        }

        if (subjectsData) {
          setSubjects(subjectsData)
          
          // Fetch question counts for each subject
          const counts: { [key: string]: number } = {}
          for (const subject of subjectsData) {
            const { count, error } = await supabase
              .from('mcq_questions')
              .select('*', { count: 'exact', head: true })
              .eq('institution', institution)
              .eq('subject', subject.subject_name)

            if (!error && count !== null) {
              counts[subject.subject_name] = count
            } else {
              counts[subject.subject_name] = 0
            }
          }
          setQuestionCounts(counts)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchSubjects()
  }, [profile?.faculty, profileLoading])

  const handleSubjectClick = (subject: Subject) => {
    // Navigate to subject-specific practice page
    router.push(`/dashboard/mcq-preparation/subject-wise?subject=${encodeURIComponent(subject.subject_name)}&institution=${subject.institution}`)
  }

  const getSubjectIcon = (subjectName: string) => {
    const name = subjectName.toLowerCase()
    if (name.includes('physics')) return '⚛️'
    if (name.includes('chemistry')) return '🧪'
    if (name.includes('mathematics') || name.includes('math')) return '📐'
    if (name.includes('english')) return '📚'
    if (name.includes('botany')) return '🌿'
    if (name.includes('zoology')) return '🦋'
    if (name.includes('mat')) return '🧠'
    return '📖'
  }

  const getSubjectColor = (index: number) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-orange-500 to-orange-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-teal-500 to-teal-600',
      'from-red-500 to-red-600',
    ]
    return colors[index % colors.length]
  }

  if (profileLoading || isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#4DB748]" />
      </div>
    )
  }

  // Show message if no profile or wrong purpose
  if (!profile || profile.purpose !== 'mcq-preparation') {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              MCQ Preparation Not Configured
            </h3>
            <p className="text-gray-600 mb-4">
              Please complete your profile to see available subjects
            </p>
            <Button onClick={() => router.push('/dashboard/profile')}>
              Complete Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show message if faculty not selected
  if (!profile.faculty) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Select Your Faculty
            </h3>
            <p className="text-gray-600 mb-4">
              Please select IOE or MBBS in your profile to see subjects
            </p>
            <Button onClick={() => router.push('/dashboard/profile')}>
              Update Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (subjects.length === 0) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Subjects Available
            </h3>
            <p className="text-gray-600">
              Subjects for {profile.faculty?.toUpperCase()} will be available soon
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {profile.faculty === 'ioe' ? 'IOE Engineering' : 'IOM MBBS'} Subjects
          </h2>
          <p className="text-gray-600 mt-1">
            Select a subject to start practicing MCQs
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {subjects.length} Subjects Available
        </Badge>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {subjects.map((subject, index) => (
          <Card
            key={subject.id}
            className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-[#4DB748] overflow-hidden"
            onClick={() => handleSubjectClick(subject)}
          >
            {/* Gradient Header */}
            <div className={`h-2 bg-gradient-to-r ${getSubjectColor(index)}`} />
            
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-4xl">{getSubjectIcon(subject.subject_name)}</div>
                  <div>
                    <CardTitle className="text-lg group-hover:text-[#4DB748] transition-colors">
                      {subject.subject_name}
                    </CardTitle>
                    {subject.subject_code && (
                      <p className="text-xs text-gray-500 mt-1">
                        {subject.subject_code}
                      </p>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#4DB748] group-hover:translate-x-1 transition-all" />
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                {subject.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {subject.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {questionCounts[subject.subject_name] || 0} Questions
                    </span>
                  </div>
                  {questionCounts[subject.subject_name] > 0 ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500">
                      Coming Soon
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <Card className="bg-gradient-to-r from-[#4DB748]/10 to-blue-50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#4DB748]">
                {subjects.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Subjects</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {Object.values(questionCounts).reduce((a, b) => a + b, 0)}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Questions</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {subjects.filter(s => questionCounts[s.subject_name] > 0).length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Active Subjects</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
