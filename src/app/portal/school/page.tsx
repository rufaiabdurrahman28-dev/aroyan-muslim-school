'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import type { Section, FileStatus } from '@/lib/types'

type Step = 1 | 2 | 3 | 4
type FolderKey = 'syllabus' | 'lesson_notes' | 'others'

interface ClassInfo {
  id: string
  name: string
  teacher: string
  section: Section
}

interface MockFile {
  id: string
  title: string
  uploadedBy: string
  date: string
  status: FileStatus
}

const SECTION_KEYS_MAP: Record<string, Section> = {
  NURS2026: 'nursery',
  PRIM2026: 'primary',
  JSS2026: 'jss',
  SSS2026: 'sss',
}

const SECTION_LABELS: Record<Section, string> = {
  nursery: 'Nursery / Primary',
  primary: 'Primary',
  jss: 'Junior Secondary',
  sss: 'Senior Secondary',
}

const CLASSES: Record<Section, ClassInfo[]> = {
  nursery: [
    { id: 'c1', name: 'Nursery 1A', teacher: 'Ustaz Nasir Muhammad', section: 'nursery' },
    { id: 'c2', name: 'Nursery 1B', teacher: 'Ustazah Fatima Ali', section: 'nursery' },
    { id: 'c3', name: 'Nursery 2A', teacher: 'Ustazah Khadijah Isa', section: 'nursery' },
    { id: 'c4', name: 'Nursery 2B', teacher: 'Ustaz Yusuf Harun', section: 'nursery' },
    { id: 'c5', name: 'Nursery 3A', teacher: 'Ustazah Amina Sule', section: 'nursery' },
    { id: 'c6', name: 'Nursery 3B', teacher: 'Ustaz Hamza Bello', section: 'nursery' },
  ],
  primary: [
    { id: 'c7', name: 'Primary 1A', teacher: 'Malam Idris Bello', section: 'primary' },
    { id: 'c8', name: 'Primary 1B', teacher: 'Ustazah Maryam Sani', section: 'primary' },
    { id: 'c9', name: 'Primary 2A', teacher: 'Malam Ahmad Tukur', section: 'primary' },
    { id: 'c10', name: 'Primary 2B', teacher: 'Ustazah Hafsat Musa', section: 'primary' },
    { id: 'c11', name: 'Primary 3A', teacher: 'Malam Sani Garba', section: 'primary' },
    { id: 'c12', name: 'Primary 3B', teacher: 'Ustazah Zainab Adam', section: 'primary' },
    { id: 'c13', name: 'Primary 4A', teacher: 'Malam Usman Kabir', section: 'primary' },
    { id: 'c14', name: 'Primary 4B', teacher: 'Ustazah Aisha Dalhatu', section: 'primary' },
    { id: 'c15', name: 'Primary 5A', teacher: 'Ustazah Hauwa Musa', section: 'primary' },
    { id: 'c16', name: 'Primary 5B', teacher: 'Malam Faruk Aliyu', section: 'primary' },
    { id: 'c17', name: 'Primary 6A', teacher: 'Malam Yusuf Adam', section: 'primary' },
    { id: 'c18', name: 'Primary 6B', teacher: 'Ustazah Sa\'adat Ibrahim', section: 'primary' },
  ],
  jss: [
    { id: 'c19', name: 'JSS 1A', teacher: 'Malam Kabir Usman', section: 'jss' },
    { id: 'c20', name: 'JSS 1B', teacher: 'Ustazah Hauwa Sule', section: 'jss' },
    { id: 'c21', name: 'JSS 2A', teacher: 'Malam Farouk Ahmed', section: 'jss' },
    { id: 'c22', name: 'JSS 2B', teacher: 'Ustazah Nafisa Garba', section: 'jss' },
    { id: 'c23', name: 'JSS 3A', teacher: 'Malam Aliyu Bello', section: 'jss' },
    { id: 'c24', name: 'JSS 3B', teacher: 'Ustazah Fatima Adam', section: 'jss' },
  ],
  sss: [
    { id: 'c25', name: 'SSS 1 Science', teacher: 'Malam Tukur Ibrahim', section: 'sss' },
    { id: 'c26', name: 'SSS 1 Arts', teacher: 'Ustazah Zainab Ali', section: 'sss' },
    { id: 'c27', name: 'SSS 2 Science', teacher: 'Ustaz Aminu Dalhatu', section: 'sss' },
    { id: 'c28', name: 'SSS 2 Arts', teacher: 'Ustazah Khadijah Musa', section: 'sss' },
    { id: 'c29', name: 'SSS 3 Science', teacher: 'Malam Ibrahim Sule', section: 'sss' },
    { id: 'c30', name: 'SSS 3 Arts', teacher: 'Ustazah Hadiza Bello', section: 'sss' },
  ],
}

const FOLDER_INFO: Record<FolderKey, { icon: string; title: string; description: string }> = {
  syllabus: { icon: '📋', title: 'Syllabus/Scheme of Work', description: 'Curriculum and scheme of work documents' },
  lesson_notes: { icon: '📝', title: 'Lesson Notes', description: 'Weekly lesson notes and plans' },
  others: { icon: '📁', title: 'Others', description: 'Exam questions, test papers, and other files' },
}

const MOCK_FOLDER_FILES: Record<FolderKey, MockFile[]> = {
  syllabus: [
    { id: 'sf1', title: 'English Language Scheme Term 2.pdf', uploadedBy: 'Ustaz Nasir', date: '2026-04-20', status: 'approved' },
    { id: 'sf2', title: 'Mathematics Curriculum 2026.docx', uploadedBy: 'Malam Sani', date: '2026-04-18', status: 'pending' },
    { id: 'sf3', title: 'Islamic Studies Scheme.pdf', uploadedBy: 'Ustazah Fatima', date: '2026-04-15', status: 'approved' },
  ],
  lesson_notes: [
    { id: 'lf1', title: 'Week 8 - English Notes.docx', uploadedBy: 'Ustaz Nasir', date: '2026-04-22', status: 'pending' },
    { id: 'lf2', title: 'Week 7 - Math Notes.pdf', uploadedBy: 'Malam Sani', date: '2026-04-19', status: 'approved' },
    { id: 'lf3', title: 'Week 6 - Science Notes.docx', uploadedBy: 'Ustazah Khadijah', date: '2026-04-16', status: 'not_approved' },
    { id: 'lf4', title: 'Week 5 - Civic Education.pdf', uploadedBy: 'Malam Kabir', date: '2026-04-12', status: 'approved' },
  ],
  others: [
    { id: 'of1', title: 'Mid-Term Exam Questions.pdf', uploadedBy: 'Ustaz Nasir', date: '2026-04-21', status: 'pending' },
    { id: 'of2', title: 'Homework Assignment Sheet.docx', uploadedBy: 'Malam Sani', date: '2026-04-17', status: 'approved' },
    { id: 'of3', title: 'Test Questions Term 1.pdf', uploadedBy: 'Ustazah Fatima', date: '2026-04-10', status: 'not_approved' },
  ],
}

function StatusBadge({ status }: { status: FileStatus }) {
  let bg = '#FEF3C7'
  let color = '#92400E'
  if (status === 'approved') { bg = '#D1FAE5'; color = '#065F46' }
  if (status === 'not_approved') { bg = '#FEE2E2'; color = '#991B1B' }
  const label = status === 'not_approved' ? 'Not Approved' : status.charAt(0).toUpperCase() + status.slice(1)
  return (
    <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, backgroundColor: bg, color }}>
      {label}
    </span>
  )
}

