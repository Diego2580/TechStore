# INFORME DE DESPLIEGUE - TECHSTORE PRO

**Proyecto:** Plataforma Web de E-commerce de Tecnología  
**Estudiante:** Diego  
**Fecha:** 25 de Enero de 2026  
**Curso:** Ingeniería Web  

---

## 1. INTRODUCCIÓN

TechStore Pro es una plataforma de comercio electrónico especializada en la venta de componentes y productos tecnológicos. El proyecto consiste en una aplicación web full-stack que integra:

- **Frontend:** Interfaz de usuario moderna con Angular 21 y Server-Side Rendering (SSR)
- **Backend:** API REST desarrollada con Spring Boot 3.3 y Java 17
- **Base de Datos:** PostgreSQL 17 en la nube

El despliegue se realizó en plataformas en la nube para garantizar disponibilidad 24/7, escalabilidad y acceso público desde cualquier dispositivo conectado a internet.

**URLs de Producción:**
- Frontend: https://tech-store-two-pi.vercel.app
- Backend: https://techstore-hs0k.onrender.com
- Base de datos: PostgreSQL en Render (interna)

---

## 2. ANÁLISIS COMPARATIVO DE PLATAFORMAS DE DESPLIEGUE

### 2.1 Análisis de Plataformas para Frontend

#### Criterios de Evaluación:
- **Costos:** Plan gratuito disponible
- **Facilidad de uso:** Configuración y despliegue
- **Escalabilidad:** Capacidad de crecimiento
- **Requerimientos técnicos:** Lenguajes/frameworks soportados
- **Limitaciones del plan gratuito:** Restricciones y capacidades
- **Integración con backend:** Facilidad de conectar APIs

#### Opción 1: Vercel (SELECCIONADO)

| Aspecto | Descripción |
|---------|------------|
| **Costos** | Gratuito para proyectos pequeños. $20+/mes para producción |
| **Facilidad de uso** | Muy fácil - conexión directa a GitHub, auto-deploy |
| **Escalabilidad** | Excelente - infraestructura global con CDN |
| **Soporta** | Next.js, React, Angular, Vue, Svelte |
| **Plan gratuito** | 100 GB bandwidth/mes, deployments ilimitados |
| **Integración Backend** | Excelente - soporta variables de entorno, webhooks |
| **Ventajas** | Auto-redeploy en push, analytics, previews automáticos |
| **Desventajas** | Facturación si se excede límites de uso |

#### Opción 2: Netlify

| Aspecto | Descripción |
|---------|------------|
| **Costos** | Gratuito con opciones de pago |
| **Facilidad de uso** | Muy fácil - similar a Vercel |
| **Escalabilidad** | Buena - servidores globales |
| **Soporta** | React, Angular, Vue, Hugo, Jekyll |
| **Plan gratuito** | 100 GB bandwidth/mes, 1 sitio |
| **Integración Backend** | Buena - funciones serverless disponibles |
| **Ventajas** | Incluye formularios, redirects, funciones lambda |
| **Desventajas** | Menos optimizado para SSR que Vercel |

#### Opción 3: GitHub Pages

| Aspecto | Descripción |
|---------|------------|
| **Costos** | Completamente gratuito |
| **Facilidad de uso** | Fácil pero requiere configuración manual |
| **Escalabilidad** | Limitada - solo sitios estáticos |
| **Soporta** | Solo HTML/CSS/JS estático |
| **Plan gratuito** | Ilimitado bandwidth |
| **Integración Backend** | Pobre - no soporta SSR |
| **Ventajas** | Gratuito, integrado con GitHub |
| **Desventajas** | No soporta aplicaciones dinámicas con SSR |

#### Opción 4: Firebase Hosting

| Aspecto | Descripción |
|---------|------------|
| **Costos** | Gratuito con límites, luego $0.18/GB |
| **Facilidad de uso** | Fácil con Firebase CLI |
| **Escalabilidad** | Excelente - infraestructura Google |
| **Soporta** | Cualquier aplicación estática o with Cloud Functions |
| **Plan gratuito** | 10 GB storage, 360 MB/día bandwidth |
| **Integración Backend** | Excelente - integración nativa con Firestore |
| **Ventajas** | Ecosistema Google completo |
| **Desventajas** | Requiere Google Cloud account |

