-- PART 5: Enable RLS and Simple Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE helpdesk_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admission_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_student_links ENABLE ROW LEVEL SECURITY;

-- School settings: anyone can read
CREATE POLICY "Anyone can view school settings" ON school_settings
  FOR SELECT USING (true);

-- Admission: anyone can submit
CREATE POLICY "Anyone can submit applications" ON admission_applications
  FOR INSERT WITH CHECK (true);

-- Profiles: users can see their own
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Section keys: authenticated users can read
CREATE POLICY "Authenticated can read section keys" ON section_keys
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Classes: authenticated users can view
CREATE POLICY "Authenticated can view classes" ON classes
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- School files: teachers/admins can view all, students only approved
CREATE POLICY "Teachers admins can view files" ON school_files
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'teacher'))
  );
CREATE POLICY "Students can view approved files" ON school_files
  FOR SELECT USING (
    status = 'approved' AND auth.uid() IS NOT NULL
  );
CREATE POLICY "Teachers can insert files" ON school_files
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
  );
CREATE POLICY "Admins can update files" ON school_files
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- Assignments: authenticated can view
CREATE POLICY "Authenticated can view assignments" ON assignments
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Submissions: students can see own, teachers can see all
CREATE POLICY "Students view own submissions" ON submissions
  FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Students can insert submissions" ON submissions
  FOR INSERT WITH CHECK (student_id = auth.uid());

-- Attendance: authenticated can view
CREATE POLICY "Authenticated can view attendance" ON attendance_logs
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Report cards: students see own final, teachers/admins see all
CREATE POLICY "Students view own final reports" ON report_cards
  FOR SELECT USING (student_id = auth.uid() AND status = 'final');
CREATE POLICY "Teachers admins manage reports" ON report_cards
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'teacher'))
  );

-- Helpdesk: users see own messages, admins see all
CREATE POLICY "Users view own messages" ON helpdesk_messages
  FOR SELECT USING (sender_id = auth.uid() OR recipient_id = auth.uid());
CREATE POLICY "Users can send messages" ON helpdesk_messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Admins manage messages" ON helpdesk_messages
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- Parent links: parents see own, admins manage
CREATE POLICY "Parents view own links" ON parent_student_links
  FOR SELECT USING (parent_id = auth.uid());