export default function SchoolPortalPage() {
  const router = useRouter()
  const { profile, portalAccess, loading } = useAuth()

  const [step, setStep] = useState<Step>(1)
  const [sectionKey, setSectionKey] = useState('')
  const [sectionKeyError, setSectionKeyError] = useState('')
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null)
  const [workspacePassword, setWorkspacePassword] = useState('')
  const [workspaceError, setWorkspaceError] = useState('')
  const [openFolder, setOpenFolder] = useState<FolderKey | null>(null)
  const [folderFiles, setFolderFiles] = useState(MOCK_FOLDER_FILES)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadFileName, setUploadFileName] = useState('')

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
            <h1 className="page-hero-title">School Portal</h1>
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

  if (portalAccess && !portalAccess.school) {
    return (
      <>
        <div className="D D1 D1-short">
          <Navbar />
          <section className="page-hero">
            <h1 className="page-hero-title">School Portal</h1>
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
            <p style={{ fontSize: '16px', color: '#777', margin: '0 0 24px' }}>You do not have permission to access the School Portal.</p>
            <a href="/dashboard" className="cta-btn cta-btn-filled" style={{ display: 'inline-block' }}>Back to Dashboard</a>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  function handleSectionKeySubmit() {
    setSectionKeyError('')
    const upperKey = sectionKey.trim().toUpperCase()
    if (SECTION_KEYS_MAP[upperKey]) {
      setSelectedSection(SECTION_KEYS_MAP[upperKey])
      setStep(2)
    } else {
      setSectionKeyError('Invalid section key')
    }
  }

  function handleClassSelect(cls: ClassInfo) {
    setSelectedClass(cls)
    setStep(3)
  }

  function handleWorkspaceSubmit() {
    setWorkspaceError('')
    if (workspacePassword.trim() === 'class2026') {
      setStep(4)
    } else {
      setWorkspaceError('Incorrect workspace password')
    }
  }

  function handleMockUpload(folder: FolderKey) {
    if (!uploadTitle.trim()) return
    const newFile: MockFile = {
      id: `upload-${Date.now()}`,
      title: uploadTitle + (uploadFileName ? ` (${uploadFileName})` : ''),
      uploadedBy: profile?.full_name || 'Current User',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    }
    setFolderFiles(prev => ({
      ...prev,
      [folder]: [newFile, ...prev[folder]],
    }))
    setUploadTitle('')
    setUploadFileName('')
  }

  function handleGoBack(targetStep: Step) {
    if (targetStep === 1) {
      setSelectedSection(null)
      setSelectedClass(null)
      setOpenFolder(null)
      setSectionKey('')
      setWorkspacePassword('')
    } else if (targetStep === 2) {
      setSelectedClass(null)
      setOpenFolder(null)
      setWorkspacePassword('')
    } else if (targetStep === 3) {
      setOpenFolder(null)
      setWorkspacePassword('')
    }
    setStep(targetStep)
  }

  const stepLabels = ['Section Key', 'Select Class', 'Workspace Password', 'Class Workspace']

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .step-indicators {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          margin-bottom: 36px;
          padding: 0 20px;
        }
        .step-dot {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          background: #E8E8E8;
          color: #999;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }
        .step-dot-active {
          background: #2D5F3F;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(45, 95, 63, 0.3);
        }
        .step-dot-done {
          background: #2D5F3F;
          color: #FFFFFF;
        }
        .step-line {
          width: 48px;
          height: 3px;
          background: #E8E8E8;
          transition: background 0.3s ease;
          flex-shrink: 0;
        }
        .step-line-done {
          background: #2D5F3F;
        }
        .step-label {
          font-size: 11px;
          color: #999;
          text-align: center;
          margin-top: 6px;
          white-space: nowrap;
        }
        .step-label-active {
          color: #2D5F3F;
          font-weight: 600;
        }
        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .school-card {
          background: #FFFFFF;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
          border-radius: 16px;
          padding: 36px;
          max-width: 480px;
          width: 100%;
          margin: 0 auto;
        }
        .school-card-wide {
          max-width: 800px;
        }
        .school-card-title {
          font-size: 22px;
          font-weight: 700;
          color: #2D5F3F;
          margin: 0 0 8px;
          text-align: center;
        }
        .school-card-desc {
          font-size: 15px;
          color: #777;
          margin: 0 0 24px;
          text-align: center;
          line-height: 1.5;
        }
        .school-error {
          color: #dc3545;
          font-size: 13px;
          font-weight: 500;
          margin: 8px 0 0;
          text-align: center;
        }
        .class-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
        }
        .class-card {
          background: #FFFFFF;
          border: 1.5px solid #E8E8E8;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .class-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #2D5F3F, #C9A961);
        }
        .class-card:hover {
          border-color: #2D5F3F;
          box-shadow: 0 6px 20px rgba(45, 95, 63, 0.12);
          transform: translateY(-3px);
        }
        .class-card-name {
          font-size: 17px;
          font-weight: 700;
          color: #2D5F3F;
          margin: 0 0 6px;
        }
        .class-card-teacher {
          font-size: 13px;
          color: #777;
          margin: 0;
        }
        .folder-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
        }
        .folder-card {
          background: #FFFFFF;
          border: 1.5px solid #E8E8E8;
          border-radius: 14px;
          padding: 28px 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
        }
        .folder-card:hover {
          border-color: #2D5F3F;
          box-shadow: 0 6px 24px rgba(45, 95, 63, 0.12);
          transform: translateY(-4px);
        }
        .folder-icon {
          width: 60px;
          height: 60px;
          margin-bottom: 14px;
          color: #C9A961;
        }
        .folder-title {
          font-size: 16px;
          font-weight: 700;
          color: #2D5F3F;
          margin: 0 0 6px;
        }
        .folder-desc {
          font-size: 13px;
          color: #777;
          line-height: 1.5;
          margin: 0 0 12px;
        }
        .folder-count-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 3px 12px;
          background: rgba(45, 95, 63, 0.08);
          color: #2D5F3F;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }
        .file-list-wrapper {
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
        }
        .file-upload-bar {
          display: flex;
          gap: 10px;
          align-items: flex-end;
          margin-bottom: 20px;
          flex-wrap: wrap;
          padding: 16px;
          background: rgba(45, 95, 63, 0.03);
          border: 1px dashed #C9A961;
          border-radius: 12px;
        }
        .file-upload-field {
          flex: 1;
          min-width: 160px;
        }
        .file-upload-label {
          font-size: 12px;
          font-weight: 600;
          color: #555;
          margin-bottom: 4px;
          display: block;
        }
        .file-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: #FFFFFF;
          border: 1px solid #F0F0F0;
          border-radius: 10px;
          margin-bottom: 10px;
          transition: box-shadow 0.2s ease;
          flex-wrap: wrap;
          gap: 8px;
        }
        .file-item:hover {
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        .file-item-info {
          flex: 1;
          min-width: 180px;
        }
        .file-item-title {
          font-size: 14px;
          font-weight: 600;
          color: #2D5F3F;
          margin: 0 0 2px;
        }
        .file-item-meta {
          font-size: 12px;
          color: #999;
          margin: 0;
        }
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 600;
          color: #2D5F3F;
          background: transparent;
          border: 1.5px solid #2D5F3F;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 20px;
        }
        .back-btn:hover {
          background: #2D5F3F;
          color: #FFFFFF;
        }
        .workspace-header {
          text-align: center;
          margin-bottom: 28px;
        }
        .workspace-class-name {
          font-size: 28px;
          font-weight: 700;
          color: #2D5F3F;
          margin: 0 0 6px;
        }
        .workspace-section-label {
          font-size: 14px;
          color: #777;
          margin: 0;
        }
        @media (max-width: 768px) {
          .class-grid {
            grid-template-columns: 1fr 1fr;
          }
          .folder-grid {
            grid-template-columns: 1fr;
          }
          .step-line {
            width: 28px;
          }
          .school-card {
            padding: 24px 18px;
          }
          .file-upload-bar {
            flex-direction: column;
          }
        }
        @media (max-width: 480px) {
          .class-grid {
            grid-template-columns: 1fr;
          }
        }
      ` }} />

      {/* ==================== D1 - Header + Hero ==================== */}
      <div className="D D1 D1-short">
        <Navbar />
        <section className="page-hero">
          <h1 className="page-hero-title">School Portal</h1>
          <p className="page-hero-subtitle">
            Access your class workspace — upload files and manage content
          </p>
        </section>
      </div>

      {/* ==================== D2 - Main Content ==================== */}
      <div className="D D2 D2-auto" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <section className="admission-section" style={{ maxWidth: '900px', width: '100%' }}>

          {/* Step Indicators */}
          <div className="step-indicators">
            {stepLabels.map((label, i) => {
              const stepNum = (i + 1) as Step
              const isDone = stepNum < step
              const isActive = stepNum === step
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="step-item">
                    <div className={`step-dot${isActive ? ' step-dot-active' : ''}${isDone ? ' step-dot-done' : ''}`}>
                      {isDone ? '✓' : stepNum}
                    </div>
                    <div className={`step-label${isActive ? ' step-label-active' : ''}`}>{label}</div>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div className={`step-line${isDone ? ' step-line-done' : ''}`} style={{ margin: '0 8px', marginBottom: '20px' }} />
                  )}
                </div>
              )
            })}
          </div>

          {/* STEP 1: Section Key */}
          {step === 1 && (
            <div className="school-card">
              <div className="school-card-title">Enter Section Key</div>
              <div className="school-card-desc">Please enter the section key provided by the school administration to access your section.</div>
              <div className="auth-form">
                <div className="form-group">
                  <label className="form-label">Section Key</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. NURS2026, PRIM2026, JSS2026, SSS2026"
                    value={sectionKey}
                    onChange={e => { setSectionKey(e.target.value); setSectionKeyError('') }}
                    onKeyDown={e => { if (e.key === 'Enter') handleSectionKeySubmit() }}
                  />
                </div>
                {sectionKeyError && <p className="school-error">{sectionKeyError}</p>}
                <button className="form-submit-btn" onClick={handleSectionKeySubmit}>Continue</button>
              </div>
            </div>
          )}

          {/* STEP 2: Class Selection */}
          {step === 2 && selectedSection && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#2D5F3F', margin: '0 0 6px' }}>
                  {SECTION_LABELS[selectedSection]} Section
                </h2>
                <p style={{ fontSize: '14px', color: '#777', margin: '0' }}>Select your class to continue</p>
              </div>
              <button className="back-btn" onClick={() => handleGoBack(1)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back
              </button>
              <div className="class-grid">
                {CLASSES[selectedSection].map(cls => (
                  <div
                    key={cls.id}
                    className="class-card"
                    onClick={() => handleClassSelect(cls)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClassSelect(cls) } }}
                  >
                    <p className="class-card-name">{cls.name}</p>
                    <p className="class-card-teacher">👤 {cls.teacher}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Workspace Password */}
          {step === 3 && selectedClass && (
            <div className="school-card">
              <div className="school-card-title">Workspace Password</div>
              <div className="school-card-desc">
                Enter the workspace password for <strong style={{ color: '#2D5F3F' }}>{selectedClass.name}</strong>
              </div>
              <div className="auth-form">
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter workspace password"
                    value={workspacePassword}
                    onChange={e => { setWorkspacePassword(e.target.value); setWorkspaceError('') }}
                    onKeyDown={e => { if (e.key === 'Enter') handleWorkspaceSubmit() }}
                  />
                </div>
                {workspaceError && <p className="school-error">{workspaceError}</p>}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="back-btn" onClick={() => handleGoBack(2)} style={{ marginBottom: 0, flexShrink: 0 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back
                  </button>
                  <button className="form-submit-btn" style={{ flex: 1, marginTop: 0 }} onClick={handleWorkspaceSubmit}>Enter Workspace</button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Class Workspace */}
          {step === 4 && selectedClass && (
            <div>
              <div className="workspace-header">
                <h2 className="workspace-class-name">{selectedClass.name}</h2>
                <p className="workspace-section-label">{SECTION_LABELS[selectedClass.section]} Section &middot; {selectedClass.teacher}</p>
              </div>

              <button className="back-btn" onClick={() => handleGoBack(3)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back to Class Selection
              </button>

              {!openFolder ? (
                /* Folder View */
                <div className="folder-grid">
                  {(Object.keys(FOLDER_INFO) as FolderKey[]).map(key => {
                    const info = FOLDER_INFO[key]
                    const fileCount = folderFiles[key].length
                    return (
                      <div
                        key={key}
                        className="folder-card"
                        onClick={() => setOpenFolder(key)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenFolder(key) } }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="folder-icon">
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" fill="rgba(201, 169, 97, 0.15)" />
                        </svg>
                        <p className="folder-title">{info.title}</p>
                        <p className="folder-desc">{info.description}</p>
                        <span className="folder-count-badge">{fileCount} {fileCount === 1 ? 'file' : 'files'}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                /* File List View */
                <div className="file-list-wrapper">
                  <button className="back-btn" onClick={() => setOpenFolder(null)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back to Folders
                  </button>

                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#2D5F3F', margin: '0 0 20px' }}>
                    {FOLDER_INFO[openFolder].icon} {FOLDER_INFO[openFolder].title}
                  </h3>

                  {/* Upload bar */}
                  <div className="file-upload-bar">
                    <div className="file-upload-field">
                      <label className="file-upload-label">File Title</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Week 9 Lesson Note"
                        value={uploadTitle}
                        onChange={e => setUploadTitle(e.target.value)}
                        style={{ padding: '10px 14px', fontSize: '14px' }}
                      />
                    </div>
                    <div className="file-upload-field" style={{ maxWidth: '200px' }}>
                      <label className="file-upload-label">Choose File</label>
                      <input
                        type="file"
                        className="form-input"
                        style={{ padding: '7px 10px', fontSize: '13px' }}
                        onChange={e => {
                          const f = e.target.files?.[0]
                          setUploadFileName(f ? f.name : '')
                        }}
                      />
                    </div>
                    <button
                      className="form-submit-btn"
                      style={{ width: 'auto', padding: '10px 24px', margin: 0, flexShrink: 0 }}
                      onClick={() => handleMockUpload(openFolder)}
                      disabled={!uploadTitle.trim()}
                    >
                      Upload
                    </button>
                  </div>

                  {/* File List */}
                  {folderFiles[openFolder].map(file => (
                    <div key={file.id} className="file-item">
                      <div className="file-item-info">
                        <p className="file-item-title">{file.title}</p>
                        <p className="file-item-meta">Uploaded by {file.uploadedBy} &middot; {file.date}</p>
                      </div>
                      <StatusBadge status={file.status} />
                    </div>
                  ))}

                  {folderFiles[openFolder].length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999', fontSize: '15px' }}>
                      No files in this folder yet. Upload one above.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </section>
      </div>

      {/* ==================== D3 - Footer ==================== */}
      <Footer />
    </>
  )
}
