# 🚀 Instrucciones de Deploy a Render - Tech Store Backend

## 📌 URLs Configuradas

### Frontend (Vercel)
```
https://tech-store-two-pi.vercel.app
```

### Backend (Render)
```
https://techstore-hs0k.onrender.com
```

### Swagger (Producción)
```
https://techstore-hs0k.onrender.com/swagger-ui.html
```

---

## ✅ Cambios Realizados para Producción

### 1. CORS Actualizado
Se configuró **CORS en todos los controllers** para permitir solicitudes desde Vercel:

```java
@CrossOrigin(origins = {
    "http://localhost:4200",                      // Desarrollo local
    "https://tech-store-two-pi.vercel.app"        // Vercel Production
})
```

**Controllers actualizados:**
- ✅ AuthController (`/api/auth`)
- ✅ ProductoController (`/api/productos`)
- ✅ NosotrosController (`/api/nosotros`)

### 2. OpenAPI Configuration Actualizada
```java
.servers(List.of(
    new Server()
        .url("http://localhost:8080")
        .description("Servidor de Desarrollo Local"),
    new Server()
        .url("https://techstore-hs0k.onrender.com")
        .description("Servidor de Producción (Render)")
))
```

---

## 📦 Archivo JAR Generado

**Ubicación:**
```
tech-store-backend/target/tech-store-backend-1.0.0.jar
```

**Tamaño:** ~60 MB (incluye todas las dependencias)

**Build Status:** ✅ SUCCESS

---

## 🚀 Pasos para Desplegar a Render

### Opción 1: Desde GitHub (Recomendado - Auto Deploy)

Si tu repositorio está en GitHub:

1. **Push a GitHub:**
   ```bash
   git add .
   git commit -m "feat: CORS actualizado para producción + Swagger configurado"
   git push origin main
   ```

2. **En Render Dashboard:**
   - Ve a https://dashboard.render.com
   - Haz clic en tu servicio "tech-store-backend"
   - Haz clic en "Manual Deploy" → "Deploy latest commit"
   - O configura "Auto-deploy" si ya está vinculado

### Opción 2: Subir JAR Directamente

Si Render soporta upload de JAR:

1. **Ir a Render Dashboard**
2. Seleccionar "tech-store-backend"
3. Buscar opción de upload
4. Subir `target/tech-store-backend-1.0.0.jar`
5. Haz clic en Deploy

---

## 🔧 Verificación Post-Deploy

### ✅ Test 1: Health Check
```bash
curl https://techstore-hs0k.onrender.com/swagger-ui.html
```
Debería devolver status `200 OK`

### ✅ Test 2: Swagger Accesible
```
https://techstore-hs0k.onrender.com/swagger-ui.html
```
Debe mostrar la interfaz de Swagger con todos los endpoints

### ✅ Test 3: Probar Endpoint
```bash
curl https://techstore-hs0k.onrender.com/api/productos
```
Debe devolver lista de productos

### ✅ Test 4: Desde Vercel Frontend
El frontend en Vercel debe poder consumir los endpoints sin errores de CORS

---

## 📋 Checklist Pre-Deploy

- [x] CORS configurado para Vercel
- [x] OpenAPI actualizado con URLs de Render
- [x] JAR compilado exitosamente
- [x] Build status: SUCCESS
- [x] No hay errores de compilación
- [x] Base de datos en Render está funcional
- [ ] Deploy ejecutado

---

## 🔐 Variables de Entorno en Render

Asegurate que estas variables estén configuradas:

```
DATABASE_URL=postgresql://usuario:contraseña@host:5432/techstore
SPRING_PROFILES_ACTIVE=prod
```

En Render Dashboard:
1. Servicio → Settings
2. Environment → Add Environment Variable
3. Nombre: `DATABASE_URL`
4. Value: Tu connection string de PostgreSQL

---

## 📊 Monitoreo Post-Deploy

### URLs a Monitorear

| Endpoint | Método | URL |
|----------|--------|-----|
| Swagger UI | GET | `https://techstore-hs0k.onrender.com/swagger-ui.html` |
| OpenAPI JSON | GET | `https://techstore-hs0k.onrender.com/v3/api-docs` |
| Get Products | GET | `https://techstore-hs0k.onrender.com/api/productos` |
| Auth Login | POST | `https://techstore-hs0k.onrender.com/api/auth/login` |

---

## 🐛 Solución de Problemas

### ❌ "CORS Error en Vercel"
**Solución:** Verifica que CORS esté actualizado con la URL de Vercel
```java
@CrossOrigin(origins = {
    "http://localhost:4200",
    "https://tech-store-two-pi.vercel.app"  // ← Verifica esta URL
})
```

### ❌ "Swagger no abre en Render"
**Solución:**
1. Verifica que el servicio esté corriendo (green status en Dashboard)
2. Intenta acceder a `/swagger-ui.html`
3. Revisa logs en Render: Dashboard → Logs

### ❌ "Database connection error"
**Solución:**
1. Verifica `DATABASE_URL` en Environment Variables
2. Asegúrate que la BD en Render esté activa
3. Revisa que el usuario tenga permisos en la BD

### ❌ "403 Forbidden desde Vercel"
**Solución:** El CORS está rechazando. Verifica:
1. La URL exacta de Vercel es correcta
2. Sin trailing slashes en la URL
3. Usa `https://` (no `http://`)

---

## 📝 Información del Deploy

**Fecha de Compilación:** 28 de Enero de 2026  
**Build System:** Maven 3.9.x  
**Java Version:** 17  
**Spring Boot Version:** 3.3.0  
**Target:** Render (OnRender.com)  
**Base de Datos:** PostgreSQL  

---

## 🎯 Flujo Completo de Testing Post-Deploy

Una vez deployado, prueba este flujo:

### 1. Abrir Swagger
```
https://techstore-hs0k.onrender.com/swagger-ui.html
```

### 2. Registrar Usuario
```
POST /api/auth/register
{
  "username": "testprod",
  "password": "test123"
}
```
✅ Response: 201 Created

### 3. Login
```
POST /api/auth/login
{
  "username": "testprod",
  "password": "test123"
}
```
✅ Response: 200 OK con token

### 4. Crear Producto
```
POST /api/productos
{
  "nombre": "Test Producto",
  "precio": 99.99,
  "imagenUrl": "test.jpg"
}
```
✅ Response: 201 Created

### 5. Listar Productos
```
GET /api/productos
```
✅ Response: 200 OK con array

### 6. Desde Vercel Frontend
Accede a https://tech-store-two-pi.vercel.app y verifica que:
- ✅ Pueda listar productos
- ✅ Pueda registrarse
- ✅ Pueda hacer login
- ✅ No haya errores de CORS en consola

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs en Render Dashboard
2. Verifica CORS en los controllers
3. Confirma que DATABASE_URL está correcto
4. Verifica que Vercel tenga la URL correcta del backend

---

**Status:** ✅ Listo para Deploy  
**Swagger:** ✅ Funcional en localhost:8080  
**CORS:** ✅ Configurado para Vercel  
**Build:** ✅ SUCCESS (4.757s)
