'use client';

import { useState } from 'react';
import { Mail, Phone, MessageSquare, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AnimateLayout from '@/components/layout/AnimateLayout';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would implement the actual form submission logic
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const supportCategories = [
    {
      icon: MessageSquare,
      title: 'General Inquiry',
      description: 'Questions about our platform, features, or services',
    },
    {
      icon: Clock,
      title: 'Technical Support',
      description: 'Issues with accessing content or technical difficulties',
    },
    {
      icon: Mail,
      title: 'Account Support',
      description: 'Help with account creation, login, or profile management',
    },
    {
      icon: Phone,
      title: 'Academic Guidance',
      description: 'Questions about study materials and academic resources',
    },
  ];

  return (
    <AnimateLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#4DB748] to-[#45a63f] py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                How Can We Help You?
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                We're here to support your academic journey. Reach out to us with any questions or concerns.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Support Categories */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {supportCategories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-[#4DB748]/10 rounded-lg flex items-center justify-center mb-4">
                    <category.icon className="w-6 h-6 text-[#4DB748]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {category.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  Contact Our Support Team
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitted && (
                    <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm mb-4">
                      Thank you for reaching out! We'll get back to you shortly.
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DB748] focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DB748] focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DB748] focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="account">Account Support</option>
                      <option value="academic">Academic Guidance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DB748] focus:border-transparent"
                      placeholder="Please describe your question or issue in detail..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#4DB748] text-white py-3 px-6 rounded-md font-medium hover:bg-[#45a63f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4DB748] focus:ring-offset-2"
                  >
                    Send Message
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Additional Contact Info */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-8">
                  Other Ways to Reach Us
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#4DB748]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-[#4DB748]" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h4>
                    <p className="text-gray-600">support@elevate.com</p>
                    <p className="text-sm text-gray-500 mt-1">Response within 24 hours</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#4DB748]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-[#4DB748]" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h4>
                    <p className="text-gray-600">Available on website</p>
                    <p className="text-sm text-gray-500 mt-1">Mon-Fri, 9 AM - 6 PM</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#4DB748]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-[#4DB748]" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Response Time</h4>
                    <p className="text-gray-600">Usually within 4-6 hours</p>
                    <p className="text-sm text-gray-500 mt-1">During business hours</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </AnimateLayout>
  );
}
