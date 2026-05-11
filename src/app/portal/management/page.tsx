'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import QuoteSlider from '@/components/shared/QuoteSlider'
import type { Section, AdmissionStatus, FileStatus, Role } from '@/lib/types'
import { supabase } from '@/lib/supabase'

type SubTab = 'admissions' | 'files' | 'teachers' | 'students' | 'helpdesk' | 'create_account'

interface MockAdmission {
  id: string
  name: string
  phone: string
  level: string
  parent: string
  status: AdmissionStatus
  date: string
}

interface MockFile {
  id: string
  fileName: string
  category: string
  uploadedBy: string
  date: string
  status: FileStatus
}

interface MockTeacher {
  id: string
  name: string
  email: string
  assignedClass: string
}

interface MockStudent {
  id: string
  name: string
  email: string
  className: string
}

interface MockHelpdesk {
  id: string
  sender: string
  subject: string
  message: string
  status: 'open' | 'closed'
}

const SECTION_KEYS: Section[] = ['nursery', 'primary', 'jss', 'sss']
const SECTION_TAB_LABELS: Record<Section, string> = {
  nursery: 'Nursery/Primary',
  primary: 'Primary',
  jss: 'JSS',
  sss: 'SSS',
}

const MOCK_ADMISSIONS: Record<Section, MockAdmission[]> = {
  nursery: [
    { id: 'a1', name: 'Aisha Bello', phone: '08012345678', level: 'Nursery 2', parent: 'Hajia Bello', status: 'pending', date: '2026-04-20' },
    { id: 'a2', name: 'Yusuf Ibrahim', phone: '08098765432', level: 'Nursery 1', parent: 'Malam Ibrahim', status: 'reviewed', date: '2026-04-18' },
    { id: 'a3', name: 'Fatima Sani', phone: '08034567891', level: 'Nursery 3', parent: 'Hajiya Sani', status: 'accepted', date: '2026-04-15' },
    { id: 'a4', name: 'Musa Abdullahi', phone: '08045678912', level: 'Nursery 2', parent: 'Alhaji Abdullahi', status: 'rejected', date: '2026-04-12' },
  ],
  primary: [
    { id: 'b1', name: 'Khadijah Musa', phone: '08056789123', level: 'Primary 3', parent: 'Malam Musa', status: 'pending', date: '2026-04-22' },
    { id: 'b2', name: 'Aliyu Garba', phone: '08067891234', level: 'Primary 5', parent: 'Alhaji Garba', status: 'reviewed', date: '2026-04-19' },
    { id: 'b3', name: 'Zainab Ahmed', phone: '08078912345', level: 'Primary 1', parent: 'Hajiya Ahmed', status: 'accepted', date: '2026-04-16' },
  ],
  jss: [
    { id: 'c1', name: 'Abubakar Usman', phone: '08089012345', level: 'JSS 2', parent: 'Malam Usman', status: 'pending', date: '2026-04-21' },
    { id: 'c2', name: 'Maryam Hamza', phone: '08090123456', level: 'JSS 1', parent: 'Hajiya Hamza', status: 'reviewed', date: '2026-04-17' },
    { id: 'c3', name: 'Ibrahim Sule', phone: '08001234567', level: 'JSS 3', parent: 'Alhaji Sule', status: 'accepted', date: '2026-04-14' },
  ],
  sss: [
    { id: 'd1', name: 'Hassan Bello', phone: '08012349876', level: 'SSS 2 Science', parent: 'Malam Bello', status: 'pending', date: '2026-04-23' },
    { id: 'd2', name: 'Amina Musa', phone: '08023450987', level: 'SSS 1 Arts', parent: 'Hajiya Musa', status: 'reviewed', date: '2026-04-20' },
    { id: 'd3', name: 'Umar Farouk', phone: '08034561098', level: 'SSS 3 Science', parent: 'Alhaji Farouk', status: 'rejected', date: '2026-04-10' },
  ],
}