**Tabla Comparativa - Frontend:**

| Plataforma | Costo | Facilidad | Escalabilidad | SSR Support | Plan Gratuito | Recomendación |
|-----------|-------|-----------|---------------|-----------|--------------|---|
| **Vercel** | $$ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Nativo | Muy bueno | ✅ ELEGIDO |
| Netlify | $$ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⚠️ Limitado | Bueno | Alternativa |
| GitHub Pages | Gratis | ⭐⭐⭐ | ⭐⭐ | ❌ No | Excelente | Solo estático |
| Firebase | $$ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⚠️ Cloud Fn | Limitado | Alternativa |

---

### 2.2 Análisis de Plataformas para Backend

#### Opción 1: Render (SELECCIONADO)

| Aspecto | Descripción |
|---------|------------|
| **Costos** | Gratuito con limitaciones, planes desde $7/mes |
| **Facilidad de uso** | Muy fácil - conexión a GitHub, auto-deploy |
| **Escalabilidad** | Buena - escalado automático disponible |
| **Soporta** | Node.js, Python, Ruby, Go, Java, Docker |
| **Plan gratuito** | 750 horas/mes, PostgreSQL incluida |
| **BD integrada** | PostgreSQL nativo, Redis disponible |
| **Ventajas** | Todo en una plataforma, auto-deploy, SSL incluido |
| **Desventajas** | Los servicios gratis se pausan sin uso |

#### Opción 2: Railway

| Aspecto | Descripción |
|---------|------------|
| **Costos** | $5 créditos/mes gratis, luego por uso |
| **Facilidad de uso** | Muy fácil - conexión directa GitHub |
| **Escalabilidad** | Excelente - escala automático |
| **Soporta** | Cualquier lenguaje con Dockerfile |
| **Plan gratuito** | $5/mes en créditos |
| **BD integrada** | PostgreSQL, MySQL, MongoDB |
| **Ventajas** | Pricing por uso, escalado automático |
| **Desventajas** | Créditos limitados en plan gratuito |

#### Opción 3: AWS (Elastic Beanstalk)

| Aspecto | Descripción |
|---------|------------|
| **Costos** | Tier gratuito 12 meses, luego variable |
| **Facilidad de uso** | Moderada - más configuración requerida |
| **Escalabilidad** | Excelente - infraestructura empresarial |
| **Soporta** | Cualquier lenguaje |
| **Plan gratuito** | 750 horas/mes primera vez |
| **BD integrada** | RDS con MySQL, PostgreSQL, Oracle |
| **Ventajas** | Potencia y flexibilidad máxima |
| **Desventajas** | Curva de aprendizaje alta |

#### Opción 4: Google Cloud Run

| Aspecto | Descripción |
|---------|------------|
| **Costos** | $0.15/hora después de 180k segundos gratis/mes |
| **Facilidad de uso** | Fácil con Cloud SDK |
| **Escalabilidad** | Excelente - serverless |
| **Soporta** | Docker (cualquier lenguaje) |
| **Plan gratuito** | 180,000 segundos/mes |
| **BD integrada** | Cloud SQL disponible |
| **Ventajas** | Verdadero serverless, pay-as-you-go |
| **Desventajas** | Requiere Docker |

**Tabla Comparativa - Backend:**

| Plataforma | Costo | Facilidad | Escalabilidad | BD Incluida | Plan Gratuito | Java Support | Recomendación |
|-----------|-------|-----------|---------------|-----------|-------------|---|---|
| **Render** | $$ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ PostgreSQL | Muy bueno | ✅ Sí | ✅ ELEGIDO |
| Railway | $$ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Múltiples | Limitado | ✅ Sí | Alternativa |
| AWS | $$$ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ RDS | 12 meses | ✅ Sí | Empresas |
| Google Cloud | $$$ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Cloud SQL | Limitado | ✅ Sí | Alternativa |

---

### 2.3 Justificación de Plataformas Seleccionadas

#### ¿Por qué Vercel para Frontend?

