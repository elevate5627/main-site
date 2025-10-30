'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ChevronDown, LogIn, User, BookOpen, 
  Home, Settings, LogOut, Layers, Info, Video, FileText, Play, BookCheck,  
  List, StickyNote, FileSearch, ListChecks, 
  History, ClipboardList
} from 'lucide-react';
import Logo from '@/components/common/Logo';
import { createClient } from '@/lib/supabase-client';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    // Get user session
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setDropdownOpen(false);
  };

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About', href: '/about', icon: Info },
    { 
      name: 'Resources', 
      href: '/resources', 
      icon: Layers,
      megaMenu: [
        {
          category: 'Study Materials',
          items: [
            { name: 'Study Notes', href: '/resources/notes', icon: StickyNote, description: 'Comprehensive study materials' },
            { name: 'Past Papers', href: '/resources/papers', icon: FileSearch, description: 'Previous year question papers' },
            { name: 'MCQ Practice', href: 'https://mcq.elivate.info', icon: ListChecks, description: 'Multiple choice questions', external: true },
          ]
        },
        {
          category: 'Academic Resources',
          items: [
            { name: 'Lab Materials', href: '/resources/labs', icon: BookCheck, description: 'Laboratory guides and solutions' },
            { name: 'Course Guides', href: '/resources/courses', icon: BookOpen, description: 'Detailed syllabus information' },
            { name: 'Projects', href: '/resources/projects', icon: ClipboardList, description: 'Project ideas and guides' },
          ]
        }
      ]
    },
    { name: 'Support', href: '/support', icon: User },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                {item.megaMenu ? (
                  <button
                    onMouseEnter={() => setMegaMenuOpen(item.name)}
                    onMouseLeave={() => setMegaMenuOpen(null)}
                    className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors ${
                      pathname.startsWith(item.href)
                        ? 'text-[#4DB748]'
                        : 'text-gray-700 hover:text-[#4DB748]'
                    }`}
                  >
                    <span>{item.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? 'text-[#4DB748]'
                        : 'text-gray-700 hover:text-[#4DB748]'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}

                {/* Mega Menu */}
                {item.megaMenu && megaMenuOpen === item.name && (
                  <div
                    onMouseEnter={() => setMegaMenuOpen(item.name)}
                    onMouseLeave={() => setMegaMenuOpen(null)}
                    className="absolute top-full left-0 w-96 bg-white rounded-lg shadow-xl border border-gray-100 p-6 mt-2"
                  >
                    <div className="grid grid-cols-1 gap-6">
                      {item.megaMenu.map((category) => (
                        <div key={category.category}>
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">
                            {category.category}
                          </h3>
                          <div className="space-y-2">
                            {category.items.map((menuItem) => (
                              <Link
                                key={menuItem.name}
                                href={menuItem.href}
                                target={menuItem.external ? '_blank' : undefined}
                                rel={menuItem.external ? 'noopener noreferrer' : undefined}
                                className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <menuItem.icon className="w-5 h-5 text-[#4DB748] mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {menuItem.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {menuItem.description}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-[#4DB748] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2"
                    >
                      <Link
                        href="/dashboard"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-2 bg-[#4DB748] text-white px-4 py-2 rounded-lg hover:bg-[#45a63f] transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-[#4DB748] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              
              <hr className="my-4" />
              
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 bg-[#4DB748] text-white px-3 py-2 rounded-lg w-full"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
