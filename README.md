# 🏗️ IngWork (ConstruMatch)

**Marketplace para conectar Clientes con Profesionales de la Construcción e Ingeniería**

Stack: Next.js 15 (App Router, TypeScript, Tailwind CSS 4), Supabase (Auth/DB/Storage/Realtime)

---

## 📋 Requisitos

- Node.js 18+
- Cuenta en Supabase
- Git instalado

---

## 🚀 Configuración Local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env.local` y completa con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
```

### 3. Configurar Base de Datos en Supabase

1. Crea un proyecto en Supabase
2. Ve al SQL Editor
3. Ejecuta el script completo de `database/ingwork_database.sql`
4. Verifica que se crearon todas las tablas:
   - profiles
   - projects
   - proposals
   - messages
   - attachments
   - reviews
   - notifications
   - project_categories
   - skills

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre http://localhost:3000

---

## ✅ Funcionalidades Implementadas

### 🔐 Autenticación
- Registro de usuarios (Cliente / Ingeniero)
- Login con email y contraseña
- Gestión de sesiones con Supabase Auth
- Onboarding diferenciado por rol

### 👤 Perfiles
- **Clientes**: nombre, email, teléfono, ubicación, empresa
- **Ingenieros**: nombre, especialidad, años de experiencia, carnet de colegiatura, disponibilidad, habilidades, portfolio

### 📋 Proyectos
- Creación de proyectos por clientes
- Listado de proyectos abiertos para ingenieros
- Estados: draft, open, in_progress, completed, cancelled
- Categorías predefinidas
- Presupuesto estimado y tiempo de entrega

### 💼 Propuestas
- Ingenieros pueden enviar propuestas a proyectos
- Clientes pueden aceptar/rechazar propuestas
- Sistema de negociación
- Estados: sent, viewed, accepted, rejected, negotiating, withdrawn

### 💬 Mensajería
- Chat entre cliente e ingeniero por proyecto
- Mensajes en tiempo real
- Soporte para archivos adjuntos

### ⭐ Sistema de Calificaciones
- Calificación de 1-5 estrellas
- Comentarios opcionales
- Calificaciones por categorías (comunicación, calidad, puntualidad, profesionalismo)

### 🔔 Notificaciones
- Notificaciones de propuestas
- Notificaciones de mensajes
- Actualizaciones de proyectos

---

## 🛠️ Correcciones Recientes (Nov 2024)

### ✅ 1. Error al crear proyectos
**Problema**: Error "Could not find the 'privacy' column"
**Solución**: Eliminado campo `privacy` inexistente, proyectos ahora se crean con status `"open"`

### ✅ 2. Cambio de "Tarifa por hora" a "Carnet de colegiatura"
**Cambio visual**: El campo ahora se llama "Carnet de colegiatura" (ej: CIP-12345)
**Nota**: Internamente sigue siendo `hourly_rate` en la BD

### ✅ 3. Campos adicionales en registro de clientes
**Agregados**: Teléfono y ubicación en el formulario de registro para clientes

### ✅ 4. Sistema de calificación con estrellas
**Componentes nuevos**: 
- `StarRating` - Componente de estrellas interactivo
- `RatingModal` - Modal para calificar profesionales

---

## 📁 Estructura del Proyecto

```
ingwork/
├── src/
│   ├── app/
│   │   ├── auth/          # Login y registro
│   │   ├── dashboard/     # Dashboards por rol
│   │   │   ├── client/    # Panel de cliente
│   │   │   └── engineer/  # Panel de ingeniero
│   │   ├── onboarding/    # Completar perfil
│   │   └── page.tsx       # Landing page
│   ├── components/
│   │   └── ui/            # Componentes reutilizables
│   └── lib/
│       ├── auth.ts        # Funciones de autenticación
│       └── supabase/      # Clientes de Supabase
├── database/
│   └── ingwork_database.sql  # Schema completo
├── .env.example           # Template de variables de entorno
└── SETUP.md              # Guía detallada de configuración
```

---

## 🗂️ Base de Datos

### Tablas Principales

| Tabla | Descripción |
|-------|-------------|
| `profiles` | Perfiles de usuarios (clientes e ingenieros) |
| `projects` | Proyectos publicados por clientes |
| `proposals` | Propuestas de ingenieros |
| `messages` | Mensajes entre usuarios |
| `attachments` | Archivos adjuntos |
| `reviews` | Calificaciones y reseñas (1-5 estrellas) |
| `notifications` | Notificaciones del sistema |
| `project_categories` | Categorías de proyectos |
| `skills` | Habilidades técnicas |

---

## 🚢 Deploy a Producción

### Opción 1: Vercel (Recomendado)

1. Sube el código a GitHub
2. Conecta tu repositorio en Vercel
3. Configura las variables de entorno en Vercel
4. Deploy automático

### Opción 2: Otro hosting

```bash
npm run build
npm run start
```

---

## 📜 Scripts Disponibles

```bash
npm run dev      # Desarrollo con Turbopack
npm run build    # Build para producción
npm run start    # Ejecutar en producción
npm run lint     # Verificar código
```

---

## 📚 Documentación Adicional

- [SETUP.md](./SETUP.md) - Guía detallada de configuración
- [database/ingwork_database.sql](./database/ingwork_database.sql) - Schema de la base de datos

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es privado y confidencial.

---

## 🆘 Soporte

Si encuentras problemas:
1. Verifica que todas las dependencias estén instaladas (`npm install`)
2. Confirma que las variables de entorno estén configuradas
3. Asegúrate de que la base de datos en Supabase esté configurada correctamente
4. Revisa la consola del navegador y los logs del servidor para errores específicos

Para más detalles, consulta [SETUP.md](./SETUP.md)
