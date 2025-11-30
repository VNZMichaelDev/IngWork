# 🔧 INSTRUCCIONES PARA ARREGLAR LA CARGA DE PDFs

## ¿Cuál es el problema?

El error **"new row violates row-level security policy"** ocurre porque:
1. Las políticas RLS (Row Level Security) no están configuradas en Supabase
2. Sin estas políticas, los usuarios no pueden actualizar su propio perfil
3. Por lo tanto, no pueden guardar las URLs de los documentos PDF

## ✅ Solución

Necesitas ejecutar un script SQL en Supabase que configure las políticas RLS.

### Paso 1: Ir a Supabase

1. Abre tu proyecto en [Supabase](https://supabase.com)
2. Ve a **SQL Editor** (en el menú izquierdo)

### Paso 2: Ejecutar el script

1. Haz clic en **New Query**
2. Copia todo el contenido del archivo: `database/add_rls_policies.sql`
3. Pégalo en el editor SQL
4. Haz clic en **Run** (botón azul)

**Espera a que termine** (debería decir "Success" al final)

### Paso 3: Verificar que funcionó

1. Abre la aplicación
2. Regístrate como ingeniero
3. Ve a `/onboarding`
4. Intenta subir un PDF
5. **Debe funcionar sin errores** ✅

---

## 📋 ¿Qué hace el script?

El script configura las políticas RLS para que:

- ✅ Los usuarios puedan **ver todos los perfiles** (lectura pública)
- ✅ Los usuarios puedan **actualizar su propio perfil** (incluidas las URLs de documentos)
- ✅ Los usuarios puedan **crear sus propios favoritos**
- ✅ Los ingenieros puedan **subir sus documentos**
- ✅ Los admins puedan **ver todos los documentos**

---

## 🚀 Después de ejecutar el script

### Opción A: Desarrollo Local
```bash
npm run dev
```

Luego prueba:
1. Registra un ingeniero
2. Ve a `/onboarding`
3. Sube un PDF
4. Debe funcionar ✅

### Opción B: Producción
1. Despliega los cambios de código
2. El script SQL ya está ejecutado en Supabase
3. Los PDFs deben funcionar ✅

---

## ❓ Si aún no funciona

### Opción 1: Verificar que el script se ejecutó
1. Ve a Supabase → SQL Editor
2. Haz clic en **Queries** (historial)
3. Busca la query que ejecutaste
4. Verifica que diga "Success"

### Opción 2: Ejecutar el script de características nuevas
Si no ejecutaste `database/add_new_features.sql` antes, hazlo ahora:

1. Ve a SQL Editor
2. Copia el contenido de `database/add_new_features.sql`
3. Pégalo y ejecuta
4. Luego ejecuta `database/add_rls_policies.sql`

### Opción 3: Verificar la tabla profiles
1. Ve a Supabase → Table Editor
2. Abre la tabla `profiles`
3. Verifica que existan estas columnas:
   - `cv_url`
   - `dni_url`
   - `colegio_carnet_url`
   - `is_admin`
   - `country_code`

Si no existen, ejecuta `database/add_new_features.sql` primero.

---

## 📝 Resumen de cambios

| Archivo | Cambio |
|---------|--------|
| `src/app/dashboard/admin/page.tsx` | ✅ Agrega estadísticas (ingenieros, clientes, verificados) |
| `src/app/dashboard/client/engineers/page.tsx` | ✅ Muestra badge de verificación en lista de ingenieros |
| `database/add_rls_policies.sql` | ✅ NUEVO - Configura políticas RLS para permitir actualizaciones |

---

## 🎯 Checklist Final

- [ ] Ejecuté `database/add_new_features.sql` en Supabase
- [ ] Ejecuté `database/add_rls_policies.sql` en Supabase
- [ ] Probé registrar un ingeniero
- [ ] Probé subir un PDF en `/onboarding`
- [ ] El PDF se subió sin errores ✅
- [ ] El panel admin muestra estadísticas ✅
- [ ] El panel cliente muestra el badge de verificación ✅

---

**¡Listo! Los PDFs deben funcionar ahora.** 🚀
