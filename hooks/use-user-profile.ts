import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'

/**
 * Development Mode Configuration:
 * Change the 'faculty' value in the mockProfile below to test different views:
 * - 'ioe' for IOE Engineering subjects (Physics, Chemistry, Mathematics, English)
 * - 'mbbs' for IOM MBBS subjects (Physics, Chemistry, Botany, Zoology, MAT)
 */

export interface UserProfile {
  user_id: string
  full_name: string
  purpose: 'study-material' | 'mcq-preparation' | ''
  // Study material fields
  university?: string
  department?: string
  semester?: string
  // MCQ preparation fields
  faculty?: 'ioe' | 'mbbs' | ''
  created_at?: string
  updated_at?: string
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Skip authentication in development mode
        if (process.env.NODE_ENV === 'development') {
          // Check localStorage for saved faculty preference
          const savedFaculty = typeof window !== 'undefined' 
            ? localStorage.getItem('dev_faculty') 
            : null
          
          console.warn('🎓 USER PROFILE - DEVELOPMENT MODE')
          console.warn('Saved Faculty from localStorage:', savedFaculty)
          console.warn('Will use faculty:', savedFaculty || 'ioe (default)')
          
          const devUser = {
            id: 'dev-user',
            email: 'dev@localhost',
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString()
          } as User

          const mockProfile: UserProfile = {
            user_id: 'dev-user',
            full_name: 'Dev User',
            purpose: 'study-material',
            university: 'Tribhuvan University',
            department: 'Computer Engineering',
            semester: '5',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }

          console.warn('Mock Profile Created:', mockProfile)

          setUser(devUser)
          setProfile(mockProfile)
          setIsLoading(false)
          return
        }

        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          setIsLoading(false)
          return
        }

        setUser(session.user)

        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single()

        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "not found" error, which is okay
          setError(error.message)
        } else if (data) {
          setProfile(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const refreshProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        setError(error.message)
      } else if (data) {
        setProfile(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  return { profile, user, isLoading, error, refreshProfile }
}
