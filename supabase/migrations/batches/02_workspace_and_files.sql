-- =====================================================
-- BATCH 2: Workspaces + Files Tables
-- =====================================================
-- Run this AFTER Batch 1 succeeds.

-- ── 4. class_workspaces ───────────────────────────
CREATE TABLE class_workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES profiles(id),
  workspace_password_hash TEXT NOT NULL
);
ALTER TABLE class_workspaces ENABLE ROW LEVEL SECURITY;

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
