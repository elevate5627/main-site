'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { GraduationCap } from 'lucide-react'

export default function FacultySwitcher() {
  const [faculty, setFaculty] = useState<'ioe' | 'mbbs'>('ioe')

  useEffect(() => {
    // Read current faculty from localStorage on mount
    const savedFaculty = localStorage.getItem('dev_faculty')
    if (savedFaculty === 'ioe' || savedFaculty === 'mbbs') {
      setFaculty(savedFaculty)
    }
  }, [])

  const handleSwitch = (newFaculty: 'ioe' | 'mbbs') => {
    if (newFaculty === faculty) return // Don't reload if already selected
    
    setFaculty(newFaculty)
    
    // Update the mock profile in localStorage for development
    localStorage.setItem('dev_faculty', newFaculty)
    
    // Force page reload to refresh data
    window.location.reload()
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-3 border-2 border-gray-200">
        <div className="flex items-center space-x-2 mb-2">
          <GraduationCap className="h-4 w-4 text-gray-600" />
          <span className="text-xs font-semibold text-gray-700">Dev Mode</span>
        </div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={faculty === 'ioe' ? 'default' : 'outline'}
            onClick={() => handleSwitch('ioe')}
            className="text-xs"
          >
            IOE
          </Button>
          <Button
            size="sm"
            variant={faculty === 'mbbs' ? 'default' : 'outline'}
            onClick={() => handleSwitch('mbbs')}
            className="text-xs"
          >
            MBBS
          </Button>
        </div>
      </div>
    </div>
  )
}
