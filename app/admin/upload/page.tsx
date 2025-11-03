'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, FileText, Brain, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function ContentUploadPage() {
  const [supabase] = useState(() => createClient())
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)

  // Study Material Form State
  const [studyMaterial, setStudyMaterial] = useState({
    title: '',
    description: '',
    subject: '',
    semester: '',
    type: 'notes', // notes, labs, syllabus
    file: null as File | null,
    topics: '',
    difficulty: 'Medium'
  })

  // MCQ Form State
  const [mcqData, setMCQData] = useState({
    question: '',
    subject: '',
    topic: '',
    difficulty: 'Medium',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    explanation: ''
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setStudyMaterial({ ...studyMaterial, file: e.target.files[0] })
    }
  }

  const handleStudyMaterialUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      if (!studyMaterial.file) {
        toast({
          title: "Error",
          description: "Please select a file to upload",
          variant: "destructive"
        })
        return
      }

      // 1. Upload file to Supabase Storage
      const fileExt = studyMaterial.file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `study-materials/${studyMaterial.type}/${fileName}`

      const { data: storageData, error: storageError } = await supabase.storage
        .from('content')
        .upload(filePath, studyMaterial.file)

      if (storageError) {
        throw storageError
      }

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('content')
        .getPublicUrl(filePath)

      // 3. Insert metadata into database
      const { error: dbError } = await supabase
        .from('study_materials')
        .insert({
          title: studyMaterial.title,
          description: studyMaterial.description,
          subject: studyMaterial.subject,
          semester: parseInt(studyMaterial.semester),
          type: studyMaterial.type,
          file_url: publicUrl,
          file_path: filePath,
          file_size: studyMaterial.file.size,
          file_format: fileExt,
          topics: studyMaterial.topics.split(',').map(t => t.trim()),
          difficulty: studyMaterial.difficulty,
          downloads: 0,
          views: 0,
          rating: 0
        })

      if (dbError) {
        throw dbError
      }

      toast({
        title: "Success!",
        description: "Study material uploaded successfully",
      })

      // Reset form
      setStudyMaterial({
        title: '',
        description: '',
        subject: '',
        semester: '',
        type: 'notes',
        file: null,
        topics: '',
        difficulty: 'Medium'
      })

    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "An error occurred during upload",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const handleMCQSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      const { error } = await supabase
        .from('mcq_questions')
        .insert({
          question: mcqData.question,
          subject: mcqData.subject,
          topic: mcqData.topic,
          difficulty: mcqData.difficulty,
          options: {
            A: mcqData.optionA,
            B: mcqData.optionB,
            C: mcqData.optionC,
            D: mcqData.optionD
          },
          correct_answer: mcqData.correctAnswer,
          explanation: mcqData.explanation,
          attempts: 0,
          correct_attempts: 0
        })

      if (error) {
        throw error
      }

      toast({
        title: "Success!",
        description: "MCQ question added successfully",
      })

      // Reset form
      setMCQData({
        question: '',
        subject: '',
        topic: '',
        difficulty: 'Medium',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
        explanation: ''
      })

    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "An error occurred while adding the question",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Upload className="h-8 w-8 text-[#4DB748]" />
            <h1 className="text-3xl font-bold text-gray-900">Content Upload</h1>
          </div>
          <p className="text-gray-600">Upload study materials and add MCQ questions</p>
        </div>

        {/* Upload Tabs */}
        <Tabs defaultValue="study-materials" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="study-materials">
              <FileText className="h-4 w-4 mr-2" />
              Study Materials
            </TabsTrigger>
            <TabsTrigger value="mcq">
              <Brain className="h-4 w-4 mr-2" />
              MCQ Questions
            </TabsTrigger>
          </TabsList>

          {/* Study Materials Upload */}
          <TabsContent value="study-materials">
            <Card>
              <CardHeader>
                <CardTitle>Upload Study Material</CardTitle>
                <CardDescription>
                  Upload notes, lab manuals, or syllabus documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleStudyMaterialUpload} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        required
                        value={studyMaterial.title}
                        onChange={(e) => setStudyMaterial({ ...studyMaterial, title: e.target.value })}
                        placeholder="Data Structures and Algorithms"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        required
                        value={studyMaterial.subject}
                        onChange={(e) => setStudyMaterial({ ...studyMaterial, subject: e.target.value })}
                        placeholder="Computer Science"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      required
                      value={studyMaterial.description}
                      onChange={(e) => setStudyMaterial({ ...studyMaterial, description: e.target.value })}
                      placeholder="Comprehensive notes covering all topics..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type *</Label>
                      <Select
                        value={studyMaterial.type}
                        onValueChange={(value) => setStudyMaterial({ ...studyMaterial, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="notes">Notes</SelectItem>
                          <SelectItem value="labs">Lab Manual</SelectItem>
                          <SelectItem value="syllabus">Syllabus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="semester">Semester *</Label>
                      <Select
                        value={studyMaterial.semester}
                        onValueChange={(value) => setStudyMaterial({ ...studyMaterial, semester: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                            <SelectItem key={sem} value={sem.toString()}>{sem}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty *</Label>
                      <Select
                        value={studyMaterial.difficulty}
                        onValueChange={(value) => setStudyMaterial({ ...studyMaterial, difficulty: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="topics">Topics (comma-separated)</Label>
                    <Input
                      id="topics"
                      value={studyMaterial.topics}
                      onChange={(e) => setStudyMaterial({ ...studyMaterial, topics: e.target.value })}
                      placeholder="Arrays, Linked Lists, Trees, Graphs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file">File Upload *</Label>
                    <Input
                      id="file"
                      type="file"
                      required
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                    />
                    <p className="text-xs text-gray-500">Supported formats: PDF, DOC, DOCX, PPT, PPTX (Max: 50MB)</p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#4DB748] hover:bg-[#45a63f]"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Material
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MCQ Questions */}
          <TabsContent value="mcq">
            <Card>
              <CardHeader>
                <CardTitle>Add MCQ Question</CardTitle>
                <CardDescription>
                  Create multiple choice questions for practice tests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMCQSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="question">Question *</Label>
                    <Textarea
                      id="question"
                      required
                      value={mcqData.question}
                      onChange={(e) => setMCQData({ ...mcqData, question: e.target.value })}
                      placeholder="Enter your question here..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mcq-subject">Subject *</Label>
                      <Input
                        id="mcq-subject"
                        required
                        value={mcqData.subject}
                        onChange={(e) => setMCQData({ ...mcqData, subject: e.target.value })}
                        placeholder="Physics"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="topic">Topic *</Label>
                      <Input
                        id="topic"
                        required
                        value={mcqData.topic}
                        onChange={(e) => setMCQData({ ...mcqData, topic: e.target.value })}
                        placeholder="Mechanics"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mcq-difficulty">Difficulty *</Label>
                      <Select
                        value={mcqData.difficulty}
                        onValueChange={(value) => setMCQData({ ...mcqData, difficulty: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Options *</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="optionA">Option A</Label>
                        <Input
                          id="optionA"
                          required
                          value={mcqData.optionA}
                          onChange={(e) => setMCQData({ ...mcqData, optionA: e.target.value })}
                          placeholder="Option A"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="optionB">Option B</Label>
                        <Input
                          id="optionB"
                          required
                          value={mcqData.optionB}
                          onChange={(e) => setMCQData({ ...mcqData, optionB: e.target.value })}
                          placeholder="Option B"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="optionC">Option C</Label>
                        <Input
                          id="optionC"
                          required
                          value={mcqData.optionC}
                          onChange={(e) => setMCQData({ ...mcqData, optionC: e.target.value })}
                          placeholder="Option C"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="optionD">Option D</Label>
                        <Input
                          id="optionD"
                          required
                          value={mcqData.optionD}
                          onChange={(e) => setMCQData({ ...mcqData, optionD: e.target.value })}
                          placeholder="Option D"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="correctAnswer">Correct Answer *</Label>
                    <Select
                      value={mcqData.correctAnswer}
                      onValueChange={(value) => setMCQData({ ...mcqData, correctAnswer: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Option A</SelectItem>
                        <SelectItem value="B">Option B</SelectItem>
                        <SelectItem value="C">Option C</SelectItem>
                        <SelectItem value="D">Option D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="explanation">Explanation (Optional)</Label>
                    <Textarea
                      id="explanation"
                      value={mcqData.explanation}
                      onChange={(e) => setMCQData({ ...mcqData, explanation: e.target.value })}
                      placeholder="Explain why this is the correct answer..."
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#4DB748] hover:bg-[#45a63f]"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding Question...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Add Question
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-blue-500" />
              Upload Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Ensure all files are virus-free and safe</li>
              <li>• Use clear, descriptive titles for better searchability</li>
              <li>• Add relevant topics to help students find content</li>
              <li>• For MCQs, provide detailed explanations when possible</li>
              <li>• Maximum file size: 50MB per upload</li>
              <li>• Supported formats: PDF, DOC, DOCX, PPT, PPTX</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
