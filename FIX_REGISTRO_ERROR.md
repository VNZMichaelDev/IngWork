# 🔧 ARREGLAR ERROR DE REGISTRO

## ❌ El Problema

Cuando intentas registrar un nuevo usuario (Professional/Engineer), aparece:

```
Error creando perfil: new row violates row-level security policy for table "profiles"
```

Esto significa que **la política RLS de INSERT está bloqueando el registro**.

---

## ✅ La Solución

Ejecuta este script en Supabase SQL Editor:

```sql
-- Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política 1: SELECT - Todos pueden leer perfiles
CREATE POLICY "profiles_select_all" ON public.profiles
    FOR SELECT
    USING (true);

-- Política 2: INSERT - Usuarios autenticados pueden insertar su propio perfil
CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Política 3: UPDATE - Usuarios pueden actualizar su propio perfil
CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Política 4: UPDATE - Admins pueden actualizar cualquier perfil
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

---

## 🚀 Pasos

1. Ve a **Supabase → SQL Editor**
2. Haz clic en **New Query**
3. **Copia y pega TODO el código anterior**
4. Haz clic en **Run**
5. Espera a que diga **"Success"**
6. **Recarga el navegador** (Ctrl+Shift+R)
7. Intenta registrar un nuevo usuario

---

## ✅ Qué hace el script

- ✅ Elimina todas las políticas antiguas que causan conflictos
- ✅ Crea nuevas políticas limpias:
  - **SELECT**: Todos leen perfiles (público)
  - **INSERT**: Cada usuario inserta su propio perfil (registro)
  - **UPDATE**: Cada usuario actualiza su propio perfil
  - **UPDATE**: Admins pueden actualizar cualquier perfil

---

## 🎉 Resultado

Después de ejecutar el script:
- ✅ El registro funciona correctamente
- ✅ Los usuarios pueden crear su perfil
- ✅ No hay errores de RLS
- ✅ La seguridad se mantiene

---

**Nota**: Este es el script definitivo. Si no funciona, contacta al soporte.