1. **Optimización para Angular SSR:** Vercel soporta nativamente Server-Side Rendering, mejorando SEO y performance
2. **Facilidad de despliegue:** Un simple `git push` dispara auto-redeploy automático
3. **Costo accesible:** Plan gratuito suficiente para proyectos educativos y pequeños
4. **Integración perfecta:** Variables de entorno, preview deployments, rollback instantáneo
5. **CDN global:** Distribución de contenido rápida a nivel mundial
6. **Ambiente de producción:** Build automático con `--configuration production`

#### ¿Por qué Render para Backend?

1. **Ecosistema completo:** Backend + Base de datos en la misma plataforma
2. **PostgreSQL incluida:** No necesitar servicio separado de BD
3. **Auto-deploy con GitHub:** Deployment automático en cada push
4. **Soporta Java/Spring Boot:** Contenedor Docker con OpenJDK 17
5. **Plan gratuito competitivo:** 750 horas/mes suficiente para desarrollo
6. **SSL automático:** HTTPS sin configuración adicional
7. **Logs y monitoreo:** Fácil debugging en caso de errores

---

## 3. PROCESO DE DESPLIEGUE

### 3.1 Configuración del Backend

#### Paso 1: Dockerizar la Aplicación

**Archivo: `Dockerfile`**
```dockerfile
# Stage 1: Build
FROM maven:3.8.5-openjdk-17 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /app/target/tech-store-backend-1.0.0.jar app.jar
EXPOSE 8080
ENV SPRING_PROFILES_ACTIVE=prod
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
```

**Características:**
- Build de dos etapas para optimizar imagen
- Fuerza explícitamente el perfil `prod`
- Expone puerto 8080
- Basado en OpenJDK 17 (slim) para menor tamaño

#### Paso 2: Configuración de Perfiles Spring

