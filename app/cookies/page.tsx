'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AnimateLayout from '@/components/layout/AnimateLayout';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function CookiePolicy() {
  return (
    <AnimateLayout>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeIn}
          >
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>

            <div className="bg-white shadow-sm rounded-lg p-6 space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">What Are Cookies</h2>
                <p className="text-gray-600">
                  Cookies are small text files that are placed on your computer or mobile device when you 
                  visit our website. They help us provide you with a better experience by remembering your 
                  preferences and understanding how you use our platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">How We Use Cookies</h2>
                <p className="text-gray-600 mb-4">We use cookies for several purposes:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>To remember your login status and preferences</li>
                  <li>To analyze how our website is used and improve performance</li>
                  <li>To provide personalized content and recommendations</li>
                  <li>To ensure security and prevent fraud</li>
                  <li>To measure the effectiveness of our educational content</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Types of Cookies We Use</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                    <p className="text-gray-600">
                      These cookies are necessary for our website to function properly and cannot be disabled.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Analytics Cookies</h3>
                    <p className="text-gray-600">
                      These help us understand how visitors interact with our website by collecting anonymous information.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Functional Cookies</h3>
                    <p className="text-gray-600">
                      These cookies enable enhanced functionality and personalization, such as remembering your study preferences.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Managing Cookies</h2>
                <p className="text-gray-600">
                  You can control and manage cookies in various ways. Most web browsers allow you to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
                  <li>View what cookies are stored on your device</li>
                  <li>Delete cookies individually or all cookies</li>
                  <li>Block cookies from specific sites</li>
                  <li>Block all cookies from all sites</li>
                  <li>Set preferences for accepting cookies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Third-Party Cookies</h2>
                <p className="text-gray-600">
                  Some cookies on our site are set by third-party services that appear on our pages. 
                  These include social media platforms, analytics services, and educational content providers. 
                  We do not control these cookies, and you should check the relevant third party's cookie policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Updates to This Policy</h2>
                <p className="text-gray-600">
                  We may update this Cookie Policy from time to time to reflect changes in our practices 
                  or for other operational, legal, or regulatory reasons.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-600">
                  If you have any questions about our use of cookies, please contact us at 
                  privacy@elevate.com or through our support page.
                </p>
              </section>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimateLayout>
  );
}
