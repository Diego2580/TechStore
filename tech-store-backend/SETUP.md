# Tech Store Backend - Guía de Instalación

## Pre-requisitos

1. **PostgreSQL** instalado y ejecutándose
   - Descargar desde: https://www.postgresql.org/download/
   - Usuario por defecto: `postgres`
   - Contraseña por defecto: `postgres` (o la que estableciste)

2. **Java JDK 21+**
   - Descargar desde: https://www.oracle.com/java/technologies/downloads/

3. **Maven 3.8.1+**
   - Descargar desde: https://maven.apache.org/download.cgi
   - Agregar a PATH del sistema

## Pasos de Instalación

### 1. Crear Base de Datos

Abre pgAdmin o SQL Shell (psql) y ejecuta:

```sql
CREATE DATABASE techstore;
```

### 2. Clonar/Descargar el Backend

```bash
cd "c:\Users\diego\OneDrive\Escritorio\U CATO\Ingenieria Web"
```

### 3. Navegar a la carpeta del backend

```bash
cd tech-store-backend
```

### 4. Instalar dependencias con Maven

```bash
mvn clean install
```

### 5. Ejecutar la aplicación

```bash
mvn spring-boot:run
```

O si prefieres compilar primero:

```bash
mvn clean package
java -jar target/tech-store-backend-1.0.0.jar
```

## Verificar que está funcionando

Abre tu navegador y ve a:
- `http://localhost:8080/api/productos` - Debe retornar un array JSON (aunque esté vacío)
- `http://localhost:8080/api/nosotros` - Debe retornar un objeto JSON

## Solución de Problemas

### Error: "Conexión rechazada" en PostgreSQL
- Verifica que PostgreSQL está ejecutándose
- Verifica el usuario y contraseña en `application.properties`

### Error: "Maven no encontrado"
- Verifica que Maven está instalado y agregado a PATH
- Reinicia la terminal después de instalar

### Error: "Java no encontrado"
- Verifica que Java 21+ está instalado
- Ejecuta `java -version` para verificar

## Proximos pasos

Una vez que el backend esté ejecutándose, debes actualizar los servicios Angular para conectarse a `http://localhost:8080/api/` en lugar de MockAPI.
