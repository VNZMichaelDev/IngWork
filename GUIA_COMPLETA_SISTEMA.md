# 📖 Guía Completa del Sistema - IngWork

## 🎯 Respuestas a tus Preguntas

### ❓ 1. "¿Siempre sale así o hay que aceptar o rechazar?"

**Respuesta**: ✅ **SÍ, hay botones de Aceptar/Rechazar**

**Cómo funciona:**

1. **Cuando el ingeniero envía una propuesta:**
   - La propuesta aparece con estado "Enviada" (badge azul)
   - El cliente ve los detalles: oferta, tiempo de entrega, carnet de colegiatura

2. **El cliente ve 2 botones:**
   - ✅ **Botón "Aceptar"** (verde)
   - ❌ **Botón "Rechazar"** (gris)

3. **Al hacer clic en "Aceptar":**
   - La propuesta cambia a estado "Aceptada" (badge verde)
   - El proyecto cambia a estado "En progreso"
   - Las demás propuestas se rechazan automáticamente

4. **Al hacer clic en "Rechazar":**
   - La propuesta cambia a estado "Rechazada" (badge rojo)
   - El proyecto sigue "Abierto" para recibir más propuestas

**Nota**: Los botones solo aparecen si:
- La propuesta tiene estado "Enviada"
- El proyecto está "Abierto" o "Pendiente"

---

### ❓ 2. "¿Dónde está lo de las calificaciones?"

**Respuesta**: ✅ **Ahora está integrado en el sistema**

**Ubicación del sistema de calificaciones:**

#### 📍 Dónde aparece el botón de calificar:

**En la página de detalles del proyecto** (`/dashboard/client/projects/[id]`)

Cuando el proyecto está **"Completado"**, aparece un botón amarillo:
```
⭐ Calificar Ingeniero
```

#### 🔄 Flujo completo:

1. **Proyecto Abierto** → Cliente recibe propuestas
2. **Cliente acepta propuesta** → Proyecto pasa a "En progreso"
3. **Aparece botón verde**: "✓ Marcar como Completado"
4. **Cliente marca como completado** → Proyecto pasa a "Completado"
5. **Aparece botón amarillo**: "⭐ Calificar Ingeniero"
6. **Cliente hace clic** → Se abre modal de calificación
7. **Cliente califica**:
   - Selecciona estrellas (1-5) ⭐⭐⭐⭐⭐
   - Escribe comentario opcional (máx 500 caracteres)
   - Hace clic en "Enviar calificación"
8. **Calificación guardada** → Se guarda en la tabla `reviews` de Supabase

#### 🎨 Componentes del sistema de calificaciones:

1. **StarRating** (`src/components/ui/star-rating.tsx`)
   - Componente de estrellas interactivo
   - Modo lectura y modo edición
   - Animaciones hover

2. **RatingModal** (`src/components/ui/rating-modal.tsx`)
   - Modal completo para calificar
   - Formulario con validación
   - Integración con Supabase

---

## 📊 Estados del Proyecto

### 1. **Open (Abierto)** 🟢
- El proyecto está publicado
- Los ingenieros pueden enviar propuestas
- El cliente puede ver y aceptar/rechazar propuestas

### 2. **In Progress (En progreso)** 🔵
- Una propuesta fue aceptada
- El ingeniero está trabajando en el proyecto
- Aparece botón "Marcar como Completado"

### 3. **Completed (Completado)** ✅
- El trabajo está terminado
- Aparece botón "Calificar Ingeniero"
- El cliente puede dejar una reseña con estrellas

### 4. **Cancelled (Cancelado)** ❌
- El proyecto fue cancelado
- No se pueden enviar más propuestas

---

## 🔄 Flujo Completo del Sistema

### Para el Cliente:

```
1. Crear Proyecto
   ↓
2. Recibir Propuestas
   ↓
3. Ver Detalles (Oferta, Tiempo, Carnet)
   ↓
4. Aceptar o Rechazar
   ↓
5. Proyecto "En progreso"
   ↓
6. Marcar como "Completado"
   ↓
7. Calificar Ingeniero (⭐⭐⭐⭐⭐)
```

### Para el Ingeniero:

```
1. Ver Proyectos Disponibles
   ↓
2. Enviar Propuesta
   ↓
3. Esperar respuesta del cliente
   ↓
4. Si es aceptada → Trabajar en el proyecto
   ↓
5. Recibir calificación del cliente
```

---

## 🎨 Interfaz de Usuario

### Página de Proyecto del Cliente