const MOCK_FILES: Record<Section, MockFile[]> = {
  nursery: [
    { id: 'f1', fileName: 'Nursery Rhymes Scheme.pdf', category: 'Syllabus', uploadedBy: 'Ustaz Nasir', date: '2026-04-22', status: 'pending' },
    { id: 'f2', fileName: 'Week 8 Lesson Note.docx', category: 'Lesson Notes', uploadedBy: 'Ustazah Fatima', date: '2026-04-20', status: 'approved' },
    { id: 'f3', fileName: 'Term Exam Questions.pdf', category: 'Others', uploadedBy: 'Ustaz Nasir', date: '2026-04-18', status: 'not_approved' },
  ],
  primary: [
    { id: 'f4', fileName: 'Primary Science Scheme.pdf', category: 'Syllabus', uploadedBy: 'Malam Idris', date: '2026-04-21', status: 'pending' },
    { id: 'f5', fileName: 'Week 7 Math Notes.docx', category: 'Lesson Notes', uploadedBy: 'Malam Sani', date: '2026-04-19', status: 'approved' },
  ],
  jss: [
    { id: 'f6', fileName: 'JSS English Scheme.pdf', category: 'Syllabus', uploadedBy: 'Malam Kabir', date: '2026-04-20', status: 'pending' },
    { id: 'f7', fileName: 'Civic Education Notes.docx', category: 'Lesson Notes', uploadedBy: 'Ustazah Hauwa', date: '2026-04-18', status: 'approved' },
    { id: 'f8', fileName: 'JSS 2 Test Questions.pdf', category: 'Others', uploadedBy: 'Malam Kabir', date: '2026-04-15', status: 'pending' },
  ],
  sss: [
    { id: 'f9', fileName: 'SSS Physics Scheme.pdf', category: 'Syllabus', uploadedBy: 'Malam Tukur', date: '2026-04-21', status: 'approved' },
    { id: 'f10', fileName: 'Chemistry Lesson Note.docx', category: 'Lesson Notes', uploadedBy: 'Ustaz Aminu', date: '2026-04-17', status: 'not_approved' },
  ],
}

const MOCK_TEACHERS: Record<Section, MockTeacher[]> = {
  nursery: [
    { id: 't1', name: 'Ustaz Nasir Muhammad', email: 'nasir@aroyan.edu', assignedClass: 'Nursery 1' },
    { id: 't2', name: 'Ustazah Fatima Ali', email: 'fatima@aroyan.edu', assignedClass: 'Nursery 2' },
    { id: 't3', name: 'Ustazah Khadijah Isa', email: 'khadijah@aroyan.edu', assignedClass: 'Nursery 3' },
  ],
  primary: [
    { id: 't4', name: 'Malam Idris Bello', email: 'idris@aroyan.edu', assignedClass: 'Primary 1A' },
    { id: 't5', name: 'Malam Sani Garba', email: 'sani@aroyan.edu', assignedClass: 'Primary 3A' },
    { id: 't6', name: 'Ustazah Hauwa Musa', email: 'hauwa@aroyan.edu', assignedClass: 'Primary 5A' },
    { id: 't7', name: 'Malam Yusuf Adam', email: 'yusuf@aroyan.edu', assignedClass: 'Primary 6A' },
  ],
  jss: [
    { id: 't8', name: 'Malam Kabir Usman', email: 'kabir@aroyan.edu', assignedClass: 'JSS 1A' },
    { id: 't9', name: 'Ustazah Hauwa Sule', email: 'hauwa.s@aroyan.edu', assignedClass: 'JSS 2A' },
    { id: 't10', name: 'Malam Farouk Ahmed', email: 'farouk@aroyan.edu', assignedClass: 'JSS 3A' },
  ],
  sss: [
    { id: 't11', name: 'Malam Tukur Ibrahim', email: 'tukur@aroyan.edu', assignedClass: 'SSS 1 Science' },
    { id: 't12', name: 'Ustaz Aminu Dalhatu', email: 'aminu@aroyan.edu', assignedClass: 'SSS 2 Science' },
    { id: 't13', name: 'Ustazah Zainab Ali', email: 'zainab@aroyan.edu', assignedClass: 'SSS 1 Arts' },
  ],
}

const MOCK_STUDENTS: Record<Section, MockStudent[]> = {
  nursery: [
    { id: 's1', name: 'Aisha Bello', email: 'aisha.b@aroyan.edu', className: 'Nursery 2' },
    { id: 's2', name: 'Yusuf Ibrahim', email: 'yusuf.i@aroyan.edu', className: 'Nursery 1' },
    { id: 's3', name: 'Fatima Sani', email: 'fatima.s@aroyan.edu', className: 'Nursery 3' },
  ],
  primary: [
    { id: 's4', name: 'Khadijah Musa', email: 'khadijah.m@aroyan.edu', className: 'Primary 3A' },
    { id: 's5', name: 'Aliyu Garba', email: 'aliyu.g@aroyan.edu', className: 'Primary 5A' },
    { id: 's6', name: 'Zainab Ahmed', email: 'zainab.a@aroyan.edu', className: 'Primary 1A' },
    { id: 's7', name: 'Bashir Umar', email: 'bashir.u@aroyan.edu', className: 'Primary 6A' },
  ],
  jss: [
    { id: 's8', name: 'Abubakar Usman', email: 'abubakar.u@aroyan.edu', className: 'JSS 2A' },
    { id: 's9', name: 'Maryam Hamza', email: 'maryam.h@aroyan.edu', className: 'JSS 1A' },
    { id: 's10', name: 'Ibrahim Sule', email: 'ibrahim.s@aroyan.edu', className: 'JSS 3A' },
  ],
  sss: [
    { id: 's11', name: 'Hassan Bello', email: 'hassan.b@aroyan.edu', className: 'SSS 2 Science' },
    { id: 's12', name: 'Amina Musa', email: 'amina.m@aroyan.edu', className: 'SSS 1 Arts' },
    { id: 's13', name: 'Umar Farouk', email: 'umar.f@aroyan.edu', className: 'SSS 3 Science' },
  ],
}

