'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AnimateLayout from '@/components/layout/AnimateLayout';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function TermsPage() {
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

            <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

            <div className="bg-white shadow-sm rounded-lg p-6 space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-600">
                  By accessing and using Elevate's educational platform, you accept and agree to be bound 
                  by the terms and provision of this agreement. These terms apply to all users of the service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Use License</h2>
                <p className="text-gray-600">
                  Permission is granted to temporarily access and use our educational materials for personal, 
                  non-commercial educational purposes only. This license does not include the right to 
                  download, modify, or redistribute content without explicit permission.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Privacy Policy</h2>
                <p className="text-gray-600">
                  Your privacy is important to us. Please review our Privacy Policy, which outlines how we collect, use, and protect your personal information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Content and Conduct</h2>
                <p className="text-gray-600">
                  Users are responsible for all content they post or share through our services. 
                  Content must not violate any applicable laws or infringe on others' rights.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h2>
                <p className="text-gray-600">
                  All content and materials available through our services are protected by 
                  intellectual property rights and belong to Elevate or its licensors.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Termination</h2>
                <p className="text-gray-600">
                  We may terminate or suspend access to our services immediately, without prior notice, 
                  for conduct that we believe violates these Terms of Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Disclaimers</h2>
                <p className="text-gray-600">
                  The information on this platform is provided on an 'as is' basis. To the fullest extent 
                  permitted by law, we exclude all representations, warranties, and conditions relating to our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
                <p className="text-gray-600">
                  In no event shall Elevate be liable for any special, direct, indirect, consequential, 
                  or incidental damages or any damages whatsoever arising out of the use of our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
                <p className="text-gray-600">
                  We reserve the right to revise these terms at any time without notice. By using our services, 
                  you agree to be bound by the current version of these Terms of Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
                <p className="text-gray-600">
                  If you have any questions about these Terms of Service, please contact us at 
                  legal@elevate.com or through our support page.
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
