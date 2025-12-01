-- =====================================================
-- ARREGLAR RLS EN PROFILES
-- =====================================================

-- Primero, eliminar todas las políticas existentes en profiles
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;

-- Habilitar RLS en profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política 1: Todos pueden leer perfiles (público)
CREATE POLICY "profiles_select_all" ON public.profiles
    FOR SELECT
    USING (true);

-- Política 2: Cada usuario puede actualizar su propio perfil
CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Política 3: Cada usuario puede insertar su propio perfil (registro)
CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Política 4: Admins pueden actualizar cualquier perfil
CREATE POLICY "profiles_update_admin" ON public.profiles
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );
