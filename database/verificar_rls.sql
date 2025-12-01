-- =====================================================
-- VERIFICAR ESTADO DE RLS
-- =====================================================

-- Ver si RLS está habilitado en profiles
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('profiles', 'engineer_documents', 'favorites', 'projects', 'proposals', 'messages', 'attachments', 'reviews')
ORDER BY tablename;

-- Si rowsecurity = true, significa que RLS está HABILITADO
-- Si rowsecurity = false, significa que RLS está DESHABILITADO
