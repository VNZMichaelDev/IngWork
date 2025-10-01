# ConstruMatch - Documentación Técnica

## 🚀 Descripción del Proyecto

**ConstruMatch** es un marketplace digital que conecta clientes con profesionales de la construcción. Desarrollado con Next.js 15, TypeScript, Tailwind CSS y Supabase.

## 📋 Características Principales

- 🔐 **Autenticación completa** con roles (Cliente/Profesional)
- 👥 **Gestión de perfiles** diferenciados por rol
- 📋 **Sistema de proyectos** con publicación y gestión
- 💼 **Propuestas y negociación** entre usuarios
- 💬 **Mensajería en tiempo real**
- ⭐ **Sistema de calificaciones**
- 📱 **Diseño responsive** para móvil, tablet y desktop
- 🔍 **Búsqueda y filtrado** avanzado

## 💻 Stack Tecnológico

### Frontend
- **Next.js 15.5.4** - Framework React con App Router
- **React 18+** - Librería de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS utility-first
- **Lucide React** - Iconos SVG

### Backend & Database
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Base de datos relacional
- **Row Level Security** - Seguridad a nivel de fila
- **Real-time subscriptions** - Actualizaciones en tiempo real

### Deployment
- **Vercel** - Hosting del frontend
- **Supabase Cloud** - Backend y base de datos

## 📁 Estructura del Proyecto

```
construmatch/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── auth/              # Autenticación (login, register)
│   │   ├── dashboard/         # Dashboards por rol
│   │   │   ├── client/        # Dashboard del cliente
│   │   │   └── engineer/      # Dashboard del profesional
│   │   ├── onboarding/        # Configuración inicial
│   │   └── page.tsx           # Landing page
│   ├── components/            # Componentes reutilizables
│   │   ├── ui/               # Componentes base (Button, Input, etc.)
│   │   ├── FileUpload.tsx    # Subida de archivos
│   │   └── ReviewSystem.tsx  # Sistema de calificaciones
│   └── lib/                  # Librerías y utilidades
│       ├── supabase/         # Configuración de Supabase
│       ├── auth.ts           # Funciones de autenticación
│       ├── storage.ts        # Gestión de archivos
│       └── types.ts          # Tipos TypeScript
├── public/                   # Archivos estáticos
├── database/                 # Scripts de base de datos
├── docs/                     # Documentación
└── package.json             # Dependencias
```

## 🗄️ Base de Datos

### Tablas Principales

1. **`profiles`** - Perfiles de usuarios (clientes e ingenieros)
2. **`projects`** - Proyectos publicados por clientes
3. **`proposals`** - Propuestas de ingenieros a proyectos
4. **`messages`** - Sistema de mensajería
5. **`reviews`** - Calificaciones y comentarios
6. **`attachments`** - Archivos adjuntos
7. **`notifications`** - Notificaciones del sistema

### Configuración de Seguridad (RLS)

```sql
-- Los usuarios pueden ver todos los perfiles
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);

-- Solo pueden editar su propio perfil
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Cualquiera puede ver proyectos activos
CREATE POLICY "Anyone can view active projects" ON projects FOR SELECT USING (status != 'draft');

-- Solo participantes pueden ver propuestas
CREATE POLICY "Project participants can view proposals" ON proposals FOR SELECT USING (
    engineer_id = auth.uid() OR 
    project_id IN (SELECT id FROM projects WHERE client_id = auth.uid())
);
```

## 🔐 Autenticación y Roles

### Roles del Sistema

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **Cliente** | Empresas o personas que publican proyectos | - Crear proyectos<br>- Ver propuestas<br>- Contratar profesionales<br>- Calificar trabajo |
| **Profesional** | Especialistas en construcción que ofrecen servicios | - Ver proyectos<br>- Enviar propuestas<br>- Comunicarse con clientes<br>- Gestionar perfil |

### Flujo de Autenticación

