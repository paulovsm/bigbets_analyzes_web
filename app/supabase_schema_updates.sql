-- Enable public read access to studies and reports
-- This allows anyone to view the studies without being authenticated

-- 1. Whitespace Studies
DROP POLICY IF EXISTS "Users can view own studies" ON whitespace_studies;
CREATE POLICY "Public can view studies" ON whitespace_studies
    FOR SELECT USING (true);

-- 2. Study Reports
DROP POLICY IF EXISTS "Users can view own reports" ON study_reports; -- Assuming a default policy existed or creating new
ALTER TABLE study_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view reports" ON study_reports
    FOR SELECT USING (true);

-- 3. Whitespaces
DROP POLICY IF EXISTS "Users can view own whitespaces" ON whitespaces;
CREATE POLICY "Public can view whitespaces" ON whitespaces
    FOR SELECT USING (true);

-- 4. Client Analyses (Optional - maybe keep this private? The user said "any one with the link". Let's default to public for now as per "Consultar nos whitespaces")
CREATE POLICY "Public can view client analyses" ON client_analyses
    FOR SELECT USING (true);
