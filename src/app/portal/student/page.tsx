'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import type { SubmissionStatus, Term } from '@/lib/types'

type Tab = 'assignments' | 'results' | 'attendance' | 'files'
type FolderKey = 'syllabus' | 'lesson_notes' | 'others'

interface StudentAssignment {
  id: string
  title: string
  dueDate: string
  className: string
  status: SubmissionStatus
}

interface SubjectResult {
  id: string
  subject: string
  test1: number
  test2: number
  exam: number
  total: number
  percentage: number
  grade: string
  comment: string
}

interface TermResult {
  term: Term
  termLabel: string
  subjects: SubjectResult[]
}

interface AttendanceRecord {
  id: string
  date: string
  dayName: string
  resumptionTime: string | null
  closingTime: string | null
  status: 'present' | 'late' | 'absent'
}

interface ApprovedFile {
  id: string
  title: string
  uploadedBy: string
  date: string
  folder: FolderKey
}

const MOCK_ASSIGNMENTS: StudentAssignment[] = [
  { id: 'as1', title: 'English Essay - My Community', dueDate: '2026-05-15', className: 'JSS 2A', status: 'submitted' },
  { id: 'as2', title: 'Mathematics Homework - Algebra', dueDate: '2026-05-10', className: 'JSS 2A', status: 'submitted' },
  { id: 'as3', title: 'Islamic Studies - Quran Memorization', dueDate: '2026-05-20', className: 'JSS 2A', status: 'pending' },
  { id: 'as4', title: 'Civic Education Project', dueDate: '2026-05-25', className: 'JSS 2A', status: 'not_submitted' },
  { id: 'as5', title: 'Basic Science Lab Report', dueDate: '2026-05-18', className: 'JSS 2A', status: 'pending' },
  { id: 'as6', title: 'Social Studies Assignment', dueDate: '2026-05-22', className: 'JSS 2A', status: 'submitted' },
]

const MOCK_RESULTS: TermResult[] = [
  {
    term: '1st',
    termLabel: '1st Term',
    subjects: [
      { id: 'r1', subject: 'English Language', test1: 16, test2: 15, exam: 52, total: 83, percentage: 83, grade: 'A', comment: 'Excellent work' },
      { id: 'r2', subject: 'Mathematics', test1: 14, test2: 13, exam: 45, total: 72, percentage: 72, grade: 'A', comment: 'Very good performance' },
      { id: 'r3', subject: 'Basic Science', test1: 12, test2: 11, exam: 38, total: 61, percentage: 61, grade: 'B', comment: 'Good, can improve' },
      { id: 'r4', subject: 'Islamic Studies', test1: 18, test2: 17, exam: 55, total: 90, percentage: 90, grade: 'A', comment: 'Outstanding!' },
      { id: 'r5', subject: 'Civic Education', test1: 10, test2: 9, exam: 35, total: 54, percentage: 54, grade: 'C', comment: 'Needs more effort' },
      { id: 'r6', subject: 'Social Studies', test1: 13, test2: 14, exam: 42, total: 69, percentage: 69, grade: 'B', comment: 'Good performance' },
    ],
  },
  {
    term: '2nd',
    termLabel: '2nd Term',
    subjects: [
      { id: 'r7', subject: 'English Language', test1: 15, test2: 14, exam: 48, total: 77, percentage: 77, grade: 'A', comment: 'Keep it up' },
      { id: 'r8', subject: 'Mathematics', test1: 13, test2: 12, exam: 40, total: 65, percentage: 65, grade: 'B', comment: 'Good improvement needed' },
      { id: 'r9', subject: 'Basic Science', test1: 11, test2: 10, exam: 32, total: 53, percentage: 53, grade: 'C', comment: 'Work harder' },
      { id: 'r10', subject: 'Islamic Studies', test1: 17, test2: 16, exam: 50, total: 83, percentage: 83, grade: 'A', comment: 'MashaAllah!' },
      { id: 'r11', subject: 'Civic Education', test1: 9, test2: 8, exam: 30, total: 47, percentage: 47, grade: 'D', comment: 'Needs serious attention' },
      { id: 'r12', subject: 'Social Studies', test1: 12, test2: 11, exam: 36, total: 59, percentage: 59, grade: 'C', comment: 'Fair performance' },
    ],
  },
  {
    term: '3rd',
    termLabel: '3rd Term',
    subjects: [
      { id: 'r13', subject: 'English Language', test1: 0, test2: 0, exam: 0, total: 0, percentage: 0, grade: 'F', comment: 'Results not yet available' },
      { id: 'r14', subject: 'Mathematics', test1: 0, test2: 0, exam: 0, total: 0, percentage: 0, grade: 'F', comment: 'Results not yet available' },
      { id: 'r15', subject: 'Basic Science', test1: 0, test2: 0, exam: 0, total: 0, percentage: 0, grade: 'F', comment: 'Results not yet available' },
      { id: 'r16', subject: 'Islamic Studies', test1: 0, test2: 0, exam: 0, total: 0, percentage: 0, grade: 'F', comment: 'Results not yet available' },
      { id: 'r17', subject: 'Civic Education', test1: 0, test2: 0, exam: 0, total: 0, percentage: 0, grade: 'F', comment: 'Results not yet available' },
      { id: 'r18', subject: 'Social Studies', test1: 0, test2: 0, exam: 0, total: 0, percentage: 0, grade: 'F', comment: 'Results not yet available' },
    ],
  },
]

