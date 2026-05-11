-- =====================================================
-- BATCH 5: All RLS Policies
-- =====================================================
-- Run this AFTER Batch 4 succeeds.
-- This batch adds the access control policies to all tables.

-- ── profiles policies ─────────────────────────────
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

-- ── section_keys policies ─────────────────────────
CREATE POLICY "Teachers and admins can read section keys" ON section_keys
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'teacher'))
  );

-- ── classes policies ──────────────────────────────
CREATE POLICY "Authenticated users can view classes" ON classes
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage classes" ON classes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- ── class_workspaces policies ─────────────────────
CREATE POLICY "Teachers can view own workspaces" ON class_workspaces
  FOR SELECT USING (
    teacher_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- ── school_files policies ─────────────────────────
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

-- ── assignments policies ──────────────────────────
CREATE POLICY "Class members can view assignments" ON assignments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
  );
CREATE POLICY "Teachers can manage assignments" ON assignments
  FOR ALL USING (
    created_by = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- ── submissions policies ──────────────────────────
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

-- ── attendance_logs policies ──────────────────────
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

-- ── report_cards policies ─────────────────────────
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

-- ── helpdesk_messages policies ────────────────────
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

-- ── school_settings policies ──────────────────────
CREATE POLICY "Anyone can view school settings" ON school_settings
  FOR SELECT USING (true);
CREATE POLICY "Admins can update settings" ON school_settings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- ── admission_applications policies ───────────────
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

-- ── parent_student_links policies ─────────────────
CREATE POLICY "Parents can view own links" ON parent_student_links
  FOR SELECT USING (parent_id = auth.uid());
CREATE POLICY "Admins can manage links" ON parent_student_links
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );
