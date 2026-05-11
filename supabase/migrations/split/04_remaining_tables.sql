-- PART 4: Remaining Tables
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

CREATE TABLE parent_student_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES profiles(id),
  student_id UUID NOT NULL REFERENCES profiles(id),
  access_key TEXT NOT NULL UNIQUE
);