const MOCK_HELPDESK: Record<Section, MockHelpdesk[]> = {
  nursery: [
    { id: 'h1', sender: 'Hajia Bello', subject: 'Fee Payment Inquiry', message: 'Salam, I want to confirm the nursery school fees for next term. Jazakallahu khairan.', status: 'open' },
    { id: 'h2', sender: 'Malam Ibrahim', subject: 'Resumption Date', message: 'Please what is the resumption date for nursery section?', status: 'closed' },
  ],
  primary: [
    { id: 'h3', sender: 'Alhaji Garba', subject: 'Report Card Issue', message: 'My son Aliyu did not receive his report card. Please assist.', status: 'open' },
  ],
  jss: [
    { id: 'h4', sender: 'Malam Usman', subject: 'Homework Clarification', message: 'Salam, my son needs clarification on the JSS 2 mathematics homework.', status: 'open' },
    { id: 'h5', sender: 'Hajiya Hamza', subject: 'Uniform Purchase', message: 'Where can I purchase the JSS uniform? Is it available at the school?', status: 'closed' },
  ],
  sss: [
    { id: 'h6', sender: 'Malam Bello', subject: 'Subject Combination', message: 'Can my son switch from Science to Arts class in SSS 2?', status: 'open' },
  ],
}

function StatusBadge({ status }: { status: AdmissionStatus | FileStatus | string }) {
  let bg = '#FEF3C7'
  let color = '#92400E'
  if (status === 'reviewed') { bg = '#DBEAFE'; color = '#1E40AF' }
  if (status === 'accepted' || status === 'approved') { bg = '#D1FAE5'; color = '#065F46' }
  if (status === 'rejected' || status === 'not_approved') { bg = '#FEE2E2'; color = '#991B1B' }
  const label = status === 'not_approved' ? 'Not Approved' : status.charAt(0).toUpperCase() + status.slice(1)
  return (
    <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, backgroundColor: bg, color }}>
      {label}
    </span>
  )
}

