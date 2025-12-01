'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Download } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface UploadLog {
  id: string
  file_name: string
  institution_type: string
  program: string
  records_inserted: number
  upload_status: string
  uploaded_at: string
}

export default function QuestionSetsUploadPage() {
  const [supabase] = useState(() => createClient())
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)
  const [uploadLogs, setUploadLogs] = useState<UploadLog[]>([])
  
  const [uploadData, setUploadData] = useState({
    institutionType: 'IOE',
    program: 'Engineering',
    file: null as File | null
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Validate file type
      if (!file.name.endsWith('.csv')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a CSV file',
          variant: 'destructive'
        })
        return
      }
      
      setUploadData({ ...uploadData, file })
    }
  }

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length === 0) return []
    
    const headers = lines[0].split(',').map(h => h.trim())
    const data = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      if (values.length === headers.length) {
        const row: any = {}
        headers.forEach((header, index) => {
          row[header] = values[index]
        })
        data.push(row)
      }
    }
    
    return data
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!uploadData.file) {
      toast({
        title: 'No file selected',
        description: 'Please select a CSV file to upload',
        variant: 'destructive'
      })
      return
    }

    setUploading(true)

    try {
      // Read the CSV file
      const text = await uploadData.file.text()
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

      // Get current user
      const { data: userData } = await supabase.auth.getUser()

      // Transform and insert data
      const questionSets = rows.map(row => ({
        institution_type: uploadData.institutionType,
        program: uploadData.program,
        subject: row.subject || row.Subject || '',
        year: row.year || row.Year ? parseInt(row.year || row.Year) : null,
        marks: row.marks || row.Marks ? parseFloat(row.marks || row.Marks) : null,
        question_text: row.question || row.Question || row.question_text || '',
        question_number: row.question_number || row.Question_Number ? parseInt(row.question_number || row.Question_Number) : null,
        section: row.section || row.Section || null,
        difficulty: row.difficulty || row.Difficulty || 'Medium',
        topic: row.topic || row.Topic || null,
        metadata: {
          original_data: row
        }
      }))

      // Insert into database in batches of 100
      const batchSize = 100
      let insertedCount = 0
      
      for (let i = 0; i < questionSets.length; i += batchSize) {
        const batch = questionSets.slice(i, i + batchSize)
        const { error } = await supabase
          .from('question_sets')
          .insert(batch)
        
        if (error) {
          console.error('Batch insert error:', error)
        } else {
          insertedCount += batch.length
        }
      }

      // Log the upload
      await supabase
        .from('csv_upload_logs')
        .insert({
          user_id: userData?.user?.id,
          file_name: uploadData.file.name,
          institution_type: uploadData.institutionType,
          program: uploadData.program,
          records_inserted: insertedCount,
          upload_status: insertedCount === questionSets.length ? 'success' : 'partial'
        })

      toast({
        title: 'Upload successful!',
        description: `${insertedCount} questions uploaded successfully`
      })

      // Reset form
      setUploadData({
        ...uploadData,
        file: null
      })
      
      // Reset file input
      const fileInput = document.getElementById('csv-file') as HTMLInputElement
      if (fileInput) fileInput.value = ''

      // Refresh logs
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
    const { data, error } = await supabase
      .from('csv_upload_logs')
      .select('*')
      .order('uploaded_at', { ascending: false })
      .limit(10)

    if (!error && data) {
      setUploadLogs(data)
    }
  }

  // Fetch logs on component mount
  useState(() => {
    fetchUploadLogs()
  })

  const downloadSampleCSV = () => {
    const sampleData = uploadData.institutionType === 'IOE' 
      ? 'subject,year,marks,question,question_number,section,difficulty,topic\nMathematics,2023,10,Solve the differential equation dy/dx = x + y,1,A,Medium,Differential Equations\nPhysics,2023,5,Explain Newton\'s laws of motion,2,B,Easy,Mechanics'
      : 'subject,year,marks,question,question_number,section,difficulty,topic\nAnatomy,2023,10,Describe the structure of the heart,1,A,Medium,Cardiovascular System\nPhysiology,2023,5,Explain the mechanism of respiration,2,B,Easy,Respiratory System'
    
    const blob = new Blob([sampleData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sample_${uploadData.institutionType.toLowerCase()}_questions.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Question Sets</h1>
          <p className="text-gray-600">Upload CSV files containing IOE Engineering and IOM MBBS questions</p>
        </div>

        {/* Instructions Alert */}
        <Alert className="mb-6">
          <FileText className="h-4 w-4" />
          <AlertTitle>CSV Format Instructions</AlertTitle>
          <AlertDescription>
            Your CSV file should include the following columns: <strong>subject, year, marks, question, question_number, section, difficulty, topic</strong>.
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
              Upload CSV File
            </CardTitle>
            <CardDescription>
              Select institution type and program, then upload your CSV file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Institution Type */}
                <div className="space-y-2">
                  <Label htmlFor="institution-type">Institution Type</Label>
                  <Select
                    value={uploadData.institutionType}
                    onValueChange={(value) => {
                      setUploadData({
                        ...uploadData,
                        institutionType: value,
                        program: value === 'IOE' ? 'Engineering' : 'MBBS'
                      })
                    }}
                  >
                    <SelectTrigger id="institution-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IOE">IOE (Engineering)</SelectItem>
                      <SelectItem value="IOM">IOM (Medical)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Program */}
                <div className="space-y-2">
                  <Label htmlFor="program">Program</Label>
                  <Input
                    id="program"
                    value={uploadData.program}
                    onChange={(e) => setUploadData({ ...uploadData, program: e.target.value })}
                    placeholder="e.g., Engineering, MBBS"
                    required
                  />
                </div>
              </div>

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
                  {uploadData.file && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                </div>
                {uploadData.file && (
                  <p className="text-sm text-gray-600">
                    Selected: {uploadData.file.name} ({(uploadData.file.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!uploadData.file || uploading}
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
                    Upload CSV
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Upload Logs */}
        {uploadLogs.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
              <CardDescription>History of your CSV uploads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {uploadLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {log.upload_status === 'success' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                      <div>
                        <p className="font-medium">{log.file_name}</p>
                        <p className="text-sm text-gray-600">
                          {log.institution_type} - {log.program} • {log.records_inserted} records
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(log.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
