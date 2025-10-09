'use client'

import { BookOpen, MessageSquare, FileQuestion, BookMarked, FileText, Microscope, FlaskConical, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const resources = [
  {
    title: 'Notes',
    description: 'Comprehensive study notes for all subjects',
    icon: BookOpen,
    gradient: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Q&A',
    description: 'Ask questions and get expert answers',
    icon: MessageSquare,
    gradient: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-600',
  },
  {
    title: 'MCQs',
    description: 'Practice with multiple choice questions',
    icon: FileQuestion,
    gradient: 'from-orange-500/20 to-red-500/20',
    iconColor: 'text-orange-600',
  },
  {
    title: 'Syllabus',
    description: 'Complete syllabus coverage and guidelines',
    icon: BookMarked,
    gradient: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-green-600',
  },
  {
    title: 'Question Papers',
    description: 'Last 10 years solved question papers',
    icon: FileText,
    gradient: 'from-yellow-500/20 to-amber-500/20',
    iconColor: 'text-yellow-600',
  },
  {
    title: 'Case Studies',
    description: 'Real-world case studies and analysis',
    icon: Microscope,
    gradient: 'from-teal-500/20 to-cyan-500/20',
    iconColor: 'text-teal-600',
  },
  {
    title: 'Lab Notes',
    description: 'Practical lab experiments and procedures',
    icon: FlaskConical,
    gradient: 'from-rose-500/20 to-pink-500/20',
    iconColor: 'text-rose-600',
  },
  {
    title: 'Progress Tracking',
    description: 'Monitor your learning journey',
    icon: TrendingUp,
    gradient: 'from-[#4DB748]/20 to-green-500/20',
    iconColor: 'text-[#4DB748]',
  },
]

export default function BentoGrid() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Our Resources
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Access a comprehensive collection of learning materials designed to help you excel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {resources.map((resource, index) => {
            const Icon = resource.icon
            return (
              <Card
                key={resource.title}
                className={`group cursor-pointer overflow-hidden border border-gray-200 hover:border-[#4DB748] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  index === 0 || index === 7 ? 'lg:col-span-2' : ''
                }`}
              >
                <CardContent className="p-6 h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${resource.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${resource.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-7 w-7 ${resource.iconColor}`} />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#4DB748] transition-colors">
                      {resource.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed">
                      {resource.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
