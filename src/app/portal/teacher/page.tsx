'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { calculateGrade, type Section, type Term, type FileStatus, type SubmissionStatus } from '@/lib/types'

type Tab = 'attendance' | 'assignments' | 'report-cards' | 'file-status'

interface MockStudent {
  id: string
  name: string
  resumptionTime: string | null
  closingTime: string | null
  status: 'present' | 'late' | 'absent'
}

interface MockClass {
  id: string
  name: string
  section: Section
}

interface MockAssignment {
  id: string
  title: string
  dueDate: string
  className: string
  classId: string
  submissions: MockSubmission[]
}

interface MockSubmission {
  studentId: string
  studentName: string
  status: SubmissionStatus
  submittedAt: string | null
}

interface MockFileStatus {
  id: string
  fileName: string
  category: string
  status: FileStatus
  date: string
}

interface ReportRow {
  studentId: string
  studentName: string
  test1: number
  test2: number
  exam: number
  total: number
  percentage: number
  grade: string
  comment: string
}

const CLASSES: MockClass[] = [
  { id: 'c1', name: 'Nursery 1A', section: 'nursery' },
  { id: 'c7', name: 'Primary 1A', section: 'primary' },
  { id: 'c9', name: 'Primary 2A', section: 'primary' },
  { id: 'c19', name: 'JSS 1A', section: 'jss' },
  { id: 'c21', name: 'JSS 2A', section: 'jss' },
  { id: 'c25', name: 'SSS 1 Science', section: 'sss' },
  { id: 'c27', name: 'SSS 2 Science', section: 'sss' },
]

const STUDENTS_BY_CLASS: Record<string, { id: string; name: string }[]> = {
  'c1': [
    { id: 's1', name: 'Aisha Bello' },
    { id: 's2', name: 'Yusuf Ibrahim' },
    { id: 's3', name: 'Fatima Sani' },
    { id: 's4', name: 'Musa Abdullahi' },
    { id: 's5', name: 'Hauwa Garba' },
  ],
  'c7': [
    { id: 's6', name: 'Khadijah Musa' },
    { id: 's7', name: 'Aliyu Garba' },
    { id: 's8', name: 'Zainab Ahmed' },
    { id: 's9', name: 'Bashir Umar' },
    { id: 's10', name: 'Amina Bello' },
    { id: 's11', name: 'Ibrahim Sule' },
  ],
  'c9': [
    { id: 's12', name: 'Usman Kabir' },
    { id: 's13', name: 'Maryam Adam' },
    { id: 's14', name: 'Hamza Yusuf' },
    { id: 's15', name: 'Sa\'adat Ibrahim' },
    { id: 's16', name: 'Abdullahi Musa' },
    { id: 's17', name: 'Fatima Ali' },
    { id: 's18', name: 'Nasir Bello' },
  ],
  'c19': [
    { id: 's19', name: 'Abubakar Usman' },
    { id: 's20', name: 'Maryam Hamza' },
    { id: 's21', name: 'Ibrahim Sule' },
    { id: 's22', name: 'Khadijah Ahmed' },
    { id: 's23', name: 'Umar Farouk' },
    { id: 's24', name: 'Aisha Dalhatu' },
  ],
  'c21': [
    { id: 's25', name: 'Hassan Bello' },
    { id: 's26', name: 'Amina Musa' },
    { id: 's27', name: 'Yusuf Tukur' },
    { id: 's28', name: 'Zainab Garba' },
    { id: 's29', name: 'Farouk Adam' },
    { id: 's30', name: 'Hafsat Ibrahim' },
    { id: 's31', name: 'Aliyu Kabir' },
    { id: 's32', name: 'Nafisa Sule' },
  ],
  'c25': [
    { id: 's33', name: 'Tukur Ibrahim' },
    { id: 's34', name: 'Hadiza Bello' },
    { id: 's35', name: 'Aminu Dalhatu' },
    { id: 's36', name: 'Khadijah Musa' },
    { id: 's37', name: 'Ibrahim Sule' },
    { id: 's38', name: 'Zainab Ali' },
  ],
  'c27': [
    { id: 's39', name: 'Musa Tukur' },
    { id: 's40', name: 'Fatima Kabir' },
    { id: 's41', name: 'Abubakar Usman' },
    { id: 's42', name: 'Maryam Garba' },
    { id: 's43', name: 'Hassan Ahmed' },
    { id: 's44', name: 'Aisha Bello' },
    { id: 's45', name: 'Umar Farouk' },
  ],
}

