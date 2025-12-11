'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useUserProfile } from '@/hooks/use-user-profile'
import { User } from '@supabase/supabase-js'
import FacultySwitcher from '@/components/FacultySwitcher'
import { 
  Library,
  BookOpen,
  Play,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Circle,
  XCircle,
  Brain
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

interface MCQQuestion {
  id: string
  question_text: string
  subject: string | null
  chapter: string | null
  topic: string | null
  marks: number | null
  difficulty: string | null
  option_1: string | null
  option_2: string | null
  option_3: string | null
  option_4: string | null
  answer_option_number: number
  explanation: string | null
}

interface SubjectData {
  name: string
  icon: string
  totalQuestions: number
}

const MOCK_SUBJECTS_OLD = [
  {
    id: 1,
    name: 'Physics',
    icon: '⚛️',
    totalQuestions: 450,
    completedQuestions: 180,
    accuracy: 78,
    topics: [
      { id: 1, name: 'Mechanics', questions: 120, completed: 60, difficulty: 'Medium' },
      { id: 2, name: 'Thermodynamics', questions: 80, completed: 40, difficulty: 'Hard' },
      { id: 3, name: 'Electromagnetism', questions: 100, completed: 35, difficulty: 'Hard' },
      { id: 4, name: 'Optics', questions: 70, completed: 25, difficulty: 'Medium' },
      { id: 5, name: 'Modern Physics', questions: 80, completed: 20, difficulty: 'Expert' }
    ]
  },
  {
    id: 2,
    name: 'Chemistry',
    icon: '🧪',
    totalQuestions: 400,
    completedQuestions: 165,
    accuracy: 82,
    topics: [
      { id: 1, name: 'Organic Chemistry', questions: 150, completed: 75, difficulty: 'Hard' },
      { id: 2, name: 'Inorganic Chemistry', questions: 120, completed: 50, difficulty: 'Medium' },
      { id: 3, name: 'Physical Chemistry', questions: 130, completed: 40, difficulty: 'Hard' }
    ]
  },
  {
    id: 3,
    name: 'Mathematics',
    icon: '📐',
    totalQuestions: 500,
    completedQuestions: 250,
    accuracy: 85,
    topics: [
      { id: 1, name: 'Calculus', questions: 150, completed: 90, difficulty: 'Hard' },
      { id: 2, name: 'Algebra', questions: 130, completed: 80, difficulty: 'Medium' },
      { id: 3, name: 'Trigonometry', questions: 100, completed: 50, difficulty: 'Medium' },
      { id: 4, name: 'Coordinate Geometry', questions: 120, completed: 30, difficulty: 'Hard' }
    ]
  },
  {
    id: 4,
    name: 'Biology',
    icon: '🧬',
    totalQuestions: 350,
    completedQuestions: 120,
    accuracy: 76,
    topics: [
      { id: 1, name: 'Botany', questions: 175, completed: 60, difficulty: 'Medium' },
      { id: 2, name: 'Zoology', questions: 175, completed: 60, difficulty: 'Medium' }
    ]
  }
]

export default function SubjectWisePage() {
  const router = useRouter()
  const { profile } = useUserProfile()
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [subjects, setSubjects] = useState<SubjectData[]>([])
  const [questions, setQuestions] = useState<MCQQuestion[]>([])
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)

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

  // Fetch subjects when both user and profile are ready
  useEffect(() => {
    if (user && profile?.faculty) {
      console.warn('✅ Both user and profile ready, fetching subjects...')
      fetchSubjects()
    }
  }, [user?.id, profile?.faculty])

  const fetchSubjects = async () => {
    try {
      // Map faculty to institution
      const institution = profile?.faculty === 'ioe' ? 'IOE' : 'IOM'

      console.warn('🔍 SUBJECT-WISE PAGE: Fetching subjects for', institution)

      // Fetch subjects from subjects table instead of querying all questions
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('subjects')
        .select('*')
        .eq('institution', institution)
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (subjectsError) throw subjectsError

      // Get question counts for each subject
      const subjectList: SubjectData[] = []
      for (const subject of subjectsData || []) {
        const { count } = await supabase
          .from('mcq_questions')
          .select('*', { count: 'exact', head: true })
          .eq('institution', institution)
          .eq('subject', subject.subject_name)

        subjectList.push({
          name: subject.subject_name,
          icon: getSubjectIcon(subject.subject_name),
          totalQuestions: count || 0
        })
      }

      console.warn('📊 Subjects loaded:', subjectList.map(s => `${s.name} (${s.totalQuestions})`))
      setSubjects(subjectList)
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
  }

  const fetchQuestionsForSubject = async (subjectName: string) => {
    try {
      const { data, error } = await supabase
        .from('mcq_questions')
        .select('*')
        .eq('subject', subjectName)
        .order('marks', { ascending: true })
        .limit(50)

      if (error) throw error
      setQuestions(data || [])
      setSelectedAnswers({})
      setShowResults(false)
    } catch (error) {
      console.error('Error fetching questions:', error)
    }
  }

  const getSubjectIcon = (subjectName: string) => {
    const name = subjectName?.toLowerCase() || ''
    if (name.includes('mathematic')) return '📐'
    if (name.includes('physic')) return '⚛️'
    if (name.includes('chemist')) return '🧪'
    if (name.includes('english')) return '📚'
    if (name.includes('botan')) return '🌿'
    if (name.includes('zoolog')) return '🦋'
    if (name.includes('mat')) return '🧠'
    if (name.includes('biolog')) return '🧬'
    if (name.includes('anatomy')) return '🫀'
    if (name.includes('physiolog')) return '💉'
    return '📖'
  }

  const handleSubjectClick = (subjectName: string) => {
    setSelectedSubject(subjectName)
    fetchQuestionsForSubject(subjectName)
  }

  const handleAnswerSelect = (questionId: string, optionNumber: number) => {
    if (!showResults) {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: optionNumber
      }))
    }
  }

  const handleSubmit = () => {
    setShowResults(true)
  }

  const handleReset = () => {
    setSelectedAnswers({})
    setShowResults(false)
  }

  const getScore = () => {
    let correct = 0
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.answer_option_number) {
        correct++
      }
    })
    return {
      correct,
      total: questions.length,
      answered: Object.keys(selectedAnswers).length
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-orange-100 text-orange-800'
      case 'Expert': return 'bg-red-100 text-red-800'
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

  const score = getScore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {!selectedSubject ? (
          <>
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-3 bg-gradient-to-br from-[#4DB748] to-emerald-600 rounded-xl shadow-lg">
                  <Library className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Subject-Wise Practice</h1>
                  <p className="text-gray-600 mt-1">Master each subject with targeted practice sessions</p>
                </div>
              </div>
              
              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Subjects</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{subjects.length}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-500 opacity-80" />
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Questions</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {subjects.reduce((sum, s) => sum + s.totalQuestions, 0)}
                      </p>
                    </div>
                    <Brain className="h-8 w-8 text-purple-500 opacity-80" />
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Subjects</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {subjects.filter(s => s.totalQuestions > 0).length}
                      </p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-500 opacity-80" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#4DB748] to-emerald-600 rounded-xl p-4 shadow-md text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/90">Ready to Start</p>
                      <p className="text-2xl font-bold mt-1">Let's Go!</p>
                    </div>
                    <Play className="h-8 w-8 text-white/90" />
                  </div>
                </div>
              </div>
            </div>

            {/* Subject Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject, index) => {
                const colors = [
                  { gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
                  { gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
                  { gradient: 'from-pink-500 to-pink-600', bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
                  { gradient: 'from-orange-500 to-orange-600', bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
                  { gradient: 'from-teal-500 to-teal-600', bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200' },
                ]
                const colorScheme = colors[index % colors.length]
                
                return (
                  <Card 
                    key={subject.name} 
                    className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-[#4DB748] hover:-translate-y-1"
                    onClick={() => handleSubjectClick(subject.name)}
                  >
                    {/* Gradient Header */}
                    <div className={`h-2 bg-gradient-to-r ${colorScheme.gradient}`} />
                    
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`${colorScheme.bg} p-3 rounded-xl ${colorScheme.border} border-2`}>
                            <span className="text-4xl">{subject.icon}</span>
                          </div>
                          <div>
                            <CardTitle className="text-xl group-hover:text-[#4DB748] transition-colors">
                              {subject.name}
                            </CardTitle>
                            <CardDescription className="mt-1.5 flex items-center space-x-1">
                              <BookOpen className="h-3.5 w-3.5" />
                              <span>{subject.totalQuestions} questions</span>
                            </CardDescription>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#4DB748] group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Progress Info */}
                      <div className={`${colorScheme.bg} rounded-lg p-3 border ${colorScheme.border}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-600">Questions Available</span>
                          <span className={`text-sm font-bold ${colorScheme.text}`}>
                            {subject.totalQuestions}
                          </span>
                        </div>
                        <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${colorScheme.gradient} transition-all duration-500`}
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button 
                        className={`w-full bg-gradient-to-r ${colorScheme.gradient} hover:opacity-90 text-white font-medium shadow-md transition-all group/btn`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSubjectClick(subject.name)
                        }}
                      >
                        <Play className="h-4 w-4 mr-2 group-hover/btn:translate-x-0.5 transition-transform" />
                        Start Practice
                      </Button>

                      {/* Quick Stats */}
                      <div className="flex items-center justify-between pt-2 border-t text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Brain className="h-3.5 w-3.5" />
                          <span>MCQ Practice</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>~{Math.ceil(subject.totalQuestions * 1.5)} min</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Empty State */}
            {subjects.length === 0 && (
              <Card className="border-2 border-dashed border-gray-300">
                <CardContent className="pt-12 pb-12">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <BookOpen className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Subjects Available</h3>
                    <p className="text-gray-600 mb-6">Questions will appear here once they are uploaded to the system</p>
                    <Button variant="outline">
                      <Library className="h-4 w-4 mr-2" />
                      Contact Admin
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <>
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedSubject(null)
                  setQuestions([])
                  setSelectedAnswers({})
                  setShowResults(false)
                }}
                className="mb-4"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Subjects
              </Button>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-4xl">{getSubjectIcon(selectedSubject)}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedSubject}</h2>
                    <p className="text-gray-600">{questions.length} questions</p>
                  </div>
                </div>
              </div>

              {/* Results Summary */}
              {showResults && (
                <Card className="mb-6 border-2 border-[#4DB748]">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Results</h3>
                        <p className="text-gray-600">
                          You got {score.correct} out of {score.total} questions correct
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold text-[#4DB748]">
                          {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
                        </div>
                        <Button onClick={handleReset} variant="outline" className="mt-2">
                          Try Again
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submit Button */}
              {!showResults && Object.keys(selectedAnswers).length > 0 && (
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600">
                        {Object.keys(selectedAnswers).length} of {questions.length} questions answered
                      </p>
                      <Button onClick={handleSubmit} className="bg-[#4DB748] hover:bg-[#45a63f]">
                        Submit Answers
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {questions.map((question, index) => {
                const selectedAnswer = selectedAnswers[question.id]
                const isCorrect = selectedAnswer === question.answer_option_number

                return (
                  <Card key={question.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">Question {index + 1}</Badge>
                            {question.difficulty && (
                              <Badge className={getDifficultyColor(question.difficulty)}>
                                {question.difficulty}
                              </Badge>
                            )}
                            {question.marks && (
                              <Badge variant="secondary">{question.marks} marks</Badge>
                            )}
                            {showResults && selectedAnswer && (
                              <Badge variant={isCorrect ? 'default' : 'destructive'} className={isCorrect ? 'bg-green-500' : ''}>
                                {isCorrect ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                                {isCorrect ? 'Correct' : 'Incorrect'}
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg">{question.question_text}</CardTitle>
                          {(question.chapter || question.topic) && (
                            <CardDescription className="mt-2">
                              {question.chapter && `Chapter: ${question.chapter}`}
                              {question.chapter && question.topic && ' • '}
                              {question.topic && `Topic: ${question.topic}`}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup
                        value={selectedAnswer?.toString()}
                        onValueChange={(value) => handleAnswerSelect(question.id, parseInt(value))}
                        disabled={showResults}
                      >
                        <div className="space-y-3">
                          {[1, 2, 3, 4].map(optionNum => {
                            const optionText = question[`option_${optionNum}` as keyof MCQQuestion]
                            if (!optionText) return null

                            const isSelected = selectedAnswer === optionNum
                            const isCorrectOption = question.answer_option_number === optionNum
                            const showCorrect = showResults && isCorrectOption

                            return (
                              <div
                                key={optionNum}
                                className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors ${
                                  showCorrect
                                    ? 'border-green-500 bg-green-50'
                                    : isSelected && showResults && !isCorrectOption
                                    ? 'border-red-500 bg-red-50'
                                    : isSelected
                                    ? 'border-[#4DB748] bg-green-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <RadioGroupItem value={optionNum.toString()} id={`${question.id}-${optionNum}`} />
                                <Label
                                  htmlFor={`${question.id}-${optionNum}`}
                                  className="flex-1 cursor-pointer"
                                >
                                  <span className="font-semibold mr-2">{optionNum}.</span>
                                  {optionText}
                                  {showCorrect && (
                                    <CheckCircle2 className="inline-block ml-2 h-4 w-4 text-green-600" />
                                  )}
                                </Label>
                              </div>
                            )
                          })}
                        </div>
                      </RadioGroup>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </>
        )}
      </div>
      {process.env.NODE_ENV === 'development' && <FacultySwitcher />}
    </div>
  )
}
