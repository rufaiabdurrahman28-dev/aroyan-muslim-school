-- =====================================================
-- Aroyan Schools — Supabase Migration 001
-- All tables, RLS policies, and seed data
-- =====================================================

-- ── Enums ──────────────────────────────────────────
CREATE TYPE role_enum AS ENUM ('parent', 'teacher', 'student', 'admin', 'manager');
CREATE TYPE section_enum AS ENUM ('nursery', 'primary', 'jss', 'sss');
CREATE TYPE file_category_enum AS ENUM ('syllabus', 'scheme_of_work', 'lesson_notes', 'others');
CREATE TYPE file_status_enum AS ENUM ('pending', 'approved', 'not_approved');
CREATE TYPE submission_status_enum AS ENUM ('pending', 'submitted', 'not_submitted');
CREATE TYPE attendance_type_enum AS ENUM ('resumption', 'closing');
CREATE TYPE attendance_method_enum AS ENUM ('key', 'face_scan');
CREATE TYPE report_status_enum AS ENUM ('draft', 'final');
CREATE TYPE helpdesk_status_enum AS ENUM ('open', 'closed');
CREATE TYPE admission_status_enum AS ENUM ('pending', 'reviewed', 'accepted', 'rejected');
CREATE TYPE term_enum AS ENUM ('1st', '2nd', '3rd');

-- ── 1. profiles ────────────────────────────────────
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role role_enum NOT NULL DEFAULT 'student',
  section section_enum,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ── 2. section_keys ───────────────────────────────
CREATE TABLE section_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section section_enum NOT NULL,
  key_code TEXT NOT NULL UNIQUE
);
ALTER TABLE section_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers and admins can read section keys" ON section_keys
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'teacher'))
  );

-- ── 3. classes ────────────────────────────────────
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  section section_enum NOT NULL,
  arm TEXT DEFAULT 'A',
  teacher_id UUID REFERENCES profiles(id)
);
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view classes" ON classes
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage classes" ON classes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- ── 4. class_workspaces ───────────────────────────
CREATE TABLE class_workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES profiles(id),
  workspace_password_hash TEXT NOT NULL
);
ALTER TABLE class_workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view own workspaces" ON class_workspaces
  FOR SELECT USING (
    teacher_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- ── 5. school_files ───────────────────────────────
CREATE TABLE school_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  category file_category_enum NOT NULL,
  week INTEGER,
  term term_enum NOT NULL,
  content TEXT,
  file_url TEXT,
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  status file_status_enum NOT NULL DEFAULT 'pending',
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE school_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view files in their class" ON school_files
  FOR SELECT USING (
    uploaded_by = auth.uid()
    OR EXISTS (SELECT 1 FROM classes c JOIN profiles p ON p.id = auth.uid() WHERE c.id = class_id AND (c.teacher_id = auth.uid() OR p.role IN ('admin', 'manager', 'teacher')))
  );
CREATE POLICY "Students can view approved files" ON school_files
  FOR SELECT USING (
    status = 'approved'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('student', 'parent'))
  );
CREATE POLICY "Teachers can insert files" ON school_files
  FOR INSERT WITH CHECK (
    auth.uid() = uploaded_by
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin', 'manager'))
  );
CREATE POLICY "Admins can update file status" ON school_files
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );
CREATE POLICY "Teachers can update own pending files" ON school_files
  FOR UPDATE USING (
    uploaded_by = auth.uid() AND status = 'pending'
  );

-- ── 6. assignments ────────────────────────────────
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  due_date DATE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Class members can view assignments" ON assignments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "Teachers can manage assignments" ON assignments
  FOR ALL USING (
    created_by = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- ── 7. submissions ────────────────────────────────
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id),
  file_url TEXT,
  status submission_status_enum NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMPTZ
);
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own submissions" ON submissions
  FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Teachers can view class submissions" ON submissions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM assignments a JOIN classes c ON c.id = a.class_id WHERE a.id = assignment_id AND (c.teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))))
  );
CREATE POLICY "Students can insert own submissions" ON submissions
  FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Teachers can update submissions" ON submissions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin', 'manager'))
  );

-- ── 8. attendance_logs ────────────────────────────
CREATE TABLE attendance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES profiles(id),
  class_id UUID NOT NULL REFERENCES classes(id),
  type attendance_type_enum NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  method attendance_method_enum NOT NULL DEFAULT 'key'
);
ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can manage own attendance" ON attendance_logs
  FOR ALL USING (teacher_id = auth.uid());
CREATE POLICY "Admins can view all attendance" ON attendance_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );
CREATE POLICY "Students can view own class attendance" ON attendance_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('student', 'parent'))
  );

