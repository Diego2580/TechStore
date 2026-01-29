# 🚀 Swagger API Documentation - Tech Store

## 📌 Acceso a Swagger UI

La documentación interactiva de la API está disponible en:

### URL Local (Desarrollo)
```
http://localhost:8080/swagger-ui.html
```

### Alternativas
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`
- **OpenAPI YAML**: `http://localhost:8080/v3/api-docs.yaml`

---

## 🎯 Características de Swagger

✅ **Documentación Automática**: Se genera automáticamente a partir del código  
✅ **Interfaz Interactiva**: Prueba endpoints directamente desde el navegador  
✅ **Try it Out**: Botón para ejecutar requests sin herramientas externas  
✅ **Schemas Automáticos**: DTOs y modelos documentados automáticamente  
✅ **Códigos de Estado**: Respuestas posibles (200, 400, 404, 500, etc.)  

---

## 📚 Endpoints Disponibles

### 🔐 AUTENTICACIÓN (`/api/auth`)

#### 1️⃣ Registro de Usuario
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "nuevo_usuario",
  "password": "contraseña123"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "username": "nuevo_usuario"
}
```

**Posibles Respuestas:**
- `201 Created`: Usuario registrado exitosamente
- `409 Conflict`: El usuario ya existe
- `400 Bad Request`: Datos inválidos

---

#### 2️⃣ Inicio de Sesión
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "nuevo_usuario",
  "password": "contraseña123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "nuevo_usuario"
  }
}
```

**Posibles Respuestas:**
- `200 OK`: Login exitoso
- `401 Unauthorized`: Credenciales inválidas
- `400 Bad Request`: Datos inválidos

---

### 📦 PRODUCTOS (`/api/productos`)

#### 1️⃣ Obtener Todos los Productos
```
GET /api/productos
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "nombre": "Laptop",
    "precio": 1200.00,
    "imagenUrl": "laptop.jpg"
  },
  {
    "id": 2,
    "nombre": "Mouse",
    "precio": 25.00,
    "imagenUrl": "mouse.jpg"
  }
]
```

---

#### 2️⃣ Obtener Producto por ID
```
GET /api/productos/{id}
```

**Ejemplo:**
```
GET /api/productos/1
```

**Response (200 OK):**
```json
{
  "id": 1,
  "nombre": "Laptop",
  "precio": 1200.00,
  "imagenUrl": "laptop.jpg"
}
```

**Posibles Respuestas:**
- `200 OK`: Producto encontrado
- `404 Not Found`: Producto no existe

---

#### 3️⃣ Crear Nuevo Producto
```
POST /api/productos
```

**Request Body:**
```json
{
  "nombre": "Monitor 4K",
  "precio": 500.00,
  "imagenUrl": "monitor4k.jpg"
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "nombre": "Monitor 4K",
  "precio": 500.00,
  "imagenUrl": "monitor4k.jpg"
}
```

**Posibles Respuestas:**
- `201 Created`: Producto creado exitosamente
- `400 Bad Request`: Datos inválidos

---

#### 4️⃣ Actualizar Producto
```
PUT /api/productos/{id}
```

**Ejemplo:**
```
PUT /api/productos/1
```

**Request Body:**
```json
{
  "nombre": "Laptop Gamer",
  "precio": 1500.00,
  "imagenUrl": "laptop-gamer.jpg"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "nombre": "Laptop Gamer",
  "precio": 1500.00,
  "imagenUrl": "laptop-gamer.jpg"
}
```

**Posibles Respuestas:**
- `200 OK`: Producto actualizado exitosamente
- `404 Not Found`: Producto no existe
- `400 Bad Request`: Datos inválidos

---

#### 5️⃣ Eliminar Producto
```
DELETE /api/productos/{id}
```

**Ejemplo:**
```
DELETE /api/productos/1
```

**Response (204 No Content):**
```
[Sin contenido en respuesta]
```

**Posibles Respuestas:**
- `204 No Content`: Producto eliminado exitosamente
- `404 Not Found`: Producto no existe

---

## 🧪 Cómo Probar Endpoints en Swagger

### Paso 1: Abrir Swagger UI
1. Asegúrate que el backend está ejecutándose en `http://localhost:8080`
2. Ve a `http://localhost:8080/swagger-ui.html`

### Paso 2: Expandir Endpoint
1. Haz clic en el endpoint que deseas probar
2. Se expandirá mostrando los detalles

