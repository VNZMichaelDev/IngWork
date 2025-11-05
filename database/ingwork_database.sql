-- =====================================================
-- INGWORK MARKETPLACE DATABASE SETUP
-- Complete SQL configuration for Supabase
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. PROFILES TABLE (User profiles)
-- =====================================================
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'engineer')),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    company VARCHAR(255),
    location VARCHAR(255),
    bio TEXT,
    avatar_url TEXT,
    
    -- Engineer specific fields
    specialty VARCHAR(255),
    experience_years INTEGER,
    hourly_rate DECIMAL(10,2),
    availability VARCHAR(50) CHECK (availability IN ('available', 'busy', 'unavailable')),
    skills TEXT[], -- Array of skills
    portfolio_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    
    -- Client specific fields
    industry VARCHAR(255),
    company_size VARCHAR(50),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);

-- =====================================================
-- 2. PROJECTS TABLE
-- =====================================================
CREATE TABLE public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    budget_estimate DECIMAL(12,2),
    eta_days INTEGER,
    location VARCHAR(255),
    requirements TEXT,
    skills_required TEXT[], -- Array of required skills
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('draft', 'open', 'in_progress', 'completed', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Dates
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deadline DATE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    is_featured BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0
);

-- =====================================================
-- 3. PROPOSALS TABLE
-- =====================================================
CREATE TABLE public.proposals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    engineer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    bid_amount DECIMAL(12,2) NOT NULL,
    eta_days INTEGER NOT NULL,
    details TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'sent' CHECK (status IN ('sent', 'viewed', 'accepted', 'rejected', 'negotiating', 'withdrawn')),
    
    -- Negotiation fields
    counter_offer_amount DECIMAL(12,2),
    counter_offer_days INTEGER,
    negotiation_notes TEXT,
    
    -- Dates
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    viewed_at TIMESTAMP WITH TIME ZONE,
    responded_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    UNIQUE(project_id, engineer_id) -- One proposal per engineer per project
);

-- =====================================================
-- 4. MESSAGES TABLE (Project communication)
-- =====================================================
CREATE TABLE public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'system', 'proposal_update')),
    
    -- File attachments
    attachment_url TEXT,
    attachment_name VARCHAR(255),
    attachment_size INTEGER,
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    -- Dates
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 5. ATTACHMENTS TABLE (File uploads)
-- =====================================================
CREATE TABLE public.attachments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    proposal_id UUID REFERENCES public.proposals(id) ON DELETE CASCADE,
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    uploader_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- File details
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    
    -- Metadata
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- At least one reference must exist
    CHECK (
        (project_id IS NOT NULL) OR 
        (proposal_id IS NOT NULL) OR 
        (message_id IS NOT NULL)
    )
);

-- =====================================================
-- 6. REVIEWS TABLE (Ratings and feedback)
-- =====================================================
CREATE TABLE public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    reviewee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Rating (1-5 stars)
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    
    -- Review categories
    communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
    quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
    timeliness_rating INTEGER CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
    professionalism_rating INTEGER CHECK (professionalism_rating >= 1 AND professionalism_rating <= 5),
    
    -- Status
    is_public BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    
    -- Dates
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(project_id, reviewer_id, reviewee_id) -- One review per project per pair
);

-- =====================================================
-- 7. NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('proposal', 'message', 'project_update', 'review', 'system')),
    
    -- Related entities
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    proposal_id UUID REFERENCES public.proposals(id) ON DELETE CASCADE,
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    -- Dates
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 8. PROJECT CATEGORIES TABLE (Reference data)
-- =====================================================
CREATE TABLE public.project_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert construction and building categories
INSERT INTO public.project_categories (name, description, icon) VALUES
('Construcción', 'Proyectos de construcción nueva', 'building'),
('Mantenimiento y mejoramiento', 'Mantenimiento y mejoras de edificaciones', 'wrench'),
('Remodelación', 'Remodelación y renovación de espacios', 'home'),
('Servicios técnicos y documentación', 'Documentación técnica, planos, estudios', 'file-text'),
('Asesorías y consultorías', 'Asesoría técnica y consultoría profesional', 'briefcase'),
('Supervisión', 'Supervisión de obras y proyectos', 'eye'),
('Categoría A - Edificaciones esenciales', 'Hospitales, estaciones de bomberos, comisarías, centrales eléctricas, etc.', 'shield'),
('Categoría B - Edificaciones de uso especial', 'Escuelas, universidades, iglesias, cines, estadios, museos, centros comerciales', 'users'),
('Categoría C - Edificaciones comunes', 'Viviendas, oficinas, locales comerciales pequeños, talleres, edificios multifamiliares', 'home'),
('Categoría D - Edificaciones menores', 'Construcciones agrícolas ligeras, depósitos pequeños, cobertizos, garajes, cercos', 'box');

