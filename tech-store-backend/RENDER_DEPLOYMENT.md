# Tech Store Backend - Render Deployment

## Requisitos previos
- Cuenta en [Render.com](https://render.com)
- Repositorio GitHub con el código
- Base de datos PostgreSQL en Render

## Pasos para desplegar en Render

### 1. Crear base de datos PostgreSQL en Render
1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Click en **New +** → **PostgreSQL**
3. Llena los datos:
   - **Name**: `tech-store-db`
   - **Database**: `techstore`
   - **User**: `postgres`
   - Deja otros valores por defecto
4. Click **Create Database**
5. Espera a que se cree (tarda ~2 min)
6. Copia la **Internal Database URL** (tendrá formato: `postgresql://user:pass@host:5432/dbname`)

### 2. Crear servicio Web para el Backend
1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Click en **New +** → **Web Service**
3. Conecta tu repositorio GitHub:
   - Click **Connect account** si es la primera vez
   - Selecciona `tech-store-angular` (o el nombre de tu repo)
4. Llena los datos del servicio:
   - **Name**: `tech-store-backend`
   - **Runtime**: `Docker`
   - **Build Command**: (dejar vacío, Render detecta el Dockerfile)
   - **Start Command**: (dejar vacío)
5. Despliegue:
   - **Plan**: Free (o Pro si necesitas más recursos)
6. En la sección **Environment**:
   - Click **Add Environment Variable**
   - Agrega:
     ```
     DATABASE_URL = postgresql://user:pass@host:5432/techstore
     CORS_ORIGINS = https://tu-frontend-en-render.onrender.com
     ```
   - La `DATABASE_URL` la copias del paso 1
7. Click **Create Web Service**
8. Espera a que compile y despliegue (tarda ~5-10 min)

### 3. Obtener la URL del backend
Cuando el deploy esté listo, Render te asignará una URL como:
```
https://tech-store-backend-xxxx.onrender.com
```

### 4. Actualizar el frontend
En el frontend Angular, actualiza la URL del backend:
```typescript
// src/app/services/api.service.ts
private readonly API_URL = 'https://tech-store-backend-xxxx.onrender.com/api/productos';

// src/app/services/auth.service.ts
private readonly API_URL = 'https://tech-store-backend-xxxx.onrender.com/api/auth';
```

### 5. Desplegar el frontend en Render (opcional)
Si quieres el frontend también en Render:
1. Click **New +** → **Web Service**
2. Selecciona el repositorio
3. **Build Command**: `npm run build`
4. **Start Command**: `npx serve -s dist/tech-store-angular/browser -l 3000`
5. Agrega variable de entorno si necesitas
6. Click **Create Web Service**

## Notas importantes
- El tier Free en Render duerme después de 15 min de inactividad
- Para producción, considera usar un plan de pago
- Si la BD PostgreSQL está en Render, asegúrate que sea **Internal** para mejor rendimiento
- Render recrea el contenedor en cada push a GitHub

## Troubleshooting
Si el backend falla:
1. Ve a **Logs** en Render para ver errores
2. Verifica que la `DATABASE_URL` sea correcta
3. Revisa que el Dockerfile esté en la raíz del repo (o en `tech-store-backend/Dockerfile`)
4. Asegúrate que `pom.xml` existe en la carpeta correcta

## Links útiles
- [Render Docs - Docker](https://render.com/docs/docker)
- [Render Docs - PostgreSQL](https://render.com/docs/databases)
