'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Search, 
  Beaker, 
  Play,
  Code,
  Star,
  Clock,
  Users,
  ChevronDown,
  MonitorPlay,
  BookOpen
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

// Mock data for demonstration
const labs = [
  {
    id: 1,
    title: "Data Structures Implementation Lab",
    subject: "Computer Science",
    description: "Interactive coding exercises for implementing arrays, linked lists, stacks, queues, trees, and graphs with real-time visualization.",
    difficulty: "Intermediate",
    duration: "3-4 hours",
    exercises: 12,
    completions: "8.2k",
    rating: 4.8,
    type: "Interactive",
    technologies: ["Python", "JavaScript", "Visualization"],
    thumbnail: "/api/placeholder/400/250"
  },
  {
    id: 2,
    title: "Machine Learning Fundamentals",
    subject: "Computer Science",
    description: "Hands-on implementation of linear regression, decision trees, and neural networks using popular ML libraries.",
    difficulty: "Advanced",
    duration: "4-5 hours",
    exercises: 8,
    completions: "5.7k",
    rating: 4.9,
    type: "Coding Lab",
    technologies: ["Python", "Scikit-learn", "TensorFlow"],
    thumbnail: "/api/placeholder/400/250"
  },
  {
    id: 3,
    title: "Database Design and SQL Queries",
    subject: "Computer Science",
    description: "Design databases, write complex SQL queries, and optimize database performance with real-world scenarios.",
    difficulty: "Intermediate",
    duration: "2-3 hours",
    exercises: 15,
    completions: "6.1k",
    rating: 4.7,
    type: "Interactive",
    technologies: ["SQL", "PostgreSQL", "MySQL"],
    thumbnail: "/api/placeholder/400/250"
  },
  {
    id: 4,
    title: "Chemistry Virtual Lab - Organic Reactions",
    subject: "Chemistry",
    description: "Simulate organic chemistry reactions in a safe virtual environment with 3D molecular visualization.",
    difficulty: "Intermediate",
    duration: "2-3 hours",
    exercises: 10,
    completions: "4.3k",
    rating: 4.6,
    type: "Virtual Lab",
    technologies: ["3D Simulation", "Molecular Modeling"],
    thumbnail: "/api/placeholder/400/250"
  },
  {
    id: 5,
    title: "Physics Mechanics Simulation",
    subject: "Physics",
    description: "Interactive simulations of classical mechanics including projectile motion, collisions, and energy conservation.",
    difficulty: "Beginner",
    duration: "1-2 hours",
    exercises: 8,
    completions: "9.1k",
    rating: 4.5,
    type: "Simulation",
    technologies: ["Physics Engine", "Interactive Graphics"],
    thumbnail: "/api/placeholder/400/250"
  },
  {
    id: 6,
    title: "Web Development Full Stack Project",
    subject: "Computer Science",
    description: "Build a complete web application from frontend to backend including authentication, database, and deployment.",
    difficulty: "Advanced",
    duration: "6-8 hours",
    exercises: 20,
    completions: "3.8k",
    rating: 4.8,
    type: "Project Lab",
    technologies: ["React", "Node.js", "MongoDB", "Express"],
    thumbnail: "/api/placeholder/400/250"
  }
];

const subjects = [
  "All Subjects",
  "Computer Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Mathematics",
  "Engineering"
];

const difficulties = [
  "All Levels",
  "Beginner",
  "Intermediate",
  "Advanced"
];

const labTypes = [
  "All Types",
  "Interactive",
  "Coding Lab",
  "Virtual Lab",
  "Simulation",
  "Project Lab"
];

export default function LabsPage() {
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
  const [selectedType, setSelectedType] = useState("All Types");

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AnimateLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header Section */}
        <div className="bg-gradient-to-b from-[#4DB748]/10 to-transparent pt-12 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={0}
            >
              <Link
                href="/resources"
                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-[#4DB748] mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Resources
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
                Interactive Labs
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Learn by doing with our interactive coding labs, virtual experiments, and 
                hands-on simulations. Practice real-world skills in a guided environment.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={2}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search labs..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4DB748] focus:border-transparent"
                />
              </div>

              {/* Primary Filters */}
              <div className="flex gap-4">
                <div className="relative">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#4DB748] focus:border-transparent"
                  >
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Secondary Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#4DB748] focus:border-transparent"
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#4DB748] focus:border-transparent"
                >
                  {labTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Labs Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {labs.map((lab, index) => (
              <motion.div
                key={lab.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeIn}
                custom={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-transparent hover:-translate-y-2"
              >
                {/* Thumbnail */}
                <div className="h-48 bg-gradient-to-br from-[#4DB748]/10 to-[#4DB748]/5 flex items-center justify-center relative">
                  <Beaker className="w-16 h-16 text-[#4DB748]/30" />
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-medium text-[#4DB748] bg-white/90 px-2 py-1 rounded-full">
                      {lab.type}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(lab.difficulty)}`}>
                      {lab.difficulty}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-medium text-[#4DB748] bg-[#4DB748]/10 px-3 py-1 rounded-full">
                      {lab.subject}
                    </span>
                    <div className="flex items-center text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium ml-1">{lab.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#4DB748] transition-colors line-clamp-2">
                    {lab.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {lab.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {lab.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{lab.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      <span>{lab.exercises} exercises</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{lab.completions} completed</span>
                    </div>
                    <div className="flex items-center">
                      <MonitorPlay className="w-4 h-4 mr-1" />
                      <span>Interactive</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-[#4DB748] text-white py-3 rounded-xl font-medium hover:bg-[#45a63f] transition-colors group-hover:scale-105 transform duration-200 flex items-center justify-center">
                    <Play className="w-4 h-4 mr-2" />
                    Start Lab
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
            custom={6}
            className="text-center mt-12"
          >
            <button className="bg-white border-2 border-[#4DB748] text-[#4DB748] px-8 py-4 rounded-xl font-semibold hover:bg-[#4DB748] hover:text-white transition-colors">
              Load More Labs
            </button>
          </motion.div>
        </div>
      </div>
    </AnimateLayout>
  );
}
