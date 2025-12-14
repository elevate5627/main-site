// Mock Test Rules and Configurations

export interface MockTestRules {
  faculty: 'ioe' | 'mbbs'
  totalQuestions: number
  totalMarks: number
  duration: number // in minutes
  negativeMarking: boolean
  negativeMarkingRatio: number
  passingPercentage: number
  subjectDistribution: {
    subject: string
    questions: number
    marks: number
  }[]
  instructions: string[]
  examPattern: string
  allowedAttempts?: number
}

// IOE Engineering Entrance Exam Rules
export const mockTestRules = {
  exam_metadata: {
    exam_title: "IOE Entrance Mock Test",
    organization: "Tribhuvan University - Institute of Engineering",
    mode: "computer-based",
    language: "English",
    duration_minutes: 120,
    total_questions: 90,
    total_marks: 140,
    passing_score: 40 
  },
  question_format: {
    type: "multiple_choice_single_correct",
    subjects: [
      {
        name: "Mathematics",
        questions: 30,
        marks: 50
      },
      {
        name: "Physics",
        questions: 25,
        marks: 40
      },
      {
        name: "Chemistry",
        questions: 20,
        marks: 30
      },
      {
        name: "English",
        questions: 15,
        marks: 20
      }
    ],
    options_per_question: 4,
    randomize_questions: true,
    randomize_options: true
  },
  marking_scheme: {
    totalMarks: 140,
    totalTimeMinutes: 120,
    negativeMarkingPerQuestion: 0.1,
    subjects: {
      Mathematics: {
        totalMarks: 50,
        questions: {
          hard: { count: 20, marksPerQuestion: 2 },
          easy: { count: 10, marksPerQuestion: 1 }
        }
      },
      Physics: {
        totalMarks: 40,
        questions: {
          hard: { count: 15, marksPerQuestion: 2 },
          easy: { count: 10, marksPerQuestion: 1 }
        }
      },
      Chemistry: {
        totalMarks: 30,
        questions: {
          hard: { count: 10, marksPerQuestion: 2 },
          easy: { count: 10, marksPerQuestion: 1 }
        }
      },
      English: {
        totalMarks: 20,
        questions: {
          hard: { count: 5, marksPerQuestion: 2 },
          easy: { count: 10, marksPerQuestion: 1 }
        }
      }
    },
    question_types: {
      easy: {
        marks: 1,
        negative_marks: -0.1
      },
      hard: {
        marks: 2,
        negative_marks: -0.1
      }
    },
    marks_per_unattempted: 0,
    negative_marking: true,
    total_marks: 140
  },
  interface_behavior: {
    allow_back_navigation: false,
    allow_question_skip: true,
    review_flag: true,
    show_timer: true,
    auto_submit_on_timeout: true,
    show_submission_warning: true
  },
  admit_card: {
    required: true,
    format: "QR code or printed",
    verify_before_start: true
  },
  materials_policy: {
    allowed_items: [
      "pen",
      "pencil",
      "rough paper"
    ],
    prohibited_items: [
      "calculator",
      "mobile",
      "smartwatch",
      "notes"
    ],
    on_screen_calculator: false
  },
  cheating_policy: {
    monitoring_methods: [
      "browser tracking",
      "tab change logging"
    ],
    warnings_allowed: 3,
    actions: {
      tab_switch: "warning on first, auto-submit after three warnings",
      fullscreen_exit: "warning only",
      copy_paste_attempt: "immediate disqualification"
    }
  },
  result_policy: {
    reveal_score: true,
    reveal_correct_answers: false,
    show_rank: true,
    result_delivery: "instant_after_submission"
  },
  user_experience: {
    simulate_real_environment: true,
    disable_right_click: true,
    disable_keyboard_shortcuts: true,
    fullscreen_enforced: true
  }
} as const;

