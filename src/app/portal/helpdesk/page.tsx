'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import type { HelpdeskStatus, Role } from '@/lib/types'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole: Role
  text: string
  timestamp: string
}

interface Ticket {
  id: string
  subject: string
  status: HelpdeskStatus
  messages: Message[]
  createdAt: string
  updatedAt: string
}

const INITIAL_TICKETS: Ticket[] = [
  {
    id: 't1',
    subject: 'Fee Payment Inquiry',
    status: 'open',
    createdAt: '2026-04-28T09:00:00',
    updatedAt: '2026-04-29T14:30:00',
    messages: [
      {
        id: 'm1',
        senderId: 'parent1',
        senderName: 'Hajia Bello',
        senderRole: 'parent',
        text: 'Salam, I want to confirm the nursery school fees for next term. Are there any changes from last term? Jazakallahu khairan.',
        timestamp: '2026-04-28T09:00:00',
      },
      {
        id: 'm2',
        senderId: 'admin1',
        senderName: 'Admin (Ustaz Nasir)',
        senderRole: 'admin',
        text: 'Wa alaikum salam, Hajia. The fees remain the same for next term. Nursery section is ₦45,000 per term. Payment can be made at the school bursary or via bank transfer.',
        timestamp: '2026-04-28T11:30:00',
      },
      {
        id: 'm3',
        senderId: 'parent1',
        senderName: 'Hajia Bello',
        senderRole: 'parent',
        text: 'Jazakallahu khairan. Can I pay in two installments?',
        timestamp: '2026-04-29T14:30:00',
      },
    ],
  },
  {
    id: 't2',
    subject: 'Report Card Issue',
    status: 'open',
    createdAt: '2026-04-25T10:15:00',
    updatedAt: '2026-04-26T09:00:00',
    messages: [
      {
        id: 'm4',
        senderId: 'parent2',
        senderName: 'Alhaji Garba',
        senderRole: 'parent',
        text: 'My son Aliyu in Primary 5A did not receive his report card for 2nd term. Other students in his class received theirs. Please assist.',
        timestamp: '2026-04-25T10:15:00',
      },
      {
        id: 'm5',
        senderId: 'admin1',
        senderName: 'Admin (Ustazah Fatima)',
        senderRole: 'admin',
        text: 'We apologize for the oversight, Alhaji. We will check with the class teacher and ensure Aliyu\'s report card is prepared. You should receive it by Wednesday inshaAllah.',
        timestamp: '2026-04-26T09:00:00',
      },
    ],
  },
  {
    id: 't3',
    subject: 'Homework Clarification',
    status: 'open',
    createdAt: '2026-04-30T16:00:00',
    updatedAt: '2026-04-30T16:00:00',
    messages: [
      {
        id: 'm6',
        senderId: 'parent3',
        senderName: 'Malam Usman',
        senderRole: 'parent',
        text: 'Salam, my son Abubakar in JSS 2A needs clarification on the mathematics homework. The question about quadratic equations is not clear. Can the teacher explain further?',
        timestamp: '2026-04-30T16:00:00',
      },
    ],
  },
  {
    id: 't4',
    subject: 'Subject Combination Request',
    status: 'open',
    createdAt: '2026-05-01T08:45:00',
    updatedAt: '2026-05-02T10:00:00',
    messages: [
      {
        id: 'm7',
        senderId: 'parent4',
        senderName: 'Malam Bello',
        senderRole: 'parent',
        text: 'Can my son Hassan in SSS 2 Science switch to Arts class? He is struggling with Physics and Chemistry and would like to focus on Arts subjects.',
        timestamp: '2026-05-01T08:45:00',
      },
      {
        id: 'm8',
        senderId: 'admin1',
        senderName: 'Admin (Malam Tukur)',
        senderRole: 'admin',
        text: 'Salam Malam Bello. Subject changes are possible but require approval from the Head of Section. We will schedule a meeting with you and Hassan to discuss this. Please come to the school office on Thursday.',
        timestamp: '2026-05-02T10:00:00',
      },
    ],
  },
  {
    id: 't5',
    subject: 'Resumption Date',
    status: 'closed',
    createdAt: '2026-04-20T07:30:00',
    updatedAt: '2026-04-20T09:15:00',
    messages: [
      {
        id: 'm9',
        senderId: 'parent5',
        senderName: 'Malam Ibrahim',
        senderRole: 'parent',
        text: 'Please what is the resumption date for 3rd term?',
        timestamp: '2026-04-20T07:30:00',
      },
      {
        id: 'm10',
        senderId: 'admin1',
        senderName: 'Admin',
        senderRole: 'admin',
        text: '3rd term resumption is May 4th, 2026. Looking forward to seeing all students back inshaAllah.',
        timestamp: '2026-04-20T09:15:00',
      },
    ],
  },
]