const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att1', date: '2026-05-05', dayName: 'Monday', resumptionTime: '7:15 AM', closingTime: '2:30 PM', status: 'present' },
  { id: 'att2', date: '2026-05-06', dayName: 'Tuesday', resumptionTime: '7:35 AM', closingTime: '2:30 PM', status: 'late' },
  { id: 'att3', date: '2026-05-07', dayName: 'Wednesday', resumptionTime: '7:20 AM', closingTime: '2:30 PM', status: 'present' },
  { id: 'att4', date: '2026-05-08', dayName: 'Thursday', resumptionTime: null, closingTime: null, status: 'absent' },
  { id: 'att5', date: '2026-05-09', dayName: 'Friday', resumptionTime: '7:10 AM', closingTime: '12:30 PM', status: 'present' },
  { id: 'att6', date: '2026-05-12', dayName: 'Monday', resumptionTime: '7:25 AM', closingTime: '2:30 PM', status: 'present' },
  { id: 'att7', date: '2026-05-13', dayName: 'Tuesday', resumptionTime: '7:40 AM', closingTime: '2:30 PM', status: 'late' },
]

const MOCK_FILES: Record<FolderKey, ApprovedFile[]> = {
  syllabus: [
    { id: 'sf1', title: 'English Language Scheme Term 2.pdf', uploadedBy: 'Ustaz Nasir', date: '2026-04-20', folder: 'syllabus' },
    { id: 'sf2', title: 'Islamic Studies Scheme.pdf', uploadedBy: 'Ustazah Fatima', date: '2026-04-15', folder: 'syllabus' },
    { id: 'sf3', title: 'Mathematics Curriculum 2026.docx', uploadedBy: 'Malam Sani', date: '2026-04-18', folder: 'syllabus' },
  ],
  lesson_notes: [
    { id: 'lf1', title: 'Week 7 - Math Notes.pdf', uploadedBy: 'Malam Sani', date: '2026-04-19', folder: 'lesson_notes' },
    { id: 'lf2', title: 'Week 5 - Civic Education.pdf', uploadedBy: 'Malam Kabir', date: '2026-04-12', folder: 'lesson_notes' },
    { id: 'lf3', title: 'Week 8 - English Notes.docx', uploadedBy: 'Ustaz Nasir', date: '2026-04-22', folder: 'lesson_notes' },
  ],
  others: [
    { id: 'of1', title: 'Homework Assignment Sheet.docx', uploadedBy: 'Malam Sani', date: '2026-04-17', folder: 'others' },
    { id: 'of2', title: 'Mid-Term Exam Schedule.pdf', uploadedBy: 'Admin', date: '2026-04-21', folder: 'others' },
  ],
}

const FOLDER_INFO: Record<FolderKey, { icon: string; title: string }> = {
  syllabus: { icon: '📋', title: 'Syllabus/Scheme of Work' },
  lesson_notes: { icon: '📝', title: 'Lesson Notes' },
  others: { icon: '📁', title: 'Others' },
}