#### Header del Proyecto:
```
┌─────────────────────────────────────────────────┐
│ Título del Proyecto          [Estado: Abierto]  │
│ Categoría | Presupuesto | Tiempo | Fecha        │
│ Descripción del proyecto...                     │
│ Ubicación: Ciudad, País                         │
│                                                  │
│ [Botones según estado]:                         │
│ - Si "En progreso": [✓ Marcar como Completado] │
│ - Si "Completado": [⭐ Calificar Ingeniero]     │
└─────────────────────────────────────────────────┘
```

#### Sección de Propuestas:
```
┌─────────────────────────────────────────────────┐
│ Propuestas Recibidas (1)                        │
├─────────────────────────────────────────────────┤
│ Michael Escobar          [Enviada]              │
│ Especialidad: Ingeniería Civil                  │
│                                                  │
│ Oferta: $500    Tiempo: 20 días                 │
│ Carnet: CIP-12345                               │
│                                                  │
│ Detalles: Lorem ipsum...                        │
│                                                  │
│ Enviada: 5/11/2025    [Ver portafolio →]       │
│                                                  │
│                    [Rechazar]  [Aceptar]        │
└─────────────────────────────────────────────────┘
```

#### Modal de Calificación:
```
┌─────────────────────────────────────┐
│ Calificar a Michael Escobar    [X]  │
├─────────────────────────────────────┤
│                                     │
│ Calificación *                      │
│ ⭐⭐⭐⭐⭐                           │
│                                     │
│ Comentario (opcional)               │
│ ┌─────────────────────────────────┐ │
│ │ Excelente trabajo...            │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│ 45/500 caracteres                   │
│                                     │
│     [Cancelar]  [Enviar calificación] │
└─────────────────────────────────────┘
```

---

## 💾 Base de Datos

### Tabla `reviews` (Calificaciones)

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  project_id UUID,           -- ID del proyecto
  reviewer_id UUID,          -- ID del cliente que califica
  reviewee_id UUID,          -- ID del ingeniero calificado
  rating INTEGER (1-5),      -- Calificación de estrellas
  comment TEXT,              -- Comentario opcional
  created_at TIMESTAMP
);
```

---

## ✅ Checklist de Funcionalidades

### Sistema de Propuestas:
- ✅ Ingeniero puede enviar propuesta
- ✅ Cliente ve propuestas recibidas
- ✅ Cliente ve detalles: oferta, tiempo, carnet
- ✅ Botones Aceptar/Rechazar aparecen correctamente
- ✅ Al aceptar: proyecto pasa a "En progreso"
- ✅ Al aceptar: otras propuestas se rechazan automáticamente

### Sistema de Calificaciones:
- ✅ Componente de estrellas (1-5)
- ✅ Modal de calificación
- ✅ Campo de comentario opcional
- ✅ Validación de campos
- ✅ Integración con Supabase
- ✅ Botón aparece cuando proyecto está completado
- ✅ Botón "Marcar como Completado" funciona

### Cambios Visuales:
- ✅ "Carnet de colegiatura" en propuestas
- ✅ "Carnet de colegiatura" en búsqueda de ingenieros
- ✅ "Carnet de colegiatura" en perfil
- ✅ Categorías de construcción actualizadas

---

## 🚀 Para Probar el Sistema

### 1. Como Cliente:

```bash
# 1. Crear un proyecto
# 2. Esperar a que un ingeniero envíe propuesta
# 3. Ir a la página del proyecto
# 4. Ver los botones Aceptar/Rechazar
# 5. Aceptar la propuesta
# 6. Hacer clic en "Marcar como Completado"
# 7. Hacer clic en "Calificar Ingeniero"
# 8. Seleccionar estrellas y escribir comentario
# 9. Enviar calificación
```

### 2. Como Ingeniero:

```bash
# 1. Ver proyectos disponibles
# 2. Enviar propuesta con tu carnet de colegiatura
# 3. Esperar a que el cliente acepte
# 4. Recibir notificación de aceptación
# 5. Recibir calificación del cliente
```

---

## 📝 Comandos Git

```bash
# Ver cambios
git status

# Subir a GitHub
git push origin main
```

---

## 🎉 Resumen Final

### ✅ Todo Implementado:

1. **Botones Aceptar/Rechazar** → Funcionan correctamente
2. **Sistema de calificaciones** → Completamente integrado
3. **Flujo completo** → Cliente puede calificar al ingeniero
4. **Carnet de colegiatura** → Aparece en todas las vistas
5. **Categorías de construcción** → Actualizadas

### 📍 Ubicaciones Clave:

- **Propuestas**: `/dashboard/client/projects/[id]`
- **Calificaciones**: Modal en la misma página cuando proyecto está completado
- **Componentes**: `src/components/ui/star-rating.tsx` y `rating-modal.tsx`

---

**¡Todo listo y funcionando!** 🎊
