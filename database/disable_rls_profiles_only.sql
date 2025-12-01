-- =====================================================
-- DESACTIVAR RLS EN PROFILES TEMPORALMENTE
-- =====================================================
-- Esto es temporal para que funcione el registro
-- Después se pueden agregar políticas específicas

ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
