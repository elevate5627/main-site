'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  BookOpen, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  FileText,
  TrendingUp,
  Award
} from 'lucide-react'
import { MockTestRules } from '@/lib/mock-test-rules'

interface MockTestInstructionsProps {
  rules: MockTestRules
  onStartTest: () => void
  totalQuestions: number
}

export function MockTestInstructions({ rules, onStartTest, totalQuestions }: MockTestInstructionsProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <FileText className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {rules.faculty === 'ioe' ? 'IOE Engineering' : 'IOM MBBS'} Mock Test
        </h1>
        <p className="text-gray-600">{rules.examPattern}</p>
      </div>

      {/* Key Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-2xl font-bold text-gray-900">{rules.duration} min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Questions</p>
                <p className="text-2xl font-bold text-gray-900">{rules.totalQuestions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Marks</p>
                <p className="text-2xl font-bold text-gray-900">{rules.totalMarks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Marking Scheme */}
      <Card className="border-2 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            Marking Scheme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900">Correct Answer</p>
                <p className="text-sm text-green-700">+1 mark</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-900">Wrong Answer</p>
                <p className="text-sm text-red-700">-{rules.negativeMarkingRatio} marks</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <AlertCircle className="h-6 w-6 text-gray-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Unanswered</p>
                <p className="text-sm text-gray-700">0 marks</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-900">
              <strong>Passing Marks:</strong> {rules.passingPercentage}% ({(rules.totalMarks * rules.passingPercentage) / 100} marks out of {rules.totalMarks})
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Subject Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#4DB748]" />
            Subject Distribution
          </CardTitle>
          <CardDescription>Questions and marks for each subject</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rules.subjectDistribution.map((subject, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-semibold">{index + 1}</Badge>
                  <span className="font-medium text-gray-900">{subject.subject}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-sm text-gray-600">
                    <strong>{subject.questions}</strong> questions
                  </span>
                  <span className="text-sm text-gray-600">
                    <strong>{subject.marks}</strong> marks
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            Important Instructions
          </CardTitle>
          <CardDescription>Please read carefully before starting the test</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {rules.instructions.map((instruction, index) => (
              <li key={index} className="flex items-start gap-2">
                {instruction.startsWith('  •') ? (
                  <span className="text-sm text-gray-700 ml-6">{instruction}</span>
                ) : instruction.match(/^\d+\./) || instruction.includes(':') ? (
                  <>
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span className="text-sm text-gray-700 font-medium">{instruction}</span>
                  </>
                ) : (
                  <>
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span className="text-sm text-gray-700">{instruction}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Warning */}
      <Card className="border-2 border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="font-semibold text-red-900">Important Notice:</p>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• The timer will start as soon as you click "Start Test"</li>
                <li>• The test will auto-submit when time runs out</li>
                <li>• You cannot pause or restart the test once started</li>
                <li>• Make sure you have stable internet connection</li>
                <li>• Do not refresh or close the browser during the test</li>
                {rules.allowedAttempts && (
                  <li>• You are allowed only <strong>{rules.allowedAttempts}</strong> attempt(s) for this test</li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Declaration */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="declaration"
                className="mt-1 h-4 w-4 text-[#4DB748] focus:ring-[#4DB748] border-gray-300 rounded"
                required
              />
              <label htmlFor="declaration" className="text-sm text-gray-700">
                I have read and understood all the instructions. I am ready to begin the test and agree to follow all the rules and regulations.
              </label>
            </div>
            <Button
              onClick={onStartTest}
              className="w-full bg-[#4DB748] hover:bg-[#45a63f] text-white text-lg py-6"
              size="lg"
            >
              Start Mock Test
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Questions Warning */}
      {totalQuestions < rules.totalQuestions && (
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-yellow-900 mb-1">Notice:</p>
                <p className="text-sm text-yellow-800">
                  Currently, only <strong>{totalQuestions}</strong> questions are available in the database 
                  (Expected: {rules.totalQuestions} questions). The test will proceed with available questions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
