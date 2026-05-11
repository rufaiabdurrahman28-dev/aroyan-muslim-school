-- PART 3: Data Tables
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

CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  due_date DATE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id),
  file_url TEXT,
  status submission_status_enum NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMPTZ
);

CREATE TABLE attendance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES profiles(id),
  class_id UUID NOT NULL REFERENCES classes(id),
  type attendance_type_enum NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  method attendance_method_enum NOT NULL DEFAULT 'key'
);
