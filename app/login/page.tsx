'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { GraduationCap, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      } else {
        setIsLoading(false)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/dashboard')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4DB748]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4DB748]/5 via-white to-[#4DB748]/10 flex flex-col">
      <header className="p-4">
        <Link href="/">
          <Button variant="ghost" className="text-gray-700 hover:text-[#4DB748]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#4DB748] mx-auto mb-4 shadow-lg">
                <GraduationCap className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to access your learning dashboard</p>
            </div>

            <div className="space-y-6">
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: '#4DB748',
                        brandAccent: '#45a840',
                        brandButtonText: 'white',
                        defaultButtonBackground: 'white',
                        defaultButtonBackgroundHover: '#f9fafb',
                        defaultButtonBorder: '#e5e7eb',
                        defaultButtonText: '#374151',
                        inputBackground: 'white',
                        inputBorder: '#e5e7eb',
                        inputBorderHover: '#4DB748',
                        inputBorderFocus: '#4DB748',
                        inputText: '#1f2937',
                        inputPlaceholder: '#9ca3af',
                      },
                      space: {
                        inputPadding: '12px',
                        buttonPadding: '12px',
                      },
                      borderWidths: {
                        buttonBorderWidth: '1px',
                        inputBorderWidth: '1px',
                      },
                      radii: {
                        borderRadiusButton: '0.75rem',
                        buttonBorderRadius: '0.75rem',
                        inputBorderRadius: '0.75rem',
                      },
                    },
                  },
                  className: {
                    container: 'auth-container',
                    button: 'auth-button',
                    input: 'auth-input',
                  },
                }}
                providers={['google']}
                redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
                view="sign_in"
                showLinks={false}
                localization={{
                  variables: {
                    sign_in: {
                      email_label: 'Email Address',
                      password_label: 'Password',
                      button_label: 'Sign In',
                      social_provider_text: 'Sign in with {{provider}}',
                      link_text: "Don't have an account? Sign up",
                    },
                    sign_up: {
                      email_label: 'Email Address',
                      password_label: 'Password',
                      button_label: 'Sign Up',
                      social_provider_text: 'Sign up with {{provider}}',
                      link_text: 'Already have an account? Sign in',
                    },
                  },
                }}
              />
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Need help?{' '}
              <a href="#" className="text-[#4DB748] hover:underline font-medium">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
