# 📍 Dónde Ver las Calificaciones - IngWork

## 🎯 Respuesta Rápida

Las calificaciones y comentarios se pueden ver en **3 lugares diferentes**:

---

## 1. 📄 Perfil Público del Ingeniero (NUEVO)

**Ubicación**: `/dashboard/client/engineers/[id]`

**Cómo llegar:**
- Desde la búsqueda de ingenieros → Clic en **"Ver perfil y reseñas"**
- Desde las propuestas → Clic en **"Ver perfil y reseñas →"**

**Qué se muestra:**

### Header del Perfil:
```
┌──────────────────────────────────────────────────┐
│  [👤]  Michael Escobar                           │
│        Ingeniería Civil                          │
│        Empresa ABC                               │
│                                                  │
│        ⭐⭐⭐⭐⭐ 4.8  (12 reseñas)            │
│        [Disponible]                              │
│                                                  │
│  ┌──────────────┬──────────────┬──────────────┐ │
│  │ Experiencia  │ Carnet       │ Miembro desde│ │
│  │ 5 años       │ CIP-12345    │ 1/10/2024    │ │
│  └──────────────┴──────────────┴──────────────┘ │
└──────────────────────────────────────────────────┘
```

### Sección de Reseñas:
```
┌──────────────────────────────────────────────────┐
│ Reseñas y Calificaciones (12)                    │
├──────────────────────────────────────────────────┤
│                                                  │
│ Juan Pérez          ⭐⭐⭐⭐⭐  5/11/2025      │
│ Proyecto: Construcción de vivienda              │
│                                                  │
│ "Excelente trabajo, muy profesional y           │
│  cumplió con los tiempos establecidos."         │
│                                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│ María García        ⭐⭐⭐⭐☆  3/11/2025      │
│ Proyecto: Remodelación de oficina               │
│                                                  │
│ "Buen trabajo en general, aunque hubo algunos   │
│  retrasos menores."                             │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Información mostrada en cada reseña:**
- ⭐ Calificación de estrellas (1-5)
- 👤 Nombre del cliente que calificó
- 📋 Nombre del proyecto
- 💬 Comentario (si lo dejó)
- 📅 Fecha de la calificación

---

## 2. 🔍 Búsqueda de Ingenieros

**Ubicación**: `/dashboard/client/engineers`

**Qué se muestra:**
- Botón **"Ver perfil y reseñas"** en cada tarjeta de ingeniero
- Al hacer clic → Te lleva al perfil completo con todas las reseñas

```
┌──────────────────────────────────────────────────┐
│ [👤] Michael Escobar                             │
│      Ingeniería Civil                            │
│                                                  │
│ ┌──────────┬──────────┬──────────┬──────────┐   │
│ │Experiencia│ Carnet   │Especialidad│ Estado │   │
│ │ 5 años   │CIP-12345 │   Civil   │Disponible│  │
│ └──────────┴──────────┴──────────┴──────────┘   │
│                                                  │
│              [Ver perfil y reseñas] [Contactar] │
└──────────────────────────────────────────────────┘
```

---

## 3. 📋 Propuestas del Proyecto

**Ubicación**: `/dashboard/client/projects/[id]`

**Qué se muestra:**
- Enlace **"Ver perfil y reseñas →"** en cada propuesta
- Al hacer clic → Te lleva al perfil del ingeniero con sus reseñas

```
┌──────────────────────────────────────────────────┐
│ Michael Escobar                    [Enviada]     │
│ Especialidad: Ingeniería Civil                   │
│                                                  │
│ Oferta: $500    Tiempo: 20 días                 │
│ Carnet: CIP-12345                               │
│                                                  │
│ Enviada: 5/11/2025                              │
│ Ver perfil y reseñas → | Ver portafolio →      │
│                                                  │
│                    [Rechazar]  [Aceptar]        │
└──────────────────────────────────────────────────┘
```

---

## 🔄 Flujo Completo de Calificaciones

### Para el Cliente:

```
1. Completar proyecto
   ↓
2. Hacer clic en "⭐ Calificar Ingeniero"
   ↓
3. Seleccionar estrellas (1-5)
   ↓
4. Escribir comentario (opcional)
   ↓
5. Enviar calificación
   ↓
6. La calificación se guarda en Supabase
   ↓