### Paso 3: Clickear "Try it out"
1. Busca el botón azul "Try it out"
2. Se habilitarán los campos para editar

### Paso 4: Llenar Datos
1. Ingresa los parámetros o body requeridos
2. Modifica según sea necesario

### Paso 5: Ejecutar
1. Haz clic en el botón "Execute"
2. Verás la respuesta en la sección "Response"

---

## 📊 Flujo Completo de Pruebas

### 1. Registrar Nuevo Usuario
```
POST /api/auth/register
{
  "username": "testuser",
  "password": "test123"
}
```
✅ Respuesta: `201 Created` con ID del usuario

### 2. Login
```
POST /api/auth/login
{
  "username": "testuser",
  "password": "test123"
}
```
✅ Respuesta: `200 OK` con token JWT

### 3. Obtener Todos los Productos
```
GET /api/productos
```
✅ Respuesta: `200 OK` con lista de productos

### 4. Crear Nuevo Producto
```
POST /api/productos
{
  "nombre": "Teclado Mecánico",
  "precio": 150.00,
  "imagenUrl": "keyboard.jpg"
}
```
✅ Respuesta: `201 Created` con producto creado

### 5. Actualizar Producto
```
PUT /api/productos/{id}
{
  "nombre": "Teclado Mecánico RGB",
  "precio": 180.00,
  "imagenUrl": "keyboard-rgb.jpg"
}
```
✅ Respuesta: `200 OK` con producto actualizado

### 6. Obtener Producto Específico
```
GET /api/productos/{id}
```
✅ Respuesta: `200 OK` con detalles del producto

### 7. Eliminar Producto
```
DELETE /api/productos/{id}
```
✅ Respuesta: `204 No Content`

---

## 🔧 Configuración de Swagger

### Archivo: `OpenApiConfig.java`

La configuración se encuentra en:
```
src/main/java/com/techstore/config/OpenApiConfig.java
```

Contiene:
- ✅ Información de la API (título, descripción, versión)
- ✅ Contacto del equipo de desarrollo
- ✅ URLs de servidores (desarrollo y producción)
- ✅ Licencia (Apache 2.0)

### Dependencia en `pom.xml`

```xml
<!-- Springdoc OpenAPI (Swagger UI) -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.0.2</version>
</dependency>
```

---

## 🐛 Solución de Problemas

### ❌ "No puedo acceder a Swagger"

**Solución:**
1. Verifica que el backend esté ejecutándose
2. Comprueba que sea `http://localhost:8080/swagger-ui.html` (no `https`)
3. Abre la consola del navegador (F12) y revisa errores

### ❌ "Los endpoints no aparecen en Swagger"

**Solución:**
1. Asegúrate que los controllers tengan `@Tag` y `@Operation`
2. Ejecuta `mvn clean package`
3. Reinicia la aplicación
4. Actualiza la página (Ctrl+Shift+R)

### ❌ "Error 404 Not Found en Swagger"

**Solución:**
1. Verifica que el endpoint exista
2. Comprueba las anotaciones `@RequestMapping` y `@GetMapping` / `@PostMapping`
3. Revisa los logs del backend para errores

---

## 📸 Evidencias para el Informe

Para documentar en el informe, captura:

1. **Página principal de Swagger**
   - Muestra lista de endpoints disponibles

2. **Endpoint de Registro**
   - Abierto mostrando Request y Response

3. **Endpoint de Login**
   - Con response exitoso mostrando token

4. **CRUD de Productos**
   - GET todos los productos
   - POST crear producto
   - PUT actualizar producto
   - DELETE eliminar producto

5. **Response exitoso**
   - Código 200/201/204
   - Body con datos correctos
   - Headers relevantes

---

## 🚀 Próximos Pasos

✅ **Ya Completado:**
- Configuración de Swagger/OpenAPI
- Anotaciones en controladores
- Documentación automática

⏳ **Siguientes:**
1. Capturar pantallas de Swagger para el informe
2. Probar todos los endpoints
3. Configurar monitoreo en producción (UptimeRobot)
4. Generar informe final

---

**Backend:** Spring Boot 3.3.0 + Java 17  
**Documentation:** Springdoc OpenAPI 2.0.2  
**UI Access:** http://localhost:8080/swagger-ui.html  
**Status:** ✅ Funcional y Listo para Pruebas
