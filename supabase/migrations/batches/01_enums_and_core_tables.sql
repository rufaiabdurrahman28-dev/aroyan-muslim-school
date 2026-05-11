-- =====================================================
-- BATCH 1: Enums + Core Tables (profiles, section_keys, classes)
-- =====================================================
-- Run this FIRST. Wait for "Success" before running Batch 2.

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

-- ── 2. section_keys ───────────────────────────────
CREATE TABLE section_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section section_enum NOT NULL,
  key_code TEXT NOT NULL UNIQUE
);
ALTER TABLE section_keys ENABLE ROW LEVEL SECURITY;

-- ── 3. classes ────────────────────────────────────
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  section section_enum NOT NULL,
  arm TEXT DEFAULT 'A',
  teacher_id UUID REFERENCES profiles(id)
);
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- ── Seed: Section keys ─────────────────────────────
INSERT INTO section_keys (section, key_code) VALUES
  ('nursery', 'NURS2026'),
  ('primary', 'PRIM2026'),
  ('jss', 'JSS2026'),
  ('sss', 'SSS2026');
