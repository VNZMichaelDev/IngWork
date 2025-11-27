# 📖 EJEMPLOS DE USO - COMPONENTES Y FUNCIONALIDADES

## 1. DocumentUpload - Carga de Documentos

### Uso en Onboarding:
```tsx
import DocumentUpload from "@/components/DocumentUpload";

<DocumentUpload
  userId={profile.id}
  documentType="cv"
  label="Currículum Vitae (CV)"
  description="Sube tu CV en PDF. Máximo 10MB."
  onFileUploaded={setCvFile}
  existingUrl={cvFile?.url}
/>
```

### Props:
- `userId: string` - ID del usuario
- `documentType: "cv" | "dni" | "colegio_carnet"` - Tipo de documento
- `onFileUploaded: (file: UploadedFile) => void` - Callback al subir
- `existingUrl?: string` - URL del documento existente
- `label: string` - Etiqueta del campo
- `description?: string` - Descripción adicional

---

## 2. WhatsAppButton - Botón de WhatsApp

### Uso en Perfil de Ingeniero:
```tsx
import WhatsAppButton from "@/components/WhatsAppButton";

<WhatsAppButton
  phone={engineer.phone}
  engineerName={engineer.full_name}
  message="Hola, me gustaría contactarte"
  variant="default"
  size="default"
  fullWidth={true}
/>
```

### Props:
- `phone?: string` - Número de teléfono
- `engineerName?: string` - Nombre del ingeniero
- `message?: string` - Mensaje personalizado
- `variant?: "default" | "outline" | "ghost"` - Estilo del botón
- `size?: "default" | "sm" | "lg"` - Tamaño del botón
- `fullWidth?: boolean` - Ancho completo
- `className?: string` - Clases CSS adicionales

### Teléfonos válidos:
```
+51 987654321
+51 9 87 654 321
987654321
9 87 654 321
```

---

## 3. FavoriteButton - Botón de Favoritos

### Uso en Perfil:
```tsx
import FavoriteButton from "@/components/FavoriteButton";

<FavoriteButton
  userId={currentUser.id}
  favoriteUserId={engineer.id}
  size="default"
/>
```

### Props:
- `userId: string` - ID del usuario actual
- `favoriteUserId: string` - ID del usuario a favoritear
- `size?: "default" | "sm" | "lg"` - Tamaño del botón
- `className?: string` - Clases CSS adicionales

### Comportamiento:
- Carga automáticamente el estado de favorito
- Guarda/elimina en tabla `favorites`
- Muestra corazón lleno si es favorito
- Muestra corazón vacío si no es favorito

---

## 4. FavoritesList - Lista de Favoritos

### Uso en Dashboard:
```tsx
import FavoritesList from "@/components/FavoritesList";

<FavoritesList
  userId={user.id}
  maxItems={6}
/>
```

### Props:
- `userId: string` - ID del usuario
- `maxItems?: number` - Máximo de favoritos a mostrar (default: 6)

### Características:
- Carga automática de favoritos
- Muestra información del ingeniero
- Badge de verificación
- Botón para remover favorito
- Enlace al perfil completo

---

## 5. EnhancedRatingSystem - Sistema de Reseñas

### Uso después de proyecto completado:
```tsx
import EnhancedRatingSystem from "@/components/EnhancedRatingSystem";

<EnhancedRatingSystem
  projectId={project.id}
  reviewerId={currentUser.id}
  revieweeId={engineer.id}
  revieweeName={engineer.full_name}
  onReviewSubmitted={() => {
    // Recargar reseñas
  }}
/>
```

### Props:
- `projectId: string` - ID del proyecto
- `reviewerId: string` - ID de quien califica
- `revieweeId: string` - ID de quien es calificado
- `revieweeName?: string` - Nombre del calificado
- `onReviewSubmitted?: () => void` - Callback al guardar

### Calificaciones:
- **General**: 1-5 estrellas
- **Comunicación**: 1-5 estrellas
- **Calidad del trabajo**: 1-5 estrellas
- **Puntualidad**: 1-5 estrellas
- **Profesionalismo**: 1-5 estrellas

### Campos opcionales:
- Título de la reseña
- Comentario detallado

---

## 6. ReviewsList - Visualización de Reseñas

### Uso en Perfil de Ingeniero:
```tsx
import ReviewsList from "@/components/ReviewsList";

<ReviewsList
  userId={engineer.id}
  maxReviews={5}
/>
```

### Props:
- `userId: string` - ID del usuario a mostrar reseñas
- `maxReviews?: number` - Máximo de reseñas a mostrar (default: 5)

### Muestra:
- Promedio de calificación
- Total de reseñas
- Información del revisor
- Título y comentario
- Calificaciones por categoría

---

## 7. VerificationBadge - Badge de Verificación

### Uso en Perfil:
```tsx
import VerificationBadge from "@/components/VerificationBadge";

<VerificationBadge
  isVerified={engineer.is_verified}
  size="md"
  showLabel={true}
/>
```