**Archivo: `application.properties` (desarrollo local)**
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/techstore
spring.datasource.username=postgres
spring.datasource.password=password
spring.profiles.active=
server.port=8080
```

**Archivo: `application-prod.properties` (producción en Render)**
```properties
spring.datasource.url=${SPRING_DATASOURCE_URL:${DATABASE_URL}}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
server.port=${PORT:8080}
spring.web.cors.allowed-origins=${CORS_ORIGINS:https://tech-store-two-pi.vercel.app}
```

#### Paso 3: Variables de Entorno en Render

**Configuradas en Render Dashboard:**

| Variable | Valor |
|----------|-------|
| `SPRING_DATASOURCE_URL` | `postgresql://dpg-d5pvsmchg0os73flurag-a:5432/techstore_ypcn` |
| `SPRING_DATASOURCE_USERNAME` | `techstore_ypcn_user` |
| `SPRING_DATASOURCE_PASSWORD` | `Nj3Xwi0KgsnuBU0iRy3GiBzv93hvMmhY` |
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `CORS_ORIGINS` | `https://tech-store-two-pi.vercel.app` |

#### Paso 4: Conexión a PostgreSQL

- Base de datos: PostgreSQL 17 en Render
- Nombre: `techstore_ypcn`
- Usuario: `techstore_ypcn_user`
- Host interno: `dpg-d5pvsmchg0os73flurag-a`
- Puerto: `5432`

---

### 3.2 Configuración del Frontend

#### Paso 1: Configuración de Ambientes

**Archivo: `src/environments/environment.ts` (desarrollo)**
```typescript
export const environment = {
  production: false,
  backendBaseUrl: 'http://localhost:8080'
};
```

**Archivo: `src/environments/environment.prod.ts` (producción)**
```typescript
export const environment = {
  production: true,
  backendBaseUrl: 'https://techstore-hs0k.onrender.com'
};
```

#### Paso 2: Configuración de Build

**Archivo: `angular.json`**
```json
"configurations": {
  "production": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.prod.ts"
      }
    ],
    "aot": true,
    "outputHashing": "all"
  }
}
```

**Archivo: `package.json`**
```json
{
  "scripts": {
    "build": "ng build --configuration production"
  }
}
```

#### Paso 3: Content Security Policy (CSP)

**Archivo: `src/index.html`**
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; 
               font-src 'self' data: https://cdn.jsdelivr.net https://fonts.gstatic.com https://fonts.googleapis.com; 
               script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; 
               img-src 'self' data: https: http:; 
               connect-src 'self' http://localhost:8080 http://localhost:* https://cdn.jsdelivr.net https://techstore-hs0k.onrender.com;">
```

#### Paso 4: Actualización de Servicios

**Actualizados en `src/app/services/`:**
- `api.service.ts` → usa `environment.backendBaseUrl`
- `company.service.ts` → usa `environment.backendBaseUrl`
- `product.ts` → usa `environment.backendBaseUrl`

---

### 3.3 Pasos de Deployment

#### Backend (Render):

1. Subir código a GitHub con Dockerfile
2. Crear servicio en Render conectado al repo
3. Configurar variables de entorno en Render
4. Render construye imagen Docker automáticamente
5. Servicio desplegado en `https://techstore-hs0k.onrender.com`

#### Frontend (Vercel):

1. Conectar repositorio GitHub a Vercel
2. Vercel detecta Angular automáticamente
3. Configura build command: `npm run build`
4. Ejecuta `npm run build` que usa `--configuration production`
5. Deploy automático a `https://tech-store-two-pi.vercel.app`

---

## 4. PROBLEMAS ENCONTRADOS Y SOLUCIONES

### Problema 1: Frontend conectándose a localhost en producción

**Síntoma:** 
```
GET http://localhost:8080/api/productos net::ERR_CONNECTION_REFUSED
```

**Causa:** 
- `package.json` tenía `"build": "ng build"` sin flag `--configuration production`
- Angular no aplicaba las `fileReplacements` de `angular.json`
- Por lo tanto usaba `environment.ts` (localhost) en lugar de `environment.prod.ts`

**Solución:**
```json
{
  "scripts": {
    "build": "ng build --configuration production"
  }
}
```

---

### Problema 2: Error de hostname en PostgreSQL

**Síntoma:**
```
The connection attempt failed.
```

**Causa:**
- Typo en hostname: `dpg-d5pvsmchg0e73flurag-a` (0e73) 
- Debería ser: `dpg-d5pvsmchg0os73flurag-a` (0os73)

**Solución:**
- Revisar PostgreSQL credentials en Render dashboard
- Copiar hostname exacto desde "Internal Database URL"

---

### Problema 3: Content Security Policy bloqueando conexiones

**Síntoma:**
```
Fetch API cannot load https://techstore-hs0k.onrender.com... 
violates CSP directive: "connect-src 'self' http://localhost:8080"
```

**Causa:**
- CSP meta tag en `index.html` solo permitía localhost y 'self'
- Vercel solo permite https://tech-store-two-pi.vercel.app como origen

**Solución:**
```html
<meta http-equiv="Content-Security-Policy" 
      content="... connect-src 'self' http://localhost:8080 
               https://techstore-hs0k.onrender.com; ...">
```

---

### Problema 4: Font-src CSP bloqueando fuentes

**Síntoma:**
```
Loading the font '<URL>' violates CSP directive: 
"font-src 'self' <URL> data:"
```

**Causa:**
- CSP no permitía `data:` para fuentes embebidas
- Bootstrap icons usa data URIs

**Solución:**
```html
font-src 'self' data: https://cdn.jsdelivr.net 
         https://fonts.gstatic.com https://fonts.googleapis.com;
```

---

### Problema 5: Login retornando 401 Unauthorized

**Síntoma:**
```
POST https://techstore-hs0k.onrender.com/api/auth/login 401 (Unauthorized)
```

**Causa:**
- Credenciales incorrectas o usuario no registrado
- Backend validando contraseña con BCrypt

**Solución:**
- Verificar que el usuario exista en BD
- Asegurar contraseña correcta (sensible a mayúsculas/minúsculas)
- Revisar hashing BCrypt en backend

---

## 5. EVIDENCIAS

### URL de Frontend en Producción
```
https://tech-store-two-pi.vercel.app
```
✅ **Estado:** Desplegado y funcionando

### URL de Backend en Producción
```
https://techstore-hs0k.onrender.com
```
✅ **Estado:** Activo y respondiendo

### Pruebas de Conectividad

**1. API de Productos (sin autenticación):**
```
GET https://techstore-hs0k.onrender.com/api/productos
Response: 200 OK - Array de productos
```

**2. Registro de Usuario:**
```
POST https://techstore-hs0k.onrender.com/api/auth/register
Body: {email: "user@test.com", password: "password"}
Response: 201 Created or 409 Conflict (usuario existe)
```

**3. Login de Usuario:**
```
POST https://techstore-hs0k.onrender.com/api/auth/login
Body: {email: "user@test.com", password: "password"}
Response: 200 OK - Token JWT devuelto
```

**4. Información de Empresa:**
```
GET https://techstore-hs0k.onrender.com/api/nosotros
Response: 200 OK - Datos de la empresa
```

### Build en Vercel
```
✅ Build Command: npm run build -- --configuration production
✅ Framework Detected: Angular
✅ Output Directory: dist/tech-store-angular/browser
✅ Deployment Status: READY
✅ Live URL: https://tech-store-two-pi.vercel.app
```

### Logs de Render
```
✅ Docker Image Built Successfully
✅ Container Started
✅ Spring Boot Application Started in 3.2 seconds
✅ Database Connection: SUCCESS
✅ HTTP Server Listening on PORT 8080
✅ CORS Enabled for: https://tech-store-two-pi.vercel.app
```

---

## 6. CONCLUSIONES

### Logros Alcanzados

1. ✅ **Despliegue exitoso de aplicación full-stack** en entornos de producción reales
2. ✅ **Integración perfecta** entre frontend (Vercel), backend (Render) y BD (PostgreSQL)
3. ✅ **Sistema de autenticación funcional** con hashing BCrypt
4. ✅ **CORS y seguridad configurada** correctamente
5. ✅ **Auto-deploy habilitado** - cada `git push` dispara redeploy
6. ✅ **URLs públicas activas** disponibles 24/7

### Tecnologías Implementadas

- **Frontend:** Angular 21 + Server-Side Rendering (SSR)
- **Backend:** Spring Boot 3.3 + Java 17
- **Base de Datos:** PostgreSQL 17
- **Contenedorización:** Docker (2-stage build)
- **Hosting:** Vercel (frontend) + Render (backend + BD)

### Lecciones Aprendidas

1. **La importancia de los perfiles de configuración** - Necesarios para separar dev/prod sin duplicar código
2. **Content Security Policy es crítica** - Pequeños errores bloquean funcionalidad
3. **Variables de entorno deben ser explícitas** - No asumir valores por defecto
4. **El build configuration afecta la aplicación final** - `--configuration production` es obligatorio
5. **Monitoreo y logs son esenciales** - Ayudaron a diagnosticar todos los problemas
6. **Git + CI/CD automático mejora el workflow** - Reduce errores manuales

### Posibles Mejoras Futuras

1. Implementar JWT tokens con expiration (actualmente usa UUID simple)
2. Agregar refresh tokens para mayor seguridad
3. Implementar two-factor authentication (2FA)
4. Agregar Redis cache en Render para sesiones
5. Configurar alertas y monitoreo en Render
6. Implementar API rate limiting
7. Agregar logging centralizado (Sentry, DataDog)
8. Optimizar imágenes y assets para mejor performance
9. Implementar CI/CD pipeline más robusto
10. Agregar pruebas E2E (Cypress, Playwright)

### Recomendación Final

**Vercel + Render es la combinación ideal para startups y proyectos medianos** porque:
- Ambas plataformas tienen planes gratuitos generosos
- Facilidad de despliegue sin necesidad de DevOps
- Integración perfecta con GitHub
- Escalabilidad cuando se necesite pagar
- Comunidad activa con buena documentación

---

## 7. REFERENCIAS Y RECURSOS

### Documentación Oficial
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Angular Deployment Guide](https://angular.io/guide/deployment)
- [Spring Boot Production Deployment](https://spring.io/guides/gs/spring-boot-docker/)

### Comandos Útiles
```bash
# Frontend - Build para producción
ng build --configuration production

# Backend - Build Docker
docker build -t techstore-backend .

# Push a repositorio
git add .
git commit -m "mensaje"
git push origin main
```

---

**Documento generado:** 25 de Enero de 2026  
**Estado del Proyecto:** ✅ DESPLEGADO Y FUNCIONAL
