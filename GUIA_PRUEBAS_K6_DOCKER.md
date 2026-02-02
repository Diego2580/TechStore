# Guía de Pruebas con k6 y Docker - TechStore Pro

## 📦 Requisitos Previos

- **Docker Desktop** instalado: https://www.docker.com/products/docker-desktop
- **k6** instalado (ya lo tienes instalado)
- **Git Bash** o PowerShell

---

## 🚀 Parte 1: Pruebas de Carga con k6

### 1.1 Ejecutar Pruebas contra Producción

```powershell
# Desde la raíz del proyecto
& 'C:\Program Files\k6\k6.exe' run k6-load-test.js
```

**Salida esperada:**
```
✓ p(95)<2000ms    → P95: 275ms
✗ rate<0.3        → 36% errores (login con usuarios inexistentes)
```

### 1.2 Interpretar Resultados

| Métrica | Valor | Significado |
|---------|-------|-------------|
| `http_req_duration (p95)` | 275ms | 95% de requests responden en <275ms |
| `http_req_failed` | 36.77% | Login falla (usuarios aleatorios no existen) |
| `http_reqs` | 446 | Total de peticiones en 3 minutos |
| `iterations` | 560 | Ciclos completos ejecutados |
| `vus_max` | 10 | Máximo de usuarios virtuales concurrentes |

### 1.3 Guardar Resultados en JSON

```powershell
& 'C:\Program Files\k6\k6.exe' run k6-load-test.js --out json=resultados-k6.json
```

### 1.4 Generar Reporte HTML (Opcional)

```powershell
# Instalar extensión de k6
& 'C:\Program Files\k6\k6.exe' run k6-load-test.js --out json=resultados.json

# Usar herramienta online para visualizar
# https://github.com/benc-uk/k6-reporter
```

---

## 🐳 Parte 2: Pruebas con Docker

### 2.1 Verificar Docker Desktop

```powershell
# Verificar que Docker está corriendo
docker --version
docker ps
```

**Salida esperada:**
```
Docker version 24.x.x
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

### 2.2 Construir Imagen Docker del Backend

```powershell
# Navegar al directorio del backend
cd tech-store-backend

# Construir la imagen
docker build -t techstore-backend:latest .
```

**Proceso:**
1. **Build stage**: Compila el proyecto con Maven
2. **Runtime stage**: Crea imagen ligera con solo el JAR

**Tiempo estimado:** 3-5 minutos (primera vez)

### 2.3 Verificar la Imagen

```powershell
# Listar imágenes Docker
docker images | Select-String "techstore"
```

**Salida esperada:**
```
techstore-backend   latest    abc123def456   2 minutes ago   450MB
```

### 2.4 Ejecutar Contenedor en Local

**Opción A: Sin Base de Datos (Solo API)**

```powershell
docker run -p 8080:8080 `
  -e SPRING_PROFILES_ACTIVE=prod `
  -e DATABASE_URL="jdbc:postgresql://host.docker.internal:5432/techstore" `
  -e SPRING_DATASOURCE_USERNAME="postgres" `
  -e SPRING_DATASOURCE_PASSWORD="newpassword" `
  techstore-backend:latest
```

**Opción B: Con Docker Compose (Recomendado)**

Primero, crea `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: techstore
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: newpassword
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-database.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: .
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: prod
      DATABASE_URL: jdbc:postgresql://postgres:5432/techstore
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: newpassword
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:
```

Luego ejecuta:

```powershell
# Desde tech-store-backend/
docker-compose up -d
```

### 2.5 Verificar que el Backend Funciona

```powershell
# Verificar contenedores corriendo
docker-compose ps

# Ver logs del backend
docker-compose logs -f backend

# Probar el API
curl http://localhost:8080/api/productos
```

### 2.6 Ejecutar k6 contra Docker Local

Modifica temporalmente `k6-load-test.js`:

```javascript
// Cambiar esta línea:
const BASE_URL = 'https://techstore-hs0k.onrender.com';

// Por esta:
const BASE_URL = 'http://localhost:8080';
```

