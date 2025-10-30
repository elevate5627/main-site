/**
 * Common API response structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T = any> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * User interface
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * University interface
 */
export interface University {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Branch interface
 */
export interface Branch {
  id: string;
  name: string;
  code: string;
  universityId: string;
  university?: University;
  createdAt: string;
  updatedAt: string;
}

/**
 * Semester interface
 */
export interface Semester {
  id: string;
  name: string;
  code: string;
  branchId: string;
  branch?: Branch;
  createdAt: string;
  updatedAt: string;
}

/**
 * Course interface
 */
export interface Course {
  id: string;
  name: string;
  code: string;
  isLab: boolean;
  semesterId: string;
  semester?: Semester;
  createdAt: string;
  updatedAt: string;
}

/**
 * Syllabus interface
 */
export interface Syllabus {
  id: string;
  topic: string;
  description: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Notes interface
 */
export interface Notes {
  id: string;
  title: string;
  description: string;
  content: string;
  fileUrl?: string;
  courseId: string;
  course?: Course;
  createdAt: string;
  updatedAt: string;
}

/**
 * Question Bank interface
 */
export interface QuestionBank {
  id: string;
  title: string;
  description: string;
  courseId: string;
  course?: Course;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Question interface
 */
export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  questionBankId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Video interface
 */
export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  courseId: string;
  course?: Course;
  createdAt: string;
  updatedAt: string;
}

/**
 * Lab Sheet interface
 */
export interface LabSheet {
  id: string;
  title: string;
  description: string;
  content: string;
  fileUrl?: string;
  courseId: string;
  course?: Course;
  createdAt: string;
  updatedAt: string;
}

/**
 * Content types enum
 */
export enum ContentType {
  NOTE = 'NOTE',
  VIDEO = 'VIDEO',
  LAB_SHEET = 'LAB_SHEET',
  QUESTION_BANK = 'QUESTION_BANK',
  SYLLABUS = 'SYLLABUS'
}

/**
 * Generic content interface
 */
export interface Content {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  courseId: string;
  course?: Course;
  createdAt: string;
  updatedAt: string;
}
