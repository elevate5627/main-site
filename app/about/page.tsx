'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, BookCopy, Beaker, FileText, FolderKanban, Users, Award, Target, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import AnimateLayout from '@/components/layout/AnimateLayout';

// Animation variants
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

export default function AboutPage() {
  // Academic offerings
  const offerings = [
    {
      icon: BookOpen,
      title: "Premium Study Notes",
      description: "Access expertly structured notes that clarify complex concepts and reinforce learning through clear explanations and visual aids.",
      color: "from-blue-600 to-blue-400"
    },
    {
      icon: FileText,
      title: "Updated Syllabuses",
      description: "Stay perfectly aligned with your university's latest academic schedules and requirements with our regularly updated curriculum guides.",
      color: "from-indigo-600 to-indigo-400"
    },
    {
      icon: BookCopy,
      title: "Past Exam Papers",
      description: "Prepare confidently with previous exam questions and detailed solutions that help you understand the pattern and expectations of your exams.",
      color: "from-purple-600 to-purple-400"
    },
    {
      icon: Beaker,
      title: "Lab Solutions",
      description: "Get step-by-step guidance through practical assignments and laboratory work with our comprehensive lab solution guides.",
      color: "from-green-600 to-green-400"
    },
    {
      icon: GraduationCap,
      title: "Interactive Tutorials",
      description: "Learn through simplified explanations of complex topics with our engaging, interactive tutorial content designed for deeper understanding.",
      color: "from-amber-600 to-amber-400"
    },
    {
      icon: FolderKanban,
      title: "Case Studies",
      description: "Apply theoretical knowledge to real-world examples that elevate your coursework and help you develop practical problem-solving skills.",
      color: "from-rose-600 to-rose-400"
    }
  ];

  // Our values
  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We constantly evolve our learning approaches to incorporate the latest educational technologies and methodologies."
    },
    {
      icon: Users,
      title: "Community",
      description: "We believe in fostering a supportive network where students can collaborate and learn from each other."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We hold ourselves to the highest standards in all the educational content and support we provide."
    },
    {
      icon: Target,
      title: "Focus",
      description: "We help students cut through information overload to focus on what truly matters for academic success."
    }
  ];

  return (
    <AnimateLayout>
      <div className="min-h-screen">
        {/* Background styling */}
        <div className="relative bg-gradient-to-br from-white via-green-50 to-white">
          {/* Background pattern */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/pattern-light.svg')] bg-repeat"></div>
          </div>
          
          {/* Static background elements */}
          <div className="absolute top-40 right-[20%] w-64 h-64 bg-primary-300 rounded-full blur-3xl -z-10 opacity-40" />
          <div className="absolute bottom-20 left-[10%] w-96 h-96 bg-blue-300 rounded-full blur-3xl -z-10 opacity-30" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">            
            {/* Hero Section */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={0}
              className="text-center mb-16"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                About Elevate
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Empowering students to reach their full potential through innovative learning solutions.
              </p>
            </motion.div>

            {/* Mission & Vision */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={1}
              className="mb-16"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
                <p className="text-gray-600 text-lg leading-relaxed text-center max-w-4xl mx-auto">
                  At Elevate, we're dedicated to transforming the educational experience by providing 
                  students with comprehensive, accessible, and high-quality academic resources. We believe 
                  that every student deserves the tools and support needed to excel in their studies and 
                  achieve their academic goals.
                </p>
              </div>
            </motion.div>

            {/* Key Features */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={2}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What Sets Us Apart</h2>
              <div className="grid md:grid-cols-4 gap-8">
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 text-center">
                      <div className="w-12 h-12 bg-[#4DB748]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-[#4DB748]" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                      <p className="text-gray-600 text-sm">{value.description}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Academic Offerings */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={3}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What We Offer</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {offerings.map((offering, index) => {
                  const Icon = offering.icon;
                  return (
                    <motion.div
                      key={index}
                      variants={fadeIn}
                      custom={index + 4}
                      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${offering.color} p-3 mb-4`}>
                        <Icon className="w-full h-full text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{offering.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{offering.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={10}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-[#4DB748] to-[#45a63f] rounded-2xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h2>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                  Join thousands of students who have already transformed their learning experience with our comprehensive resources.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/resources"
                    className="bg-white text-[#4DB748] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Explore Resources
                  </Link>
                  <Link
                    href="/dashboard"
                    className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimateLayout>
  );
}