function RoleBadge({ role }: { role: Role }) {
  let bg = '#E5E7EB'
  let color = '#6B7280'
  let label = role

  if (role === 'admin' || role === 'manager') { bg = '#DBEAFE'; color = '#1E40AF'; label = role === 'admin' ? 'Admin' : 'Management' }
  else if (role === 'teacher') { bg = '#D1FAE5'; color = '#065F46'; label = 'Teacher' }
  else if (role === 'parent') { bg = '#FEF3C7'; color = '#92400E'; label = 'Parent' }
  else if (role === 'student') { bg = '#F3E8FF'; color = '#7C3AED'; label = 'Student' }

  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700, backgroundColor: bg, color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {label}
    </span>
  )
}

function StatusBadge({ status }: { status: HelpdeskStatus }) {
  const bg = status === 'open' ? '#D1FAE5' : '#E5E7EB'
  const color = status === 'open' ? '#065F46' : '#6B7280'
  return (
    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: 11, fontWeight: 600, backgroundColor: bg, color }}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export default function HelpdeskPortalPage() {
  const router = useRouter()
  const { profile, portalAccess, loading } = useAuth()
  const [tickets, setTickets] = useState(INITIAL_TICKETS)
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)
  const [newSubject, setNewSubject] = useState('')
  const [newMessage, setNewMessage] = useState('')

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
            <h1 className="page-hero-title">Helpdesk</h1>
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

  if (portalAccess && !portalAccess.helpdesk) {
    return (
      <>
        <div className="D D1 D1-short">
          <Navbar />
          <section className="page-hero">
            <h1 className="page-hero-title">Helpdesk</h1>
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
            <p style={{ fontSize: '16px', color: '#777', margin: '0 0 24px' }}>You do not have permission to access the Helpdesk.</p>
            <a href="/dashboard" className="cta-btn cta-btn-filled" style={{ display: 'inline-block' }}>Back to Dashboard</a>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || null
  const isAdminOrManager = profile.role === 'admin' || profile.role === 'manager'

  function handleSendReply() {
    if (!replyText.trim() || !selectedTicketId) return
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: profile.id,
      senderName: profile.full_name,
      senderRole: profile.role as Role,
      text: replyText.trim(),
      timestamp: new Date().toISOString(),
    }
    setTickets(prev => prev.map(t => {
      if (t.id !== selectedTicketId) return t
      return {
        ...t,
        messages: [...t.messages, newMsg],
        updatedAt: new Date().toISOString(),
      }
    }))
    setReplyText('')
  }

  function handleCloseTicket() {
    if (!selectedTicketId) return
    setTickets(prev => prev.map(t => {
      if (t.id !== selectedTicketId) return t
      return { ...t, status: 'closed' as HelpdeskStatus }
    }))
  }

  function handleCreateTicket() {
    if (!newSubject.trim() || !newMessage.trim()) return
    const newTicket: Ticket = {
      id: `t-${Date.now()}`,
      subject: newSubject.trim(),
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: profile.id,
          senderName: profile.full_name,
          senderRole: profile.role as Role,
          text: newMessage.trim(),
          timestamp: new Date().toISOString(),
        },
      ],
    }
    setTickets(prev => [newTicket, ...prev])
    setNewSubject('')
    setNewMessage('')
    setShowNewMessageModal(false)
    setSelectedTicketId(newTicket.id)
  }

  const sortedTickets = [...tickets].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .hd-layout {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 0;
          border-radius: 16px;
          border: 1px solid #E8E8E8;
          overflow: hidden;
          min-height: 500px;
          background: #FFFFFF;
        }
        .hd-inbox {
          border-right: 1px solid #E8E8E8;
          display: flex;
          flex-direction: column;
          max-height: 600px;
        }
        .hd-inbox-header {
          padding: 16px 20px;
          border-bottom: 1px solid #F0F0F0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(45, 95, 63, 0.03);
        }
        .hd-inbox-title {
          font-size: 16px;
          font-weight: 700;
          color: #2D5F3F;
          margin: 0;
        }
        .hd-inbox-list {
          flex: 1;
          overflow-y: auto;
        }
        .hd-inbox-item {
          padding: 14px 20px;
          border-bottom: 1px solid #F0F0F0;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .hd-inbox-item:hover {
          background: rgba(45, 95, 63, 0.04);
        }
        .hd-inbox-item-active {
          background: rgba(45, 95, 63, 0.08);
          border-left: 3px solid #2D5F3F;
        }
        .hd-inbox-item-subject {
          font-size: 14px;
          font-weight: 700;
          color: #2D5F3F;
          margin: 0 0 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .hd-inbox-item-preview {
          font-size: 12px;
          color: #777;
          margin: 0 0 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.4;
        }
        .hd-inbox-item-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .hd-inbox-item-date {
          font-size: 11px;
          color: #999;
        }
        .hd-new-btn {
          padding: 7px 14px;
          font-size: 13px;
          font-weight: 600;
          background: #2D5F3F;
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s ease;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .hd-new-btn:hover {
          background: #1F4A2E;
        }
        .hd-conversation {
          display: flex;
          flex-direction: column;
          max-height: 600px;
        }
        .hd-conversation-header {
          padding: 16px 20px;
          border-bottom: 1px solid #F0F0F0;
          background: rgba(45, 95, 63, 0.03);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }
        .hd-conversation-subject {
          font-size: 16px;
          font-weight: 700;
          color: #2D5F3F;
          margin: 0;
        }
        .hd-conversation-actions {
          display: flex;
          gap: 8px;
        }
        .hd-close-btn {
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          background: transparent;
          color: #777;
          border: 1.5px solid #DDD;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .hd-close-btn:hover {
          border-color: #dc3545;
          color: #dc3545;
        }
        .hd-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .hd-message {
          display: flex;
          gap: 10px;
          max-width: 85%;
        }
        .hd-message-own {
          align-self: flex-end;
          flex-direction: row-reverse;
        }
        .hd-message-avatar {
          width: 32px;
          height: 32px;
          min-width: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          color: #FFFFFF;
          flex-shrink: 0;
        }
        .hd-message-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .hd-message-header {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .hd-message-sender {
          font-size: 13px;
          font-weight: 700;
          color: #2D5F3F;
        }
        .hd-message-time {
          font-size: 11px;
          color: #999;
        }
        .hd-message-text {
          background: #F8F9F5;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 14px;
          color: #444;
          line-height: 1.6;
          margin: 0;
        }
        .hd-message-own .hd-message-text {
          background: #2D5F3F;
          color: #FFFFFF;
        }
        .hd-reply-bar {
          padding: 12px 20px;
          border-top: 1px solid #F0F0F0;
          display: flex;
          gap: 10px;
          align-items: flex-end;
          background: #FAFAFA;
        }
        .hd-reply-input {
          flex: 1;
          padding: 10px 14px;
          border: 1.5px solid #DDD;
          border-radius: 10px;
          font-size: 14px;
          color: #333;
          background: #FFFFFF;
          outline: none;
          resize: none;
          font-family: inherit;
          line-height: 1.5;
          min-height: 40px;
          max-height: 100px;
          transition: border-color 0.2s ease;
        }
        .hd-reply-input:focus {
          border-color: #2D5F3F;
          box-shadow: 0 0 0 3px rgba(45, 95, 63, 0.1);
        }
        .hd-send-btn {
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          background: #2D5F3F;
          color: #FFFFFF;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s ease;
          white-space: nowrap;
        }
        .hd-send-btn:hover {
          background: #1F4A2E;
        }
        .hd-empty-conversation {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 40px;
          text-align: center;
          color: #999;
        }
        .hd-empty-icon {
          width: 64px;
          height: 64px;
          margin-bottom: 16px;
          color: #DDD;
        }
        .hd-modal-overlay {
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
        .hd-modal {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 32px;
          max-width: 480px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }
        .hd-modal-title {
          font-size: 20px;
          font-weight: 700;
          color: #2D5F3F;
          margin: 0 0 20px;
        }
        .hd-modal-field {
          margin-bottom: 16px;
        }
        .hd-modal-field label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #555;
          margin-bottom: 4px;
        }
        .hd-modal-input {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #DDD;
          border-radius: 8px;
          font-size: 14px;
          color: #333;
          background: #FAFAFA;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s ease;
        }
        .hd-modal-input:focus {
          border-color: #2D5F3F;
          box-shadow: 0 0 0 3px rgba(45, 95, 63, 0.1);
          background: #FFFFFF;
        }
        .hd-modal-textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #DDD;
          border-radius: 8px;
          font-size: 14px;
          color: #333;
          background: #FAFAFA;
          outline: none;
          resize: vertical;
          font-family: inherit;
          line-height: 1.6;
          min-height: 120px;
          box-sizing: border-box;
          transition: border-color 0.2s ease;
        }
        .hd-modal-textarea:focus {
          border-color: #2D5F3F;
          box-shadow: 0 0 0 3px rgba(45, 95, 63, 0.1);
          background: #FFFFFF;
        }
        .hd-modal-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
        }
        .hd-cancel-btn {
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          background: transparent;
          color: #777;
          border: 1.5px solid #DDD;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .hd-cancel-btn:hover {
          border-color: #999;
          color: #555;
        }
        .hd-submit-btn {
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          background: #2D5F3F;
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .hd-submit-btn:hover {
          background: #1F4A2E;
        }
        @media (max-width: 768px) {
          .hd-layout {
            grid-template-columns: 1fr;
            min-height: unset;
          }
          .hd-inbox {
            border-right: none;
            border-bottom: 1px solid #E8E8E8;
            max-height: ${selectedTicket ? '0' : '400px'};
            overflow: hidden;
          }
          .hd-conversation {
            max-height: unset;
          }
          .hd-inbox-list {
            max-height: 320px;
          }
          .hd-message {
            max-width: 95%;
          }
        }
      ` }} />

      {/* D1 - Header + Hero */}
      <div className="D D1 D1-short">
        <Navbar />
        <section className="page-hero">
          <h1 className="page-hero-title">Helpdesk</h1>
          <p className="page-hero-subtitle">
            Send messages and get support from the school administration
          </p>
        </section>
      </div>

      {/* D2 - Main Content */}
      <div className="D D2 D2-auto" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <section className="admission-section" style={{ maxWidth: '1100px', width: '100%' }}>

          <div className="hd-layout">
            {/* Left Panel - Inbox */}
            <div className="hd-inbox">
              <div className="hd-inbox-header">
                <h3 className="hd-inbox-title">Inbox</h3>
                <button className="hd-new-btn" onClick={() => setShowNewMessageModal(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  New Message
                </button>
              </div>
              <div className="hd-inbox-list">
                {sortedTickets.map(ticket => {
                  const lastMessage = ticket.messages[ticket.messages.length - 1]
                  return (
                    <div
                      key={ticket.id}
                      className={`hd-inbox-item${selectedTicketId === ticket.id ? ' hd-inbox-item-active' : ''}`}
                      onClick={() => setSelectedTicketId(ticket.id)}
                    >
                      <p className="hd-inbox-item-subject">{ticket.subject}</p>
                      <p className="hd-inbox-item-preview">{lastMessage?.text || ''}</p>
                      <div className="hd-inbox-item-meta">
                        <StatusBadge status={ticket.status} />
                        <span className="hd-inbox-item-date">
                          {new Date(ticket.updatedAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right Panel - Conversation */}
            <div className="hd-conversation">
              {selectedTicket ? (
                <>
                  <div className="hd-conversation-header">
                    <h3 className="hd-conversation-subject">{selectedTicket.subject}</h3>
                    <div className="hd-conversation-actions">
                      <StatusBadge status={selectedTicket.status} />
                      {isAdminOrManager && selectedTicket.status === 'open' && (
                        <button className="hd-close-btn" onClick={handleCloseTicket}>
                          Close Ticket
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="hd-messages">
                    {selectedTicket.messages.map(msg => {
                      const isOwn = msg.senderId === profile.id
                      const avatarColors: Record<string, string> = {
                        admin: '#1E40AF',
                        manager: '#1E40AF',
                        teacher: '#2D5F3F',
                        parent: '#B45309',
                        student: '#7C3AED',
                      }
                      const initials = msg.senderName.split(' ').map(n => n[0]).join('').substring(0, 2)
                      return (
                        <div key={msg.id} className={`hd-message${isOwn ? ' hd-message-own' : ''}`}>
                          <div className="hd-message-avatar" style={{ background: avatarColors[msg.senderRole] || '#6B7280' }}>
                            {initials}
                          </div>
                          <div className="hd-message-body">
                            <div className="hd-message-header">
                              <span className="hd-message-sender">{msg.senderName}</span>
                              <RoleBadge role={msg.senderRole} />
                              <span className="hd-message-time">
                                {new Date(msg.timestamp).toLocaleString('en-NG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="hd-message-text">{msg.text}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {selectedTicket.status === 'open' && (
                    <div className="hd-reply-bar">
                      <textarea
                        className="hd-reply-input"
                        placeholder="Type your reply..."
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSendReply()
                          }
                        }}
                        rows={1}
                      />
                      <button className="hd-send-btn" onClick={handleSendReply} disabled={!replyText.trim()}>
                        Send
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="hd-empty-conversation">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="hd-empty-icon">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <p style={{ fontSize: 16, fontWeight: 600, color: '#AAA', margin: '0 0 4px' }}>Select a conversation</p>
                  <p style={{ fontSize: 14, color: '#CCC', margin: 0 }}>Choose a ticket from the inbox to view messages</p>
                </div>
              )}
            </div>
          </div>

        </section>
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="hd-modal-overlay" onClick={() => setShowNewMessageModal(false)}>
          <div className="hd-modal" onClick={e => e.stopPropagation()}>
            <h2 className="hd-modal-title">New Message</h2>
            <div className="hd-modal-field">
              <label>Subject</label>
              <input
                type="text"
                className="hd-modal-input"
                placeholder="What is your message about?"
                value={newSubject}
                onChange={e => setNewSubject(e.target.value)}
              />
            </div>
            <div className="hd-modal-field">
              <label>Message</label>
              <textarea
                className="hd-modal-textarea"
                placeholder="Type your message here..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
              />
            </div>
            <div className="hd-modal-actions">
              <button className="hd-cancel-btn" onClick={() => setShowNewMessageModal(false)}>
                Cancel
              </button>
              <button
                className="hd-submit-btn"
                onClick={handleCreateTicket}
                disabled={!newSubject.trim() || !newMessage.trim()}
              >
                Send Message
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
