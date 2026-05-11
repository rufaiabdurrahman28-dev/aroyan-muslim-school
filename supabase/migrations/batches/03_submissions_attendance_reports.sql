-- =====================================================
-- BATCH 3: Submissions, Attendance, Report Cards
-- =====================================================
-- Run this AFTER Batch 2 succeeds.

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
