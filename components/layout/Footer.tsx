'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Linkedin, Music } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: '#', label: 'Facebook' },
    { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
    { icon: <Instagram className="w-5 h-5" />, href: '#', label: 'Instagram' },
    { icon: <Linkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn' },
    { icon: <Music className="w-5 h-5" />, href: '#', label: 'Blog' }
  ];

  return (
    <footer className="bg-[#5BB450] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-16">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <Link href="/" className="inline-block">
                <Image
                  src="/png/white-logo.png"
                  alt="Elivate"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </Link>
              <span className="text-xl font-bold text-white">Elivate</span>
            </div>
            <p className="text-white text-sm leading-relaxed mb-5 max-w-xs">
              Empowering students to achieve academic excellence through innovative learning tools and resources.
            </p>
            <div className="flex space-x-2.5">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/20 rounded flex items-center justify-center hover:bg-white/30 transition-colors duration-300"
                  aria-label={social.label}
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold mb-4 text-base">Product</h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/resources"
                  className="text-white/90 hover:text-white transition-colors duration-300 text-sm"
                >
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold mb-4 text-base">Company</h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/about"
                  className="text-white/90 hover:text-white transition-colors duration-300 text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-white/90 hover:text-white transition-colors duration-300 text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold mb-4 text-base">Legal</h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/privacy"
                  className="text-white/90 hover:text-white transition-colors duration-300 text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-white/90 hover:text-white transition-colors duration-300 text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/gdpr"
                  className="text-white/90 hover:text-white transition-colors duration-300 text-sm"
                >
                  GDPR Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-white/90 text-sm">
              © 2025 Elivate Learning. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm">
              <Link href="/privacy" className="text-white/90 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-white/90 hover:text-white transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
