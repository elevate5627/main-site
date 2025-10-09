import Header from '@/components/Header'
import BentoGrid from '@/components/BentoGrid'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen, Users, Award } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#4DB748]/10 via-transparent to-transparent" />

        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-[#4DB748]/10 border border-[#4DB748]/20">
              <span className="text-sm font-medium text-[#4DB748]">Welcome to the Future of Learning</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Master Your Education
              <span className="block text-[#4DB748] mt-2">One Resource at a Time</span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Access comprehensive study materials, practice questions, and expert guidance to excel in your academic journey
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/login">
                <Button size="lg" className="bg-[#4DB748] hover:bg-[#45a840] text-white text-lg px-8 py-6 rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl group">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full border-2 border-gray-300 hover:border-[#4DB748] hover:text-[#4DB748] transition-all duration-200">
                Learn More
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
              <div className="flex flex-col items-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                <div className="w-12 h-12 rounded-full bg-[#4DB748]/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-[#4DB748]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">1000+</h3>
                <p className="text-gray-600 text-sm">Study Resources</p>
              </div>

              <div className="flex flex-col items-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                <div className="w-12 h-12 rounded-full bg-[#4DB748]/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-[#4DB748]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">50K+</h3>
                <p className="text-gray-600 text-sm">Active Students</p>
              </div>

              <div className="flex flex-col items-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                <div className="w-12 h-12 rounded-full bg-[#4DB748]/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-[#4DB748]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">98%</h3>
                <p className="text-gray-600 text-sm">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BentoGrid />

      <section className="py-20 px-4 bg-gradient-to-br from-[#4DB748] to-[#45a840]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Join thousands of students who are already achieving their academic goals
          </p>
          <Link href="/login">
            <Button size="lg" variant="secondary" className="bg-white text-[#4DB748] hover:bg-gray-100 text-lg px-8 py-6 rounded-full transition-all duration-200 hover:scale-105 shadow-lg">
              Sign Up Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-gray-200">
        <div className="container mx-auto text-center text-gray-600">
          <p>&copy; 2025 Elivate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
