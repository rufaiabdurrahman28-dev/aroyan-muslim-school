-- PART 1: Create Enums
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
