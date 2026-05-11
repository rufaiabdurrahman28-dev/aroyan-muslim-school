/* ── Aroyan Schools — TypeScript Types ────────────── */

export type Role = 'parent' | 'teacher' | 'student' | 'admin' | 'manager'
export type Section = 'nursery' | 'primary' | 'jss' | 'sss'
export type FileCategory = 'syllabus' | 'scheme_of_work' | 'lesson_notes' | 'others'
export type FileStatus = 'pending' | 'approved' | 'not_approved'
export type SubmissionStatus = 'pending' | 'submitted' | 'not_submitted'
export type AttendanceType = 'resumption' | 'closing'
export type AttendanceMethod = 'key' | 'face_scan'
export type ReportStatus = 'draft' | 'final'
export type HelpdeskStatus = 'open' | 'closed'
export type AdmissionStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected'
export type Term = '1st' | '2nd' | '3rd'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: Role
  section?: Section
  created_at: string
}

export interface SectionKey {
  id: string
  section: Section
  key_code: string
}

export interface Class {
  id: string
  name: string
  section: Section
  teacher_id: string
  arm?: string
}

export interface ClassWorkspace {
  id: string
  class_id: string
  teacher_id: string
  workspace_password_hash: string
}

export interface SchoolFile {
  id: string
  class_id: string
  category: FileCategory
  week?: number
  term: Term
  content?: string
  file_url?: string
  uploaded_by: string
  status: FileStatus
  approved_by?: string
  approved_at?: string
  uploaded_at: string
}

export interface Assignment {
  id: string
  class_id: string
  title: string
  due_date?: string
  created_by: string
}

export interface Submission {
  id: string
  assignment_id: string
  student_id: string
  file_url?: string
  status: SubmissionStatus
  submitted_at?: string
}

export interface AttendanceLog {
  id: string
  teacher_id: string
  class_id: string
  type: AttendanceType
  timestamp: string
  method: AttendanceMethod
}

export interface ReportCard {
  id: string
  student_id: string
  class_id: string
  term: Term
  session: string
  subject?: string
  test1?: number
  test2?: number
  exam?: number
  total?: number
  percentage?: number
  grade?: string
  teacher_comment?: string
  teacher_signature?: string
  management_signature?: string
  status: ReportStatus
  created_at: string
}

export interface HelpdeskMessage {
  id: string
  sender_id: string
  sender_role: Role
  recipient_id?: string
  subject: string
  message: string
  status: HelpdeskStatus
  created_at: string
}

export interface SchoolSettings {
  id: string
  school_name: string
  logo_url: string
  address: string
  phone: string
}

export interface AdmissionApplication {
  id: string
  full_name: string
  email?: string
  phone: string
  dob?: string
  gender?: string
  level: Section
  parent_name: string
  parent_phone: string
  previous_school?: string
  status: AdmissionStatus
  reviewed_by?: string
  reviewed_at?: string
  created_at: string
}

export interface ParentStudentLink {
  id: string
  parent_id: string
  student_id: string
  access_key: string
}

/* ── UI Helper Types ──────────────────────────────── */

export interface PortalAccess {
  management: boolean
  school: boolean
  teacher: boolean
  student: boolean
  helpdesk: boolean
}

export const ROLE_ACCESS: Record<Role, PortalAccess> = {
  admin:    { management: true,  school: true,  teacher: true,  student: true,  helpdesk: true  },
  manager:  { management: true,  school: true,  teacher: true,  student: true,  helpdesk: true  },
  teacher:  { management: false, school: true,  teacher: true,  student: true,  helpdesk: true  },
  student:  { management: false, school: false, teacher: false, student: true,  helpdesk: false },
  parent:   { management: false, school: false, teacher: false, student: true,  helpdesk: true  },
}

export const SECTION_LABELS: Record<Section, string> = {
  nursery: 'Nursery / Primary',
  primary: 'Primary',
  jss: 'Junior Secondary',
  sss: 'Senior Secondary',
}

export const GRADE_SCALE: [number, string][] = [
  [70, 'A'],
  [60, 'B'],
  [50, 'C'],
  [45, 'D'],
  [40, 'E'],
  [0, 'F'],
]

export function calculateGrade(percentage: number): string {
  for (const [threshold, grade] of GRADE_SCALE) {
    if (percentage >= threshold) return grade
  }
  return 'F'
}
