# IngWork - Guía de Configuración

## 📋 Prerrequisitos

- Node.js 18+ instalado
- Cuenta de Supabase configurada
- Git instalado

## 🚀 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 3. Configurar la base de datos en Supabase

1. Ve a tu proyecto en Supabase
2. Abre el SQL Editor
3. Ejecuta el script completo de `database/ingwork_database.sql`
4. Verifica que todas las tablas se hayan creado correctamente:
   - profiles
   - projects
   - proposals
   - messages
   - attachments
   - reviews
   - notifications
   - project_categories
   - skills

### 4. Ejecutar el proyecto en desarrollo

```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:3000`

## 📝 Cambios Recientes Implementados

### ✅ 1. Corrección del error de creación de proyectos
- Eliminado el campo `privacy` que no existía en la base de datos
- Los proyectos ahora se crean con status `"open"` por defecto
- Archivos modificados:
  - `src/app/dashboard/client/projects/new/page.tsx`
  - `src/app/dashboard/engineer/page.tsx`

### ✅ 2. Cambio de "Tarifa por hora" a "Carnet de colegiatura"
- Cambio visual únicamente (el campo interno sigue siendo `hourly_rate`)
- Ahora acepta texto en lugar de números
- Archivos modificados:
  - `src/app/onboarding/page.tsx`
  - `src/app/dashboard/engineer/profile/page.tsx`

### ✅ 3. Campos adicionales en registro de clientes
- Agregados campos de teléfono y ubicación para clientes
- Los campos aparecen solo cuando se selecciona el rol "Cliente"
- Archivo modificado:
  - `src/app/auth/register/page.tsx`

### ✅ 4. Sistema de calificación con estrellas
- Componente de calificación interactivo de 1-5 estrellas
- Modal para calificar profesionales
- Integración con la tabla `reviews` de Supabase
- Archivos creados:
  - `src/components/ui/star-rating.tsx`
  - `src/components/ui/rating-modal.tsx`

## 🗂️ Estructura de la Base de Datos

### Tablas principales:

1. **profiles**: Perfiles de usuarios (clientes e ingenieros)
2. **projects**: Proyectos publicados por clientes
3. **proposals**: Propuestas de ingenieros para proyectos
4. **messages**: Mensajes entre clientes e ingenieros
5. **attachments**: Archivos adjuntos
6. **reviews**: Calificaciones y reseñas (1-5 estrellas)
7. **notifications**: Notificaciones del sistema
8. **project_categories**: Categorías de proyectos
9. **skills**: Habilidades técnicas

## 🔧 Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Ejecutar en producción
- `npm run lint` - Verificar código con ESLint

## 📦 Para subir a Git

```bash
# Agregar todos los cambios
git add .

# Hacer commit
git commit -m "feat: Implementar correcciones y mejoras del sistema"

# Subir a GitHub
git push origin main
```

## ⚠️ Notas Importantes

1. **Variables de entorno**: Asegúrate de NO subir el archivo `.env.local` a Git (ya está en `.gitignore`)
2. **Base de datos**: Verifica que todas las tablas estén creadas en Supabase antes de ejecutar la aplicación
3. **Dependencias**: Ejecuta `npm install` después de clonar el repositorio
4. **TypeScript**: Los errores de lint que aparecen en el IDE son normales y desaparecerán después de ejecutar `npm install`

## 🎯 Funcionalidades Principales

- ✅ Registro y autenticación de usuarios (clientes e ingenieros)
- ✅ Creación y gestión de proyectos
- ✅ Sistema de propuestas
- ✅ Mensajería entre usuarios
- ✅ Sistema de calificaciones con estrellas
- ✅ Perfiles personalizables
- ✅ Dashboard diferenciado por rol

## 📞 Soporte

Si encuentras algún problema, verifica:
1. Que todas las dependencias estén instaladas
2. Que las variables de entorno estén configuradas correctamente
3. Que la base de datos en Supabase esté configurada
4. Que estés usando Node.js 18 o superior
