-- =====================================================
-- BATCH 4: Helpdesk, Settings, Admission, Parent Links
-- =====================================================
-- Run this AFTER Batch 3 succeeds.

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

-- ── 11. school_settings ───────────────────────────
CREATE TABLE school_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name TEXT NOT NULL DEFAULT 'Aroyan Muslim School',
  logo_url TEXT NOT NULL DEFAULT '/InShot_20260507_212731657.jpg',
  address TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT ''
);
ALTER TABLE school_settings ENABLE ROW LEVEL SECURITY;

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

-- ── 13. parent_student_links ──────────────────────
CREATE TABLE parent_student_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES profiles(id),
  student_id UUID NOT NULL REFERENCES profiles(id),
  access_key TEXT NOT NULL UNIQUE
);
ALTER TABLE parent_student_links ENABLE ROW LEVEL SECURITY;

-- ── Seed: School settings ─────────────────────────
INSERT INTO school_settings (school_name, logo_url, address, phone) VALUES
  ('Aroyan Muslim School', '/InShot_20260507_212731657.jpg', 'Lagos, Nigeria', '+234-XXX-XXX-XXXX');