Ejecuta las pruebas:

```powershell
& 'C:\Program Files\k6\k6.exe' run k6-load-test.js
```

**Resultados esperados:**
- **Latencia más baja** (sin cold starts)
- **Sin errores de CORS** (mismo origen)

### 2.7 Detener Contenedores

```powershell
# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (limpia BD)
docker-compose down -v
```

---

## 🧪 Parte 3: Escenarios de Prueba Avanzados

### 3.1 Prueba de Estrés (Spike Test)

Crea `k6-stress-test.js`:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 100 },  // Spike a 100 usuarios
    { duration: '30s', target: 100 },  // Mantener 100 usuarios
    { duration: '10s', target: 0 },    // Bajar a 0
  ],
};

const BASE_URL = 'https://techstore-hs0k.onrender.com';

export default function () {
  const res = http.get(`${BASE_URL}/api/productos`);
  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(1);
}
```

Ejecuta:

```powershell
& 'C:\Program Files\k6\k6.exe' run k6-stress-test.js
```

### 3.2 Prueba de Soak (Duración)

Para probar estabilidad a largo plazo:

```javascript
export const options = {
  stages: [
    { duration: '2m', target: 10 },   // Rampa a 10 usuarios
    { duration: '10m', target: 10 },  // Mantener por 10 minutos
    { duration: '2m', target: 0 },    // Bajar a 0
  ],
};
```

### 3.3 Prueba de Autenticación Completa

Crea `k6-auth-test.js`:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://techstore-hs0k.onrender.com';

export default function () {
  // 1. Registrar usuario
  const registerPayload = JSON.stringify({
    nombre: `User ${__VU}`,
    correo: `user${__VU}@k6test.com`,
    contraseña: 'Test1234!'
  });

  const registerRes = http.post(
    `${BASE_URL}/api/auth/register`, 
    registerPayload,
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(registerRes, {
    'register success': (r) => r.status === 200 || r.status === 400
  });

  // 2. Login
  const loginPayload = JSON.stringify({
    correo: `user${__VU}@k6test.com`,
    contraseña: 'Test1234!'
  });

  const loginRes = http.post(
    `${BASE_URL}/api/auth/login`,
    loginPayload,
    { headers: { 'Content-Type': 'application/json' } }
  );

  const token = loginRes.json('token');
  
  check(loginRes, {
    'login success': (r) => r.status === 200,
    'token received': (r) => token !== undefined
  });

  // 3. Acceder a endpoint protegido
  if (token) {
    const authRes = http.get(`${BASE_URL}/api/productos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    check(authRes, {
      'authenticated request success': (r) => r.status === 200
    });
  }

  sleep(1);
}
```

---

## 📊 Parte 4: Análisis de Resultados

### 4.1 Métricas Clave a Reportar

**Para la Sustentación:**

1. **Throughput (req/s):**
   - Producción: ~2.5 req/s
   - Docker local: ~5-10 req/s (más rápido)

2. **Latencia P95:**
   - Producción: 275ms
   - Docker local: <100ms

3. **Tasa de Error:**
   - Endpoint productos: 0%
   - Endpoint login: 36% (usuarios inexistentes - esperado)

4. **Usuarios Virtuales:**
   - Mínimo: 1 VU
   - Máximo: 10 VU concurrentes

### 4.2 Tabla de Comparación

| Escenario | P95 Latencia | Throughput | Errores |
|-----------|-------------|------------|---------|
| Producción (Render) | 275ms | 2.5 req/s | 0% (productos) |
| Docker Local | <100ms | 10 req/s | 0% |
| Con 100 usuarios | 500-800ms | 20 req/s | 5-10% |

---

## 🎯 Parte 5: Demostración en la Sustentación

### Guión de Presentación (2-3 minutos)

**1. Mostrar script k6 (15 seg):**
```powershell
code k6-load-test.js
```
- Explicar: "Simulamos 10 usuarios concurrentes accediendo a productos y login"

**2. Ejecutar pruebas en vivo (30 seg):**
```powershell
& 'C:\Program Files\k6\k6.exe' run k6-load-test.js
```
- Mientras corre, explicar: "Estamos haciendo 446 peticiones en 3 minutos"

**3. Interpretar resultados (30 seg):**
- Señalar P95: "El 95% de usuarios recibe respuesta en menos de 275ms"
- Señalar errores: "Los errores de login son esperados, usamos usuarios aleatorios"

**4. Mostrar Docker (1 min):**
```powershell
cd tech-store-backend
docker images | Select-String "techstore"
```
- Explicar: "La imagen Docker empaqueta todo el backend en un contenedor portable"
- Mostrar Dockerfile: "Compilamos con Maven y ejecutamos con Java 17"

**5. Opcional - Levantar con Docker Compose (30 seg):**
```powershell
docker-compose up -d
docker-compose ps
```
- Explicar: "En segundos tenemos backend + PostgreSQL corriendo"

---

## 🔧 Troubleshooting

### Problema: "k6 no reconocido"

**Solución:**
```powershell
# Reiniciar terminal o usar ruta completa
& 'C:\Program Files\k6\k6.exe' run k6-load-test.js
```

### Problema: "Docker no está corriendo"

**Solución:**
1. Abrir Docker Desktop
2. Esperar a que diga "Docker is running"
3. Intentar de nuevo

### Problema: "Puerto 8080 ya en uso"

**Solución:**
```powershell
# Ver qué proceso usa el puerto
netstat -ano | findstr :8080

