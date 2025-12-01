'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Download } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface UploadLog {
  id: string
  file_name: string
  records_inserted: number
  upload_status: string
  uploaded_at: string
}

export default function MCQCSVUploadPage() {
  const [supabase] = useState(() => createClient())
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)
  const [uploadLogs, setUploadLogs] = useState<UploadLog[]>([])
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      
      if (!selectedFile.name.endsWith('.csv')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a CSV file',
          variant: 'destructive'
        })
        return
      }
      
      setFile(selectedFile)
    }
  }

  const parseCSV = (text: string): any[] => {
    const rows: any[] = []
    let currentRow: string[] = []
    let currentField = ''
    let inQuotes = false
    let headers: string[] = []
    
    // Parse character by character to handle quoted fields with commas and newlines
    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      const nextChar = text[i + 1]
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Double quote inside quoted field
          currentField += '"'
          i++ // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        currentRow.push(currentField.trim())
        currentField = ''
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        // End of row
        if (currentField || currentRow.length > 0) {
          currentRow.push(currentField.trim())
          
          if (headers.length === 0) {
            // First row is headers
            headers = currentRow
          } else if (currentRow.length === headers.length) {
            // Create object from row
            const rowObj: any = {}
            headers.forEach((header, index) => {
              rowObj[header] = currentRow[index] || ''
            })
            rows.push(rowObj)
          }
          
          currentRow = []
          currentField = ''
        }
        
        // Skip \r\n combinations
        if (char === '\r' && nextChar === '\n') {
          i++
        }
      } else {
        currentField += char
      }
    }
    
    // Handle last row if exists
    if (currentField || currentRow.length > 0) {
      currentRow.push(currentField.trim())
      if (headers.length > 0 && currentRow.length === headers.length) {
        const rowObj: any = {}
        headers.forEach((header, index) => {
          rowObj[header] = currentRow[index] || ''
        })
        rows.push(rowObj)
      }
    }
    
    console.log(`Parsed ${rows.length} rows from CSV`)
    return rows
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a CSV file to upload',
        variant: 'destructive'
      })
      return
    }

    setUploading(true)

    try {
      const text = await file.text()
      const rows = parseCSV(text)

      if (rows.length === 0) {
        toast({
          title: 'Empty file',
          description: 'The CSV file appears to be empty or invalid',
          variant: 'destructive'
        })
        setUploading(false)
        return
      }

      // Get user ID (or use null for development)
      let userId = null
      try {
        const { data: userData } = await supabase.auth.getUser()
        userId = userData?.user?.id || null
      } catch (error) {
        console.log('No auth user, continuing without user ID')
      }

      // Transform MCQ data to match database structure
      const mcqQuestions = rows.map(row => {
        const options: any = {
          A: row.option_1 || '',
          B: row.option_2 || '',
          C: row.option_3 || '',
          D: row.option_4 || ''
        }

        // Add image URLs if present
        if (row.option_1_image_url) options.A_image = row.option_1_image_url
        if (row.option_2_image_url) options.B_image = row.option_2_image_url
        if (row.option_3_image_url) options.C_image = row.option_3_image_url
        if (row.option_4_image_url) options.D_image = row.option_4_image_url

        // Determine correct answer based on answer_option_number
        const answerNum = parseInt(row.answer_option_number || '1')
        const correctAnswer = ['A', 'B', 'C', 'D'][answerNum - 1] || 'A'

        return {
          question: row.question_text || '',
          subject: row.course_name || row.chapter || 'General',
          topic: row.Topic || row.chapter || '',
          difficulty: row.difficulty || 'Medium',
          options: options,
          correct_answer: correctAnswer,
          explanation: '', // Can be added if available in CSV
          attempts: 0,
          correct_attempts: 0,
          author_id: userId
        }
      }).filter(q => q.question.trim() !== '')

      console.log(`Parsed ${mcqQuestions.length} questions from CSV`)
      console.log('First question sample:', mcqQuestions[0])

      // Insert into database in batches
      const batchSize = 100
      let insertedCount = 0
      let errorCount = 0
      
      for (let i = 0; i < mcqQuestions.length; i += batchSize) {
        const batch = mcqQuestions.slice(i, i + batchSize)
        const { data, error } = await supabase
          .from('mcq_questions')
          .insert(batch)
          .select()
        
        if (error) {
          console.error(`Batch ${i / batchSize + 1} insert error:`, error)
          errorCount += batch.length
        } else {
          insertedCount += batch.length
          console.log(`Batch ${i / batchSize + 1}: Inserted ${batch.length} questions`)
        }
      }

      if (errorCount > 0) {
        console.error(`Failed to insert ${errorCount} questions`)
      }

      toast({
        title: 'Upload successful!',
        description: `${insertedCount} MCQ questions uploaded successfully out of ${mcqQuestions.length} total`
      })

      // Reset form
      setFile(null)
      const fileInput = document.getElementById('csv-file') as HTMLInputElement
      if (fileInput) fileInput.value = ''

      fetchUploadLogs()

    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'An error occurred during upload',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  const fetchUploadLogs = async () => {
    // This would need a separate table to track MCQ uploads
    // For now, we'll skip this
  }

  const downloadSampleCSV = () => {
    const sampleData = `question_text,question_image_url,course_name,chapter,Topic,marks,difficulty,option_1,option_1_image_url,option_2,option_2_image_url,option_3,option_3_image_url,option_4,option_4_image_url,answer_option_number
What is the capital of France?,,Geography,Europe,Capitals,1,Easy,London,,Paris,,Berlin,,Madrid,,2
Which planet is closest to the Sun?,,Science,Astronomy,Solar System,1,Easy,Venus,,Mercury,,Mars,,Earth,,2`
    
    const blob = new Blob([sampleData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample_mcq_questions.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload MCQ Questions (CSV)</h1>
          <p className="text-gray-600">Upload CSV files containing MCQ questions with options and answers</p>
        </div>

        {/* Instructions Alert */}
        <Alert className="mb-6">
          <FileText className="h-4 w-4" />
          <AlertTitle>CSV Format Instructions</AlertTitle>
          <AlertDescription>
            Your CSV file should include: <strong>question_text, course_name, chapter, Topic, marks, difficulty, option_1, option_2, option_3, option_4, answer_option_number</strong>.
            <br />
            The answer_option_number should be 1, 2, 3, or 4 corresponding to the correct option.
            <br />
            <Button 
              variant="link" 
              className="px-0 h-auto font-normal text-sm"
              onClick={downloadSampleCSV}
            >
              <Download className="h-3 w-3 mr-1" />
              Download sample CSV
            </Button>
          </AlertDescription>
        </Alert>

        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload MCQ CSV File
            </CardTitle>
            <CardDescription>
              Select your CSV file containing MCQ questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-6">
              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="csv-file">CSV File</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="cursor-pointer"
                  />
                  {file && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                </div>
                {file && (
                  <p className="text-sm text-gray-600">
                    Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!file || uploading}
                className="w-full"
                size="lg"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload MCQ CSV
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About Your CSV Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>✓ Your MBBS QBank CSV has <strong>4,715 questions</strong></p>
              <p>✓ Your IOE MCQ CSV has <strong>1,707 questions</strong></p>
              <p>✓ Both files will be uploaded to the MCQ questions database</p>
              <p>✓ Questions will be available in the MCQ Preparation section</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
