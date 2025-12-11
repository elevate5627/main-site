'use client'

import SubjectCards from '@/components/SubjectCards'
import FacultySwitcher from '@/components/FacultySwitcher'

export default function McqPreparationPage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <SubjectCards />
      </div>
      {process.env.NODE_ENV === 'development' && <FacultySwitcher />}
    </div>
  )
}
