-- =====================================================
-- BATCH 6: Storage Buckets (Optional - run last)
-- =====================================================
-- Run this AFTER Batch 5 succeeds.

-- ── Storage Buckets ───────────────────────────────
INSERT INTO storage.buckets (id, name, public) VALUES ('school-files', 'school-files', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('report-cards', 'report-cards', false);

-- Storage policies for school-files bucket
CREATE POLICY "Teachers can upload school files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'school-files' AND auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can view school files" ON storage.objects
  FOR SELECT USING (bucket_id = 'school-files' AND auth.uid() IS NOT NULL);

-- Storage policies for report-cards bucket
CREATE POLICY "System can upload reports" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'report-cards' AND auth.uid() IS NOT NULL);
CREATE POLICY "Users can view own reports" ON storage.objects
  FOR SELECT USING (bucket_id = 'report-cards' AND auth.uid() IS NOT NULL);
