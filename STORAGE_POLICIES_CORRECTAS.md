# 🔐 POLÍTICAS DE STORAGE CORRECTAS

## 📍 Dónde crear las políticas

**IMPORTANTE**: Las políticas deben ir en el **BUCKET**, no en Schema.

En Supabase:
1. Ve a **Storage → Files**
2. Busca el bucket **`engineer-documents`**
3. Haz clic en el bucket
4. Ve a la pestaña **"Policies"**
5. Haz clic en **"New policy"**

---

## 📋 Políticas a crear

### Política 1: Lectura Pública
```
Name: Public Read Access
Definition: (bucket_id = 'engineer-documents')
Allowed operations: SELECT
Applied to: anon, authenticated
```

O en SQL:
```sql
CREATE POLICY "Public Read Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'engineer-documents');
```

---

### Política 2: Subida Autenticada
```
Name: Authenticated Upload
Definition: (bucket_id = 'engineer-documents' AND auth.role() = 'authenticated')
Allowed operations: INSERT
Applied to: authenticated
```

O en SQL:
```sql
CREATE POLICY "Authenticated Upload" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'engineer-documents' AND auth.role() = 'authenticated');
```

---

### Política 3: Actualización Autenticada
```
Name: Authenticated Update
Definition: (bucket_id = 'engineer-documents' AND auth.role() = 'authenticated')
Allowed operations: UPDATE
Applied to: authenticated
```

O en SQL:
```sql
CREATE POLICY "Authenticated Update" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'engineer-documents' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'engineer-documents' AND auth.role() = 'authenticated');
```

---

### Política 4: Eliminación Autenticada
```
Name: Authenticated Delete
Definition: (bucket_id = 'engineer-documents' AND auth.role() = 'authenticated')
Allowed operations: DELETE
Applied to: authenticated
```

O en SQL:
```sql
CREATE POLICY "Authenticated Delete" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'engineer-documents' AND auth.role() = 'authenticated');
```

---

## ✅ Pasos para crear las políticas

### Opción A: Interfaz Gráfica (Recomendado)

1. Ve a **Storage → Files → engineer-documents**
2. Haz clic en **"New policy"**
3. Selecciona **"For SELECT"** (para lectura)
4. En "Definition", escribe: `bucket_id = 'engineer-documents'`
5. Haz clic en **"Review"** y luego **"Save policy"**
6. Repite para INSERT, UPDATE, DELETE

### Opción B: SQL Editor

Ve a **SQL Editor** y ejecuta:

```sql
-- Política 1: Lectura pública
CREATE POLICY "Public Read Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'engineer-documents');

-- Política 2: Subida autenticada
CREATE POLICY "Authenticated Upload" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'engineer-documents' AND auth.role() = 'authenticated');

-- Política 3: Actualización autenticada
CREATE POLICY "Authenticated Update" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'engineer-documents' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'engineer-documents' AND auth.role() = 'authenticated');

-- Política 4: Eliminación autenticada
CREATE POLICY "Authenticated Delete" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'engineer-documents' AND auth.role() = 'authenticated');
```

---

## 🎯 Resumen

| Política | Operación | Quién | Condición |
|----------|-----------|-------|-----------|
| Public Read | SELECT | Todos | bucket_id = 'engineer-documents' |
| Authenticated Upload | INSERT | Autenticados | bucket_id = 'engineer-documents' |
| Authenticated Update | UPDATE | Autenticados | bucket_id = 'engineer-documents' |
| Authenticated Delete | DELETE | Autenticados | bucket_id = 'engineer-documents' |

---

## ✅ Después de crear las políticas

1. Recarga el navegador (Ctrl+Shift+R)
2. Intenta subir un PDF
3. Debe funcionar ✅

---

**Nota**: Las políticas de Storage son DIFERENTES a las políticas RLS de tablas.
- **Storage policies** → Controlan acceso a archivos en buckets
- **RLS policies** → Controlan acceso a datos en tablas
