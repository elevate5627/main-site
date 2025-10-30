'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Search, 
  BookOpen, 
  Filter,
  Download,
  Star,
  Clock,
  ChevronDown
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
const notes = [
  {
    id: 1,
    title: "Data Structures and Algorithms",
    subject: "Computer Science",
    description: "Comprehensive notes covering arrays, linked lists, trees, and graphs with implementation examples.",
    pages: 45,
    downloads: "2.3k",
    rating: 4.8,
    lastUpdated: "2024-01-15",
    thumbnail: "/api/placeholder/300/200"
  },
  {
    id: 2,
    title: "Database Management Systems",
    subject: "Computer Science",
    description: "Complete guide to DBMS concepts, SQL, normalization, and transaction management.",
    pages: 38,
    downloads: "1.8k",
    rating: 4.7,
    lastUpdated: "2024-01-10",
    thumbnail: "/api/placeholder/300/200"
  },
  {
    id: 3,
    title: "Object-Oriented Programming",
    subject: "Computer Science",
    description: "Understanding classes, objects, inheritance, polymorphism with practical examples.",
    pages: 52,
    downloads: "3.1k",
    rating: 4.9,
    lastUpdated: "2024-01-20",
    thumbnail: "/api/placeholder/300/200"
  },
  {
    id: 4,
    title: "Computer Networks",
    subject: "Computer Science",
    description: "Networking fundamentals, protocols, OSI model, and network security basics.",
    pages: 41,
    downloads: "1.5k",
    rating: 4.6,
    lastUpdated: "2024-01-12",
    thumbnail: "/api/placeholder/300/200"
  },
  {
    id: 5,
    title: "Operating Systems",
    subject: "Computer Science",
    description: "Process management, memory management, file systems, and system calls.",
    pages: 47,
    downloads: "2.0k",
    rating: 4.7,
    lastUpdated: "2024-01-18",
    thumbnail: "/api/placeholder/300/200"
  },
  {
    id: 6,
    title: "Software Engineering",
    subject: "Computer Science",
    description: "SDLC models, requirements analysis, design patterns, and testing methodologies.",
    pages: 35,
    downloads: "1.2k",
    rating: 4.5,
    lastUpdated: "2024-01-08",
    thumbnail: "/api/placeholder/300/200"
  }
];

const subjects = [
  "All Subjects",
  "Computer Science",
  "Mathematics",
  "Physics",
  "Engineering",
  "Chemistry",
  "Biology"
];

export default function NotesPage() {
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [sortBy, setSortBy] = useState("popular");

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
                Study Notes
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Access comprehensive study materials and lecture notes curated by experts 
                to help you understand complex concepts and excel in your studies.
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
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4DB748] focus:border-transparent"
                />
              </div>

              {/* Filters */}
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

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#4DB748] focus:border-transparent"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="recent">Most Recent</option>
                    <option value="rating">Highest Rated</option>
                    <option value="alphabetical">Alphabetical</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Notes Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {notes.map((note, index) => (
              <motion.div
                key={note.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeIn}
                custom={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-transparent hover:-translate-y-2"
              >
                {/* Thumbnail */}
                <div className="h-48 bg-gradient-to-br from-[#4DB748]/10 to-[#4DB748]/5 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-[#4DB748]/30" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-medium text-[#4DB748] bg-[#4DB748]/10 px-3 py-1 rounded-full">
                      {note.subject}
                    </span>
                    <div className="flex items-center text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium ml-1">{note.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#4DB748] transition-colors line-clamp-2">
                    {note.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {note.description}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      <span>{note.pages} pages</span>
                    </div>
                    <div className="flex items-center">
                      <Download className="w-4 h-4 mr-1" />
                      <span>{note.downloads}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{new Date(note.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-[#4DB748] text-white py-3 rounded-xl font-medium hover:bg-[#45a63f] transition-colors group-hover:scale-105 transform duration-200">
                    View Notes
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
              Load More Notes
            </button>
          </motion.div>
        </div>
      </div>
    </AnimateLayout>
  );
}
