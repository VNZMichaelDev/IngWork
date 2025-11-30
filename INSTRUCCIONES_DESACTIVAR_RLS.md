# 🔓 DESACTIVAR RLS - PARA PRESENTACIÓN

## ⚠️ ADVERTENCIA

Este script desactiva **todas las políticas RLS**. 

**SOLO USAR PARA**:
- ✅ Presentaciones
- ✅ Demos
- ✅ Desarrollo local

**NO USAR EN**:
- ❌ Producción
- ❌ Datos reales
- ❌ Aplicaciones públicas

---

## 🚀 CÓMO EJECUTAR

### Paso 1: Ve a Supabase
1. Abre https://supabase.com
2. Ve a tu proyecto
3. Ve a **SQL Editor**

### Paso 2: Ejecuta el script
1. Haz clic en **New Query**
2. Copia el contenido de: `database/disable_rls_all.sql`
3. Pégalo en el editor
4. Haz clic en **Run**
5. Espera a que diga **"Success"**

### Paso 3: Listo
Ahora todos los PDFs deberían funcionar sin problemas.

---

## ✅ Verificación

Después de ejecutar el script:

1. **Abre la app**
   ```
   npm run dev
   ```

2. **Prueba los PDFs**
   ```
   URL: http://localhost:3000/onboarding
   1. Registra un ingeniero
   2. Intenta subir un PDF
   3. Debe funcionar sin errores ✅
   ```

3. **Prueba el panel admin**
   ```
   URL: http://localhost:3000/dashboard/admin
   ✓ Debe mostrar estadísticas
   ```

4. **Prueba el panel cliente**
   ```
   URL: http://localhost:3000/dashboard/client/engineers
   ✓ Debe mostrar badges de verificación
   ```

---

## 📊 Qué hace el script

Desactiva RLS en estas tablas:
- `profiles` - Perfiles de usuarios
- `favorites` - Favoritos
- `engineer_documents` - Documentos de ingenieros
- `reviews` - Reseñas
- `projects` - Proyectos
- `proposals` - Propuestas
- `messages` - Mensajes
- `attachments` - Archivos adjuntos

Sin RLS, **cualquiera puede acceder a cualquier dato** sin restricciones.

---

## 🎯 Para la presentación

Con RLS desactivado:
- ✅ Los PDFs funcionan perfectamente
- ✅ No hay errores de seguridad
- ✅ Todo es más rápido
- ✅ Perfecto para demo

---

## ⚠️ Después de la presentación

Si quieres volver a activar RLS:

1. Ejecuta: `database/add_rls_policies.sql`
2. O crea políticas personalizadas según necesites

---

**Nota**: Este script es solo para desarrollo/presentación. No lo uses en producción.
