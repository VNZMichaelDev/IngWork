# IngWork 

**Marketplace para conectar Clientes con Ingenieros**

Stack: Next.js (App Router, TypeScript, Tailwind), Supabase (Auth/DB/Storage/Realtime), desplegado en Vercel.

## Requisitos

- Node.js 18+
- Cuenta en GitHub, Vercel y Supabase

## Configuración local

1) Instala dependencias:

```bash
npm install
```

2) Variables de entorno (crea manualmente `.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

También puedes copiar desde `env.sample`.

3) Levanta el servidor de desarrollo:

```bash
npm run dev
```

Abre http://localhost:3000

## Supabase

1) Crea un proyecto en Supabase y copia la URL y anon key en `.env.local`.

2) En el panel de SQL, ejecuta el contenido de `supabase/schema.sql` para crear tablas y políticas RLS.

3) Habilita Auth por email/password (por defecto viene activo). Posteriormente integraremos recuperación de contraseña y perfiles extendidos.

## Estructura inicial

- `src/app/page.tsx`: Landing con botones “Soy Cliente” y “Soy Ingeniero”.
- `src/app/auth/login/page.tsx`: Pantalla stub de login.
- `src/app/auth/register/page.tsx`: Pantalla stub de registro con selección de rol por querystring.
- `src/lib/supabase/client.ts` y `src/lib/supabase/server.ts`: clientes de Supabase (navegador/servidor).
- `supabase/schema.sql`: esquema inicial de BD (profiles, projects, proposals, messages, attachments, reviews) con RLS.

## Deploy (GitHub + Vercel)

1) Crea un repositorio en GitHub y sube el código.
2) En Vercel, "Import Project" desde GitHub.
3) Configura en Vercel las variables de entorno del apartado Configuración local.
4) Despliega (Vercel construirá el proyecto con `npm run build`).

## Próximos pasos

- Integrar Supabase Auth en `/auth/login` y `/auth/register`.
- Panel Cliente: crear proyecto, ver estados, buscar ingenieros.
- Panel Ingeniero: ver proyectos disponibles, enviar propuestas, gestionar propuestas.
- Mensajería dentro del proyecto y carga de archivos (Storage).
- Calificaciones y reseñas al completar proyectos.
