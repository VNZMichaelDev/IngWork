# 🔐 CONFIGURAR POLÍTICAS DE STORAGE - ENGINEER-DOCUMENTS

## Ubicación en Supabase

**Storage** → **Buckets** → **engineer-documents** → **Policies**

---

## POLÍTICA 1: Lectura Pública (SELECT)

### Haz clic en "New policy"

**Nombre**: `Public Read Access`

**Selecciona**: `SELECT`

**Aplica a**: `Authenticated users and anonymous users`

**Expresión**:
```sql
true
```

**Explicación**: Permite que cualquiera (autenticado o no) lea/descargue los documentos.

---

## POLÍTICA 2: Escritura Autenticada (INSERT)

### Haz clic en "New policy"

**Nombre**: `Authenticated Upload`

**Selecciona**: `INSERT`

**Aplica a**: `Authenticated users`

**Expresión**:
```sql
auth.uid() = (storage.foldername('name'))[1]::uuid
```

**Explicación**: Solo usuarios autenticados pueden subir documentos a su carpeta.

---

## POLÍTICA 3: Actualización Autenticada (UPDATE)

### Haz clic en "New policy"

**Nombre**: `Authenticated Update`

**Selecciona**: `UPDATE`

**Aplica a**: `Authenticated users`

**Expresión**:
```sql
auth.uid() = (storage.foldername('name'))[1]::uuid
```

**Explicación**: Solo usuarios autenticados pueden actualizar sus documentos.

---

## POLÍTICA 4: Eliminación Autenticada (DELETE)

### Haz clic en "New policy"

**Nombre**: `Authenticated Delete`

**Selecciona**: `DELETE`

**Aplica a**: `Authenticated users`

**Expresión**:
```sql
auth.uid() = (storage.foldername('name'))[1]::uuid
```

**Explicación**: Solo usuarios autenticados pueden eliminar sus documentos.

---

## ✅ Resultado Final

Deberías tener 4 políticas:
1. ✅ Public Read Access (SELECT)
2. ✅ Authenticated Upload (INSERT)
3. ✅ Authenticated Update (UPDATE)
4. ✅ Authenticated Delete (DELETE)

---

## 🧪 Prueba Rápida

1. Registra un ingeniero
2. Ve a `/onboarding`
3. Intenta subir un PDF
4. Debe funcionar sin errores

---

**¡Listo! Las políticas están configuradas.** 🚀
