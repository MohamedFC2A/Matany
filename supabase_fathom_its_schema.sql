-- ============================================================================
-- FATHOM ITS 1 — SUPABASE PERSISTENT ARCHITECTURE SCHEMA
-- Long-Term Memory, Placement Calibration, and Adaptive Tutoring Engine
-- ============================================================================

-- 1. Student Educational Profile
CREATE TABLE IF NOT EXISTS public.fathom_its_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    target_language TEXT NOT NULL DEFAULT 'en',
    voice_id TEXT NOT NULL DEFAULT 'JBFqnCBsd6RMkjVDRZzb',
    voice_name TEXT NOT NULL DEFAULT 'George',
    target_cefr TEXT NOT NULL DEFAULT 'B2' CHECK (target_cefr IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
    current_cefr TEXT NOT NULL DEFAULT 'A1' CHECK (current_cefr IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
    current_points INTEGER NOT NULL DEFAULT 0,
    baseline_score NUMERIC DEFAULT NULL,
    baseline_cambridge_scale INTEGER DEFAULT NULL,
    baseline_cefr TEXT DEFAULT NULL,
    baseline_breakdown JSONB DEFAULT '{}'::jsonb,
    total_study_minutes INTEGER NOT NULL DEFAULT 0,
    sessions_completed INTEGER NOT NULL DEFAULT 0,
    quizzes_solved INTEGER NOT NULL DEFAULT 0,
    last_active TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Cambridge Diagnostic & Periodic Benchmark Assessments
CREATE TABLE IF NOT EXISTS public.fathom_its_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.fathom_its_profiles(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assessment_type TEXT NOT NULL DEFAULT 'diagnostic' CHECK (assessment_type IN ('diagnostic', 'progress_checkpoint', 'final_mastery')),
    raw_score NUMERIC NOT NULL,
    max_score NUMERIC NOT NULL,
    percentage NUMERIC NOT NULL,
    cambridge_scale INTEGER NOT NULL,
    diagnosed_cefr TEXT NOT NULL CHECK (diagnosed_cefr IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
    sub_level_string TEXT,
    category_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
    answers_log JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Extended Continuous Dialogue & Tutoring Sessions
CREATE TABLE IF NOT EXISTS public.fathom_its_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.fathom_its_profiles(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'tutor', 'system')),
    content TEXT NOT NULL,
    audio_url TEXT,
    msq_data JSONB,
    correction_data JSONB,
    point_increment_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Fast Query Indexes
CREATE INDEX IF NOT EXISTS idx_fathom_its_profiles_device ON public.fathom_its_profiles(device_id);
CREATE INDEX IF NOT EXISTS idx_fathom_its_profiles_user ON public.fathom_its_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_fathom_its_assessments_device ON public.fathom_its_assessments(device_id);
CREATE INDEX IF NOT EXISTS idx_fathom_its_assessments_profile ON public.fathom_its_assessments(profile_id);
CREATE INDEX IF NOT EXISTS idx_fathom_its_messages_profile ON public.fathom_its_messages(profile_id);
CREATE INDEX IF NOT EXISTS idx_fathom_its_messages_device ON public.fathom_its_messages(device_id);
CREATE INDEX IF NOT EXISTS idx_fathom_its_messages_created ON public.fathom_its_messages(created_at ASC);

-- 5. Row Level Security (RLS)
ALTER TABLE public.fathom_its_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fathom_its_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fathom_its_messages ENABLE ROW LEVEL SECURITY;

-- 6. Flexible Permissive Policies (Support device_id tracking + authenticated users)
CREATE POLICY "Allow public read/write fathom_its_profiles" ON public.fathom_its_profiles
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read/write fathom_its_assessments" ON public.fathom_its_assessments
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read/write fathom_its_messages" ON public.fathom_its_messages
    FOR ALL USING (true) WITH CHECK (true);
