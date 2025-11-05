# ✅ Checklist Pre-Commit

Antes de hacer commit y push a Git, verifica lo siguiente:

## 🔍 Verificaciones Obligatorias

### 1. Variables de Entorno
- [ ] El archivo `.env.local` NO está incluido en el commit
- [ ] El archivo `.env.example` está actualizado con todas las variables necesarias
- [ ] Las credenciales de Supabase no están hardcodeadas en ningún archivo

### 2. Dependencias
- [ ] Todas las dependencias necesarias están en `package.json`
- [ ] No hay dependencias sin usar
- [ ] Las versiones de las dependencias son compatibles

### 3. Código
- [ ] No hay `console.log()` de debug olvidados
- [ ] No hay comentarios TODO sin resolver críticos
- [ ] El código sigue las convenciones del proyecto
- [ ] No hay código comentado innecesario

### 4. Base de Datos
- [ ] El archivo `database/ingwork_database.sql` está actualizado
- [ ] Las migraciones están documentadas si las hay
- [ ] No hay credenciales de BD en el código

### 5. Documentación
- [ ] `README.md` está actualizado
- [ ] `CHANGELOG.md` refleja los cambios realizados
- [ ] Los comentarios en el código son claros

### 6. Testing (Opcional pero recomendado)
- [ ] Las funcionalidades principales fueron probadas manualmente
- [ ] No hay errores en la consola del navegador
- [ ] Las páginas cargan correctamente

## 📋 Verificación de Archivos Modificados

### Archivos que DEBEN estar en el commit:
```
✅ .gitignore (actualizado)
✅ README.md (actualizado)
✅ CHANGELOG.md (nuevo)
✅ SETUP.md (nuevo)
✅ .env.example (nuevo)
✅ src/app/auth/register/page.tsx (modificado)
✅ src/app/dashboard/client/projects/new/page.tsx (modificado)
✅ src/app/dashboard/engineer/page.tsx (modificado)
✅ src/app/dashboard/engineer/profile/page.tsx (modificado)
✅ src/app/onboarding/page.tsx (modificado)
✅ src/components/ui/star-rating.tsx (nuevo)
✅ src/components/ui/rating-modal.tsx (nuevo)
```

### Archivos que NO DEBEN estar en el commit:
```
❌ .env.local
❌ .env
❌ node_modules/
❌ .next/
❌ *.log
❌ .vscode/ (configuraciones personales)
```

## 🚀 Comandos para Commit

Una vez verificado todo:

```bash
# Ver el estado actual
git status

# Agregar todos los archivos modificados
git add .

# Verificar qué se va a commitear
git status

# Hacer el commit con un mensaje descriptivo
git commit -m "feat: Implementar correcciones y sistema de calificaciones

- Fix: Eliminar campo privacy inexistente en proyectos
- Fix: Cambiar 'Tarifa por hora' a 'Carnet de colegiatura'
- Feat: Agregar campos de teléfono y ubicación en registro de clientes
- Feat: Implementar sistema de calificación con estrellas (1-5)
- Docs: Actualizar README, crear SETUP.md y CHANGELOG.md
- Config: Actualizar .gitignore y agregar .env.example"

# Subir a GitHub
git push origin main
```

## 🔄 Después del Push

1. Verificar en GitHub que todos los archivos se subieron correctamente
2. Revisar que no haya información sensible expuesta
3. Actualizar el README en GitHub si es necesario
4. Crear un release/tag si es una versión importante

## ⚠️ Si algo salió mal

### Deshacer el último commit (antes de push):
```bash
git reset --soft HEAD~1
```

### Deshacer cambios en un archivo específico:
```bash
git restore <archivo>
```

### Ver diferencias antes de commitear:
```bash
git diff
```

---

**Nota**: Este checklist es una guía. Ajústalo según las necesidades de tu equipo.
