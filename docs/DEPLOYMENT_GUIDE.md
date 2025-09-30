# IngWork - Guía de Deployment

## 📋 Tabla de Contenidos

1. [Preparación para Deployment](#preparación-para-deployment)
2. [Configuración de Supabase](#configuración-de-supabase)
3. [Deployment en Vercel](#deployment-en-vercel)
4. [Variables de Entorno](#variables-de-entorno)
5. [Configuración de Dominio](#configuración-de-dominio)
6. [Monitoreo y Logs](#monitoreo-y-logs)
7. [Backup y Seguridad](#backup-y-seguridad)
8. [Troubleshooting](#troubleshooting)

---

## 🚀 Preparación para Deployment

### 1. Verificar Build Local
```bash
# Limpiar cache
rm -rf .next
npm install

# Verificar que el build funciona
npm run build
npm start
```

### 2. Checklist Pre-Deployment
- ✅ Todas las funcionalidades probadas localmente
- ✅ Build exitoso sin errores
- ✅ Variables de entorno configuradas
- ✅ Base de datos configurada en Supabase
- ✅ Archivos estáticos optimizados
- ✅ SEO básico implementado

### 3. Optimizaciones de Performance
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizaciones de imagen
  images: {
    domains: ['supabase.co', 'your-supabase-project.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Compresión
  compress: true,
  
  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig;
```

---

## 🗄️ Configuración de Supabase

### 1. Crear Proyecto en Supabase Cloud

1. **Ir a** [supabase.com](https://supabase.com)
2. **Crear cuenta** o iniciar sesión
3. **Crear nuevo proyecto**:
   - Nombre: `ingwork-production`
   - Región: Elegir la más cercana a tus usuarios
   - Plan: Pro (recomendado para producción)

### 2. Configurar Base de Datos

```sql
-- Ejecutar en Supabase SQL Editor
-- Copiar y pegar el contenido completo de database/ingwork_database.sql
```

### 3. Configurar Storage

```sql
-- Crear buckets de storage
INSERT INTO storage.buckets (id, name, public) VALUES 
('avatars', 'avatars', true),
('project-files', 'project-files', false),
('attachments', 'attachments', false);

-- Políticas de storage para avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Políticas para archivos de proyecto
CREATE POLICY "Project files accessible to participants" ON storage.objects FOR SELECT USING (
  bucket_id = 'project-files' AND (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id::text = (storage.foldername(name))[2] 
      AND client_id = auth.uid()
    )
  )
);
```

### 4. Configurar Autenticación

1. **Settings → Authentication**
2. **Configurar providers**:
   - Email: Habilitado
   - Confirm email: Habilitado
   - Secure email change: Habilitado

3. **Email Templates**:
   - Personalizar templates de confirmación
   - Configurar dominio de envío

4. **URL Configuration**:
   - Site URL: `https://tu-dominio.com`
   - Redirect URLs: `https://tu-dominio.com/auth/callback`

### 5. Obtener Credenciales

```bash
# En Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-muy-larga
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

---

## ▲ Deployment en Vercel

### 1. Preparar Repositorio

```bash
# Inicializar Git si no está hecho
git init
git add .
git commit -m "Initial commit"

# Subir a GitHub
git remote add origin https://github.com/tu-usuario/ingwork.git
git branch -M main
git push -u origin main
```

### 2. Conectar con Vercel

1. **Ir a** [vercel.com](https://vercel.com)
2. **Importar proyecto** desde GitHub
3. **Configurar proyecto**:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3. Configurar Variables de Entorno

En Vercel Dashboard → Settings → Environment Variables:

```bash
# Variables de producción
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Variables opcionales
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### 4. Configurar Dominio Personalizado

1. **Vercel Dashboard → Domains**
2. **Agregar dominio**: `tu-dominio.com`
3. **Configurar DNS**:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

### 5. Deploy

```bash
# Deploy automático con cada push a main
git add .
git commit -m "Deploy to production"
git push origin main
```

---

## 🔧 Variables de Entorno

### Desarrollo (.env.local)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-local-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Desarrollo
NODE_ENV=development
```

### Producción (Vercel)
```bash
# Supabase Production
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-production-anon-key
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Producción
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### Staging (Opcional)
```bash
# Supabase Staging
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-staging.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-staging-anon-key
NEXT_PUBLIC_APP_URL=https://tu-dominio-staging.vercel.app

# Staging
NODE_ENV=staging
```

---

## 🌐 Configuración de Dominio

### 1. Comprar Dominio
- Recomendados: Namecheap, GoDaddy, Google Domains
- Ejemplo: `ingwork.com`

### 2. Configurar DNS

#### Para Vercel:
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

#### Para subdominios:
```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

### 3. Configurar SSL
- Vercel maneja SSL automáticamente
- Certificados Let's Encrypt renovados automáticamente

### 4. Redirecciones
```javascript
// next.config.js
async redirects() {
  return [
    {
      source: '/home',
      destination: '/',
      permanent: true,
    },
    {
      source: '/dashboard',
      destination: '/dashboard/client',
      permanent: false,
    },
  ]
}
```

---

## 📊 Monitoreo y Logs

### 1. Vercel Analytics
```javascript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. Vercel Speed Insights
```javascript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### 3. Supabase Logs
- **Dashboard → Logs**
- Monitorear queries lentas
- Verificar errores de autenticación
- Revisar uso de storage

### 4. Error Tracking (Opcional)
```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

---

## 🔒 Backup y Seguridad

### 1. Backup de Base de Datos

#### Backup Automático (Supabase Pro)
- Backups diarios automáticos
- Retención de 7 días
- Point-in-time recovery

#### Backup Manual
```sql
-- Exportar datos críticos
COPY profiles TO '/tmp/profiles_backup.csv' DELIMITER ',' CSV HEADER;
COPY projects TO '/tmp/projects_backup.csv' DELIMITER ',' CSV HEADER;
COPY proposals TO '/tmp/proposals_backup.csv' DELIMITER ',' CSV HEADER;
```

### 2. Configuración de Seguridad

#### Headers de Seguridad
```javascript
// next.config.js
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains',
        },
      ],
    },
  ]
}
```

#### Rate Limiting (Supabase)
```sql
-- Configurar rate limiting en Supabase
-- Dashboard → Settings → API → Rate Limiting
```

### 3. Monitoreo de Seguridad
- Revisar logs de autenticación
- Monitorear intentos de acceso fallidos
- Configurar alertas para actividad sospechosa

---

## 🛠️ Troubleshooting

### Problemas Comunes

#### 1. Build Failures
```bash
# Error: Module not found
npm install
npm run build

# Error: TypeScript
npx tsc --noEmit

# Error: ESLint
npm run lint -- --fix
```

#### 2. Variables de Entorno
```bash
# Verificar variables en Vercel
vercel env ls

# Agregar variable
vercel env add NEXT_PUBLIC_SUPABASE_URL

# Redeploy después de cambiar variables
vercel --prod
```

#### 3. Errores de Supabase
```javascript
// Verificar conexión
const supabase = createSupabaseBrowserClient();
const { data, error } = await supabase.from('profiles').select('count');
console.log('Connection test:', { data, error });
```

#### 4. Problemas de CORS
```javascript
// Verificar URL en Supabase Dashboard
// Settings → API → URL Configuration
// Site URL: https://tu-dominio.com
```

#### 5. Errores de SSL
```bash
# Verificar certificado
curl -I https://tu-dominio.com

# Forzar renovación en Vercel
# Dashboard → Domains → Refresh SSL
```

### Logs Útiles

#### Vercel Logs
```bash
# Ver logs en tiempo real
vercel logs --follow

# Ver logs de función específica
vercel logs --function=api/auth
```

#### Supabase Logs
```sql
-- Ver queries lentas
SELECT * FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Ver conexiones activas
SELECT * FROM pg_stat_activity;
```

### Comandos de Emergencia

#### Rollback en Vercel
```bash
# Ver deployments
vercel ls

# Rollback a deployment anterior
vercel rollback [deployment-url]
```

#### Restaurar Base de Datos
```bash
# En Supabase Dashboard
# Settings → Database → Backups → Restore
```

---

## 📈 Optimización Post-Deployment

### 1. Performance
- Monitorear Core Web Vitals
- Optimizar imágenes con Next.js Image
- Implementar caching estratégico
- Usar CDN para assets estáticos

### 2. SEO
- Configurar sitemap.xml
- Implementar meta tags dinámicos
- Configurar robots.txt
- Agregar structured data

### 3. Analytics
- Google Analytics 4
- Vercel Analytics
- Supabase Analytics
- Custom events tracking

### 4. Escalabilidad
- Monitorear uso de base de datos
- Configurar alertas de performance
- Planificar upgrades de plan
- Implementar caching avanzado

---

## 🎯 Checklist Final

### Pre-Deployment
- [ ] Build local exitoso
- [ ] Todas las funcionalidades probadas
- [ ] Variables de entorno configuradas
- [ ] Base de datos configurada
- [ ] SSL configurado
- [ ] Dominio configurado

### Post-Deployment
- [ ] Sitio accesible en producción
- [ ] Autenticación funcionando
- [ ] Base de datos conectada
- [ ] Emails de confirmación enviándose
- [ ] Storage funcionando
- [ ] Analytics configurado
- [ ] Monitoreo activo
- [ ] Backups configurados

### Mantenimiento
- [ ] Revisar logs semanalmente
- [ ] Monitorear performance
- [ ] Actualizar dependencias mensualmente
- [ ] Revisar métricas de uso
- [ ] Verificar backups

---

**¡Tu aplicación IngWork está lista para producción! 🚀**

Para soporte adicional, consulta:
- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Next.js](https://nextjs.org/docs)