-- =====================================================
-- 9. SKILLS TABLE (Reference data)
-- =====================================================
CREATE TABLE public.skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert common skills
INSERT INTO public.skills (name, category) VALUES
-- Programming
('JavaScript', 'Programming'),
('Python', 'Programming'),
('Java', 'Programming'),
('C#', 'Programming'),
('PHP', 'Programming'),
('TypeScript', 'Programming'),
('Go', 'Programming'),
('Rust', 'Programming'),

-- Web Development
('React', 'Web Development'),
('Vue.js', 'Web Development'),
('Angular', 'Web Development'),
('Next.js', 'Web Development'),
('Node.js', 'Web Development'),
('Express.js', 'Web Development'),
('Django', 'Web Development'),
('Laravel', 'Web Development'),

-- Mobile Development
('React Native', 'Mobile Development'),
('Flutter', 'Mobile Development'),
('Swift', 'Mobile Development'),
('Kotlin', 'Mobile Development'),
('Xamarin', 'Mobile Development'),

-- Databases
('PostgreSQL', 'Database'),
('MySQL', 'Database'),
('MongoDB', 'Database'),
('Redis', 'Database'),
('Supabase', 'Database'),
('Firebase', 'Database'),

-- Cloud & DevOps
('AWS', 'Cloud'),
('Google Cloud', 'Cloud'),
('Azure', 'Cloud'),
('Docker', 'DevOps'),
('Kubernetes', 'DevOps'),
('CI/CD', 'DevOps'),

-- Design
('Figma', 'Design'),
('Adobe Photoshop', 'Design'),
('Adobe Illustrator', 'Design'),
('Sketch', 'Design'),
('UI/UX Design', 'Design'),

-- Engineering
('AutoCAD', 'Engineering'),
('SolidWorks', 'Engineering'),
('MATLAB', 'Engineering'),
('Revit', 'Engineering'),
('SketchUp', 'Engineering');

-- =====================================================
-- 10. INDEXES FOR PERFORMANCE
-- =====================================================

-- Profiles indexes
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_specialty ON public.profiles(specialty);
CREATE INDEX idx_profiles_availability ON public.profiles(availability);
CREATE INDEX idx_profiles_location ON public.profiles(location);