// IOM MBBS Entrance Exam Rules
export const iomMockTestRules = {
  exam_metadata: {
    exam_title: "IOM MBBS Entrance Mock Test",
    organization: "Institute of Medicine - Tribhuvan University",
    mode: "computer-based",
    language: "English",
    duration_minutes: 180, // 3 hours as per official guidelines
    total_questions: 200,
    total_marks: 200, // 1 mark per question
    passing_score: 50 
  },
  question_format: {
    type: "multiple_choice_single_correct",
    subjects: [
      {
        name: "Botany",
        questions: 40,
        marks: 40
      },
      {
        name: "Zoology", 
        questions: 40,
        marks: 40
      },
      {
        name: "Chemistry",
        questions: 50,
        marks: 50
      },
      {
        name: "Physics",
        questions: 50,
        marks: 50
      },
      {
        name: "MAT", // Mental Ability Test
        questions: 20,
        marks: 20
      }
    ],
    options_per_question: 4,
    randomize_questions: true,
    randomize_options: true
  },
  marking_scheme: {
    totalMarks: 200,
    totalTimeMinutes: 180, // 3 hours
    negativeMarkingPerQuestion: 0.25, // -0.25 per wrong answer
    subjects: {
      Botany: {
        totalMarks: 40,
        questions: {
          easy: { count: 20, marksPerQuestion: 1 },
          hard: { count: 20, marksPerQuestion: 1 }
        }
      },
      Zoology: {
        totalMarks: 40,
        questions: {
          easy: { count: 20, marksPerQuestion: 1 },
          hard: { count: 20, marksPerQuestion: 1 }
        }
      },
      Chemistry: {
        totalMarks: 50,
        questions: {
          easy: { count: 25, marksPerQuestion: 1 },
          hard: { count: 25, marksPerQuestion: 1 }
        }
      },
      Physics: {
        totalMarks: 50,
        questions: {
          easy: { count: 25, marksPerQuestion: 1 },
          hard: { count: 25, marksPerQuestion: 1 }
        }
      },
      MAT: { // Mental Ability Test
        totalMarks: 20,
        questions: {
          easy: { count: 10, marksPerQuestion: 1 },
          hard: { count: 10, marksPerQuestion: 1 }
        }
      }
    }
  },
  answering_rules: {
    read_carefully: true,
    confirm_answer_recording: true,
    revisit_unanswered: true,
    navigate_between_subjects: true,
    single_correct_option: true
  },
  time_management: {
    display_timer: true,
    warning_at_minutes: 60, // 1 hour remaining warning
    auto_submit: true,
    allow_pause: false,
    total_duration_hours: 3
  },
  navigation: {
    allow_previous_question: true,
    show_question_palette: true,
    mark_for_review: true,
    confirm_submission: true,
    subject_wise_navigation: true
  },
  exam_rules: {
    full_screen_required: true,
    no_right_click: true,
    prevent_copy_paste: true,
    limit_tab_switching: true,
    multiple_login_prevention: true,
    unfair_means_detection: true,
    camera_monitoring: false,
    screen_recording: false
  },
  submission_rules: {
    auto_submit_on_time_end: true,
    no_changes_after_submit: true,
    confirmation_required: true,
    final_review_allowed: true
  }
};

// Backward compatibility with simplified interface
export const IOE_MOCK_TEST_RULES: MockTestRules = {
  faculty: 'ioe',
  totalQuestions: mockTestRules.exam_metadata.total_questions,
  totalMarks: mockTestRules.exam_metadata.total_marks,
  duration: mockTestRules.exam_metadata.duration_minutes,
  negativeMarking: mockTestRules.marking_scheme.negative_marking,
  negativeMarkingRatio: mockTestRules.marking_scheme.negativeMarkingPerQuestion,
  passingPercentage: (mockTestRules.exam_metadata.passing_score / mockTestRules.exam_metadata.total_marks) * 100,
  subjectDistribution: mockTestRules.question_format.subjects.map(s => ({
    subject: s.name,
    questions: s.questions,
    marks: s.marks
  })),
  examPattern: mockTestRules.exam_metadata.exam_title,
  instructions: [
    `Total Duration: ${mockTestRules.exam_metadata.duration_minutes} minutes (${mockTestRules.exam_metadata.duration_minutes / 60} hours)`,
    `Total Questions: ${mockTestRules.exam_metadata.total_questions} Multiple Choice Questions`,
    `Total Marks: ${mockTestRules.exam_metadata.total_marks}`,
    'Marking: Easy questions (1 mark), Hard questions (2 marks)',
    `Each wrong answer: -${mockTestRules.marking_scheme.negativeMarkingPerQuestion} marks (Negative Marking)`,
    'No marks for unanswered questions',
    'All questions are compulsory',
    'Each question has 4 options with only ONE correct answer',
    'Once submitted, answers cannot be changed',
    'Calculator, mobile phones, and electronic devices are not allowed',
    `Minimum passing marks: ${mockTestRules.exam_metadata.passing_score}%`,
    'Subject Distribution:',
    '  • Mathematics: 30 questions (50 marks) - 20 hard (2 marks each), 10 easy (1 mark each)',
    '  • Physics: 25 questions (40 marks) - 15 hard (2 marks each), 10 easy (1 mark each)',
    '  • Chemistry: 20 questions (30 marks) - 10 hard (2 marks each), 10 easy (1 mark each)',
    '  • English: 15 questions (20 marks) - 5 hard (2 marks each), 10 easy (1 mark each)',
    'Time management is crucial - plan your time wisely',
    'You can navigate between questions using Previous/Next buttons',
    'Mark questions for review if you are unsure',
    'A summary will be shown before final submission',
    'Review all answers before submitting the test',
    'Full screen mode is enforced during the exam',
    'Right-click and keyboard shortcuts are disabled',
    'Tab switching is monitored - 3 warnings allowed before auto-submission'
  ],
  allowedAttempts: 1
}

