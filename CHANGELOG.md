# Changelog

Todos los cambios notables del proyecto IngWork serán documentados en este archivo.

## [1.1.0] - 2024-11-05

### ✅ Corregido

#### 1. Error al crear proyectos
- **Problema**: Error "Could not find the 'privacy' column of 'projects' in the schema cache"
- **Causa**: El formulario intentaba insertar un campo `privacy` que no existe en la tabla `projects`
- **Solución**: 
  - Eliminado el campo `privacy` del formulario de creación de proyectos
  - Eliminado el estado local `privacy` del componente
  - Eliminado el filtro por `privacy` en el dashboard del ingeniero
  - Cambiado el status por defecto de `"pending"` a `"open"`
- **Archivos modificados**:
  - `src/app/dashboard/client/projects/new/page.tsx`
  - `src/app/dashboard/engineer/page.tsx`

#### 2. Cambio de "Tarifa por hora" a "Carnet de colegiatura"
- **Requerimiento**: Cambiar el label del campo de tarifa por hora a "Carnet de colegiatura"
- **Implementación**:
  - Cambio **solo visual** - el campo interno sigue siendo `hourly_rate` en la base de datos
  - Cambiado el tipo de input de `number` a `text` para aceptar formatos como "CIP-12345"
  - Actualizado el placeholder a "Ej: CIP-12345"
- **Archivos modificados**:
  - `src/app/onboarding/page.tsx` (líneas 195-206)
  - `src/app/dashboard/engineer/profile/page.tsx` (líneas 268-279)

#### 3. Campos adicionales en registro de clientes
- **Requerimiento**: Agregar campos de teléfono y ubicación en el registro de clientes
- **Implementación**:
  - Agregados estados locales `phone` y `location`
  - Campos condicionales que solo aparecen cuando `role === "client"`
  - Los datos se guardan automáticamente en el perfil al registrarse
  - Campos opcionales (no requeridos)
- **Archivos modificados**:
  - `src/app/auth/register/page.tsx` (líneas 21-22, 67-71, 179-207)

### ✨ Nuevo

#### 4. Sistema de calificación con estrellas
- **Descripción**: Sistema completo de calificaciones de 1-5 estrellas para proyectos
- **Componentes creados**:
  - `src/components/ui/star-rating.tsx` - Componente reutilizable de estrellas
    - Soporte para modo lectura y modo edición
    - Tres tamaños: sm, md, lg
    - Animaciones hover y transiciones suaves
    - Indicador de calificación actual
  - `src/components/ui/rating-modal.tsx` - Modal para calificar profesionales
    - Formulario con calificación de estrellas
    - Campo de comentario opcional (máximo 500 caracteres)
    - Validación de campos requeridos
    - Integración con tabla `reviews` de Supabase
    - Manejo de errores y estados de carga
- **Características**:
  - Calificación interactiva con hover effect
  - Contador de caracteres en comentarios
  - Validación de calificación obligatoria
  - Diseño responsive y moderno
  - Integración completa con la base de datos

### 📝 Documentación

- Actualizado `README.md` con información completa del proyecto
- Creado `SETUP.md` con guía detallada de instalación y configuración
- Creado `.env.example` con template de variables de entorno
- Actualizado `.gitignore` con exclusiones completas para Next.js
- Creado `CHANGELOG.md` para documentar cambios

### 🔧 Configuración

- Actualizado `.gitignore` para incluir:
  - Archivos de entorno (`.env*.local`)
  - Archivos de build y cache
  - Archivos de IDE (VSCode, IntelliJ)
  - Archivos del sistema operativo
  - Logs de npm/yarn

---

## [1.0.0] - 2024-11-01

### ✨ Lanzamiento Inicial

- Sistema de autenticación con Supabase
- Registro diferenciado por roles (Cliente/Ingeniero)
- Dashboard para clientes
- Dashboard para ingenieros
- Sistema de proyectos
- Sistema de propuestas
- Mensajería entre usuarios
- Gestión de perfiles
- Base de datos completa en Supabase

---

## Formato

Este changelog sigue el formato de [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

### Tipos de cambios

- **✨ Nuevo** - para nuevas funcionalidades
- **🔄 Cambiado** - para cambios en funcionalidades existentes
- **⚠️ Deprecado** - para funcionalidades que serán eliminadas
- **🗑️ Eliminado** - para funcionalidades eliminadas
- **✅ Corregido** - para corrección de bugs
- **🔒 Seguridad** - para vulnerabilidades de seguridad