function HelpdeskBadge({ status }: { status: 'open' | 'closed' }) {
  const bg = status === 'open' ? '#FEF3C7' : '#E5E7EB'
  const color = status === 'open' ? '#92400E' : '#6B7280'
  return (
    <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, backgroundColor: bg, color }}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export default function ManagementPortalPage() {
  const router = useRouter()
  const { profile, portalAccess, loading } = useAuth()
  const [activeSection, setActiveSection] = useState<Section>('nursery')
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('admissions')
  const [admissions, setAdmissions] = useState(MOCK_ADMISSIONS)
  const [files, setFiles] = useState(MOCK_FILES)
  const [helpdesk, setHelpdesk] = useState(MOCK_HELPDESK)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createName, setCreateName] = useState('')
  const [createEmail, setCreateEmail] = useState('')
  const [createPassword, setCreatePassword] = useState('')
  const [createRole, setCreateRole] = useState<Role>('teacher')
  const [createSection, setCreateSection] = useState<Section>('primary')
  const [createLoading, setCreateLoading] = useState(false)
  const [createMessage, setCreateMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

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
            <h1 className="page-hero-title">Management Portal</h1>
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

  if (!profile) {
    return null
  }

  if (portalAccess && !portalAccess.management) {
    return (
      <>
        <div className="D D1 D1-short">
          <Navbar />
          <section className="page-hero">
            <h1 className="page-hero-title">Management Portal</h1>
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
            <p style={{ fontSize: '16px', color: '#777', margin: '0 0 24px' }}>You do not have permission to access the Management Portal.</p>
            <a href="/dashboard" className="cta-btn cta-btn-filled" style={{ display: 'inline-block' }}>Back to Dashboard</a>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  function updateAdmissionStatus(id: string, section: Section, newStatus: AdmissionStatus) {
    setAdmissions(prev => ({
      ...prev,
      [section]: prev[section].map(a => a.id === id ? { ...a, status: newStatus } : a),
    }))
  }

  function updateFileStatus(id: string, section: Section, newStatus: FileStatus) {
    setFiles(prev => ({
      ...prev,
      [section]: prev[section].map(f => f.id === id ? { ...f, status: newStatus } : f),
    }))
  }

  function closeHelpdeskTicket(id: string, section: Section) {
    setHelpdesk(prev => ({
      ...prev,
      [section]: prev[section].map(h => h.id === id ? { ...h, status: 'closed' as const } : h),
    }))
  }

  const sectionAdmissions = admissions[activeSection]
  const sectionFiles = files[activeSection]
  const sectionTeachers = MOCK_TEACHERS[activeSection]
  const sectionStudents = MOCK_STUDENTS[activeSection]
  const sectionHelpdesk = helpdesk[activeSection]

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .mgmt-section-tabs {
          display: flex;
          gap: 0;
          border-bottom: 2px solid #E8E8E8;
          margin-bottom: 24px;
          overflow-x: auto;
        }
        .mgmt-section-tab {
          padding: 12px 24px;
          font-size: 15px;
          font-weight: 600;
          color: #777;
          cursor: pointer;
          border: none;
          background: none;
          border-bottom: 3px solid transparent;
          transition: all 0.2s ease;
          white-space: nowrap;
          margin-bottom: -2px;
        }
        .mgmt-section-tab:hover {
          color: #2D5F3F;
        }
        .mgmt-section-tab-active {
          color: #2D5F3F;
          border-bottom-color: #2D5F3F;
        }
        .mgmt-sub-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .mgmt-sub-tab {
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 600;
          color: #555;
          cursor: pointer;
          border: 1.5px solid #DDD;
          background: #FAFAFA;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        .mgmt-sub-tab:hover {
          border-color: #2D5F3F;
          color: #2D5F3F;
        }
        .mgmt-sub-tab-active {
          background: #2D5F3F;
          color: #FFFFFF;
          border-color: #2D5F3F;
        }
        .mgmt-table-wrapper {
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid #E8E8E8;
        }
        .mgmt-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .mgmt-table th {
          background-color: #2D5F3F;
          color: #FFFFFF;
          padding: 12px 14px;
          text-align: left;
          font-weight: 600;
          font-size: 13px;
          white-space: nowrap;
        }
        .mgmt-table td {
          padding: 10px 14px;
          border-bottom: 1px solid #F0F0F0;
          color: #444;
        }
        .mgmt-table tr:nth-child(even) td {
          background-color: rgba(45, 95, 63, 0.03);
        }
        .mgmt-table tr:last-child td {
          border-bottom: none;
        }
        .mgmt-table tr:hover td {
          background-color: rgba(45, 95, 63, 0.06);
        }
        .mgmt-action-btn {
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-right: 4px;
          margin-bottom: 4px;
          display: inline-block;
        }
        .mgmt-action-btn:hover {
          transform: translateY(-1px);
        }
        .btn-review {
          color: #1E40AF;
          border-color: #93C5FD;
          background: #EFF6FF;
        }
        .btn-review:hover {
          background: #DBEAFE;
        }
        .btn-accept {
          color: #065F46;
          border-color: #6EE7B7;
          background: #ECFDF5;
        }
        .btn-accept:hover {
          background: #D1FAE5;
        }
        .btn-reject {
          color: #991B1B;
          border-color: #FCA5A5;
          background: #FEF2F2;
        }
        .btn-reject:hover {
          background: #FEE2E2;
        }
        .btn-approve {
          color: #065F46;
          border-color: #6EE7B7;
          background: #ECFDF5;
        }
        .btn-approve:hover {
          background: #D1FAE5;
        }
        .btn-not-approve {
          color: #991B1B;
          border-color: #FCA5A5;
          background: #FEF2F2;
        }
        .btn-not-approve:hover {
          background: #FEE2E2;
        }
        .teacher-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        .teacher-card {
          background: #FFFFFF;
          border: 1px solid #E8E8E8;
          border-radius: 12px;
          padding: 20px;
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .teacher-card:hover {
          box-shadow: 0 4px 16px rgba(45, 95, 63, 0.1);
          transform: translateY(-2px);
        }
        .teacher-card-icon {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, rgba(45, 95, 63, 0.1), rgba(201, 169, 97, 0.15));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }
        .teacher-card-name {
          font-size: 16px;
          font-weight: 700;
          color: #2D5F3F;
          margin: 0 0 6px;
        }
        .teacher-card-email {
          font-size: 13px;
          color: #888;
          margin: 0 0 8px;
        }
        .teacher-card-class {
          font-size: 13px;
          color: #555;
          margin: 0;
        }
        .helpdesk-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .helpdesk-card {
          background: #FFFFFF;
          border: 1px solid #E8E8E8;
          border-radius: 12px;
          padding: 20px;
          transition: box-shadow 0.2s ease;
        }
        .helpdesk-card:hover {
          box-shadow: 0 4px 16px rgba(45, 95, 63, 0.1);
        }
        .helpdesk-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .helpdesk-sender {
          font-size: 15px;
          font-weight: 700;
          color: #2D5F3F;
        }
        .helpdesk-subject {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin: 0 0 6px;
        }
        .helpdesk-message {
          font-size: 14px;
          color: #555;
          line-height: 1.6;
          margin: 0 0 14px;
        }
        .helpdesk-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .helpdesk-reply-btn {
          padding: 6px 16px;
          font-size: 13px;
          font-weight: 600;
          background: #2D5F3F;
          color: #FFFFFF;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .helpdesk-reply-btn:hover {
          background: #1F4A2E;
        }
        .helpdesk-close-btn {
          padding: 6px 16px;
          font-size: 13px;
          font-weight: 600;
          background: transparent;
          color: #777;
          border: 1.5px solid #DDD;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .helpdesk-close-btn:hover {
          border-color: #dc3545;
          color: #dc3545;
        }
        .mgmt-empty {
          text-align: center;
          padding: 40px 20px;
          color: #999;
          font-size: 15px;
        }
        @media (max-width: 768px) {
          .mgmt-section-tab {
            padding: 10px 16px;
            font-size: 14px;
          }
          .mgmt-table th, .mgmt-table td {
            padding: 8px 10px;
            font-size: 12px;
          }
          .teacher-grid {
            grid-template-columns: 1fr;
          }
          .mgmt-mobile-card {
            display: block;
          }
          .mgmt-mobile-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            border-bottom: 1px solid #F0F0F0;
          }
          .mgmt-mobile-row:last-child {
            border-bottom: none;
          }
          .mgmt-mobile-label {
            font-size: 12px;
            color: #999;
            font-weight: 600;
          }
          .mgmt-mobile-value {
            font-size: 13px;
            color: #333;
            font-weight: 500;
          }
        }
      ` }} />

      {/* ==================== D1 - Header + Hero ==================== */}
      <div className="D D1 D1-short">
        <Navbar />
        <section className="page-hero">
          <h1 className="page-hero-title">Management Portal</h1>
          <p className="page-hero-subtitle">
            Admin dashboard — manage sections, review files, and handle admissions
          </p>
        </section>
      </div>

      {/* ==================== D2 - Main Content ==================== */}
      <div className="D D2 D2-auto" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <QuoteSlider />
        <section className="admission-section" style={{ maxWidth: '1100px', width: '100%' }}>
          {/* Section Tabs */}
          <div className="mgmt-section-tabs">
            {SECTION_KEYS.map(sec => (
              <button
                key={sec}
                className={`mgmt-section-tab${activeSection === sec ? ' mgmt-section-tab-active' : ''}`}
                onClick={() => { setActiveSection(sec); setActiveSubTab('admissions') }}
              >
                {SECTION_TAB_LABELS[sec]}
              </button>
            ))}
          </div>

          {/* Sub Tabs */}
          <div className="mgmt-sub-tabs" style={{ flexWrap: 'wrap' }}>
            {([
              ['admissions', 'Admission Requests'],
              ['files', 'File Review'],
              ['teachers', 'Teachers'],
              ['students', 'Students'],
              ['helpdesk', 'Helpdesk Inbox'],
              ['create_account', '➕ Create Staff Account'],
            ] as [SubTab, string][]).map(([key, label]) => (
              <button
                key={key}
                className={`mgmt-sub-tab${activeSubTab === key ? ' mgmt-sub-tab-active' : ''}`}
                onClick={() => setActiveSubTab(key)}
                style={key === 'create_account' ? { borderColor: '#C9A961', color: '#C9A961', background: 'rgba(201, 169, 97, 0.06)' } : {}}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ADMISSIONS */}
          {activeSubTab === 'admissions' && (
            <div>
              <div className="mgmt-table-wrapper" style={{ display: 'block' }}>
                {/* Desktop table */}
                <table className="mgmt-table" style={{ display: 'table' }}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Level</th>
                      <th>Parent</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sectionAdmissions.map(a => (
                      <tr key={a.id}>
                        <td style={{ fontWeight: 600, color: '#2D5F3F' }}>{a.name}</td>
                        <td>{a.phone}</td>
                        <td>{a.level}</td>
                        <td>{a.parent}</td>
                        <td><StatusBadge status={a.status} /></td>
                        <td>{a.date}</td>
                        <td>
                          {a.status === 'pending' && (
                            <button className="mgmt-action-btn btn-review" onClick={() => updateAdmissionStatus(a.id, activeSection, 'reviewed')}>Review</button>
                          )}
                          {(a.status === 'pending' || a.status === 'reviewed') && (
                            <button className="mgmt-action-btn btn-accept" onClick={() => updateAdmissionStatus(a.id, activeSection, 'accepted')}>Accept</button>
                          )}
                          {a.status !== 'rejected' && a.status !== 'accepted' && (
                            <button className="mgmt-action-btn btn-reject" onClick={() => updateAdmissionStatus(a.id, activeSection, 'rejected')}>Reject</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile cards */}
              <div style={{ display: 'none' }} className="mgmt-mobile-list">
                {sectionAdmissions.map(a => (
                  <div key={a.id} className="mgmt-mobile-card" style={{ background: '#FFF', border: '1px solid #E8E8E8', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
                    <div className="mgmt-mobile-row"><span className="mgmt-mobile-label">Name</span><span className="mgmt-mobile-value" style={{ color: '#2D5F3F', fontWeight: 600 }}>{a.name}</span></div>
                    <div className="mgmt-mobile-row"><span className="mgmt-mobile-label">Phone</span><span className="mgmt-mobile-value">{a.phone}</span></div>
                    <div className="mgmt-mobile-row"><span className="mgmt-mobile-label">Level</span><span className="mgmt-mobile-value">{a.level}</span></div>
                    <div className="mgmt-mobile-row"><span className="mgmt-mobile-label">Parent</span><span className="mgmt-mobile-value">{a.parent}</span></div>
                    <div className="mgmt-mobile-row"><span className="mgmt-mobile-label">Status</span><StatusBadge status={a.status} /></div>
                    <div className="mgmt-mobile-row"><span className="mgmt-mobile-label">Date</span><span className="mgmt-mobile-value">{a.date}</span></div>
                    <div style={{ marginTop: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {a.status === 'pending' && <button className="mgmt-action-btn btn-review" onClick={() => updateAdmissionStatus(a.id, activeSection, 'reviewed')}>Review</button>}
                      {(a.status === 'pending' || a.status === 'reviewed') && <button className="mgmt-action-btn btn-accept" onClick={() => updateAdmissionStatus(a.id, activeSection, 'accepted')}>Accept</button>}
                      {a.status !== 'rejected' && a.status !== 'accepted' && <button className="mgmt-action-btn btn-reject" onClick={() => updateAdmissionStatus(a.id, activeSection, 'rejected')}>Reject</button>}
                    </div>
                  </div>
                ))}
              </div>
              {sectionAdmissions.length === 0 && <div className="mgmt-empty">No admission requests for this section.</div>}
            </div>
          )}

          {/* FILE REVIEW */}
          {activeSubTab === 'files' && (
            <div>
              <div className="mgmt-table-wrapper" style={{ display: 'block' }}>
                <table className="mgmt-table" style={{ display: 'table' }}>
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Category</th>
                      <th>Uploaded By</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sectionFiles.map(f => (
                      <tr key={f.id}>
                        <td style={{ fontWeight: 600, color: '#2D5F3F' }}>{f.fileName}</td>
                        <td>{f.category}</td>
                        <td>{f.uploadedBy}</td>
                        <td>{f.date}</td>
                        <td><StatusBadge status={f.status} /></td>
                        <td>
                          {f.status === 'pending' && (
                            <>
                              <button className="mgmt-action-btn btn-approve" onClick={() => updateFileStatus(f.id, activeSection, 'approved')}>✅ Approve</button>
                              <button className="mgmt-action-btn btn-not-approve" onClick={() => updateFileStatus(f.id, activeSection, 'not_approved')}>❌ Not Approved</button>
                            </>
                          )}
                          {f.status !== 'pending' && <span style={{ fontSize: '12px', color: '#999' }}>—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile cards */}
              <div style={{ display: 'none' }} className="mgmt-mobile-list">
                {sectionFiles.map(f => (
                  <div key={f.id} className="mgmt-mobile-card" style={{ background: '#FFF', border: '1px solid #E8E8E8', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
                    <div className="mgmt-mobile-row"><span className="mgmt-mobile-label">File</span><span className="mgmt-mobile-value" style={{ color: '#2D5F3F', fontWeight: 600 }}>{f.fileName}</span></div>
                    <div className="mgmt-mobile-row"><span className="mgmt-mobile-label">Category</span><span className="mgmt-mobile-value">{f.category}</span></div>
                    <div className="mgmt-mobile-row"><span className="mgmt-mobile-label">Uploaded By</span><span className="mgmt-mobile-value">{f.uploadedBy}</span></div>
                    <div className="mgmt-mobile-row"><span className="mgmt-mobile-label">Date</span><span className="mgmt-mobile-value">{f.date}</span></div>
                    <div className="mgmt-mobile-row"><span className="mgmt-mobile-label">Status</span><StatusBadge status={f.status} /></div>
                    {f.status === 'pending' && (
                      <div style={{ marginTop: '10px', display: 'flex', gap: '6px' }}>
                        <button className="mgmt-action-btn btn-approve" onClick={() => updateFileStatus(f.id, activeSection, 'approved')}>✅ Approve</button>
                        <button className="mgmt-action-btn btn-not-approve" onClick={() => updateFileStatus(f.id, activeSection, 'not_approved')}>❌ Not Approved</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {sectionFiles.length === 0 && <div className="mgmt-empty">No files to review for this section.</div>}
            </div>
          )}

          {/* TEACHERS */}
          {activeSubTab === 'teachers' && (
            <div>
              <div className="teacher-grid">
                {sectionTeachers.map(t => (
                  <div key={t.id} className="teacher-card">
                    <div className="teacher-card-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#2D5F3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <p className="teacher-card-name">{t.name}</p>
                    <p className="teacher-card-email">{t.email}</p>
                    <p className="teacher-card-class">📍 {t.assignedClass}</p>
                  </div>
                ))}
              </div>
              {sectionTeachers.length === 0 && <div className="mgmt-empty">No teachers assigned to this section.</div>}
            </div>
          )}

          {/* STUDENTS */}
          {activeSubTab === 'students' && (
            <div>
              <div className="mgmt-table-wrapper" style={{ display: 'block' }}>
                <table className="mgmt-table" style={{ display: 'table' }}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Class</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sectionStudents.map(s => (
                      <tr key={s.id}>
                        <td style={{ fontWeight: 600, color: '#2D5F3F' }}>{s.name}</td>
                        <td>{s.email}</td>
                        <td>{s.className}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile cards */}
              <div style={{ display: 'none' }} className="mgmt-mobile-list">
                {sectionStudents.map(s => (
                  <div key={s.id} className="mgmt-mobile-card" style={{ background: '#FFF', border: '1px solid #E8E8E8', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
                    <div className="mgmt-mobile-row"><span className="mgmt-mobile-label">Name</span><span className="mgmt-mobile-value" style={{ color: '#2D5F3F', fontWeight: 600 }}>{s.name}</span></div>
                    <div className="mgmt-mobile-row"><span className="mgmt-mobile-label">Email</span><span className="mgmt-mobile-value">{s.email}</span></div>
                    <div className="mgmt-mobile-row"><span className="mgmt-mobile-label">Class</span><span className="mgmt-mobile-value">{s.className}</span></div>
                  </div>
                ))}
              </div>
              {sectionStudents.length === 0 && <div className="mgmt-empty">No students found in this section.</div>}
            </div>
          )}

          {/* CREATE STAFF ACCOUNT */}
          {activeSubTab === 'create_account' && (
            <div style={{ maxWidth: '600px' }}>
              <div style={{ background: '#FFF', border: '1.5px solid #E8E8E8', borderRadius: '16px', padding: '28px 24px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#2D5F3F', margin: '0 0 6px' }}>Create Staff Account</h3>
                <p style={{ fontSize: '14px', color: '#777', margin: '0 0 24px' }}>Create accounts for teachers and management staff. They will receive an email to confirm their account.</p>

                {createMessage && (
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    fontSize: '14px',
                    fontWeight: 500,
                    background: createMessage.type === 'success' ? 'rgba(45, 95, 63, 0.08)' : 'rgba(220, 53, 69, 0.08)',
                    border: `1px solid ${createMessage.type === 'success' ? 'rgba(45, 95, 63, 0.25)' : 'rgba(220, 53, 69, 0.25)'}`,
                    color: createMessage.type === 'success' ? '#2D5F3F' : '#dc3545',
                  }}>
                    {createMessage.text}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Ustaz Ahmad Ibrahim"
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    disabled={createLoading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="e.g. ahmad@aroyan.edu"
                    value={createEmail}
                    onChange={(e) => setCreateEmail(e.target.value)}
                    disabled={createLoading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Temporary Password</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Set a temporary password (min 6 chars)"
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    disabled={createLoading}
                  />
                  <p style={{ fontSize: '12px', color: '#999', margin: '4px 0 0' }}>The staff member can change this after first login.</p>
                </div>

                <div className="form-row-2col">
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select
                      className="form-input form-select"
                      value={createRole}
                      onChange={(e) => setCreateRole(e.target.value as Role)}
                      disabled={createLoading}
                    >
                      <option value="teacher">Teacher</option>
                      <option value="manager">Management</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Section</label>
                    <select
                      className="form-input form-select"
                      value={createSection}
                      onChange={(e) => setCreateSection(e.target.value as Section)}
                      disabled={createLoading}
                    >
                      <option value="nursery">Nursery</option>
                      <option value="primary">Primary</option>
                      <option value="jss">JSS</option>
                      <option value="sss">SSS</option>
                    </select>
                  </div>
                </div>

                <button
                  className="form-submit-btn"
                  style={{ width: '100%', marginTop: '8px' }}
                  disabled={createLoading || !createName || !createEmail || !createPassword}
                  onClick={async () => {
                    setCreateLoading(true)
                    setCreateMessage(null)

                    try {
                      // Create auth user via admin API (using service role would be ideal, but we'll use signUp)
                      const { data, error } = await supabase.auth.signUp({
                        email: createEmail,
                        password: createPassword,
                        options: {
                          emailRedirectTo: `${window.location.origin}/dashboard`,
                          data: {
                            full_name: createName,
                            role: createRole,
                          },
                        },
                      })

                      if (error) {
                        setCreateMessage({ type: 'error', text: error.message })
                        setCreateLoading(false)
                        return
                      }

                      if (data.user) {
                        // Create profile with the correct role and section
                        const { error: profileError } = await supabase.from('profiles').insert({
                          id: data.user.id,
                          email: createEmail,
                          full_name: createName,
                          role: createRole,
                          section: createSection,
                        })

                        if (profileError) {
                          // Profile might already exist (trigger created it)
                          // Update it instead
                          await supabase.from('profiles').update({
                            full_name: createName,
                            role: createRole,
                            section: createSection,
                          }).eq('id', data.user.id)
                        }

                        setCreateMessage({ type: 'success', text: `Account created for ${createName}! They will receive a confirmation email.` })
                        setCreateName('')
                        setCreateEmail('')
                        setCreatePassword('')
                      }
                    } catch (err) {
                      setCreateMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' })
                    }

                    setCreateLoading(false)
                  }}
                >
                  {createLoading ? 'Creating Account...' : 'Create Staff Account'}
                </button>
              </div>

              <div style={{ background: 'rgba(201, 169, 97, 0.06)', border: '1px solid rgba(201, 169, 97, 0.2)', borderRadius: '12px', padding: '16px 20px' }}>
                <p style={{ fontSize: '13px', color: '#777', margin: 0, lineHeight: 1.6 }}>
                  <strong style={{ color: '#C9A961' }}>Note:</strong> Only management (admin) can create staff accounts. Teachers and management accounts cannot be created through the public signup page. The staff member will receive an email to confirm their account before they can log in.
                </p>
              </div>
            </div>
          )}

          {/* HELPDESK */}
          {activeSubTab === 'helpdesk' && (
            <div>
              <div className="helpdesk-grid">
                {sectionHelpdesk.map(h => (
                  <div key={h.id} className="helpdesk-card">
                    <div className="helpdesk-header">
                      <span className="helpdesk-sender">{h.sender}</span>
                      <HelpdeskBadge status={h.status} />
                    </div>
                    <p className="helpdesk-subject">{h.subject}</p>
                    <p className="helpdesk-message">{h.message}</p>
                    <div className="helpdesk-actions">
                      {h.status === 'open' && (
                        <>
                          <button className="helpdesk-reply-btn">Reply</button>
                          <button className="helpdesk-close-btn" onClick={() => closeHelpdeskTicket(h.id, activeSection)}>Close Ticket</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {sectionHelpdesk.length === 0 && <div className="mgmt-empty">No helpdesk messages for this section.</div>}
            </div>
          )}
        </section>
      </div>

      {/* ==================== D3 - Footer ==================== */}
      <Footer />
    </>
  )
}
