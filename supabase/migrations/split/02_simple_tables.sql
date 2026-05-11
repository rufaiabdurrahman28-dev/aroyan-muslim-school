-- PART 2: Simple Tables
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role role_enum NOT NULL DEFAULT 'student',
  section section_enum,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE section_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section section_enum NOT NULL,
  key_code TEXT NOT NULL UNIQUE
);

CREATE TABLE school_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name TEXT NOT NULL DEFAULT 'Aroyan Muslim School',
  logo_url TEXT NOT NULL DEFAULT '/InShot_20260507_212731657.jpg',
  address TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT ''
);

CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  section section_enum NOT NULL,
  arm TEXT DEFAULT 'A',
  teacher_id UUID REFERENCES profiles(id)
);

CREATE TABLE class_workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES profiles(id),
  workspace_password_hash TEXT NOT NULL
);
