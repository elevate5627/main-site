'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Search, 
  FileText, 
  Filter,
  Download,
  Star,
  Calendar,
  Users,
  ChevronDown,
  ExternalLink
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
const papers = [
  {
    id: 1,
    title: "Machine Learning Applications in Healthcare: A Comprehensive Review",
    authors: ["Dr. Sarah Johnson", "Prof. Michael Chen", "Dr. Emily Rodriguez"],
    journal: "Journal of Medical AI",
    year: 2024,
    field: "Computer Science",
    abstract: "This paper presents a comprehensive review of machine learning applications in healthcare, covering diagnostic imaging, drug discovery, and personalized treatment plans. We analyze current trends and future directions in medical AI.",
    downloads: "4.2k",
    rating: 4.9,
    publishedDate: "2024-01-15",
    pages: 28,
    doi: "10.1016/j.jmai.2024.01.003"
  },
  {
    id: 2,
    title: "Sustainable Energy Solutions: Solar Panel Efficiency Optimization",
    authors: ["Dr. Robert Kim", "Prof. Lisa Wang"],
    journal: "Renewable Energy Research",
    year: 2024,
    field: "Engineering",
    abstract: "A novel approach to optimizing solar panel efficiency through advanced materials and positioning algorithms. This research demonstrates a 23% improvement in energy conversion rates.",
    downloads: "3.1k",
    rating: 4.7,
    publishedDate: "2024-01-10",
    pages: 22,
    doi: "10.1016/j.renene.2024.01.015"
  },
  {
    id: 3,
    title: "Quantum Computing: Breaking Cryptographic Barriers",
    authors: ["Prof. Alex Thompson", "Dr. Maria Petrov", "Dr. James Wilson"],
    journal: "Quantum Information Science",
    year: 2023,
    field: "Computer Science",
    abstract: "An exploration of quantum computing's potential to revolutionize cryptography, including Shor's algorithm implementation and post-quantum cryptographic solutions.",
    downloads: "5.8k",
    rating: 4.8,
    publishedDate: "2023-12-20",
    pages: 35,
    doi: "10.1038/s41586-023-06921-8"
  },
  {
    id: 4,
    title: "CRISPR Gene Editing: Therapeutic Applications and Ethical Considerations",
    authors: ["Dr. Jennifer Adams", "Prof. David Lee"],
    journal: "Nature Biotechnology",
    year: 2024,
    field: "Biology",
    abstract: "A comprehensive analysis of CRISPR-Cas9 applications in treating genetic disorders, discussing both therapeutic potential and ethical implications of human genome editing.",
    downloads: "6.7k",
    rating: 4.9,
    publishedDate: "2024-01-08",
    pages: 31,
    doi: "10.1038/s41587-024-02156-6"
  },
  {
    id: 5,
    title: "Climate Change Modeling: Advanced Predictive Algorithms",
    authors: ["Prof. Elena Kowalski", "Dr. Mark Foster", "Dr. Priya Sharma"],
    journal: "Environmental Science & Technology",
    year: 2024,
    field: "Environmental Science",
    abstract: "Development of machine learning models for climate change prediction with improved accuracy. Analysis of temperature, precipitation, and extreme weather event forecasting.",
    downloads: "3.9k",
    rating: 4.6,
    publishedDate: "2024-01-12",
    pages: 26,
    doi: "10.1021/acs.est.3c09874"
  },
  {
    id: 6,
    title: "Blockchain Technology in Supply Chain Management",
    authors: ["Dr. Ahmed Hassan", "Prof. Sophie Martin"],
    journal: "Information Systems Research",
    year: 2023,
    field: "Computer Science",
    abstract: "Implementation of blockchain technology for transparent and secure supply chain management. Case studies from pharmaceutical and food industries demonstrate significant improvements.",
    downloads: "2.8k",
    rating: 4.5,
    publishedDate: "2023-12-18",
    pages: 19,
    doi: "10.1287/isre.2023.1234"
  }
];

const fields = [
  "All Fields",
  "Computer Science",
  "Engineering",
  "Biology",
  "Physics",
  "Chemistry",
  "Mathematics",
  "Environmental Science"
];

export default function PapersPage() {
  const [selectedField, setSelectedField] = useState("All Fields");
  const [sortBy, setSortBy] = useState("recent");

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
                Research Papers
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Explore cutting-edge research publications from leading academics and institutions. 
                Stay updated with the latest discoveries and innovations in your field of study.
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
                  placeholder="Search papers, authors, or keywords..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4DB748] focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-4">
                <div className="relative">
                  <select
                    value={selectedField}
                    onChange={(e) => setSelectedField(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#4DB748] focus:border-transparent"
                  >
                    {fields.map((field) => (
                      <option key={field} value={field}>
                        {field}
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
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Downloaded</option>
                    <option value="rating">Highest Rated</option>
                    <option value="alphabetical">Alphabetical</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Papers List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="space-y-8">
            {papers.map((paper, index) => (
              <motion.div
                key={paper.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeIn}
                custom={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-transparent hover:-translate-y-1"
              >
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm font-medium text-[#4DB748] bg-[#4DB748]/10 px-3 py-1 rounded-full">
                          {paper.field}
                        </span>
                        <div className="flex items-center text-amber-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium ml-1">{paper.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">{paper.year}</span>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#4DB748] transition-colors">
                        {paper.title}
                      </h3>

                      <div className="flex items-center text-gray-600 mb-4">
                        <Users className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {paper.authors.join(", ")}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {paper.abstract}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          <span>{paper.pages} pages</span>
                        </div>
                        <div className="flex items-center">
                          <Download className="w-4 h-4 mr-1" />
                          <span>{paper.downloads} downloads</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Published {new Date(paper.publishedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          <span>DOI: {paper.doi}</span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 mb-6">
                        <strong>Published in:</strong> {paper.journal}
                      </div>
                    </div>

                    <div className="lg:ml-8 flex flex-col gap-3 lg:w-48">
                      <button className="bg-[#4DB748] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#45a63f] transition-colors flex items-center justify-center">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </button>
                      <button className="border border-[#4DB748] text-[#4DB748] px-6 py-3 rounded-xl font-medium hover:bg-[#4DB748] hover:text-white transition-colors flex items-center justify-center">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Abstract
                      </button>
                    </div>
                  </div>
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
              Load More Papers
            </button>
          </motion.div>
        </div>
      </div>
    </AnimateLayout>
  );
}