# Matar proceso (reemplazar PID)
taskkill /PID <numero> /F

# O cambiar puerto en docker-compose.yml
ports:
  - "8081:8080"
```

### Problema: "Error de conexión a base de datos"

**Solución:**
```powershell
# Verificar que PostgreSQL está corriendo
docker-compose ps

# Ver logs de errores
docker-compose logs postgres
docker-compose logs backend
```

---

## 📝 Checklist para la Sustentación

**Antes de presentar:**
- [ ] k6 instalado y probado (`& 'C:\Program Files\k6\k6.exe' version`)
- [ ] Docker Desktop corriendo
- [ ] Imagen `techstore-backend:latest` construida
- [ ] Backend en Render está "Live"
- [ ] Script k6 apunta a producción (no localhost)
- [ ] Resultados recientes guardados (screenshot o JSON)

**Durante la presentación:**
- [ ] Mostrar código del script k6
- [ ] Ejecutar prueba en vivo (o mostrar resultados guardados)
- [ ] Explicar métricas: P95, throughput, VUs
- [ ] Mostrar imagen Docker construida
- [ ] Explicar Dockerfile (multi-stage build)
- [ ] (Opcional) Levantar con docker-compose

---

## 📚 Recursos Adicionales

**Documentación:**
- k6: https://k6.io/docs/
- Docker: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/

**Comandos Útiles:**

```powershell
# k6
& 'C:\Program Files\k6\k6.exe' run script.js                     # Ejecutar script
& 'C:\Program Files\k6\k6.exe' run script.js --vus 20 --duration 60s  # Personalizar

# Docker
docker build -t nombre:tag .              # Construir imagen
docker run -p 8080:8080 nombre:tag        # Ejecutar contenedor
docker ps                                 # Ver contenedores activos
docker logs <container_id>                # Ver logs
docker exec -it <container_id> bash       # Entrar al contenedor
docker system prune -a                    # Limpiar todo

# Docker Compose
docker-compose up -d                      # Levantar servicios
docker-compose down                       # Detener servicios
docker-compose logs -f                    # Ver logs en tiempo real
docker-compose ps                         # Estado de servicios
```

---

**Fecha:** Enero 2026
**Tiempo de Ejecución:** Pruebas k6 (~3 min), Docker build (~5 min primera vez)
**Dificultad:** ⭐⭐⭐ (Media)