const MOCK_ASSIGNMENTS: MockAssignment[] = [
  {
    id: 'as1', title: 'English Essay - My Community', dueDate: '2026-05-15', className: 'JSS 2A', classId: 'c21',
    submissions: [
      { studentId: 's25', studentName: 'Hassan Bello', status: 'submitted', submittedAt: '2026-05-13T10:30:00' },
      { studentId: 's26', studentName: 'Amina Musa', status: 'submitted', submittedAt: '2026-05-14T09:15:00' },
      { studentId: 's27', studentName: 'Yusuf Tukur', status: 'pending', submittedAt: null },
      { studentId: 's28', studentName: 'Zainab Garba', status: 'not_submitted', submittedAt: null },
      { studentId: 's29', studentName: 'Farouk Adam', status: 'submitted', submittedAt: '2026-05-12T14:00:00' },
      { studentId: 's30', studentName: 'Hafsat Ibrahim', status: 'not_submitted', submittedAt: null },
      { studentId: 's31', studentName: 'Aliyu Kabir', status: 'pending', submittedAt: null },
      { studentId: 's32', studentName: 'Nafisa Sule', status: 'submitted', submittedAt: '2026-05-14T16:45:00' },
    ],
  },
  {
    id: 'as2', title: 'Mathematics Homework - Algebra', dueDate: '2026-05-10', className: 'JSS 2A', classId: 'c21',
    submissions: [
      { studentId: 's25', studentName: 'Hassan Bello', status: 'submitted', submittedAt: '2026-05-09T08:20:00' },
      { studentId: 's26', studentName: 'Amina Musa', status: 'submitted', submittedAt: '2026-05-09T11:00:00' },
      { studentId: 's27', studentName: 'Yusuf Tukur', status: 'submitted', submittedAt: '2026-05-10T07:50:00' },
      { studentId: 's28', studentName: 'Zainab Garba', status: 'not_submitted', submittedAt: null },
      { studentId: 's29', studentName: 'Farouk Adam', status: 'submitted', submittedAt: '2026-05-08T15:30:00' },
      { studentId: 's30', studentName: 'Hafsat Ibrahim', status: 'submitted', submittedAt: '2026-05-09T10:10:00' },
      { studentId: 's31', studentName: 'Aliyu Kabir', status: 'not_submitted', submittedAt: null },
      { studentId: 's32', studentName: 'Nafisa Sule', status: 'submitted', submittedAt: '2026-05-10T09:00:00' },
    ],
  },
  {
    id: 'as3', title: 'Islamic Studies - Quran Memorization', dueDate: '2026-05-20', className: 'Primary 1A', classId: 'c7',
    submissions: [
      { studentId: 's6', studentName: 'Khadijah Musa', status: 'pending', submittedAt: null },
      { studentId: 's7', studentName: 'Aliyu Garba', status: 'pending', submittedAt: null },
      { studentId: 's8', studentName: 'Zainab Ahmed', status: 'submitted', submittedAt: '2026-05-16T09:00:00' },
      { studentId: 's9', studentName: 'Bashir Umar', status: 'pending', submittedAt: null },
      { studentId: 's10', studentName: 'Amina Bello', status: 'not_submitted', submittedAt: null },
      { studentId: 's11', studentName: 'Ibrahim Sule', status: 'pending', submittedAt: null },
    ],
  },
]

const MOCK_FILE_STATUSES: MockFileStatus[] = [
  { id: 'f1', fileName: 'JSS 2 English Scheme Term 2.pdf', category: 'Syllabus/Scheme of Work', status: 'approved', date: '2026-04-20' },
  { id: 'f2', fileName: 'Week 8 English Lesson Note.docx', category: 'Lesson Notes', status: 'pending', date: '2026-04-22' },
  { id: 'f3', fileName: 'Mid-Term Exam Questions.pdf', category: 'Others', status: 'not_approved', date: '2026-04-18' },
  { id: 'f4', fileName: 'Week 7 Math Lesson Note.docx', category: 'Lesson Notes', status: 'approved', date: '2026-04-19' },
  { id: 'f5', fileName: 'Civic Education Scheme.pdf', category: 'Syllabus/Scheme of Work', status: 'pending', date: '2026-04-21' },
  { id: 'f6', fileName: 'Test Questions Term 1.pdf', category: 'Others', status: 'not_approved', date: '2026-04-10' },
]

function StatusBadge({ status, type }: { status: string; type: 'attendance' | 'submission' | 'file' | 'helpdesk' }) {
  let bg = '#E5E7EB'
  let color = '#6B7280'
  let label = status

  if (type === 'attendance') {
    if (status === 'present') { bg = '#D1FAE5'; color = '#065F46' }
    else if (status === 'late') { bg = '#FEF3C7'; color = '#92400E' }
    else if (status === 'absent') { bg = '#FEE2E2'; color = '#991B1B' }
  } else if (type === 'submission') {
    if (status === 'submitted') { bg = '#D1FAE5'; color = '#065F46' }
    else if (status === 'pending') { bg = '#FEF3C7'; color = '#92400E' }
    else if (status === 'not_submitted') { bg = '#FEE2E2'; color = '#991B1B' }
    label = status === 'not_submitted' ? 'Not Submitted' : status.charAt(0).toUpperCase() + status.slice(1)
  } else if (type === 'file') {
    if (status === 'approved') { bg = '#D1FAE5'; color = '#065F46' }
    else if (status === 'pending') { bg = '#FEF3C7'; color = '#92400E' }
    else if (status === 'not_approved') { bg = '#FEE2E2'; color = '#991B1B' }
    label = status === 'not_approved' ? 'Not Approved' : status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, backgroundColor: bg, color }}>
      {label}
    </span>
  )
}

