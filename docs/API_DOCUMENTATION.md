# ConstruMatch - Documentación de API

## 📋 Tabla de Contenidos

1. [Configuración de Supabase](#configuración-de-supabase)
2. [Autenticación](#autenticación)
3. [Perfiles](#perfiles)
4. [Proyectos](#proyectos)
5. [Propuestas](#propuestas)
6. [Mensajes](#mensajes)
7. [Reviews](#reviews)
8. [Storage](#storage)
9. [Real-time](#real-time)
10. [Tipos TypeScript](#tipos-typescript)

---

## 🔧 Configuración de Supabase

### Cliente Browser
```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export const createSupabaseBrowserClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Cliente Server
```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createSupabaseServerClient = () => {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}
```

---

## 🔐 Autenticación

### Registro de Usuario
```typescript
const signUp = async (email: string, password: string, role: 'client' | 'engineer') => {
  const supabase = createSupabaseBrowserClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role }
    }
  });
  
  return { data, error };
};
```

### Inicio de Sesión
```typescript
const signIn = async (email: string, password: string) => {
  const supabase = createSupabaseBrowserClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  return { data, error };
};
```

### Cerrar Sesión
```typescript
const signOut = async () => {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signOut();
  return { error };
};
```

### Obtener Usuario Actual
```typescript
const getUser = async () => {
  const supabase = createSupabaseBrowserClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};
```

---

## 👤 Perfiles

### Crear Perfil
```typescript
const createProfile = async (profile: {
  id: string;
  role: 'client' | 'engineer';
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  specialty?: string;
}) => {
  const supabase = createSupabaseBrowserClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .insert([profile])
    .select();
    
  return { profile: data?.[0], error };
};
```

### Obtener Perfil
```typescript
const getProfile = async (userId: string) => {
  const supabase = createSupabaseBrowserClient();
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  return { profile, error };
};
```

### Actualizar Perfil
```typescript
const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const supabase = createSupabaseBrowserClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select();
    
  return { profile: data?.[0], error };
};
```

### Buscar Ingenieros
```typescript
const searchEngineers = async (filters: {
  specialty?: string;
  location?: string;
  minRate?: number;
  maxRate?: number;
  availability?: string;
}) => {
  const supabase = createSupabaseBrowserClient();
  
  let query = supabase
    .from('profiles')
    .select('*')
    .eq('role', 'engineer')
    .eq('is_active', true);
    
  if (filters.specialty) {
    query = query.eq('specialty', filters.specialty);
  }
  
  if (filters.location) {
    query = query.ilike('location', `%${filters.location}%`);
  }
  
  if (filters.minRate) {
    query = query.gte('hourly_rate', filters.minRate);
  }
  
  if (filters.maxRate) {
    query = query.lte('hourly_rate', filters.maxRate);
  }
  
  if (filters.availability) {
    query = query.eq('availability', filters.availability);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  return { engineers: data, error };
};
```

---

## 📋 Proyectos

### Crear Proyecto
```typescript
const createProject = async (project: {
  client_id: string;
  title: string;
  description: string;
  category: string;
  budget_estimate?: number;
  eta_days?: number;
  location?: string;
  requirements?: string;
}) => {
  const supabase = createSupabaseBrowserClient();
  
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select();
    
  return { project: data?.[0], error };
};
```

### Obtener Proyectos
```typescript
const getProjects = async (filters?: {
  status?: string;
  category?: string;
  clientId?: string;
}) => {
  const supabase = createSupabaseBrowserClient();
  
  let query = supabase
    .from('projects')
    .select(`
      *,
      client:profiles!projects_client_id_fkey(full_name, company),
      _count:proposals(count)
    `);
    
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  
  if (filters?.clientId) {
    query = query.eq('client_id', filters.clientId);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  return { projects: data, error };
};
```

### Obtener Proyecto por ID
```typescript
const getProjectById = async (projectId: string) => {
  const supabase = createSupabaseBrowserClient();
  
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      client:profiles!projects_client_id_fkey(full_name, company, email, phone),
      proposals(
        *,
        engineer:profiles!proposals_engineer_id_fkey(full_name, specialty, hourly_rate)
      )
    `)
    .eq('id', projectId)
    .single();
    
  return { project: data, error };
};
```

### Actualizar Proyecto
```typescript
const updateProject = async (projectId: string, updates: Partial<Project>) => {
  const supabase = createSupabaseBrowserClient();
  
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .select();
    
  return { project: data?.[0], error };
};
```

---

## 💼 Propuestas

### Enviar Propuesta
```typescript
const submitProposal = async (proposal: {
  project_id: string;
  engineer_id: string;
  bid_amount: number;
  eta_days: number;
  details: string;
}) => {
  const supabase = createSupabaseBrowserClient();
  
  const { data, error } = await supabase
    .from('proposals')
    .insert([proposal])
    .select();
    
  return { proposal: data?.[0], error };
};
```

### Obtener Propuestas del Ingeniero
```typescript
const getEngineerProposals = async (engineerId: string) => {
  const supabase = createSupabaseBrowserClient();
  
  const { data, error } = await supabase
    .from('proposals')
    .select(`
      *,
      project:projects(
        *,
        client:profiles!projects_client_id_fkey(full_name, company)
      )
    `)
    .eq('engineer_id', engineerId)
    .order('created_at', { ascending: false });
    
  return { proposals: data, error };
};
```

### Obtener Propuestas del Proyecto
```typescript
const getProjectProposals = async (projectId: string) => {
  const supabase = createSupabaseBrowserClient();
  
  const { data, error } = await supabase
    .from('proposals')
    .select(`
      *,
      engineer:profiles!proposals_engineer_id_fkey(
        full_name, 
        specialty, 
        experience_years, 
        hourly_rate,
        avatar_url
      )
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
    
  return { proposals: data, error };
};
```

### Actualizar Estado de Propuesta
```typescript
const updateProposalStatus = async (
  proposalId: string, 
  status: 'sent' | 'viewed' | 'accepted' | 'rejected' | 'negotiating'
) => {
  const supabase = createSupabaseBrowserClient();
  
  const { data, error } = await supabase
    .from('proposals')
    .update({ 
      status,
      responded_at: new Date().toISOString()
    })
    .eq('id', proposalId)
    .select();
    
  return { proposal: data?.[0], error };
};
```

---

## 💬 Mensajes

### Enviar Mensaje
```typescript
const sendMessage = async (message: {
  project_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  message_type?: 'text' | 'file' | 'system';
}) => {
  const supabase = createSupabaseBrowserClient();
  
  const { data, error } = await supabase
    .from('messages')
    .insert([message])
    .select();
    
  return { message: data?.[0], error };
};
```

### Obtener Mensajes del Proyecto
```typescript
const getProjectMessages = async (projectId: string) => {
  const supabase = createSupabaseBrowserClient();
  
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey(full_name, avatar_url),
      recipient:profiles!messages_recipient_id_fkey(full_name, avatar_url)
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });
    
  return { messages: data, error };
};
```

### Marcar Mensaje como Leído
```typescript
const markMessageAsRead = async (messageId: string) => {
  const supabase = createSupabaseBrowserClient();
  
  const { data, error } = await supabase
    .from('messages')
    .update({ 
      is_read: true,
      read_at: new Date().toISOString()
    })
    .eq('id', messageId)
    .select();
    
  return { message: data?.[0], error };
};
```

---

## ⭐ Reviews

### Crear Review
```typescript
const createReview = async (review: {
  project_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  title?: string;
  comment?: string;
  communication_rating?: number;
  quality_rating?: number;
  timeliness_rating?: number;
}) => {
  const supabase = createSupabaseBrowserClient();
  
  const { data, error } = await supabase
    .from('reviews')
    .insert([review])
    .select();
    
  return { review: data?.[0], error };
};
```

### Obtener Reviews del Usuario
```typescript
const getUserReviews = async (userId: string) => {
  const supabase = createSupabaseBrowserClient();
  
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      reviewer:profiles!reviews_reviewer_id_fkey(full_name, avatar_url),
      project:projects(title)
    `)
    .eq('reviewee_id', userId)
    .eq('is_public', true)
    .order('created_at', { ascending: false });
    
  return { reviews: data, error };
};
```

### Obtener Estadísticas de Reviews
```typescript
const getReviewStats = async (userId: string) => {
  const supabase = createSupabaseBrowserClient();
  
  const { data, error } = await supabase
    .from('reviews')
    .select('rating, communication_rating, quality_rating, timeliness_rating')
    .eq('reviewee_id', userId);
    
  if (data) {
    const totalReviews = data.length;
    const averageRating = data.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
    const avgCommunication = data.reduce((sum, r) => sum + (r.communication_rating || 0), 0) / totalReviews;
    const avgQuality = data.reduce((sum, r) => sum + (r.quality_rating || 0), 0) / totalReviews;
    const avgTimeliness = data.reduce((sum, r) => sum + (r.timeliness_rating || 0), 0) / totalReviews;
    
    return {
      stats: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        avgCommunication: Math.round(avgCommunication * 10) / 10,
        avgQuality: Math.round(avgQuality * 10) / 10,
        avgTimeliness: Math.round(avgTimeliness * 10) / 10
      },
      error: null
    };
  }
  
  return { stats: null, error };
};
```

---

## 📁 Storage

### Subir Archivo
```typescript
const uploadFile = async (bucket: string, path: string, file: File) => {
  const supabase = createSupabaseBrowserClient();
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });
    
  return { data, error };
};
```

### Obtener URL Pública
```typescript
const getPublicUrl = (bucket: string, path: string) => {
  const supabase = createSupabaseBrowserClient();
  
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
    
  return data.publicUrl;
};
```

### Eliminar Archivo
```typescript
const deleteFile = async (bucket: string, path: string) => {
  const supabase = createSupabaseBrowserClient();
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .remove([path]);
    
  return { data, error };
};
```

---

## 🔄 Real-time

### Suscripción a Mensajes
```typescript
const subscribeToMessages = (projectId: string, callback: (message: any) => void) => {
  const supabase = createSupabaseBrowserClient();
  
  const subscription = supabase
    .channel(`messages:${projectId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `project_id=eq.${projectId}`
      },
      callback
    )
    .subscribe();
    
  return subscription;
};
```

### Suscripción a Propuestas
```typescript
const subscribeToProposals = (projectId: string, callback: (proposal: any) => void) => {
  const supabase = createSupabaseBrowserClient();
  
  const subscription = supabase
    .channel(`proposals:${projectId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'proposals',
        filter: `project_id=eq.${projectId}`
      },
      callback
    )
    .subscribe();
    
  return subscription;
};
```

### Cancelar Suscripción
```typescript
const unsubscribe = (subscription: any) => {
  const supabase = createSupabaseBrowserClient();
  supabase.removeChannel(subscription);
};
```

---

## 📝 Tipos TypeScript

### Tipos Principales
```typescript
// lib/types.ts

export type UserRole = 'client' | 'engineer';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  location?: string;
  bio?: string;
  avatar_url?: string;
  
  // Engineer specific
  specialty?: string;
  experience_years?: number;
  hourly_rate?: number;
  availability?: 'available' | 'busy' | 'unavailable';
  skills?: string[];
  portfolio_url?: string;
  
  // Client specific
  industry?: string;
  company_size?: string;
  
  // Metadata
  created_at: string;
  updated_at: string;
  is_verified: boolean;
  is_active: boolean;
}

export interface Project {
  id: string;
  client_id: string;
  title: string;
  description: string;
  category: string;
  budget_estimate?: number;
  eta_days?: number;
  location?: string;
  requirements?: string;
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  
  // Relations
  client?: Profile;
  proposals?: Proposal[];
  _count?: {
    proposals: number;
  };
}

export interface Proposal {
  id: string;
  project_id: string;
  engineer_id: string;
  bid_amount: number;
  eta_days: number;
  details: string;
  status: 'sent' | 'viewed' | 'accepted' | 'rejected' | 'negotiating' | 'withdrawn';
  created_at: string;
  updated_at: string;
  
  // Relations
  project?: Project;
  engineer?: Profile;
}

export interface Message {
  id: string;
  project_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  message_type: 'text' | 'file' | 'system' | 'proposal_update';
  attachment_url?: string;
  attachment_name?: string;
  is_read: boolean;
  created_at: string;
  
  // Relations
  sender?: Profile;
  recipient?: Profile;
}

export interface Review {
  id: string;
  project_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  title?: string;
  comment?: string;
  communication_rating?: number;
  quality_rating?: number;
  timeliness_rating?: number;
  is_public: boolean;
  created_at: string;
  
  // Relations
  reviewer?: Profile;
  reviewee?: Profile;
  project?: Project;
}

export interface Attachment {
  id: string;
  project_id?: string;
  proposal_id?: string;
  message_id?: string;
  uploader_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  description?: string;
  created_at: string;
}
```

### Tipos de Respuesta de API
```typescript
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  error: Error | null;
}
```

---

## 🚀 Ejemplos de Uso

### Flujo Completo: Cliente Crea Proyecto
```typescript
const createProjectFlow = async () => {
  // 1. Verificar autenticación
  const { user } = await authClient.getUser();
  if (!user) throw new Error('Not authenticated');
  
  // 2. Crear proyecto
  const { project, error } = await createProject({
    client_id: user.id,
    title: 'Desarrollo de App Móvil',
    description: 'Necesito desarrollar una app móvil para iOS y Android',
    category: 'Desarrollo Móvil',
    budget_estimate: 5000,
    eta_days: 60,
    location: 'Remoto'
  });
  
  if (error) throw error;
  
  // 3. Suscribirse a propuestas
  const subscription = subscribeToProposals(project.id, (payload) => {
    console.log('Nueva propuesta recibida:', payload.new);
  });
  
  return { project, subscription };
};
```

### Flujo Completo: Ingeniero Envía Propuesta
```typescript
const submitProposalFlow = async (projectId: string) => {
  // 1. Verificar autenticación
  const { user } = await authClient.getUser();
  if (!user) throw new Error('Not authenticated');
  
  // 2. Obtener detalles del proyecto
  const { project } = await getProjectById(projectId);
  if (!project) throw new Error('Project not found');
  
  // 3. Enviar propuesta
  const { proposal, error } = await submitProposal({
    project_id: projectId,
    engineer_id: user.id,
    bid_amount: 4500,
    eta_days: 45,
    details: 'Propongo desarrollar la app usando React Native...'
  });
  
  if (error) throw error;
  
  // 4. Enviar notificación al cliente
  await sendMessage({
    project_id: projectId,
    sender_id: user.id,
    recipient_id: project.client_id,
    content: 'He enviado una propuesta para tu proyecto',
    message_type: 'system'
  });
  
  return proposal;
};
```

---

Esta documentación cubre todas las operaciones principales de la API de ConstruMatch. Para más detalles sobre configuración y deployment, consulta el README.md principal.
