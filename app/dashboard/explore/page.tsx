'use client'

import { useRouter } from 'next/navigation'
import { 
  Brain, 
  BookOpen, 
  Trophy, 
  Target,
  BarChart3,
  Clock,
  Repeat,
  FileText,
  Lightbulb,
  CheckCircle2,
  ArrowLeft,
  BookMarked,
  GraduationCap,
  Microscope,
  Calculator,
  FlaskConical,
  Languages,
  Bookmark,
  TrendingUp,
  Award,
  Users,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function ExploreFeaturesPage() {
  const router = useRouter()

  const mcqFeatures = [
    {
      icon: Brain,
      title: 'Subject-wise Practice',
      description: 'Practice questions organized by subjects like Physics, Chemistry, Mathematics, Biology, etc.',
      route: '/dashboard/mcq-preparation',
      color: 'from-blue-500 to-blue-600',
      badge: 'Popular'
    },
    {
      icon: Trophy,
      title: 'Mock Tests',
      description: 'Full-length mock tests simulating real entrance exams (IOE, IOM MBBS) with timer and scoring',
      route: '/dashboard/mcq-preparation/mock-test',
      color: 'from-purple-500 to-purple-600',
      badge: 'Featured'
    },
    {
      icon: Target,
      title: 'Topic-wise Practice',
      description: 'Focus on specific topics within each subject to strengthen weak areas',
      route: '/dashboard/mcq-preparation',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Repeat,
      title: 'Practice Sets',
      description: 'Custom practice sets with varying difficulty levels - Easy, Medium, and Hard',
      route: '/dashboard/mcq-preparation',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Detailed performance tracking with subject-wise analysis and progress reports',
      route: '/dashboard/mcq-preparation',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: Clock,
      title: 'Timed Practice',
      description: 'Practice with time constraints to improve speed and time management',
      route: '/dashboard/mcq-preparation',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: Lightbulb,
      title: 'Question of the Day',
      description: 'Daily 5-question challenge to keep your preparation consistent',
      route: '/dashboard',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: CheckCircle2,
      title: 'Instant Results',
      description: 'Get immediate feedback with detailed explanations for correct and incorrect answers',
      route: '/dashboard/mcq-preparation',
      color: 'from-teal-500 to-teal-600'
    },
    {
      icon: Bookmark,
      title: 'Mark for Review',
      description: 'Bookmark questions during tests and review them later for better understanding',
      route: '/dashboard/mcq-preparation/mock-test',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Track your improvement over time with comprehensive progress charts and insights',
      route: '/dashboard/mcq-preparation',
      color: 'from-violet-500 to-violet-600'
    },
    {
      icon: Award,
      title: 'Achievement System',
      description: 'Earn badges and achievements as you complete milestones in your preparation',
      route: '/dashboard',
      color: 'from-amber-500 to-amber-600'
    },
    {
      icon: Users,
      title: 'Difficulty Levels',
      description: 'Questions categorized by difficulty to gradually increase your expertise',
      route: '/dashboard/mcq-preparation',
      color: 'from-rose-500 to-rose-600'
    }
  ]

  const studyMaterialFeatures = [
    {
      icon: BookOpen,
      title: 'Course Materials',
      description: 'Access comprehensive study materials organized by semester and subject',
      route: '/dashboard/study-materials',
      color: 'from-green-500 to-green-600',
      badge: 'Popular'
    },
    {
      icon: FileText,
      title: 'Notes & PDFs',
      description: 'Download lecture notes, PDFs, and reference materials for offline study',
      route: '/dashboard/study-materials',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: GraduationCap,
      title: 'Syllabus Coverage',
      description: 'Complete syllabus coverage for engineering and medical entrance exams',
      route: '/dashboard/study-materials',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Microscope,
      title: 'Lab Resources',
      description: 'Laboratory manuals, practical guides, and experiment procedures',
      route: '/dashboard/study-materials',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: Calculator,
      title: 'Formula Sheets',
      description: 'Quick reference formula sheets for Mathematics, Physics, and Chemistry',
      route: '/dashboard/study-materials',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: FlaskConical,
      title: 'Previous Year Papers',
      description: 'Access past exam papers with solutions for better exam preparation',
      route: '/dashboard/study-materials',
      color: 'from-teal-500 to-teal-600'
    },
    {
      icon: BookMarked,
      title: 'Reference Books',
      description: 'Curated list of recommended textbooks and reference materials',
      route: '/dashboard/study-materials',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: Languages,
      title: 'Multiple Formats',
      description: 'Materials available in various formats - PDF, Videos, Presentations, etc.',
      route: '/dashboard/study-materials',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      icon: Download,
      title: 'Offline Access',
      description: 'Download materials for offline study without internet connection',
      route: '/dashboard/study-materials',
      color: 'from-violet-500 to-violet-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore All Features</h1>
              <p className="text-lg text-gray-600">
                Discover everything our platform offers to help you excel in your studies
              </p>
            </div>
          </div>
        </div>

        {/* MCQ Features Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">MCQ Practice Features</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mcqFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card 
                  key={index}
                  className="hover:shadow-xl transition-all cursor-pointer group border-2 hover:border-blue-300"
                  onClick={() => router.push(feature.route)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      {feature.badge && (
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                          {feature.badge}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Study Materials Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-8 w-8 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900">Study Materials Features</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studyMaterialFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card 
                  key={index}
                  className="hover:shadow-xl transition-all cursor-pointer group border-2 hover:border-green-300"
                  onClick={() => router.push(feature.route)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      {feature.badge && (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                          {feature.badge}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
          <CardContent className="pt-8 pb-8">
            <div className="text-center max-w-3xl mx-auto">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
              <h3 className="text-3xl font-bold mb-3">Ready to Start Your Journey?</h3>
              <p className="text-lg mb-6 opacity-90">
                Join thousands of students who have successfully prepared using our comprehensive platform
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => router.push('/dashboard/mcq-preparation')}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  Start MCQ Practice
                </Button>
                <Button
                  onClick={() => router.push('/dashboard/study-materials')}
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600"
                >
                  Browse Study Materials
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
