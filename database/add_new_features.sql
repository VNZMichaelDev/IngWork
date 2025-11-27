-- =====================================================
-- NUEVAS FUNCIONALIDADES - SCRIPT DE ACTUALIZACIÓN
-- =====================================================

-- 1. Agregar campos a tabla profiles para documentos de ingeniero
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cv_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS dni_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS colegio_carnet_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country_code VARCHAR(5) DEFAULT 'PE';

-- 2. Crear tabla de favoritos
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    favorited_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, favorited_user_id),
    CHECK (user_id != favorited_user_id)
);

-- 3. Crear tabla de documentos de ingeniero (para mejor auditoría)
CREATE TABLE IF NOT EXISTS public.engineer_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    engineer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Document URLs
    cv_url TEXT,
    dni_url TEXT,
    colegio_carnet_url TEXT,
    
    -- Status
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    verification_notes TEXT,
    
    -- Dates
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    UNIQUE(engineer_id)
);

-- 4. Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_favorited_user_id ON public.favorites(favorited_user_id);
CREATE INDEX IF NOT EXISTS idx_engineer_documents_engineer_id ON public.engineer_documents(engineer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON public.profiles(is_verified);

-- 5. Crear vista para ingenieros verificados
CREATE OR REPLACE VIEW public.verified_engineers AS
SELECT 
    p.id,
    p.full_name,
    p.email,
    p.phone,
    p.specialty,
    p.experience_years,
    p.avatar_url,
    p.is_verified,
    ed.verified_at,
    ed.verification_notes
FROM public.profiles p
LEFT JOIN public.engineer_documents ed ON p.id = ed.engineer_id
WHERE p.role = 'engineer' AND p.is_verified = TRUE;

-- 6. Crear función para validar teléfono peruano
CREATE OR REPLACE FUNCTION validate_peruvian_phone(phone_number VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    -- Validar formato: +51 9XX XXX XXXX o 9XX XXX XXXX
    RETURN phone_number ~ '^\+?51\s?9\d{8}$' OR phone_number ~ '^9\d{8}$';
END;
$$ LANGUAGE plpgsql;

-- 7. Agregar comentarios a las nuevas columnas
COMMENT ON COLUMN public.profiles.cv_url IS 'URL del CV en Supabase Storage';
COMMENT ON COLUMN public.profiles.dni_url IS 'URL de la copia del DNI en Supabase Storage';
COMMENT ON COLUMN public.profiles.colegio_carnet_url IS 'URL del carnet de colegio de ingenieros en Supabase Storage';
COMMENT ON COLUMN public.profiles.is_admin IS 'Indica si el usuario es administrador del sistema';
COMMENT ON COLUMN public.profiles.country_code IS 'Código de país del usuario (PE para Perú)';

COMMENT ON TABLE public.favorites IS 'Tabla de favoritos entre usuarios';
COMMENT ON TABLE public.engineer_documents IS 'Documentos verificables de ingenieros';