1. **Registro** → Selección de rol → Verificación de email
2. **Onboarding** → Completar perfil según rol
3. **Dashboard** → Acceso a funcionalidades específicas del rol

## 🎨 Componentes UI

### Componentes Base (`/components/ui/`)

- **Button** - Botón reutilizable con variantes
- **Input** - Campo de entrada de texto
- **Textarea** - Área de texto multilínea

### Componentes Especializados

- **FileUpload** - Subida de archivos con validación
- **ReviewSystem** - Sistema de calificaciones con estrellas

## 📱 Responsive Design

### Breakpoints

- **Mobile**: `< 640px` (sm)
- **Tablet**: `641px - 1024px` (md/lg)
- **Desktop**: `> 1025px` (xl)

### Características Responsive

- Grid adaptable según dispositivo
- Navegación optimizada para móvil
- Texto y espaciado escalable
- Componentes que se adaptan al tamaño de pantalla

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd construmatch
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Configurar Base de Datos
1. Ir a Supabase Dashboard → SQL Editor
2. Ejecutar el script `database/construmatch_database.sql`
3. Verificar que todas las tablas se crearon correctamente

### 5. Ejecutar en Desarrollo
```bash
npm run dev
```

### 6. Build para Producción
```bash
npm run build
npm start
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run start        # Servidor de producción
npm run lint         # Linting del código
```

## 📊 Funcionalidades por Rol

### Cliente
- ✅ Crear y gestionar proyectos
- ✅ Ver propuestas recibidas
- ✅ Comunicarse con profesionales
- ✅ Contratar y calificar profesionales
- ✅ Gestionar perfil de empresa

### Profesional de Construcción
- ✅ Buscar proyectos de construcción disponibles
- ✅ Enviar propuestas personalizadas
- ✅ Comunicarse con clientes
- ✅ Gestionar perfil profesional
- ✅ Ver historial de trabajos

## 🛠️ Desarrollo

### Estructura de Archivos
- Usar **kebab-case** para nombres de archivos
- Componentes en **PascalCase**
- Funciones en **camelCase**
- Constantes en **UPPER_SNAKE_CASE**

### Convenciones de Código
- **TypeScript** obligatorio para tipado
- **ESLint** para linting
- **Tailwind CSS** para estilos
- **Componentes funcionales** con hooks

### Git Workflow
```bash
git checkout -b feature/nueva-funcionalidad
git add .
git commit -m "feat: agregar nueva funcionalidad"
git push origin feature/nueva-funcionalidad
# Crear Pull Request
```

## 🐛 Troubleshooting

### Problemas Comunes

1. **Error de build**: Verificar configuración de `next.config.js`
2. **Error de Supabase**: Revisar variables de entorno
3. **Error de tipos**: Ejecutar `npm run build` para verificar TypeScript
4. **Error de RLS**: Verificar políticas de seguridad en Supabase

### Logs y Debugging
- **Frontend**: Console del navegador
- **Backend**: Supabase Dashboard → Logs
- **Build**: Terminal con `npm run build`

## 📈 Performance

### Optimizaciones Implementadas
- **Next.js Image** para optimización de imágenes
- **Code splitting** automático
- **Static generation** donde es posible
- **Lazy loading** de componentes
- **Índices de base de datos** optimizados

## 🔒 Seguridad

### Medidas de Seguridad
- **Row Level Security (RLS)** en todas las tablas
- **Validación de entrada** en frontend y backend
- **Autenticación JWT** con Supabase
- **HTTPS** en producción
- **Variables de entorno** para datos sensibles

## 📞 Soporte

Para soporte técnico o preguntas sobre el código:
1. Revisar esta documentación
2. Verificar issues conocidos
3. Consultar documentación de Supabase y Next.js

---

## 📄 Licencia

Este proyecto es privado y propietario.

---

**ConstruMatch - Desarrollado con ❤️ usando Next.js, TypeScript y Supabase**