export default function TeacherPortalPage() {
  const router = useRouter()
  const { profile, portalAccess, loading } = useAuth()

  const [activeTab, setActiveTab] = useState<Tab>('attendance')
  const [selectedClass, setSelectedClass] = useState('c21')
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0])
  // Initialize attendance data lazily
  const [attendanceData, setAttendanceData] = useState<Record<string, MockStudent[]>>(() => {
    const initData: Record<string, MockStudent[]> = {}
    Object.keys(STUDENTS_BY_CLASS).forEach(classId => {
      initData[classId] = STUDENTS_BY_CLASS[classId].map(s => ({
        id: s.id,
        name: s.name,
        resumptionTime: null,
        closingTime: null,
        status: 'absent' as const,
      }))
    })
    return initData
  })

  // Assignments state
  const [assignments, setAssignments] = useState(MOCK_ASSIGNMENTS)
  const [expandedAssignment, setExpandedAssignment] = useState<string | null>(null)
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('')
  const [newAssignmentDueDate, setNewAssignmentDueDate] = useState('')
  const [newAssignmentClass, setNewAssignmentClass] = useState('c21')

  // Report Cards state
  const [reportClass, setReportClass] = useState('c21')
  const [reportSubject, setReportSubject] = useState('')
  const [reportTerm, setReportTerm] = useState<Term>('1st')
  const [reportSession, setReportSession] = useState('2025/2026')
  const [reportRows, setReportRows] = useState<ReportRow[]>(() => {
    const students = STUDENTS_BY_CLASS['c21'] || []
    return students.map(s => ({
      studentId: s.id,
      studentName: s.name,
      test1: 0,
      test2: 0,
      exam: 0,
      total: 0,
      percentage: 0,
      grade: 'F',
      comment: '',
    }))
  })
  const [reportSignedOff, setReportSignedOff] = useState(false)
  const [showReportPreview, setShowReportPreview] = useState(false)
  const [reportStatus, setReportStatus] = useState<'draft' | 'pending_approval' | 'final'>('draft')

  // File Status state
  const [fileStatuses, setFileStatuses] = useState(MOCK_FILE_STATUSES)

  // Report Card handlers - must be before any early returns
  const updateReportRow = useCallback((studentId: string, field: 'test1' | 'test2' | 'exam' | 'comment', value: string | number) => {
    setReportRows(prev => prev.map(row => {
      if (row.studentId !== studentId) return row
      const updated = { ...row }
      if (field === 'comment') {
        updated.comment = value as string
      } else {
        const numVal = Math.max(0, Math.min(field === 'exam' ? 60 : 20, Number(value) || 0))
        updated[field] = numVal
      }
      const total = updated.test1 + updated.test2 + updated.exam
      const percentage = total
      const grade = calculateGrade(percentage)
      updated.total = total
      updated.percentage = percentage
      updated.grade = grade
      return updated
    }))
  }, [])

  function handleReportClassChange(newClass: string) {
    setReportClass(newClass)
    const students = STUDENTS_BY_CLASS[newClass] || []
    setReportRows(students.map(s => ({
      studentId: s.id,
      studentName: s.name,
      test1: 0,
      test2: 0,
      exam: 0,
      total: 0,
      percentage: 0,
      grade: 'F',
      comment: '',
    })))
    setReportSignedOff(false)
    setReportStatus('draft')
  }

  useEffect(() => {
    if (!loading && !profile) {
      router.push('/login')
    }
  }, [loading, profile, router])

  if (loading) {
    return (
      <>
        <div className="D D1 D1-short">
          <Navbar />
          <section className="page-hero">
            <h1 className="page-hero-title">Teacher Portal</h1>
          </section>
        </div>
        <div className="D D2 D2-auto D2-center">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#777', fontSize: '16px' }}>Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!profile) return null

  if (portalAccess && !portalAccess.teacher) {
    return (
      <>
        <div className="D D1 D1-short">
          <Navbar />
          <section className="page-hero">
            <h1 className="page-hero-title">Teacher Portal</h1>
          </section>
        </div>
        <div className="D D2 D2-auto D2-center">
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 64, height: 64, margin: '0 auto 20px', display: 'block' }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#dc3545', margin: '0 0 12px' }}>Access Denied</h2>
            <p style={{ fontSize: '16px', color: '#777', margin: '0 0 24px' }}>You do not have permission to access the Teacher Portal.</p>
            <a href="/dashboard" className="cta-btn cta-btn-filled" style={{ display: 'inline-block' }}>Back to Dashboard</a>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  // Attendance handlers
  function handleCheckIn(classId: string, studentId: string) {
    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', hour12: true })
    setAttendanceData(prev => {
      const updated = { ...prev }
      updated[classId] = updated[classId].map(s => {
        if (s.id === studentId) {
          const hour = now.getHours()
          const minute = now.getMinutes()
          const isLate = hour > 7 || (hour === 7 && minute > 30)
          return {
            ...s,
            resumptionTime: timeStr,
            status: (isLate ? 'late' : 'present') as 'late' | 'present',
          }
        }
        return s
      })
      return updated
    })
  }

  function handleCheckOut(classId: string, studentId: string) {
    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', hour12: true })
    setAttendanceData(prev => {
      const updated = { ...prev }
      updated[classId] = updated[classId].map(s => {
        if (s.id === studentId) {
          const newStatus: 'present' | 'late' | 'absent' = s.resumptionTime ? s.status : 'absent'
          return {
            ...s,
            closingTime: timeStr,
            status: newStatus,
          }
        }
        return s
      })
      return updated
    })
  }

  function handleMarkAllResumption(classId: string) {
    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', hour12: true })
    const hour = now.getHours()
    const minute = now.getMinutes()
    const isLate = hour > 7 || (hour === 7 && minute > 30)
    setAttendanceData(prev => {
      const updated = { ...prev }
      updated[classId] = updated[classId].map(s => ({
        ...s,
        resumptionTime: s.resumptionTime || timeStr,
        status: (s.resumptionTime ? s.status : isLate ? 'late' : 'present') as 'present' | 'late' | 'absent',
      }))
      return updated
    })
  }

  function handleMarkAllClosing(classId: string) {
    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', hour12: true })
    setAttendanceData(prev => {
      const updated = { ...prev }
      updated[classId] = updated[classId].map(s => ({
        ...s,
        closingTime: s.closingTime || timeStr,
        status: (s.resumptionTime ? s.status : 'absent') as 'present' | 'late' | 'absent',
      }))
      return updated
    })
  }

  // Assignment handlers
  function handleCreateAssignment() {
    if (!newAssignmentTitle.trim() || !newAssignmentDueDate) return
    const cls = CLASSES.find(c => c.id === newAssignmentClass)
    const students = STUDENTS_BY_CLASS[newAssignmentClass] || []
    const newAssignment: MockAssignment = {
      id: `as-${Date.now()}`,
      title: newAssignmentTitle,
      dueDate: newAssignmentDueDate,
      className: cls?.name || '',
      classId: newAssignmentClass,
      submissions: students.map(s => ({
        studentId: s.id,
        studentName: s.name,
        status: 'pending' as SubmissionStatus,
        submittedAt: null,
      })),
    }
    setAssignments(prev => [newAssignment, ...prev])
    setNewAssignmentTitle('')
    setNewAssignmentDueDate('')
  }

  function handleToggleSubmission(assignmentId: string, studentId: string) {
    setAssignments(prev => prev.map(a => {
      if (a.id !== assignmentId) return a
      return {
        ...a,
        submissions: a.submissions.map(sub => {
          if (sub.studentId !== studentId) return sub
          const nextStatus: Record<SubmissionStatus, SubmissionStatus> = {
            pending: 'submitted',
            submitted: 'not_submitted',
            not_submitted: 'pending',
          }
          return {
            ...sub,
            status: nextStatus[sub.status],
            submittedAt: sub.status === 'pending' ? new Date().toISOString() : null,
          }
        }),
      }
    }))
  }

  function handleSaveDraft() {
    setReportStatus('draft')
    alert('Draft saved successfully!')
  }

  function handleGenerateReport() {
    setShowReportPreview(true)
  }

  function handleSubmitToManagement() {
    setReportStatus('pending_approval')
    setShowReportPreview(false)
    alert('Report card submitted to management for approval.')
  }

  function handleSignOff() {
    setReportSignedOff(true)
  }

  function handleResubmit(fileId: string) {
    setFileStatuses(prev => prev.map(f =>
      f.id === fileId ? { ...f, status: 'pending' as FileStatus, date: new Date().toISOString().split('T')[0] } : f
    ))
  }

  const currentAttendanceStudents = attendanceData[selectedClass] || []
  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'attendance', label: 'Attendance', icon: '📋' },
    { key: 'assignments', label: 'Assignments', icon: '📝' },
    { key: 'report-cards', label: 'Report Cards', icon: '📊' },
    { key: 'file-status', label: 'File Status', icon: '📁' },
  ]

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .tp-tabs {
          display: flex;
          gap: 0;
          border-bottom: 2px solid #E8E8E8;
          margin-bottom: 28px;
          overflow-x: auto;
        }
        .tp-tab {
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 600;
          color: #777;
          cursor: pointer;
          border: none;
          background: none;
          border-bottom: 3px solid transparent;
          transition: all 0.2s ease;
          white-space: nowrap;
          margin-bottom: -2px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .tp-tab:hover {
          color: #2D5F3F;
        }
        .tp-tab-active {
          color: #2D5F3F;
          border-bottom-color: #2D5F3F;
        }
        .tp-table-wrapper {
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid #E8E8E8;
        }
        .tp-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .tp-table th {
          background-color: #2D5F3F;
          color: #FFFFFF;
          padding: 10px 12px;
          text-align: left;
          font-weight: 600;
          font-size: 12px;
          white-space: nowrap;
        }
        .tp-table td {
          padding: 8px 12px;
          border-bottom: 1px solid #F0F0F0;
          color: #444;
        }
        .tp-table tr:nth-child(even) td {
          background-color: rgba(45, 95, 63, 0.03);
        }
        .tp-table tr:last-child td {
          border-bottom: none;
        }
        .tp-table tr:hover td {
          background-color: rgba(45, 95, 63, 0.06);
        }
        .tp-btn {
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .tp-btn:hover {
          transform: translateY(-1px);
        }
        .tp-btn-green {
          color: #065F46;
          border-color: #6EE7B7;
          background: #ECFDF5;
        }
        .tp-btn-green:hover {
          background: #D1FAE5;
        }
        .tp-btn-gold {
          color: #92400E;
          border-color: #FCD34D;
          background: #FFFBEB;
        }
        .tp-btn-gold:hover {
          background: #FEF3C7;
        }
        .tp-btn-red {
          color: #991B1B;
          border-color: #FCA5A5;
          background: #FEF2F2;
        }
        .tp-btn-red:hover {
          background: #FEE2E2;
        }
        .tp-btn-primary {
          color: #FFFFFF;
          background: #2D5F3F;
          border-color: #2D5F3F;
        }
        .tp-btn-primary:hover {
          background: #1F4A2E;
        }
        .tp-card {
          background: #FFFFFF;
          border: 1px solid #E8E8E8;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
          transition: box-shadow 0.2s ease;
        }
        .tp-card:hover {
          box-shadow: 0 4px 16px rgba(45, 95, 63, 0.08);
        }
        .tp-select-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: flex-end;
          margin-bottom: 20px;
        }
        .tp-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .tp-field label {
          font-size: 12px;
          font-weight: 600;
          color: #555;
        }
        .tp-input {
          padding: 8px 12px;
          border: 1.5px solid #DDD;
          border-radius: 8px;
          font-size: 14px;
          color: #333;
          background: #FAFAFA;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .tp-input:focus {
          border-color: #2D5F3F;
          box-shadow: 0 0 0 3px rgba(45, 95, 63, 0.1);
          background: #FFFFFF;
        }
        .tp-score-input {
          width: 60px;
          padding: 6px 8px;
          border: 1.5px solid #DDD;
          border-radius: 6px;
          font-size: 13px;
          color: #333;
          background: #FAFAFA;
          outline: none;
          text-align: center;
          transition: border-color 0.2s ease;
        }
        .tp-score-input:focus {
          border-color: #2D5F3F;
          box-shadow: 0 0 0 2px rgba(45, 95, 63, 0.1);
          background: #FFFFFF;
        }
        .tp-comment-input {
          width: 140px;
          padding: 6px 8px;
          border: 1.5px solid #DDD;
          border-radius: 6px;
          font-size: 12px;
          color: #333;
          background: #FAFAFA;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .tp-comment-input:focus {
          border-color: #2D5F3F;
          box-shadow: 0 0 0 2px rgba(45, 95, 63, 0.1);
          background: #FFFFFF;
        }
        .tp-report-grid-wrapper {
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid #E8E8E8;
        }
        .tp-report-grid {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          min-width: 700px;
        }
        .tp-report-grid th {
          background-color: #2D5F3F;
          color: #FFFFFF;
          padding: 10px 8px;
          text-align: center;
          font-weight: 600;
          font-size: 11px;
          white-space: nowrap;
        }
        .tp-report-grid th:first-child {
          text-align: left;
        }
        .tp-report-grid td {
          padding: 8px 6px;
          border-bottom: 1px solid #F0F0F0;
          text-align: center;
          color: #444;
          font-size: 13px;
        }
        .tp-report-grid td:first-child {
          text-align: left;
          font-weight: 600;
          color: #2D5F3F;
        }
        .tp-report-grid tr:nth-child(even) td {
          background-color: rgba(45, 95, 63, 0.03);
        }
        .tp-report-grid tr:hover td {
          background-color: rgba(45, 95, 63, 0.06);
        }
        .tp-report-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
          flex-wrap: wrap;
        }
        .tp-grade-A { color: #065F46; font-weight: 700; }
        .tp-grade-B { color: #1E40AF; font-weight: 700; }
        .tp-grade-C { color: #92400E; font-weight: 700; }
        .tp-grade-D { color: #B45309; font-weight: 600; }
        .tp-grade-E { color: #DC2626; font-weight: 600; }
        .tp-grade-F { color: #991B1B; font-weight: 700; }
        .tp-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 24px;
        }
        .tp-modal {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 0;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }
        .tp-report-preview-header {
          text-align: center;
          padding: 32px 24px 20px;
          border-bottom: 2px solid #2D5F3F;
        }
        .tp-report-preview-logo {
          width: 64px;
          height: 64px;
          object-fit: contain;
          border-radius: 50%;
          border: 2px solid #2D5F3F;
          margin-bottom: 8px;
        }
        .tp-report-preview-school {
          font-size: 22px;
          font-weight: 700;
          color: #2D5F3F;
          margin: 0 0 4px;
        }
        .tp-report-preview-address {
          font-size: 13px;
          color: #777;
          margin: 0;
        }
        .tp-report-preview-info {
          padding: 16px 24px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          font-size: 14px;
          border-bottom: 1px solid #E8E8E8;
        }
        .tp-report-preview-info-item {
          display: flex;
          gap: 6px;
        }
        .tp-report-preview-info-label {
          font-weight: 600;
          color: #555;
        }
        .tp-report-preview-info-value {
          color: #333;
        }
        .tp-report-preview-table {
          margin: 16px 24px;
          border-collapse: collapse;
          width: calc(100% - 48px);
          font-size: 12px;
        }
        .tp-report-preview-table th {
          background-color: #2D5F3F;
          color: #FFFFFF;
          padding: 8px 6px;
          text-align: center;
          font-weight: 600;
          font-size: 11px;
        }
        .tp-report-preview-table th:first-child {
          text-align: left;
        }
        .tp-report-preview-table td {
          padding: 6px;
          border-bottom: 1px solid #F0F0F0;
          text-align: center;
          color: #444;
        }
        .tp-report-preview-table td:first-child {
          text-align: left;
          font-weight: 600;
        }
        .tp-report-preview-signature {
          padding: 20px 24px 32px;
          display: flex;
          justify-content: space-between;
          gap: 40px;
        }
        .tp-signature-line {
          border-top: 1px solid #333;
          width: 200px;
          padding-top: 6px;
          font-size: 12px;
          color: #555;
        }
        .tp-assignment-card {
          background: #FFFFFF;
          border: 1px solid #E8E8E8;
          border-radius: 12px;
          margin-bottom: 12px;
          overflow: hidden;
          transition: box-shadow 0.2s ease;
        }
        .tp-assignment-card:hover {
          box-shadow: 0 4px 12px rgba(45, 95, 63, 0.08);
        }
        .tp-assignment-header {
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          gap: 12px;
          flex-wrap: wrap;
        }
        .tp-assignment-title {
          font-size: 15px;
          font-weight: 700;
          color: #2D5F3F;
          margin: 0;
        }
        .tp-assignment-meta {
          font-size: 13px;
          color: #777;
          margin: 4px 0 0;
        }
        .tp-assignment-body {
          padding: 0 20px 16px;
          border-top: 1px solid #F0F0F0;
        }
        .tp-create-form {
          background: rgba(45, 95, 63, 0.03);
          border: 1px dashed #C9A961;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
        }
        .tp-create-form h3 {
          font-size: 16px;
          font-weight: 700;
          color: #2D5F3F;
          margin: 0 0 16px;
        }
        .tp-status-badge {
          display: inline-block;
          padding: 3px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        @media (max-width: 768px) {
          .tp-tab {
            padding: 10px 14px;
            font-size: 13px;
          }
          .tp-select-row {
            flex-direction: column;
          }
          .tp-report-preview-info {
            grid-template-columns: 1fr;
          }
          .tp-report-preview-signature {
            flex-direction: column;
            gap: 20px;
          }
        }
      ` }} />

      {/* D1 - Header + Hero */}
      <div className="D D1 D1-short">
        <Navbar />
        <section className="page-hero">
          <h1 className="page-hero-title">Teacher Portal</h1>
          <p className="page-hero-subtitle">
            Manage attendance, assignments, report cards, and file uploads
          </p>
        </section>
      </div>

      {/* D2 - Main Content */}
      <div className="D D2 D2-auto" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <section className="admission-section" style={{ maxWidth: '1100px', width: '100%' }}>

          {/* Tabs */}
          <div className="tp-tabs">
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`tp-tab${activeTab === tab.key ? ' tp-tab-active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {/* ===================== ATTENDANCE TAB ===================== */}
          {activeTab === 'attendance' && (
            <div>
              <div className="tp-select-row">
                <div className="tp-field">
                  <label>Class</label>
                  <select className="tp-input" value={selectedClass} onChange={e => setSelectedClass(e.target.value)} style={{ minWidth: 160 }}>
                    {CLASSES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="tp-field">
                  <label>Date</label>
                  <input type="date" className="tp-input" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)} />
                </div>
                <button className="tp-btn tp-btn-green" onClick={() => handleMarkAllResumption(selectedClass)}>
                  Mark Resumption
                </button>
                <button className="tp-btn tp-btn-gold" onClick={() => handleMarkAllClosing(selectedClass)}>
                  Mark Closing
                </button>
              </div>

              <div className="tp-table-wrapper">
                <table className="tp-table">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}>#</th>
                      <th>Student Name</th>
                      <th>Resumption Time</th>
                      <th>Closing Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAttendanceStudents.map((s, i) => (
                      <tr key={s.id}>
                        <td>{i + 1}</td>
                        <td style={{ fontWeight: 600, color: '#2D5F3F' }}>{s.name}</td>
                        <td>{s.resumptionTime || '—'}</td>
                        <td>{s.closingTime || '—'}</td>
                        <td><StatusBadge status={s.status} type="attendance" /></td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button className="tp-btn tp-btn-green" onClick={() => handleCheckIn(selectedClass, s.id)} disabled={!!s.resumptionTime}>
                              Check In
                            </button>
                            <button className="tp-btn tp-btn-gold" onClick={() => handleCheckOut(selectedClass, s.id)} disabled={!!s.closingTime}>
                              Check Out
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================== ASSIGNMENTS TAB ===================== */}
          {activeTab === 'assignments' && (
            <div>
              {/* Create New Assignment */}
              <div className="tp-create-form">
                <h3>Create New Assignment</h3>
                <div className="tp-select-row" style={{ marginBottom: 0 }}>
                  <div className="tp-field" style={{ flex: 1 }}>
                    <label>Title</label>
                    <input type="text" className="tp-input" placeholder="Assignment title" value={newAssignmentTitle} onChange={e => setNewAssignmentTitle(e.target.value)} />
                  </div>
                  <div className="tp-field">
                    <label>Due Date</label>
                    <input type="date" className="tp-input" value={newAssignmentDueDate} onChange={e => setNewAssignmentDueDate(e.target.value)} />
                  </div>
                  <div className="tp-field">
                    <label>Class</label>
                    <select className="tp-input" value={newAssignmentClass} onChange={e => setNewAssignmentClass(e.target.value)}>
                      {CLASSES.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <button className="tp-btn tp-btn-primary" onClick={handleCreateAssignment} disabled={!newAssignmentTitle.trim() || !newAssignmentDueDate}>
                    Create
                  </button>
                </div>
              </div>

              {/* Assignment List */}
              {assignments.map(assignment => (
                <div key={assignment.id} className="tp-assignment-card">
                  <div className="tp-assignment-header" onClick={() => setExpandedAssignment(expandedAssignment === assignment.id ? null : assignment.id)}>
                    <div>
                      <p className="tp-assignment-title">{assignment.title}</p>
                      <p className="tp-assignment-meta">{assignment.className} &middot; Due: {assignment.dueDate}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: '#777' }}>
                        {assignment.submissions.filter(s => s.status === 'submitted').length}/{assignment.submissions.length} submitted
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, transform: expandedAssignment === assignment.id ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }}>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                  {expandedAssignment === assignment.id && (
                    <div className="tp-assignment-body">
                      <div className="tp-table-wrapper" style={{ marginTop: 12 }}>
                        <table className="tp-table">
                          <thead>
                            <tr>
                              <th>Student Name</th>
                              <th>Status</th>
                              <th>Submitted At</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {assignment.submissions.map(sub => (
                              <tr key={sub.studentId}>
                                <td style={{ fontWeight: 600, color: '#2D5F3F' }}>{sub.studentName}</td>
                                <td><StatusBadge status={sub.status} type="submission" /></td>
                                <td>{sub.submittedAt ? new Date(sub.submittedAt).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}</td>
                                <td>
                                  <button
                                    className={`tp-btn ${sub.status === 'submitted' ? 'tp-btn-gold' : sub.status === 'pending' ? 'tp-btn-green' : 'tp-btn-red'}`}
                                    onClick={() => handleToggleSubmission(assignment.id, sub.studentId)}
                                  >
                                    {sub.status === 'submitted' ? 'Mark Pending' : sub.status === 'pending' ? 'Mark Submitted' : 'Mark Pending'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ===================== REPORT CARDS TAB ===================== */}
          {activeTab === 'report-cards' && (
            <div>
              {/* Selectors */}
              <div className="tp-select-row">
                <div className="tp-field">
                  <label>Class</label>
                  <select className="tp-input" value={reportClass} onChange={e => handleReportClassChange(e.target.value)} style={{ minWidth: 160 }}>
                    {CLASSES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="tp-field">
                  <label>Subject</label>
                  <input type="text" className="tp-input" placeholder="e.g. English Language" value={reportSubject} onChange={e => setReportSubject(e.target.value)} style={{ minWidth: 160 }} />
                </div>
                <div className="tp-field">
                  <label>Term</label>
                  <select className="tp-input" value={reportTerm} onChange={e => setReportTerm(e.target.value as Term)}>
                    <option value="1st">1st Term</option>
                    <option value="2nd">2nd Term</option>
                    <option value="3rd">3rd Term</option>
                  </select>
                </div>
                <div className="tp-field">
                  <label>Session</label>
                  <select className="tp-input" value={reportSession} onChange={e => setReportSession(e.target.value)}>
                    <option value="2025/2026">2025/2026</option>
                    <option value="2024/2025">2024/2025</option>
                  </select>
                </div>
              </div>

              {/* Status banner */}
              {reportStatus !== 'draft' && (
                <div style={{
                  padding: '10px 16px',
                  borderRadius: 8,
                  marginBottom: 16,
                  fontSize: 13,
                  fontWeight: 600,
                  background: reportStatus === 'pending_approval' ? '#FEF3C7' : '#D1FAE5',
                  color: reportStatus === 'pending_approval' ? '#92400E' : '#065F46',
                }}>
                  {reportStatus === 'pending_approval' ? '⏳ This report card is pending management approval.' : '✅ This report card has been approved.'}
                </div>
              )}

              {/* Spreadsheet Grid */}
              <div className="tp-report-grid-wrapper">
                <table className="tp-report-grid">
                  <thead>
                    <tr>
                      <th style={{ minWidth: 140 }}>Student Name</th>
                      <th>1st Test (20)</th>
                      <th>2nd Test (20)</th>
                      <th>Exam (60)</th>
                      <th>Total</th>
                      <th>%</th>
                      <th>Grade</th>
                      <th style={{ minWidth: 140 }}>Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportRows.map(row => (
                      <tr key={row.studentId}>
                        <td>{row.studentName}</td>
                        <td>
                          <input
                            type="number"
                            className="tp-score-input"
                            min={0}
                            max={20}
                            value={row.test1 || ''}
                            onChange={e => updateReportRow(row.studentId, 'test1', e.target.value)}
                            placeholder="0"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="tp-score-input"
                            min={0}
                            max={20}
                            value={row.test2 || ''}
                            onChange={e => updateReportRow(row.studentId, 'test2', e.target.value)}
                            placeholder="0"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="tp-score-input"
                            min={0}
                            max={60}
                            value={row.exam || ''}
                            onChange={e => updateReportRow(row.studentId, 'exam', e.target.value)}
                            placeholder="0"
                          />
                        </td>
                        <td style={{ fontWeight: 700 }}>{row.total}</td>
                        <td style={{ fontWeight: 600 }}>{row.percentage}%</td>
                        <td className={`tp-grade-${row.grade}`}>{row.grade}</td>
                        <td>
                          <input
                            type="text"
                            className="tp-comment-input"
                            value={row.comment}
                            onChange={e => updateReportRow(row.studentId, 'comment', e.target.value)}
                            placeholder="Comment..."
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="tp-report-actions">
                <button className="tp-btn tp-btn-primary" onClick={handleSaveDraft}>
                  Save Draft
                </button>
                <button className="tp-btn tp-btn-green" onClick={handleGenerateReport}>
                  Generate Report Card
                </button>
                <button
                  className={`tp-btn ${reportSignedOff ? 'tp-btn-green' : 'tp-btn-gold'}`}
                  onClick={handleSignOff}
                  disabled={reportSignedOff}
                >
                  {reportSignedOff ? '✓ Signed Off' : 'Sign Off'}
                </button>
              </div>
            </div>
          )}

          {/* ===================== FILE STATUS TAB ===================== */}
          {activeTab === 'file-status' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#2D5F3F', margin: '0 0 16px' }}>My Uploaded Files</h3>
              <div className="tp-table-wrapper">
                <table className="tp-table">
                  <thead>
                    <tr>
                      <th>File</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fileStatuses.map(f => (
                      <tr key={f.id}>
                        <td style={{ fontWeight: 600, color: '#2D5F3F' }}>{f.fileName}</td>
                        <td>{f.category}</td>
                        <td><StatusBadge status={f.status} type="file" /></td>
                        <td>{f.date}</td>
                        <td>
                          {f.status === 'not_approved' && (
                            <button className="tp-btn tp-btn-gold" onClick={() => handleResubmit(f.id)}>
                              Resubmit
                            </button>
                          )}
                          {f.status !== 'not_approved' && <span style={{ fontSize: 12, color: '#999' }}>—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </section>
      </div>

      {/* ===================== REPORT CARD PREVIEW MODAL ===================== */}
      {showReportPreview && (
        <div className="tp-modal-overlay" onClick={() => setShowReportPreview(false)}>
          <div className="tp-modal" onClick={e => e.stopPropagation()}>
            <div className="tp-report-preview-header">
              <img
                src="/InShot_20260507_212731657.jpg"
                alt="School Logo"
                className="tp-report-preview-logo"
              />
              <h2 className="tp-report-preview-school">Aroyan Muslim School</h2>
              <p className="tp-report-preview-address">Quality Education with Islamic Values</p>
            </div>

            <div className="tp-report-preview-info">
              <div className="tp-report-preview-info-item">
                <span className="tp-report-preview-info-label">Student:</span>
                <span className="tp-report-preview-info-value">Class Report</span>
              </div>
              <div className="tp-report-preview-info-item">
                <span className="tp-report-preview-info-label">Class:</span>
                <span className="tp-report-preview-info-value">{CLASSES.find(c => c.id === reportClass)?.name}</span>
              </div>
              <div className="tp-report-preview-info-item">
                <span className="tp-report-preview-info-label">Subject:</span>
                <span className="tp-report-preview-info-value">{reportSubject || 'N/A'}</span>
              </div>
              <div className="tp-report-preview-info-item">
                <span className="tp-report-preview-info-label">Term:</span>
                <span className="tp-report-preview-info-value">{reportTerm} Term</span>
              </div>
              <div className="tp-report-preview-info-item">
                <span className="tp-report-preview-info-label">Session:</span>
                <span className="tp-report-preview-info-value">{reportSession}</span>
              </div>
            </div>

            <table className="tp-report-preview-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>1st Test</th>
                  <th>2nd Test</th>
                  <th>Exam</th>
                  <th>Total</th>
                  <th>%</th>
                  <th>Grade</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {reportRows.map(row => (
                  <tr key={row.studentId}>
                    <td>{row.studentName}</td>
                    <td>{row.test1}</td>
                    <td>{row.test2}</td>
                    <td>{row.exam}</td>
                    <td style={{ fontWeight: 700 }}>{row.total}</td>
                    <td>{row.percentage}%</td>
                    <td className={`tp-grade-${row.grade}`}>{row.grade}</td>
                    <td>{row.comment || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="tp-report-preview-signature">
              <div>
                <div className="tp-signature-line">
                  {reportSignedOff ? `${profile.full_name} (Signed)` : 'Teacher Signature'}
                </div>
              </div>
              <div>
                <div className="tp-signature-line">Management Signature</div>
              </div>
            </div>

            <div style={{ padding: '0 24px 24px', display: 'flex', gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button className="tp-btn tp-btn-red" onClick={() => setShowReportPreview(false)}>
                Close Preview
              </button>
              <button className="tp-btn tp-btn-primary" onClick={handleSubmitToManagement}>
                Submit to Management
              </button>
            </div>
          </div>
        </div>
      )}

      {/* D3 - Footer */}
      <Footer />
    </>
  )
}