-- ── 9. report_cards ───────────────────────────────
CREATE TABLE report_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id),
  class_id UUID NOT NULL REFERENCES classes(id),
  term term_enum NOT NULL,
  session TEXT NOT NULL DEFAULT '2025/2026',
  subject TEXT,
  test1 NUMERIC(5,2),
  test2 NUMERIC(5,2),
  exam NUMERIC(5,2),
  total NUMERIC(5,2) GENERATED ALWAYS AS (COALESCE(test1,0) + COALESCE(test2,0) + COALESCE(exam,0)) STORED,
  percentage NUMERIC(5,2) GENERATED ALWAYS AS (
    CASE WHEN COALESCE(test1,0) + COALESCE(test2,0) + COALESCE(exam,0) > 0
      THEN ROUND((COALESCE(test1,0) + COALESCE(test2,0) + COALESCE(exam,0)) / 1.0, 2)
      ELSE 0
    END
  ) STORED,
  grade TEXT,
  teacher_comment TEXT,
  teacher_signature TEXT,
  management_signature TEXT,
  status report_status_enum NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE report_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own final reports" ON report_cards
  FOR SELECT USING (
    student_id = auth.uid() AND status = 'final'
  );
CREATE POLICY "Parents can view child final reports" ON report_cards
  FOR SELECT USING (
    status = 'final'
    AND EXISTS (SELECT 1 FROM parent_student_links WHERE parent_id = auth.uid() AND student_id = report_cards.student_id)
  );
CREATE POLICY "Teachers can manage reports for their class" ON report_cards
  FOR ALL USING (
    EXISTS (SELECT 1 FROM classes c WHERE c.id = class_id AND c.teacher_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- ── 10. helpdesk_messages ─────────────────────────
CREATE TABLE helpdesk_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id),
  sender_role role_enum NOT NULL,
  recipient_id UUID REFERENCES profiles(id),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status helpdesk_status_enum NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE helpdesk_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages" ON helpdesk_messages
  FOR SELECT USING (
    sender_id = auth.uid() OR recipient_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );
CREATE POLICY "Authenticated users can send messages" ON helpdesk_messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Admins can update messages" ON helpdesk_messages
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- ── 11. school_settings ───────────────────────────
CREATE TABLE school_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name TEXT NOT NULL DEFAULT 'Aroyan Muslim School',
  logo_url TEXT NOT NULL DEFAULT '/InShot_20260507_212731657.jpg',
  address TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT ''
);
ALTER TABLE school_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view school settings" ON school_settings
  FOR SELECT USING (true);
CREATE POLICY "Admins can update settings" ON school_settings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- ── 12. admission_applications ────────────────────
CREATE TABLE admission_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  dob DATE,
  gender TEXT,
  level section_enum NOT NULL,
  parent_name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  previous_school TEXT,
  status admission_status_enum NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE admission_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit applications" ON admission_applications
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view and update applications" ON admission_applications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );
CREATE POLICY "Admins can update applications" ON admission_applications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- ── 13. parent_student_links ──────────────────────
CREATE TABLE parent_student_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES profiles(id),
  student_id UUID NOT NULL REFERENCES profiles(id),
  access_key TEXT NOT NULL UNIQUE
);
ALTER TABLE parent_student_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view own links" ON parent_student_links
  FOR SELECT USING (parent_id = auth.uid());
CREATE POLICY "Admins can manage links" ON parent_student_links
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- ── Seed Data ─────────────────────────────────────

-- Section keys
INSERT INTO section_keys (section, key_code) VALUES
  ('nursery', 'NURS2026'),
  ('primary', 'PRIM2026'),
  ('jss', 'JSS2026'),
  ('sss', 'SSS2026');

-- School settings
INSERT INTO school_settings (school_name, logo_url, address, phone) VALUES
  ('Aroyan Muslim School', '/InShot_20260507_212731657.jpg', 'Lagos, Nigeria', '+234-XXX-XXX-XXXX');

-- ── Storage Buckets ───────────────────────────────
-- Run these in Supabase SQL editor or via API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('school-files', 'school-files', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('report-cards', 'report-cards', false);

-- Storage policies for school-files bucket
-- CREATE POLICY "Teachers can upload" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'school-files' AND auth.uid() IS NOT NULL);
-- CREATE POLICY "Authenticated users can view" ON storage.objects
--   FOR SELECT USING (bucket_id = 'school-files' AND auth.uid() IS NOT NULL);

-- Storage policies for report-cards bucket
-- CREATE POLICY "System can upload reports" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'report-cards' AND auth.uid() IS NOT NULL);
-- CREATE POLICY "Users can view own reports" ON storage.objects
--   FOR SELECT USING (bucket_id = 'report-cards' AND auth.uid() IS NOT NULL);