function StatusBadge({ status, type }: { status: string; type: 'attendance' | 'submission' | 'grade' }) {
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
  } else if (type === 'grade') {
    if (['A'].includes(status)) { bg = '#D1FAE5'; color = '#065F46' }
    else if (['B'].includes(status)) { bg = '#DBEAFE'; color = '#1E40AF' }
    else if (['C'].includes(status)) { bg = '#FEF3C7'; color = '#92400E' }
    else if (['D', 'E'].includes(status)) { bg = '#FED7AA'; color = '#9A3412' }
    else { bg = '#FEE2E2'; color = '#991B1B' }
  }

  return (
    <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, backgroundColor: bg, color }}>
      {label}
    </span>
  )
}

export default function StudentPortalPage() {
  const router = useRouter()
  const { profile, portalAccess, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('assignments')
  const [activeTerm, setActiveTerm] = useState<Term>('1st')

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
            <h1 className="page-hero-title">Student Portal</h1>
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

  if (portalAccess && !portalAccess.student) {
    return (
      <>
        <div className="D D1 D1-short">
          <Navbar />
          <section className="page-hero">
            <h1 className="page-hero-title">Student Portal</h1>
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
            <p style={{ fontSize: '16px', color: '#777', margin: '0 0 24px' }}>You do not have permission to access the Student Portal.</p>
            <a href="/dashboard" className="cta-btn cta-btn-filled" style={{ display: 'inline-block' }}>Back to Dashboard</a>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'assignments', label: 'My Assignments', icon: '📝' },
    { key: 'results', label: 'My Results', icon: '📊' },
    { key: 'attendance', label: 'Attendance', icon: '📋' },
    { key: 'files', label: 'Files', icon: '📁' },
  ]

  const currentTermResults = MOCK_RESULTS.find(r => r.term === activeTerm)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .sp-tabs {
          display: flex;
          gap: 0;
          border-bottom: 2px solid #E8E8E8;
          margin-bottom: 28px;
          overflow-x: auto;
        }
        .sp-tab {
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
        .sp-tab:hover {
          color: #2D5F3F;
        }
        .sp-tab-active {
          color: #2D5F3F;
          border-bottom-color: #2D5F3F;
        }
        .sp-table-wrapper {
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid #E8E8E8;
        }
        .sp-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .sp-table th {
          background-color: #2D5F3F;
          color: #FFFFFF;
          padding: 10px 14px;
          text-align: left;
          font-weight: 600;
          font-size: 12px;
          white-space: nowrap;
        }
        .sp-table td {
          padding: 10px 14px;
          border-bottom: 1px solid #F0F0F0;
          color: #444;
        }
        .sp-table tr:nth-child(even) td {
          background-color: rgba(45, 95, 63, 0.03);
        }
        .sp-table tr:last-child td {
          border-bottom: none;
        }
        .sp-table tr:hover td {
          background-color: rgba(45, 95, 63, 0.06);
        }
        .sp-assignment-card {
          background: #FFFFFF;
          border: 1px solid #E8E8E8;
          border-radius: 12px;
          padding: 18px 20px;
          margin-bottom: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: box-shadow 0.2s ease;
          gap: 12px;
          flex-wrap: wrap;
        }
        .sp-assignment-card:hover {
          box-shadow: 0 4px 12px rgba(45, 95, 63, 0.08);
        }
        .sp-assignment-title {
          font-size: 15px;
          font-weight: 700;
          color: #2D5F3F;
          margin: 0 0 4px;
        }
        .sp-assignment-meta {
          font-size: 13px;
          color: #777;
          margin: 0;
        }
        .sp-result-card {
          background: #FFFFFF;
          border: 1px solid #E8E8E8;
          border-radius: 12px;
          margin-bottom: 24px;
          overflow: hidden;
        }
        .sp-result-card-header {
          background: linear-gradient(135deg, #2D5F3F, #1F4A2E);
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .sp-result-card-title {
          font-size: 18px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0;
        }
        .sp-result-card-subtitle {
          font-size: 13px;
          color: #C9A961;
          margin: 4px 0 0;
        }
        .sp-term-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
        }
        .sp-term-tab {
          padding: 8px 20px;
          font-size: 13px;
          font-weight: 600;
          color: #555;
          cursor: pointer;
          border: 1.5px solid #DDD;
          background: #FAFAFA;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        .sp-term-tab:hover {
          border-color: #2D5F3F;
          color: #2D5F3F;
        }
        .sp-term-tab-active {
          background: #2D5F3F;
          color: #FFFFFF;
          border-color: #2D5F3F;
        }
        .sp-grade-A { color: #065F46; font-weight: 700; }
        .sp-grade-B { color: #1E40AF; font-weight: 700; }
        .sp-grade-C { color: #92400E; font-weight: 700; }
        .sp-grade-D { color: #B45309; font-weight: 600; }
        .sp-grade-E { color: #DC2626; font-weight: 600; }
        .sp-grade-F { color: #991B1B; font-weight: 700; }
        .sp-attendance-card {
          background: #FFFFFF;
          border: 1px solid #E8E8E8;
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          transition: box-shadow 0.2s ease;
        }
        .sp-attendance-card:hover {
          box-shadow: 0 4px 12px rgba(45, 95, 63, 0.08);
        }
        .sp-attendance-date {
          font-size: 15px;
          font-weight: 700;
          color: #2D5F3F;
          margin: 0 0 2px;
        }
        .sp-attendance-day {
          font-size: 13px;
          color: #777;
          margin: 0;
        }
        .sp-attendance-times {
          display: flex;
          gap: 16px;
          font-size: 13px;
          color: #555;
        }
        .sp-folder-section {
          margin-bottom: 28px;
        }
        .sp-folder-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 2px solid rgba(45, 95, 63, 0.1);
        }
        .sp-folder-header h3 {
          font-size: 16px;
          font-weight: 700;
          color: #2D5F3F;
          margin: 0;
        }
        .sp-file-item {
          background: #FFFFFF;
          border: 1px solid #F0F0F0;
          border-radius: 10px;
          padding: 12px 16px;
          margin-bottom: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          transition: box-shadow 0.2s ease;
        }
        .sp-file-item:hover {
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .sp-file-title {
          font-size: 14px;
          font-weight: 600;
          color: #2D5F3F;
          margin: 0 0 2px;
        }
        .sp-file-meta {
          font-size: 12px;
          color: #999;
          margin: 0;
        }
        .sp-avg-badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          background: rgba(201, 169, 97, 0.15);
          color: #92400E;
        }
        @media (max-width: 768px) {
          .sp-tab {
            padding: 10px 14px;
            font-size: 13px;
          }
          .sp-assignment-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .sp-attendance-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .sp-attendance-times {
            flex-direction: column;
            gap: 4px;
          }
        }
      ` }} />

      {/* D1 - Header + Hero */}
      <div className="D D1 D1-short">
        <Navbar />
        <section className="page-hero">
          <h1 className="page-hero-title">Student Portal</h1>
          <p className="page-hero-subtitle">
            View your assignments, results, attendance, and class files
          </p>
        </section>
      </div>

      {/* D2 - Main Content */}
      <div className="D D2 D2-auto" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <section className="admission-section" style={{ maxWidth: '1100px', width: '100%' }}>

          {/* Tabs */}
          <div className="sp-tabs">
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`sp-tab${activeTab === tab.key ? ' sp-tab-active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {/* ===================== MY ASSIGNMENTS TAB ===================== */}
          {activeTab === 'assignments' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#2D5F3F', margin: '0 0 20px' }}>
                My Assignments
              </h2>
              {MOCK_ASSIGNMENTS.map(a => (
                <div key={a.id} className="sp-assignment-card">
                  <div>
                    <p className="sp-assignment-title">{a.title}</p>
                    <p className="sp-assignment-meta">{a.className} &middot; Due: {a.dueDate}</p>
                  </div>
                  <StatusBadge status={a.status} type="submission" />
                </div>
              ))}
            </div>
          )}

          {/* ===================== MY RESULTS TAB ===================== */}
          {activeTab === 'results' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#2D5F3F', margin: '0 0 20px' }}>
                My Results
              </h2>

              {/* Term Tabs */}
              <div className="sp-term-tabs">
                {(['1st', '2nd', '3rd'] as Term[]).map(t => (
                  <button
                    key={t}
                    className={`sp-term-tab${activeTerm === t ? ' sp-term-tab-active' : ''}`}
                    onClick={() => setActiveTerm(t)}
                  >
                    {t} Term
                  </button>
                ))}
              </div>

              {currentTermResults && (
                <div className="sp-result-card">
                  <div className="sp-result-card-header">
                    <div>
                      <h3 className="sp-result-card-title">{currentTermResults.termLabel} Report Card</h3>
                      <p className="sp-result-card-subtitle">Session 2025/2026 &middot; JSS 2A</p>
                    </div>
                    <div className="sp-avg-badge">
                      Avg: {currentTermResults.subjects.length > 0
                        ? Math.round(currentTermResults.subjects.reduce((sum, s) => sum + s.percentage, 0) / currentTermResults.subjects.length)
                        : 0}%
                    </div>
                  </div>
                  <div className="sp-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                    <table className="sp-table">
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th style={{ textAlign: 'center' }}>1st Test</th>
                          <th style={{ textAlign: 'center' }}>2nd Test</th>
                          <th style={{ textAlign: 'center' }}>Exam</th>
                          <th style={{ textAlign: 'center' }}>Total</th>
                          <th style={{ textAlign: 'center' }}>%</th>
                          <th style={{ textAlign: 'center' }}>Grade</th>
                          <th>Comment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentTermResults.subjects.map(s => (
                          <tr key={s.id}>
                            <td style={{ fontWeight: 600, color: '#2D5F3F' }}>{s.subject}</td>
                            <td style={{ textAlign: 'center' }}>{s.test1}</td>
                            <td style={{ textAlign: 'center' }}>{s.test2}</td>
                            <td style={{ textAlign: 'center' }}>{s.exam}</td>
                            <td style={{ textAlign: 'center', fontWeight: 700 }}>{s.total}</td>
                            <td style={{ textAlign: 'center', fontWeight: 600 }}>{s.percentage}%</td>
                            <td style={{ textAlign: 'center' }}><span className={`sp-grade-${s.grade}`}>{s.grade}</span></td>
                            <td style={{ fontSize: 12 }}>{s.comment}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================== ATTENDANCE TAB ===================== */}
          {activeTab === 'attendance' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#2D5F3F', margin: '0 0 8px' }}>
                Attendance Record
              </h2>
              <p style={{ fontSize: 14, color: '#777', margin: '0 0 20px' }}>
                Week of May 5 - May 13, 2026
              </p>

              {/* Summary */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                <div style={{ background: '#D1FAE5', color: '#065F46', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
                  Present: {MOCK_ATTENDANCE.filter(a => a.status === 'present').length}
                </div>
                <div style={{ background: '#FEF3C7', color: '#92400E', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
                  Late: {MOCK_ATTENDANCE.filter(a => a.status === 'late').length}
                </div>
                <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
                  Absent: {MOCK_ATTENDANCE.filter(a => a.status === 'absent').length}
                </div>
              </div>

              {MOCK_ATTENDANCE.map(a => (
                <div key={a.id} className="sp-attendance-card">
                  <div>
                    <p className="sp-attendance-date">{a.date}</p>
                    <p className="sp-attendance-day">{a.dayName}</p>
                  </div>
                  <div className="sp-attendance-times">
                    <span>Resumption: <strong>{a.resumptionTime || '—'}</strong></span>
                    <span>Closing: <strong>{a.closingTime || '—'}</strong></span>
                  </div>
                  <StatusBadge status={a.status} type="attendance" />
                </div>
              ))}
            </div>
          )}

          {/* ===================== FILES TAB ===================== */}
          {activeTab === 'files' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#2D5F3F', margin: '0 0 20px' }}>
                Class Files
              </h2>

              {(Object.keys(FOLDER_INFO) as FolderKey[]).map(folderKey => {
                const folderInfo = FOLDER_INFO[folderKey]
                const files = MOCK_FILES[folderKey]
                return (
                  <div key={folderKey} className="sp-folder-section">
                    <div className="sp-folder-header">
                      <span>{folderInfo.icon}</span>
                      <h3>{folderInfo.title}</h3>
                      <span style={{ fontSize: 12, color: '#999', marginLeft: 4 }}>({files.length})</span>
                    </div>
                    {files.map(f => (
                      <div key={f.id} className="sp-file-item">
                        <div>
                          <p className="sp-file-title">{f.title}</p>
                          <p className="sp-file-meta">Uploaded by {f.uploadedBy} &middot; {f.date}</p>
                        </div>
                        <span style={{ fontSize: 12, color: '#065F46', background: '#D1FAE5', padding: '3px 10px', borderRadius: 12, fontWeight: 600 }}>
                          Approved
                        </span>
                      </div>
                    ))}
                    {files.length === 0 && (
                      <p style={{ fontSize: 14, color: '#999', padding: '12px 0' }}>No files in this folder.</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}

        </section>
      </div>

      {/* D3 - Footer */}
      <Footer />
    </>
  )
}
