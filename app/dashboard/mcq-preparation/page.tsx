import React from 'react';
import AnimateLayout from '@/components/layout/AnimateLayout';
import { Brain } from 'lucide-react';

export default function McqPreparationPage() {
  return (
    <AnimateLayout>
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="flex items-center space-x-3 mb-6">
          <Brain className="w-8 h-8 text-[#4DB748]" />
          <h1 className="text-3xl font-bold text-gray-900">MCQ Preparation</h1>
        </div>
        <p className="text-gray-600 text-lg mb-8">
          This section will soon provide MCQ practice and preparation tools for your courses.
        </p>
        <div className="bg-gray-100 rounded-xl p-8 text-center text-gray-500">
          Coming soon!
        </div>
      </div>
    </AnimateLayout>
  );
}
