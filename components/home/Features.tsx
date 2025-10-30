'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  FileText, 
  Beaker, 
  GraduationCap, 
  FolderKanban, 
  ListChecks,
  ArrowRight 
} from 'lucide-react';
import Link from 'next/link';

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  const features = [
    {
      title: "Study Notes",
      description: "Access comprehensive study materials and lecture notes curated by experts for better understanding.",
      icon: BookOpen,
      href: "/resources/notes",
      color: "from-blue-600 to-blue-400",
      count: "1.2k+ Notes"
    },
    {
      title: "Past Papers",
      description: "Practice with previous year question papers and solutions to excel in your exams.",
      icon: FileText,
      href: "/resources/papers",
      color: "from-purple-600 to-purple-400",
      count: "500+ Papers"
    },
    {
      title: "Lab Materials",
      description: "Get step-by-step lab manuals, code solutions and practical guides for hands-on learning.",
      icon: Beaker,
      href: "/resources/labs",
      color: "from-amber-600 to-amber-400",
      count: "300+ Labs"
    },
    {
      title: "MCQ Practice",
      description: "Test your knowledge with multiple choice questions and track your progress.",
      icon: ListChecks,
      href: "https://mcq.elivate.info",
      color: "from-green-600 to-green-400",
      count: "New!",
      external: true
    },
    {
      title: "Course Guides",
      description: "Get detailed syllabus and course structure information for better planning.",
      icon: GraduationCap,
      href: "/resources/courses",
      color: "from-red-600 to-red-400",
      count: "100+ Courses"
    },
    {
      title: "Projects",
      description: "Find project ideas, documentation and implementation guides for practical learning.",
      icon: FolderKanban,
      href: "/resources/projects",
      color: "from-indigo-600 to-indigo-400",
      count: "250+ Projects"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive academic resources designed to support your learning journey 
            from classroom to career.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
              >
                <Link
                  href={feature.href}
                  target={feature.external ? '_blank' : undefined}
                  rel={feature.external ? 'noopener noreferrer' : undefined}
                  className="block h-full"
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 h-full border border-gray-100 group-hover:border-transparent group-hover:-translate-y-2">
                    {/* Icon with gradient background */}
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-full h-full text-white" />
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#4DB748] transition-colors">
                          {feature.title}
                        </h3>
                        <span className="text-sm font-medium text-[#4DB748] bg-[#4DB748]/10 px-3 py-1 rounded-full">
                          {feature.count}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>

                      {/* CTA */}
                      <div className="flex items-center text-[#4DB748] group-hover:text-[#45a63f] transition-colors pt-2">
                        <span className="text-sm font-medium">
                          {feature.external ? 'Visit External Site' : 'Explore Now'}
                        </span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#4DB748]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link
            href="/resources"
            className="inline-flex items-center space-x-2 bg-[#4DB748] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#45a63f] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span>View All Resources</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
