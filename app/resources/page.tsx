'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  BookOpen, 
  FileText, 
  BookCopy, 
  Beaker, 
  GraduationCap, 
  FolderKanban,
  ArrowLeft,
  ArrowRight,
  FileQuestion
} from 'lucide-react';
import AnimateLayout from '@/components/layout/AnimateLayout';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: custom * 0.1,
      ease: "easeOut" as const
    }
  })
};

const resources = [
  {
    title: "MCQ Preparation",
    description: "Practice with multiple choice questions and tests to boost your exam readiness. Access a wide range of MCQs for various subjects and track your progress.",
    icon: FileText,
    href: "https://mcq.elivate.info",
    color: "from-green-600 to-green-400",
    count: "New!"
  },
  {
    title: "Question Sets",
    description: "Browse IOE Engineering and IOM MBBS past question papers with detailed information",
    icon: FileQuestion,
    href: "/resources/question-sets",
    color: "from-teal-600 to-teal-400",
    count: "IOE & IOM"
  },
  {
    title: "Study Notes",
    description: "Access comprehensive study materials and lecture notes",
    icon: BookOpen,
    href: "/resources/notes",
    color: "from-blue-600 to-blue-400",
    count: "1.2k+ Notes"
  },
  {
    title: "Past Papers",
    description: "Practice with previous year question papers and solutions",
    icon: FileText,
    href: "/resources/papers",
    color: "from-purple-600 to-purple-400",
    count: "500+ Papers"
  },
  {
    title: "Lab Materials",
    description: "Access lab manuals, code solutions and practical guides",
    icon: Beaker,
    href: "/resources/labs",
    color: "from-amber-600 to-amber-400",
    count: "300+ Labs"
  },
  {
    title: "Course Guides",
    description: "Get detailed syllabus and course structure information",
    icon: GraduationCap,
    href: "/resources/courses",
    color: "from-red-600 to-red-400",
    count: "100+ Courses"
  },
  {
    title: "Projects",
    description: "Find project ideas, documentation and implementation guides",
    icon: FolderKanban,
    href: "/resources/projects",
    color: "from-indigo-600 to-indigo-400",
    count: "250+ Projects"
  }
];

export default function ResourcesPage() {
  return (
    <AnimateLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-[#4DB748]/10 to-transparent pt-12 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={0}
            >
              <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-[#4DB748] mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={1}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Academic Resources
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Everything you need to excel in your studies, from comprehensive notes 
                to practice materials and expert guidance.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              const isExternal = resource.href.startsWith('http');
              
              return (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  custom={index + 2}
                  className="group"
                >
                  <Link
                    href={resource.href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className="block h-full"
                  >
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 h-full border border-gray-100 group-hover:border-transparent group-hover:-translate-y-2">
                      {/* Header with icon and count */}
                      <div className="flex items-start justify-between mb-6">
                        <div className={`p-4 rounded-xl bg-gradient-to-r ${resource.color} group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <span className="bg-[#4DB748]/10 text-[#4DB748] px-3 py-1 rounded-full text-sm font-medium">
                          {resource.count}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#4DB748] transition-colors">
                          {resource.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {resource.description}
                        </p>

                        {/* CTA */}
                        <div className="flex items-center text-[#4DB748] group-hover:text-[#45a63f] transition-colors pt-4">
                          <span className="text-sm font-medium">
                            {isExternal ? 'Visit External Site' : 'Explore Resources'}
                          </span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#4DB748]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Coming Soon Notice */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={8}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-[#4DB748]/10 to-[#45a63f]/10 rounded-2xl p-8 border border-[#4DB748]/20">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                More Resources Coming Soon!
              </h3>
              <p className="text-gray-600 mb-4">
                We're constantly adding new study materials and resources to help you succeed.
              </p>
              <Link
                href="/support"
                className="inline-flex items-center text-[#4DB748] hover:text-[#45a63f] font-medium transition-colors"
              >
                <span>Request specific resources</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimateLayout>
  );
}
