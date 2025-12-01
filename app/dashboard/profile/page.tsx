'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import { 
  UserIcon, 
  ArrowLeft, 
  Save, 
  GraduationCap,
  BookOpen,
  Brain,
  Building2,
  Users,
  Calendar,
  Sparkles,
  CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ProfileData {
  fullName: string
  purpose: 'study-material' | 'mcq-preparation' | ''
  // Study Material fields
  university?: string
  department?: string
  semester?: string
  // MCQ Preparation fields
  faculty?: 'ioe' | 'mbbs' | ''
}

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    purpose: '',
    university: '',
    department: '',
    semester: '',
    faculty: ''
  })

  useEffect(() => {
    const getUser = async () => {
      // Skip authentication in development mode
      if (process.env.NODE_ENV === 'development') {
        const devUser = {
          id: 'dev-user',
          email: 'dev@localhost',
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString()
        } as User
        setUser(devUser)
        
        // Load existing profile data from database
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', devUser.id)
          .single()

        if (profile && !error) {
          setProfileData({
            fullName: profile.full_name || devUser.user_metadata?.full_name || devUser.email?.split('@')[0] || '',
            purpose: profile.purpose || '',
            university: profile.university || '',
            department: profile.department || '',
            semester: profile.semester || '',
            faculty: profile.faculty || ''
          })
        } else {
          // No profile yet, use defaults
          setProfileData(prev => ({
            ...prev,
            fullName: devUser.user_metadata?.full_name || devUser.email?.split('@')[0] || ''
          }))
        }
        
        setIsLoading(false)
      }
    }

    getUser()
  }, [supabase, router])

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePurposeChange = (value: string) => {
    setProfileData(prev => ({
      ...prev,
      purpose: value as 'study-material' | 'mcq-preparation',
      // Reset conditional fields
      university: '',
      department: '',
      semester: '',
      faculty: ''
    }))
  }

  const handleSaveProfile = async () => {
    if (!profileData.fullName) {
      toast({
        title: "Missing Information",
        description: "Please enter your full name",
        variant: "destructive"
      })
      return
    }

    if (!profileData.purpose) {
      toast({
        title: "Missing Information",
        description: "Please select your purpose",
        variant: "destructive"
      })
      return
    }

    // Validate based on purpose
    if (profileData.purpose === 'study-material') {
      if (!profileData.university || !profileData.department || !profileData.semester) {
        toast({
          title: "Missing Information",
          description: "Please fill in all study material details",
          variant: "destructive"
        })
        return
      }
    } else if (profileData.purpose === 'mcq-preparation') {
      if (!profileData.faculty) {
        toast({
          title: "Missing Information",
          description: "Please select your faculty",
          variant: "destructive"
        })
        return
      }
    }

    setIsSaving(true)

    try {
      if (!user) return

      // Save to Supabase user_profiles table
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          full_name: profileData.fullName,
          purpose: profileData.purpose,
          // Study material fields
          university: profileData.purpose === 'study-material' ? profileData.university : null,
          department: profileData.purpose === 'study-material' ? profileData.department : null,
          semester: profileData.purpose === 'study-material' ? profileData.semester : null,
          // MCQ preparation fields
          faculty: profileData.purpose === 'mcq-preparation' ? profileData.faculty : null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })

      if (error) {
        console.error('Error saving profile:', error)
        toast({
          title: "Error",
          description: "Failed to save profile. Please try again.",
          variant: "destructive"
        })
        return
      }

      // Update user metadata as well
      await supabase.auth.updateUser({
        data: {
          full_name: profileData.fullName,
          profile_completed: true,
          purpose: profileData.purpose
        }
      })

      toast({
        title: "Profile Saved! 🎉",
        description: "Your personalized content is now ready!",
      })

      // Redirect back to dashboard
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4DB748]"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-52 h-52 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-52 h-52 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-52 h-52 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              className="mb-3 hover:bg-white/50 h-8 text-sm"
            >
              <ArrowLeft className="mr-2 h-3 w-3" />
              Back to Dashboard
            </Button>
            
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center mb-2">
                <Sparkles className="h-6 w-6 text-[#4DB748] animate-pulse" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                Complete Your Profile
              </h1>
              <p className="text-gray-600 text-sm">
                Let's personalize your learning experience! ✨
              </p>
            </div>
          </div>

          {/* Profile Avatar Section */}
          <Card className="mb-4 border-2 border-transparent hover:border-[#4DB748] transition-all duration-300 shadow-md">
            <CardContent className="pt-4 pb-4">
              <div className="flex flex-col items-center">
                <Avatar className="h-16 w-16 mb-2 ring-2 ring-[#4DB748] ring-offset-2">
                  <AvatarImage src={user.user_metadata?.avatar_url} alt={profileData.fullName} />
                  <AvatarFallback className="bg-gradient-to-br from-[#4DB748] to-[#45a63f] text-white text-lg">
                    {getUserInitials(profileData.fullName || 'U')}
                  </AvatarFallback>
                </Avatar>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Main Form Card */}
          <Card className="border-2 border-transparent hover:border-[#4DB748] transition-all duration-300 shadow-md">
            <CardHeader className="bg-gradient-to-r from-[#4DB748]/10 to-blue-500/10 py-3">
              <CardTitle className="flex items-center text-lg">
                <GraduationCap className="mr-2 h-5 w-5 text-[#4DB748]" />
                Personal Information
              </CardTitle>
              <CardDescription className="text-xs">
                Tell us a bit about yourself to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-sm font-semibold flex items-center">
                  <UserIcon className="mr-1.5 h-3.5 w-3.5 text-[#4DB748]" />
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={profileData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="text-sm h-9 border-2 focus:border-[#4DB748] transition-all"
                />
              </div>

              {/* Purpose Selection */}
              <div className="space-y-1.5">
                <Label htmlFor="purpose" className="text-sm font-semibold flex items-center">
                  <Sparkles className="mr-1.5 h-3.5 w-3.5 text-[#4DB748]" />
                  What brings you here?
                </Label>
                <Select value={profileData.purpose} onValueChange={handlePurposeChange}>
                  <SelectTrigger className="text-sm h-9 border-2 focus:border-[#4DB748]">
                    <SelectValue placeholder="Select your purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="study-material" className="text-sm py-2">
                      <div className="flex items-center">
                        <BookOpen className="mr-2 h-4 w-4 text-blue-500" />
                        Study Materials - Notes, Labs & Resources
                      </div>
                    </SelectItem>
                    <SelectItem value="mcq-preparation" className="text-sm py-2">
                      <div className="flex items-center">
                        <Brain className="mr-2 h-4 w-4 text-purple-500" />
                        MCQ Preparation - Practice & Tests
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Conditional Forms with Animation */}
              {profileData.purpose === 'study-material' && (
                <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                  <div className="border-t-2 border-dashed border-gray-200 pt-4">
                    <h3 className="text-sm font-semibold mb-3 flex items-center text-[#4DB748]">
                      <BookOpen className="mr-1.5 h-4 w-4" />
                      Study Material Details
                    </h3>
                    
                    {/* University/College */}
                    <div className="space-y-1.5 mb-3">
                      <Label htmlFor="university" className="text-sm font-semibold flex items-center">
                        <Building2 className="mr-1.5 h-3.5 w-3.5 text-blue-500" />
                        University / College
                      </Label>
                      <Select 
                        value={profileData.university} 
                        onValueChange={(value) => handleInputChange('university', value)}
                      >
                        <SelectTrigger className="text-sm h-9 border-2 focus:border-[#4DB748]">
                          <SelectValue placeholder="Select your university" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tu" className="text-sm">Tribhuvan University (TU)</SelectItem>
                          <SelectItem value="ku" className="text-sm">Kathmandu University (KU)</SelectItem>
                          <SelectItem value="pu" className="text-sm">Pokhara University (PU)</SelectItem>
                          <SelectItem value="ppn" className="text-sm">Purbanchal University (PPN)</SelectItem>
                          <SelectItem value="niu" className="text-sm">Nepal Sanskrit University (NSU)</SelectItem>
                          <SelectItem value="afu" className="text-sm">Agriculture and Forestry University (AFU)</SelectItem>
                          <SelectItem value="other" className="text-sm">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Department */}
                    <div className="space-y-1.5 mb-3">
                      <Label htmlFor="department" className="text-sm font-semibold flex items-center">
                        <Users className="mr-1.5 h-3.5 w-3.5 text-purple-500" />
                        Department
                      </Label>
                      <Select 
                        value={profileData.department} 
                        onValueChange={(value) => handleInputChange('department', value)}
                      >
                        <SelectTrigger className="text-sm h-9 border-2 focus:border-[#4DB748]">
                          <SelectValue placeholder="Select your department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bct" className="text-sm">Computer Engineering (BCT)</SelectItem>
                          <SelectItem value="bex" className="text-sm">Electronics Engineering (BEX)</SelectItem>
                          <SelectItem value="civil" className="text-sm">Civil Engineering</SelectItem>
                          <SelectItem value="mechanical" className="text-sm">Mechanical Engineering</SelectItem>
                          <SelectItem value="electrical" className="text-sm">Electrical Engineering</SelectItem>
                          <SelectItem value="architecture" className="text-sm">Architecture</SelectItem>
                          <SelectItem value="bca" className="text-sm">BCA (Computer Application)</SelectItem>
                          <SelectItem value="bit" className="text-sm">BIT (Information Technology)</SelectItem>
                          <SelectItem value="csit" className="text-sm">BSc.CSIT</SelectItem>
                          <SelectItem value="other" className="text-sm">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Semester */}
                    <div className="space-y-1.5">
                      <Label htmlFor="semester" className="text-sm font-semibold flex items-center">
                        <Calendar className="mr-1.5 h-3.5 w-3.5 text-green-500" />
                        Semester
                      </Label>
                      <Select 
                        value={profileData.semester} 
                        onValueChange={(value) => handleInputChange('semester', value)}
                      >
                        <SelectTrigger className="text-sm h-9 border-2 focus:border-[#4DB748]">
                          <SelectValue placeholder="Select your semester" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1" className="text-sm">1st Semester</SelectItem>
                          <SelectItem value="2" className="text-sm">2nd Semester</SelectItem>
                          <SelectItem value="3" className="text-sm">3rd Semester</SelectItem>
                          <SelectItem value="4" className="text-sm">4th Semester</SelectItem>
                          <SelectItem value="5" className="text-sm">5th Semester</SelectItem>
                          <SelectItem value="6" className="text-sm">6th Semester</SelectItem>
                          <SelectItem value="7" className="text-sm">7th Semester</SelectItem>
                          <SelectItem value="8" className="text-sm">8th Semester</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {profileData.purpose === 'mcq-preparation' && (
                <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                  <div className="border-t-2 border-dashed border-gray-200 pt-4">
                    <h3 className="text-sm font-semibold mb-3 flex items-center text-purple-600">
                      <Brain className="mr-1.5 h-4 w-4" />
                      MCQ Preparation Details
                    </h3>
                    
                    {/* Faculty */}
                    <div className="space-y-1.5">
                      <Label htmlFor="faculty" className="text-sm font-semibold flex items-center">
                        <GraduationCap className="mr-1.5 h-3.5 w-3.5 text-purple-500" />
                        Faculty
                      </Label>
                      <Select 
                        value={profileData.faculty} 
                        onValueChange={(value) => handleInputChange('faculty', value)}
                      >
                        <SelectTrigger className="text-sm h-9 border-2 focus:border-[#4DB748]">
                          <SelectValue placeholder="Select your faculty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ioe" className="text-sm py-2">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                                <GraduationCap className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">IOE</p>
                                <p className="text-[10px] text-gray-500">Institute of Engineering</p>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="mbbs" className="text-sm py-2">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-2">
                                <GraduationCap className="h-4 w-4 text-red-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">MBBS</p>
                                <p className="text-[10px] text-gray-500">Medical Entrance</p>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Info Card */}
                    <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                      <div className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-purple-900">Get Ready to Excel!</p>
                          <p className="text-[10px] text-purple-700 mt-0.5">
                            Access thousands of questions, mock tests, and practice sets tailored for your faculty.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="pt-4">
                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="w-full h-10 text-sm bg-gradient-to-r from-[#4DB748] to-[#45a63f] hover:from-[#45a63f] hover:to-[#4DB748] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Profile
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Progress Indicator */}
          {profileData.purpose && (
            <div className="mt-4 p-3 bg-white rounded-lg shadow-md animate-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-gray-700">Profile Completion</span>
                <span className="text-xs font-bold text-[#4DB748]">
                  {profileData.purpose === 'study-material' 
                    ? (profileData.university && profileData.department && profileData.semester ? '100%' : '60%')
                    : (profileData.faculty ? '100%' : '60%')
                  }
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-[#4DB748] to-[#45a63f] h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: profileData.purpose === 'study-material'
                      ? (profileData.university && profileData.department && profileData.semester ? '100%' : '60%')
                      : (profileData.faculty ? '100%' : '60%')
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