export const IOM_MBBS_MOCK_TEST_RULES: MockTestRules = {
  faculty: 'mbbs',
  totalQuestions: iomMockTestRules.exam_metadata.total_questions,
  totalMarks: iomMockTestRules.exam_metadata.total_marks,
  duration: iomMockTestRules.exam_metadata.duration_minutes,
  negativeMarking: true,
  negativeMarkingRatio: iomMockTestRules.marking_scheme.negativeMarkingPerQuestion,
  passingPercentage: iomMockTestRules.exam_metadata.passing_score,
  subjectDistribution: iomMockTestRules.question_format.subjects.map(s => ({
    subject: s.name,
    questions: s.questions,
    marks: s.marks
  })),
  examPattern: iomMockTestRules.exam_metadata.exam_title,
  instructions: [
    `Total Duration: ${iomMockTestRules.exam_metadata.duration_minutes} minutes (${iomMockTestRules.time_management.total_duration_hours} hours)`,
    `Total Questions: ${iomMockTestRules.exam_metadata.total_questions} Multiple Choice Questions`,
    `Total Marks: ${iomMockTestRules.exam_metadata.total_marks}`,
    'Each correct answer: +1 mark',
    `Each wrong answer: -${iomMockTestRules.marking_scheme.negativeMarkingPerQuestion} marks (Negative Marking)`,
    'No marks for unanswered questions',
    'All questions are compulsory',
    'Each question has 4 options with only ONE correct answer',
    'Once submitted, answers cannot be changed',
    'Calculator, mobile phones, and electronic devices are not allowed',
    `Minimum passing marks: ${iomMockTestRules.exam_metadata.passing_score}%`,
    'Subject Distribution:',
    '  • Botany: 40 questions (40 marks)',
    '  • Zoology: 40 questions (40 marks)',
    '  • Chemistry: 50 questions (50 marks)',
    '  • Physics: 50 questions (50 marks)',
    '  • MAT (Mental Ability Test): 20 questions (20 marks)',
    'Questions are based on Class 11 and Class 12 curriculum',
    'Time management is crucial - approximately 54 seconds per question',
    'You can navigate between questions and subjects',
    'Mark questions for review if you are unsure',
    'Subject-wise navigation is available',
    'A summary will be shown before final submission',
    'Review all answers carefully before submitting the test',
    'Full screen mode is enforced during the exam',
    'Right-click and copy-paste are disabled',
    'Tab switching is monitored for security',
    'Medical eligibility criteria apply as per IOM guidelines'
  ],
  allowedAttempts: 1
}

// Export both rules for easy access
export const mockTestRulesByExam = {
  IOE: mockTestRules,
  IOM: iomMockTestRules
};

export interface MockTestSession {
  id: string
  userId: string
  faculty: 'ioe' | 'mbbs'
  startTime: string
  endTime?: string
  duration: number // in seconds
  questions: string[] // question IDs
  answers: Record<string, number> // questionId -> optionNumber
  markedForReview: string[] // question IDs
  status: 'in-progress' | 'submitted' | 'auto-submitted'
  score?: {
    correct: number
    wrong: number
    unanswered: number
    totalMarks: number
    percentage: number
    passed: boolean
  }
}

export function calculateScore(
  questions: any[],
  answers: Record<string, number>,
  rules: MockTestRules
) {
  let correct = 0
  let wrong = 0
  let unanswered = 0

  questions.forEach(q => {
    const userAnswer = answers[q.id]
    if (!userAnswer) {
      unanswered++
    } else if (userAnswer === q.answer_option_number || userAnswer === q.correct_answer) {
      correct++
    } else {
      wrong++
    }
  })

  const totalMarks = correct - (wrong * rules.negativeMarkingRatio)
  const percentage = (totalMarks / rules.totalMarks) * 100
  const passed = percentage >= rules.passingPercentage

  return {
    correct,
    wrong,
    unanswered,
    totalMarks: Math.max(0, totalMarks), // Ensure non-negative
    percentage: Math.max(0, percentage),
    passed
  }
}

export function getRemainingTime(startTime: string, durationMinutes: number): number {
  const start = new Date(startTime).getTime()
  const now = new Date().getTime()
  const elapsed = Math.floor((now - start) / 1000) // seconds
  const total = durationMinutes * 60
  return Math.max(0, total - elapsed)
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

export function getTestRules(faculty: 'ioe' | 'mbbs'): MockTestRules {
  return faculty === 'ioe' ? IOE_MOCK_TEST_RULES : IOM_MBBS_MOCK_TEST_RULES
}

export interface SubjectProgress {
  subject: string
  total: number
  answered: number
  correct?: number
  marks?: number
}

export function getSubjectWiseProgress(
  questions: any[],
  answers: Record<string, number>,
  showResults: boolean = false
): SubjectProgress[] {
  const subjectMap = new Map<string, SubjectProgress>()

  questions.forEach(q => {
    const subject = q.subject || q.subject_name || 'General'
    
    if (!subjectMap.has(subject)) {
      subjectMap.set(subject, {
        subject,
        total: 0,
        answered: 0,
        correct: 0,
        marks: 0
      })
    }

    const progress = subjectMap.get(subject)!
    progress.total++

    if (answers[q.id]) {
      progress.answered++
      
      if (showResults) {
        const isCorrect = answers[q.id] === q.answer_option_number
        if (isCorrect) {
          progress.correct!++
          progress.marks! += (q.marks || 1)
        } else {
          progress.marks! -= 0.25 // negative marking
        }
      }
    }
  })

  return Array.from(subjectMap.values()).sort((a, b) => a.subject.localeCompare(b.subject))
}
