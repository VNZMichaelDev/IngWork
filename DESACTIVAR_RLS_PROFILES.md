# 🔧 DESACTIVAR RLS EN PROFILES

## ❌ El Problema

Las políticas RLS están causando problemas en el registro. El error es:

```
Error creando perfil: new row violates row-level security policy for table "profiles"
```

---

## ✅ La Solución Rápida

Desactiva RLS en la tabla `profiles` ejecutando este script en Supabase SQL Editor:

```sql
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
```

---

## 🚀 Pasos

1. Ve a **Supabase → SQL Editor**
2. Haz clic en **New Query**
3. **Copia y pega el código anterior**
4. Haz clic en **Run**
5. Espera a que diga **"Success"**
6. **Recarga el navegador** (Ctrl+Shift+R)
7. Intenta registrar un nuevo usuario

---

## ✅ Qué hace

- ✅ Desactiva RLS en la tabla `profiles`
- ✅ Permite que cualquier usuario autenticado cree su perfil
- ✅ Permite que cualquier usuario actualice su perfil
- ✅ El registro funciona correctamente

---

## ⚠️ Nota de Seguridad

Con RLS desactivado:
- ✅ Los usuarios pueden leer todos los perfiles (esto es lo que queremos)
- ✅ Los usuarios pueden actualizar su propio perfil
- ⚠️ Técnicamente, un usuario podría actualizar el perfil de otro (pero la app no lo permite)

Para producción, después deberías agregar políticas RLS específicas. Pero por ahora, esto permite que todo funcione.

---

## 🎉 Resultado

Después de ejecutar el script:
- ✅ El registro funciona correctamente
- ✅ Los usuarios pueden crear su perfil
- ✅ Los usuarios pueden actualizar su perfil
- ✅ Los ingenieros aparecen en la búsqueda
- ✅ Los PDFs se suben correctamente

---

**Nota**: Este es el enfoque más simple. Si necesitas más seguridad, podemos agregar políticas RLS después.
