# 📋 PLAN DE IMPLEMENTACIÓN - NUEVAS FUNCIONALIDADES

## 🎯 Resumen de Cambios Solicitados

### 1. **Carga de Documentos en Registro de Ingeniero**
**Ubicación**: `src/app/onboarding/engineer-onboarding.tsx`
- CV (PDF)
- Copia de DNI (PDF)
- Carnet de Colegio de Ingenieros (PDF)
- Vista previa de documentos

**Base de Datos**: Agregar campos a tabla `profiles` o crear tabla `engineer_documents`
- `cv_url` (TEXT)
- `dni_url` (TEXT)
- `colegio_carnet_url` (TEXT)

**Almacenamiento**: Supabase Storage (bucket: `engineer-documents`)

---

### 2. **Panel de Administrador General**
**Ubicación**: `src/app/dashboard/admin/` (NUEVA)
- Acceso total a todos los registros
- Módulo de ingenieros
- Módulo de clientes
- Módulo de revisión de documentos

**Rutas**:
- `/dashboard/admin` - Panel principal
- `/dashboard/admin/engineers` - Listado de ingenieros con documentos
- `/dashboard/admin/clients` - Listado de clientes
- `/dashboard/admin/documents` - Revisión de documentos

**Base de Datos**: Agregar rol `admin` a tabla `profiles`

---

### 3. **Sistema de Verificación (Check Azul)**
**Ubicación**: Panel de admin
- Verificar que ingeniero cumple requisitos
- Asignar badge "Verificado" (check azul)
- Campo `is_verified` ya existe en `profiles`

**Implementación**:
- Botón "Verificar" en panel de admin
- Actualizar `is_verified = TRUE` en profiles
- Mostrar badge en perfil del ingeniero

---

### 4. **Integración WhatsApp**
**Ubicación**: Botón "Contactar" en perfiles de ingenieros
- Generar enlace WhatsApp dinámico
- Validar que usuario sea de Perú (código +51)
- Usar campo `phone` existente en `profiles`

**Implementación**:
- Validar formato de teléfono peruano
- Generar URL: `https://wa.me/51XXXXXXXXX`
- Redirigir al hacer click en "Contactar"

---

### 5. **Sistema de Favoritos**
**Ubicación**: Perfiles de ingenieros y proyectos
- Usuarios pueden marcar favoritos
- Ingenieros pueden marcar favoritos

**Base de Datos**: Nueva tabla `favorites`
```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  favorited_user_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP
)
```

**Componentes**:
- Botón corazón en perfiles
- Sección "Mis Favoritos" en dashboard

---

### 6. **Sistema de Reseñas y Calificaciones**
**Ubicación**: Tabla `reviews` ya existe
- Calificación de 1-5 estrellas (ya implementado)
- Ambos usuarios pueden calificar
- Mostrar reseñas en perfiles

**Mejoras**:
- Componente `StarRating` mejorado
- Mostrar promedio de calificaciones
- Filtrar por tipo de calificación

---

## 📊 ESTRUCTURA DE CAMBIOS

### Base de Datos
1. Agregar campos a `profiles`:
   - `cv_url` (TEXT)
   - `dni_url` (TEXT)
   - `colegio_carnet_url` (TEXT)
   - `is_admin` (BOOLEAN)

2. Nueva tabla `favorites`

3. Actualizar tabla `reviews` si es necesario

### Frontend
1. **Onboarding de Ingeniero**: Agregar carga de archivos
2. **Panel de Admin**: Crear módulo completo
3. **Perfiles**: Mostrar verificación, favoritos, reseñas
4. **Botón Contactar**: Integración WhatsApp

### API/Backend
1. Endpoints para carga de documentos
2. Endpoints para panel de admin
3. Endpoints para favoritos
4. Endpoints para validación de teléfono

---

## 🔄 ORDEN DE IMPLEMENTACIÓN

1. ✅ Actualizar schema de BD
2. ✅ Crear tabla `favorites`
3. ✅ Agregar carga de documentos en onboarding
4. ✅ Crear panel de admin
5. ✅ Implementar sistema de verificación
6. ✅ Integrar WhatsApp
7. ✅ Implementar favoritos
8. ✅ Mejorar sistema de reseñas

---

## 🔐 Consideraciones de Seguridad

- Solo admin puede acceder a `/dashboard/admin`
- Validar rol en backend
- Archivos solo accesibles por usuario propietario
- Validar formato de teléfono peruano
- Encriptar datos sensibles (DNI)

---

## 📱 Validación de Teléfono Peruano

```
Formato: +51 9XX XXX XXXX
Validación: Debe empezar con 51 (código país)
```
