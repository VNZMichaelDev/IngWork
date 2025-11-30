-- =====================================================
-- DESACTIVAR RLS EN TODAS LAS TABLAS
-- =====================================================
-- SOLO PARA DESARROLLO/PRESENTACIÓN
-- NO USAR EN PRODUCCIÓN

-- Desactivar RLS en profiles
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Desactivar RLS en favorites
ALTER TABLE public.favorites DISABLE ROW LEVEL SECURITY;

-- Desactivar RLS en engineer_documents
ALTER TABLE public.engineer_documents DISABLE ROW LEVEL SECURITY;

-- Desactivar RLS en reviews (si existe)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reviews') THEN
        ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
    END IF;
END
$$;

-- Desactivar RLS en projects
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;

-- Desactivar RLS en proposals
ALTER TABLE public.proposals DISABLE ROW LEVEL SECURITY;

-- Desactivar RLS en messages
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;

-- Desactivar RLS en attachments
ALTER TABLE public.attachments DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- LISTO
-- =====================================================
-- Todas las tablas ahora permiten acceso sin restricciones
-- Los PDFs deberían funcionar sin problemas