7. Aparece en el perfil del ingeniero
```

### Para otros Clientes (Ver reseñas):

```
Opción 1: Desde búsqueda
├─ Buscar ingenieros
├─ Ver tarjeta del ingeniero
└─ Clic en "Ver perfil y reseñas"
   └─ Ver todas las calificaciones

Opción 2: Desde propuestas
├─ Ver propuestas recibidas
├─ Clic en "Ver perfil y reseñas →"
└─ Ver todas las calificaciones
```

---

## 📊 Información Mostrada en el Perfil

### Calificación Promedio:
- ⭐ Estrellas visuales (ej: ⭐⭐⭐⭐⭐)
- 🔢 Número decimal (ej: 4.8)
- 📈 Cantidad de reseñas (ej: "12 reseñas")

### Cada Reseña Individual:
- 👤 **Nombre del cliente**: Quién dejó la reseña
- ⭐ **Calificación**: 1-5 estrellas
- 📋 **Proyecto**: En qué proyecto trabajaron juntos
- 💬 **Comentario**: Opinión detallada (si la dejó)
- 📅 **Fecha**: Cuándo se dejó la calificación

---

## 🎨 Ejemplo Visual Completo

### Perfil del Ingeniero con Reseñas:

```
═══════════════════════════════════════════════════
                PERFIL DEL INGENIERO
═══════════════════════════════════════════════════

[👤 FOTO]  Michael Escobar
           Ingeniería Civil
           Constructora ABC S.A.
           
           ⭐⭐⭐⭐⭐ 4.8  (12 reseñas)
           [🟢 Disponible]

───────────────────────────────────────────────────
  Experiencia    │  Carnet de      │  Miembro desde
  5 años         │  colegiatura    │  1/10/2024
                 │  CIP-12345      │
───────────────────────────────────────────────────

═══════════════════════════════════════════════════
           RESEÑAS Y CALIFICACIONES (12)
═══════════════════════════════════════════════════

┌─────────────────────────────────────────────────┐
│ Juan Pérez                    ⭐⭐⭐⭐⭐        │
│ Proyecto: Construcción de vivienda              │
│ 5/11/2025                                       │
│                                                 │
│ "Excelente profesional, muy responsable y      │
│  cumplió con todos los plazos. Recomendado     │
│  al 100%. El trabajo quedó impecable."         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ María García                  ⭐⭐⭐⭐☆        │
│ Proyecto: Remodelación de oficina               │
│ 3/11/2025                                       │
│                                                 │
│ "Buen trabajo, aunque hubo algunos retrasos    │
│  menores. En general satisfecha con el         │
│  resultado final."                             │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Carlos Rodríguez              ⭐⭐⭐⭐⭐        │
│ Proyecto: Supervisión de obra                   │
│ 1/11/2025                                       │
│                                                 │
│ "Muy profesional y atento a los detalles.      │
│  Excelente comunicación durante todo el        │
│  proyecto."                                    │
└─────────────────────────────────────────────────┘
```

---

## 💾 Base de Datos

### Tabla `reviews`:

```sql
SELECT 
  r.rating,              -- Calificación (1-5)
  r.comment,             -- Comentario
  r.created_at,          -- Fecha
  reviewer.full_name,    -- Nombre del cliente
  project.title          -- Nombre del proyecto
FROM reviews r
JOIN profiles reviewer ON r.reviewer_id = reviewer.id
JOIN projects project ON r.project_id = project.id
WHERE r.reviewee_id = '[ID_DEL_INGENIERO]'
ORDER BY r.created_at DESC;
```

---

## ✅ Resumen

### Dónde VER las calificaciones:
1. ✅ **Perfil público del ingeniero** (página completa con todas las reseñas)
2. ✅ **Búsqueda de ingenieros** (botón "Ver perfil y reseñas")
3. ✅ **Propuestas** (enlace "Ver perfil y reseñas →")

### Qué se MUESTRA:
- ✅ Calificación promedio con estrellas
- ✅ Número total de reseñas
- ✅ Lista completa de todas las reseñas
- ✅ Nombre del cliente que calificó
- ✅ Proyecto en el que trabajaron
- ✅ Comentario detallado
- ✅ Fecha de la calificación

### Quién puede VER:
- ✅ **Todos los clientes** pueden ver las reseñas de cualquier ingeniero
- ✅ Las reseñas son **públicas** para ayudar en la toma de decisiones
- ✅ Los ingenieros pueden ver sus propias reseñas

---

**¡Ahora los clientes pueden tomar decisiones informadas basándose en las experiencias de otros!** 🎉
