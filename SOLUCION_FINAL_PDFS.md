# ✅ SOLUCIÓN FINAL - PDFs

## 🎯 El Problema

El error "new row violates row-level security policy" ocurre porque:
1. RLS está **habilitado** en la tabla `profiles`
2. Las políticas RLS **no permiten** que los usuarios actualicen su propio perfil
3. Cuando intentas guardar los PDFs, falla la actualización

## ✅ La Solución

Necesitas ejecutar **UNA SOLA VEZ** este script SQL en Supabase:

```sql
-- Copiar y pegar EXACTAMENTE esto en SQL Editor

DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_all" ON public.profiles
    FOR SELECT
    USING (true);

CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

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
```

## 🚀 Pasos

### 1. Ve a Supabase SQL Editor
```
1. Abre https://supabase.com
2. Ve a tu proyecto
3. SQL Editor → New Query
```

### 2. Copia y pega el script
- Copia TODO el código SQL anterior
- Pégalo en el editor
- Haz clic en **Run**
- Espera a que diga **"Success"**

### 3. Recarga la app
```
1. Cierra el navegador completamente
2. Abre de nuevo
3. Ve a http://localhost:3000/onboarding
4. Inicia sesión
5. Intenta subir un PDF
```

## ✅ Qué hace el script

- ✅ Elimina políticas RLS antiguas que causaban problemas
- ✅ Crea nuevas políticas que permiten:
  - Todos leen perfiles (público)
  - Cada usuario actualiza su propio perfil
  - Cada usuario inserta su propio perfil (registro)
  - Admins pueden actualizar cualquier perfil
- ✅ Mantiene seguridad: cada usuario solo puede actualizar su propio perfil

## 🎉 Resultado

Después de ejecutar el script:
- ✅ Los PDFs se suben correctamente
- ✅ El perfil se actualiza con las URLs
- ✅ No hay errores de RLS
- ✅ La seguridad se mantiene

---

**Nota**: Este es el script correcto. Si no funciona, contacta al soporte.