### Props:
- `isVerified: boolean` - Si está verificado
- `size?: "sm" | "md" | "lg"` - Tamaño del badge
- `showLabel?: boolean` - Mostrar etiqueta "Verificado"

### Tamaños:
- `sm` - 4x4 (pequeño)
- `md` - 5x5 (mediano)
- `lg` - 6x6 (grande)

---

## 8. Funciones de Teléfono - phone-utils.ts

### Validar teléfono peruano:
```tsx
import { isValidPeruvianPhone } from "@/lib/phone-utils";

if (isValidPeruvianPhone("+51 987654321")) {
  // Teléfono válido
}
```

### Normalizar teléfono:
```tsx
import { normalizePeruvianPhone } from "@/lib/phone-utils";

const normalized = normalizePeruvianPhone("987654321");
// Retorna: "+51987654321"
```

### Generar enlace WhatsApp:
```tsx
import { generateWhatsAppLink } from "@/lib/phone-utils";

const link = generateWhatsAppLink("+51 987654321", "Hola!");
// Retorna: "https://wa.me/51987654321?text=Hola%21"
```

### Formatear para mostrar:
```tsx
import { formatPeruvianPhoneForDisplay } from "@/lib/phone-utils";

const formatted = formatPeruvianPhoneForDisplay("+51987654321");
// Retorna: "+51 9 87 654 321"
```

---

## 9. Panel de Administrador

### Acceso:
```
/dashboard/admin
```

### Requisitos:
- Usuario autenticado
- Campo `is_admin = TRUE` en tabla `profiles`

### Módulos:

#### Panel Principal:
- Estadísticas en tiempo real
- Tarjetas de navegación
- Información general

#### Ingenieros:
```
/dashboard/admin/engineers
```
- Listado de ingenieros
- Información profesional
- Botón para verificar
- Acceso a documentos

#### Clientes:
```
/dashboard/admin/clients
```
- Listado de clientes
- Información de contacto
- Empresa y ubicación

#### Documentos:
```
/dashboard/admin/documents
```
- Revisión de documentos
- Filtros: Todos, Pendientes, Verificados
- Vista previa de PDF
- Botón para verificar

---

## 10. Flujo Completo de Verificación

### 1. Ingeniero se registra:
```
/auth/register → Selecciona "Ingeniero"
```

### 2. Completa perfil:
```
/onboarding → Sube CV, DNI, Carnet
```

### 3. Admin revisa:
```
/dashboard/admin/documents → Ve documentos → Hace clic "Verificar"
```

### 4. Ingeniero obtiene badge:
```
Perfil del ingeniero → Muestra badge azul "✓ Verificado"
```

### 5. Cliente contacta:
```
Perfil del ingeniero → Botón "Contactar por WhatsApp" → Abre WhatsApp
```

---

## 11. Ejemplo Completo - Perfil de Ingeniero

```tsx
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth";
import WhatsAppButton from "@/components/WhatsAppButton";
import FavoriteButton from "@/components/FavoriteButton";
import VerificationBadge from "@/components/VerificationBadge";
import ReviewsList from "@/components/ReviewsList";

export default function EngineerProfile({ engineerId }) {
  const [engineer, setEngineer] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { user } = await authClient.getUser();
    setCurrentUser(user);

    const { profile } = await authClient.getProfile(engineerId);
    setEngineer(profile);
  };

  if (!engineer) return <div>Cargando...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{engineer.full_name}</h1>
            <VerificationBadge isVerified={engineer.is_verified} />
          </div>
          <p className="text-gray-600">{engineer.specialty}</p>
        </div>
        {currentUser && (
          <FavoriteButton
            userId={currentUser.id}
            favoriteUserId={engineer.id}
          />
        )}
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-gray-600 text-sm">Experiencia</p>
          <p className="font-medium">{engineer.experience_years} años</p>
        </div>
        <div>
          <p className="text-gray-600 text-sm">Teléfono</p>
          <p className="font-medium">{engineer.phone}</p>
        </div>
      </div>

      {/* Contact Button */}
      <WhatsAppButton
        phone={engineer.phone}
        engineerName={engineer.full_name}
        fullWidth={true}
        className="mb-6"
      />

      {/* Reviews */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-bold mb-4">Reseñas</h2>
        <ReviewsList userId={engineer.id} />
      </div>
    </div>
  );
}
```

---

## 12. Validación de Datos

### Teléfono Peruano:
```tsx
import { isValidPeruvianPhone } from "@/lib/phone-utils";

// ✅ Válidos:
isValidPeruvianPhone("+51 987654321") // true
isValidPeruvianPhone("987654321") // true
isValidPeruvianPhone("+51 9 87 654 321") // true

// ❌ Inválidos:
isValidPeruvianPhone("+1 987654321") // false (no es Perú)
isValidPeruvianPhone("123456789") // false (no empieza con 9)
isValidPeruvianPhone("") // false (vacío)
```

### Documentos:
```tsx
// Solo PDF
// Máximo 10MB
// Validación automática en DocumentUpload
```

---

**¡Listo para usar! 🚀**
