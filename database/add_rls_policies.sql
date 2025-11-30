-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view all profiles (public read)
CREATE POLICY "Enable read access for all users" ON public.profiles
    FOR SELECT
    USING (true);

-- Policy 2: Users can update their own profile
CREATE POLICY "Enable update for users based on id" ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policy 3: Users can insert their own profile (during signup)
CREATE POLICY "Enable insert for authenticated users" ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- =====================================================
-- FAVORITES TABLE RLS
-- =====================================================
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view their own favorites
CREATE POLICY "Users can view their own favorites" ON public.favorites
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy 2: Users can insert their own favorites
CREATE POLICY "Users can insert their own favorites" ON public.favorites
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can delete their own favorites
CREATE POLICY "Users can delete their own favorites" ON public.favorites
    FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- ENGINEER_DOCUMENTS TABLE RLS
-- =====================================================
ALTER TABLE public.engineer_documents ENABLE ROW LEVEL SECURITY;

-- Policy 1: Engineers can view their own documents
CREATE POLICY "Engineers can view their own documents" ON public.engineer_documents
    FOR SELECT
    USING (auth.uid() = engineer_id);

-- Policy 2: Admins can view all documents
CREATE POLICY "Admins can view all documents" ON public.engineer_documents
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Policy 3: Engineers can update their own documents
CREATE POLICY "Engineers can update their own documents" ON public.engineer_documents
    FOR UPDATE
    USING (auth.uid() = engineer_id)
    WITH CHECK (auth.uid() = engineer_id);

-- Policy 4: Engineers can insert their own documents
CREATE POLICY "Engineers can insert their own documents" ON public.engineer_documents
    FOR INSERT
    WITH CHECK (auth.uid() = engineer_id);

-- =====================================================
-- REVIEWS TABLE RLS (if it exists)
-- =====================================================
-- Check if reviews table exists before enabling RLS
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reviews') THEN
        ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
        
        -- Policy 1: Anyone can view reviews
        CREATE POLICY "Enable read access for all users" ON public.reviews
            FOR SELECT
            USING (true);
        
        -- Policy 2: Users can insert their own reviews
        CREATE POLICY "Users can insert their own reviews" ON public.reviews
            FOR INSERT
            WITH CHECK (auth.uid() = reviewer_id);
        
        -- Policy 3: Users can update their own reviews
        CREATE POLICY "Users can update their own reviews" ON public.reviews
            FOR UPDATE
            USING (auth.uid() = reviewer_id)
            WITH CHECK (auth.uid() = reviewer_id);
        
        -- Policy 4: Users can delete their own reviews
        CREATE POLICY "Users can delete their own reviews" ON public.reviews
            FOR DELETE
            USING (auth.uid() = reviewer_id);
    END IF;
END
$$;

-- =====================================================
-- PROJECTS TABLE RLS
-- =====================================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone can view projects
CREATE POLICY "Enable read access for all users" ON public.projects
    FOR SELECT
    USING (true);

-- Policy 2: Clients can insert their own projects
CREATE POLICY "Clients can insert their own projects" ON public.projects
    FOR INSERT
    WITH CHECK (auth.uid() = client_id);

-- Policy 3: Clients can update their own projects
CREATE POLICY "Clients can update their own projects" ON public.projects
    FOR UPDATE
    USING (auth.uid() = client_id)
    WITH CHECK (auth.uid() = client_id);

-- Policy 4: Clients can delete their own projects
CREATE POLICY "Clients can delete their own projects" ON public.projects
    FOR DELETE
    USING (auth.uid() = client_id);

-- =====================================================
-- PROPOSALS TABLE RLS
-- =====================================================
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone can view proposals
CREATE POLICY "Enable read access for all users" ON public.proposals
    FOR SELECT
    USING (true);

-- Policy 2: Engineers can insert their own proposals
CREATE POLICY "Engineers can insert their own proposals" ON public.proposals
    FOR INSERT
    WITH CHECK (auth.uid() = engineer_id);

-- Policy 3: Engineers can update their own proposals
CREATE POLICY "Engineers can update their own proposals" ON public.proposals
    FOR UPDATE
    USING (auth.uid() = engineer_id)
    WITH CHECK (auth.uid() = engineer_id);

-- Policy 4: Clients can update proposals for their projects
CREATE POLICY "Clients can update proposals for their projects" ON public.proposals
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE id = project_id AND client_id = auth.uid()
        )
    );

-- =====================================================
-- MESSAGES TABLE RLS
-- =====================================================
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view messages they're involved in
CREATE POLICY "Users can view their messages" ON public.messages
    FOR SELECT
    USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Policy 2: Users can insert messages they're sending
CREATE POLICY "Users can insert their messages" ON public.messages
    FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

-- Policy 3: Users can update their own messages
CREATE POLICY "Users can update their messages" ON public.messages
    FOR UPDATE
    USING (auth.uid() = sender_id)
    WITH CHECK (auth.uid() = sender_id);

-- =====================================================
-- ATTACHMENTS TABLE RLS
-- =====================================================
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone can view attachments
CREATE POLICY "Enable read access for all users" ON public.attachments
    FOR SELECT
    USING (true);

-- Policy 2: Users can insert their own attachments
CREATE POLICY "Users can insert their own attachments" ON public.attachments
    FOR INSERT
    WITH CHECK (auth.uid() = uploader_id);

-- Policy 3: Users can delete their own attachments
CREATE POLICY "Users can delete their own attachments" ON public.attachments
    FOR DELETE
    USING (auth.uid() = uploader_id);
