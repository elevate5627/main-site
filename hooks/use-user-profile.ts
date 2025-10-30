import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'

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