-- Projects indexes
CREATE INDEX idx_projects_client_id ON public.projects(client_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_category ON public.projects(category);
CREATE INDEX idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX idx_projects_budget ON public.projects(budget_estimate);

-- Proposals indexes
CREATE INDEX idx_proposals_project_id ON public.proposals(project_id);
CREATE INDEX idx_proposals_engineer_id ON public.proposals(engineer_id);
CREATE INDEX idx_proposals_status ON public.proposals(status);
CREATE INDEX idx_proposals_created_at ON public.proposals(created_at DESC);

-- Messages indexes
CREATE INDEX idx_messages_project_id ON public.messages(project_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_messages_is_read ON public.messages(is_read);

-- Reviews indexes
CREATE INDEX idx_reviews_reviewee_id ON public.reviews(reviewee_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);
CREATE INDEX idx_reviews_created_at ON public.reviews(created_at DESC);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- =====================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- NOTA: RLS está DESHABILITADO para facilitar el desarrollo
-- En producción, deberías habilitar RLS para mayor seguridad

-- Para habilitar RLS en el futuro, descomenta estas líneas:
/*
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Anyone can view active projects" ON public.projects FOR SELECT USING (status != 'draft');
CREATE POLICY "Clients can view their own drafts" ON public.projects FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "Clients can insert projects" ON public.projects FOR INSERT WITH CHECK (client_id = auth.uid());
CREATE POLICY "Clients can update their own projects" ON public.projects FOR UPDATE USING (client_id = auth.uid());

-- Proposals policies
CREATE POLICY "Project owners and proposal authors can view proposals" ON public.proposals FOR SELECT USING (
    engineer_id = auth.uid() OR 
    project_id IN (SELECT id FROM public.projects WHERE client_id = auth.uid())
);
CREATE POLICY "Engineers can insert proposals" ON public.proposals FOR INSERT WITH CHECK (engineer_id = auth.uid());
CREATE POLICY "Engineers can update their own proposals" ON public.proposals FOR UPDATE USING (engineer_id = auth.uid());
CREATE POLICY "Project owners can update proposal status" ON public.proposals FOR UPDATE USING (
    project_id IN (SELECT id FROM public.projects WHERE client_id = auth.uid())
);

-- Messages policies
CREATE POLICY "Project participants can view messages" ON public.messages FOR SELECT USING (
    sender_id = auth.uid() OR 
    recipient_id = auth.uid() OR
    project_id IN (SELECT id FROM public.projects WHERE client_id = auth.uid())
);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Reviews policies
CREATE POLICY "Anyone can view public reviews" ON public.reviews FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view their own reviews" ON public.reviews FOR SELECT USING (reviewer_id = auth.uid() OR reviewee_id = auth.uid());
CREATE POLICY "Users can insert reviews" ON public.reviews FOR INSERT WITH CHECK (reviewer_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());
*/

-- =====================================================
-- 12. FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON public.proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_title VARCHAR(255),
    p_message TEXT,
    p_type VARCHAR(50),
    p_project_id UUID DEFAULT NULL,
    p_proposal_id UUID DEFAULT NULL,
    p_message_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO public.notifications (user_id, title, message, type, project_id, proposal_id, message_id)
    VALUES (p_user_id, p_title, p_message, p_type, p_project_id, p_proposal_id, p_message_id)
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'projects_count', (
            SELECT COUNT(*) FROM public.projects WHERE client_id = user_id
        ),
        'proposals_sent', (
            SELECT COUNT(*) FROM public.proposals WHERE engineer_id = user_id
        ),
        'proposals_accepted', (
            SELECT COUNT(*) FROM public.proposals WHERE engineer_id = user_id AND status = 'accepted'
        ),
        'average_rating', (
            SELECT ROUND(AVG(rating), 2) FROM public.reviews WHERE reviewee_id = user_id
        ),
        'total_reviews', (
            SELECT COUNT(*) FROM public.reviews WHERE reviewee_id = user_id
        ),
        'unread_messages', (
            SELECT COUNT(*) FROM public.messages WHERE recipient_id = user_id AND is_read = false
        ),
        'unread_notifications', (
            SELECT COUNT(*) FROM public.notifications WHERE user_id = user_id AND is_read = false
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 13. SAMPLE DATA (Optional - for testing)
-- =====================================================

-- NOTA: Los datos de ejemplo están comentados porque requieren usuarios reales en auth.users
-- Para crear datos de prueba:
-- 1. Primero registra usuarios reales a través de Supabase Auth
-- 2. Luego usa sus UUIDs reales para insertar perfiles

-- Ejemplo de cómo insertar datos después de crear usuarios:
/*
-- Sample client profile
INSERT INTO public.profiles (id, role, full_name, email, phone, company, location, industry) VALUES
('<UUID_REAL_DE_AUTH_USERS>', 'client', 'María García', 'maria@empresa.com', '+34 600 123 456', 'Tech Solutions SL', 'Madrid, España', 'Tecnología');

-- Sample engineer profiles
INSERT INTO public.profiles (id, role, full_name, email, phone, location, specialty, experience_years, hourly_rate, availability, skills) VALUES
('<UUID_REAL_DE_AUTH_USERS>', 'engineer', 'Carlos Rodríguez', 'carlos@ingeniero.com', '+34 600 654 321', 'Barcelona, España', 'Desarrollo Web', 5, 45.00, 'available', ARRAY['JavaScript', 'React', 'Node.js', 'PostgreSQL']),
('<UUID_REAL_DE_AUTH_USERS>', 'engineer', 'Ana Martínez', 'ana@ingeniera.com', '+34 600 789 123', 'Valencia, España', 'Ingeniería Civil', 8, 60.00, 'available', ARRAY['AutoCAD', 'Revit', 'Gestión de Proyectos']);

-- Sample project
INSERT INTO public.projects (id, client_id, title, description, category, budget_estimate, eta_days, location, status) VALUES
('<UUID_GENERADO>', '<UUID_DEL_CLIENTE>', 'Desarrollo de E-commerce', 'Necesito desarrollar una tienda online completa con sistema de pagos y gestión de inventario', 'Desarrollo Web', 5000.00, 30, 'Remoto', 'open');

-- Sample proposal
INSERT INTO public.proposals (id, project_id, engineer_id, bid_amount, eta_days, details, status) VALUES
('<UUID_GENERADO>', '<UUID_DEL_PROYECTO>', '<UUID_DEL_INGENIERO>', 4500.00, 25, 'Propongo desarrollar el e-commerce usando React y Node.js con Stripe para pagos. Incluye diseño responsive y panel de administración.', 'accepted');
*/

-- =====================================================
-- 14. GRANTS AND PERMISSIONS
-- =====================================================

-- Grant permissions to authenticated users
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.projects TO authenticated;
GRANT ALL ON public.proposals TO authenticated;
GRANT ALL ON public.messages TO authenticated;
GRANT ALL ON public.attachments TO authenticated;
GRANT ALL ON public.reviews TO authenticated;
GRANT ALL ON public.notifications TO authenticated;

-- Grant read permissions to reference tables
GRANT SELECT ON public.project_categories TO authenticated, anon;
GRANT SELECT ON public.skills TO authenticated, anon;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =====================================================
-- END OF INGWORK DATABASE SETUP
-- =====================================================

-- To apply this configuration:
-- 1. Copy and paste this SQL into Supabase SQL Editor
-- 2. Execute the script
-- 3. Verify all tables and policies are created
-- 4. Test with sample data
-- 5. Configure your Next.js app with the database URL and keys

COMMENT ON SCHEMA public IS 'IngWork Marketplace Database - Complete setup for connecting clients with engineers';
