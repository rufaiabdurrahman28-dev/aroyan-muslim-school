# Task: Build 3 Portal Pages for Aroyan Muslim School

## Summary
Built three complete portal pages for the Aroyan Muslim School website:
1. **Teacher Portal** (`/portal/teacher`) - Most complex with 4 tabs including a spreadsheet-style report card system
2. **Student Portal** (`/portal/student`) - Read-only view with 4 tabs
3. **Helpdesk Portal** (`/portal/helpdesk`) - Two-panel messaging system

## Files Created
- `/home/z/my-project/src/app/portal/teacher/page.tsx` - Teacher Portal (4 tabs)
- `/home/z/my-project/src/app/portal/student/page.tsx` - Student Portal (4 tabs)
- `/home/z/my-project/src/app/portal/helpdesk/page.tsx` - Helpdesk Portal (2-panel layout)

## Key Implementation Details

### Teacher Portal (`/portal/teacher/page.tsx`)
- **Auth guard**: Checks `portalAccess.teacher`, redirects to `/login` if not authenticated, shows "Access Denied" if no access
- **Attendance Tab**: Class/date selectors, "Mark Resumption"/"Mark Closing" bulk buttons, individual "Check In"/"Check Out" per student, status badges (Present/Late/Absent), auto-determines late if after 7:30 AM
- **Assignments Tab**: Create new assignment form (title + due date + class), expandable assignment cards showing submission tracking, toggle submission status per student
- **Report Cards Tab** (most complex):
  - Selectors for Class, Subject, Term, Session
  - Spreadsheet-style grid with editable test1 (max 20), test2 (max 20), exam (max 60)
  - Auto-calculated Total, Percentage, Grade (using `calculateGrade` from types)
  - Editable comment per student
  - "Save Draft", "Generate Report Card", "Sign Off" buttons
  - Preview modal with school logo, student info, results table, teacher/management signature lines, "Submit to Management" button
- **File Status Tab**: Table of uploaded files with status badges and "Resubmit" button for not_approved files
- All hooks (useState, useCallback) are placed before early returns to comply with React hooks rules
- Lazy state initialization used to avoid setState-in-effect lint errors
- `handleReportClassChange` function resets report rows when class changes (replaces useEffect)

### Student Portal (`/portal/student/page.tsx`)
- **Auth guard**: Checks `portalAccess.student`
- **My Assignments Tab**: List of assignments with status badges (Pending/Submitted/Not Submitted)
- **My Results Tab**: Term tabs (1st/2nd/3rd), report card view with grade-colored letters, average percentage badge, read-only results table
- **Attendance Tab**: Calendar-style list with summary counters, resumption/closing times, status badges
- **Files Tab**: Grouped by folder (Syllabus/Scheme of Work, Lesson Notes, Others), only approved files shown

### Helpdesk Portal (`/portal/helpdesk/page.tsx`)
- **Auth guard**: Checks `portalAccess.helpdesk`
- **Two-panel layout**: Inbox (left, 380px) + Conversation (right, flexible) on desktop; stacked on mobile
- **Inbox**: List of tickets sorted by update time, subject, last message preview, status badge, date
- **Conversation**: Message thread with avatars (initials), sender name, role badges, timestamps, message bubbles (own messages right-aligned with green background)
- **Reply bar**: Textarea + Send button, supports Enter to send (Shift+Enter for newline)
- **Close Ticket**: Only visible for admin/manager roles
- **New Message Modal**: Subject + Message fields, creates new ticket
- Color-coded role badges (Admin=blue, Teacher=green, Parent=amber, Student=purple)

## Design System Compliance
- Primary Green: `#2D5F3F`, Gold Accent: `#C9A961`, Dark Green: `#1F4A2A`, Light BG: `#F8F9F5`
- Consistent tab styling across all portals (green active tab, gray inactive)
- Status badges use consistent colors (green=good, amber=warning, red=bad)
- Page structure follows D/D1-short/D2-auto/D3 pattern with Navbar and Footer
- All CSS in `<style>` tags, no globals.css modifications
- Responsive design with mobile breakpoints

## Lint Status
- All three portal pages pass ESLint with zero errors
- Pre-existing lint errors in other files (apply page, server files) remain untouched
