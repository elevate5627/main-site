'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AnimateLayout from '@/components/layout/AnimateLayout';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function GDPRPage() {
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

            <h1 className="text-3xl font-bold text-gray-900 mb-8">GDPR & Data Protection</h1>

            <div className="bg-white shadow-sm rounded-lg p-6 space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Your Rights Under GDPR</h2>
                <p className="text-gray-600 mb-4">
                  Under the General Data Protection Regulation (GDPR), you have several rights regarding your personal data:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li><strong>Right to Access:</strong> You can request information about what personal data we hold about you</li>
                  <li><strong>Right to Rectification:</strong> You can ask us to correct inaccurate personal data</li>
                  <li><strong>Right to Erasure:</strong> You can request deletion of your personal data</li>
                  <li><strong>Right to Restrict Processing:</strong> You can limit how we use your personal data</li>
                  <li><strong>Right to Data Portability:</strong> You can request your data in a portable format</li>
                  <li><strong>Right to Object:</strong> You can object to certain types of processing</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. What Data We Collect</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Full Name</li>
                  <li>Email Address</li>
                  <li>Contact Number (optional)</li>
                  <li>User Account Details (login ID, study progress)</li>
                  <li>IP Address and Browser Information</li>
                  <li>Usage Data (time spent, test results, progress)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How We Collect Your Data</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Directly: when you create an account, fill a form, take a test, or contact us</li>
                  <li>Automatically: through cookies and analytics tools</li>
                  <li>Via Third Parties: when you sign in using Google OAuth or similar tools</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Legal Basis for Processing</h2>
                <p className="text-gray-600 mb-4">We process your data based on:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li><strong>Consent:</strong> Where you have given clear consent</li>
                  <li><strong>Contract:</strong> Where processing is necessary for our service</li>
                  <li><strong>Legal Obligation:</strong> Where we must comply with legal requirements</li>
                  <li><strong>Legitimate Interest:</strong> Where we have a legitimate business need</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Retention</h2>
                <p className="text-gray-600">
                  We retain your personal data only for as long as necessary to fulfill the purposes 
                  for which it was collected, comply with legal obligations, and resolve disputes. 
                  Inactive accounts may be deleted after 2 years of inactivity.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Data Security</h2>
                <p className="text-gray-600">
                  We implement appropriate technical and organizational measures to ensure a level of 
                  security appropriate to the risk, including encryption, access controls, and regular 
                  security assessments.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">7. International Transfers</h2>
                <p className="text-gray-600">
                  If we transfer your data outside the EU, we ensure appropriate safeguards are in place, 
                  such as Standard Contractual Clauses or adequacy decisions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Making a Complaint</h2>
                <p className="text-gray-600">
                  If you believe we have not handled your personal data properly, you have the right to 
                  lodge a complaint with your local data protection authority.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Exercising Your Rights</h2>
                <p className="text-gray-600">
                  To exercise any of your rights under GDPR, please contact us at gdpr@elevate.com 
                  or through our support page. We will respond to your request within 30 days.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Contact Our Data Protection Officer</h2>
                <p className="text-gray-600">
                  If you have questions about data protection or our GDPR compliance, you can contact 
                  our Data Protection Officer at dpo@elevate.com.
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
