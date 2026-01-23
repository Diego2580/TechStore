# Tech Store Backend - SpringBoot + PostgreSQL

## Requisitos
- Java 21+
- PostgreSQL 12+
- Maven 3.8.1+

## Instalación y Configuración

### 1. Crear la Base de Datos PostgreSQL

```sql
-- Conectarse a PostgreSQL como admin
psql -U postgres

-- Crear la base de datos
CREATE DATABASE techstore;

-- Conectarse a la base de datos
\c techstore

-- Las tablas se crearán automáticamente cuando ejecutes la aplicación (Hibernate)
```

### 2. Clonar el Proyecto y Compilar

```bash
cd tech-store-backend
mvn clean install
```

### 3. Ejecutar la Aplicación

```bash
mvn spring-boot:run
```

La aplicación estará disponible en: `http://localhost:8080`

## Endpoints de API

### Productos

- **GET** `/api/productos` - Obtener todos los productos
- **GET** `/api/productos/{id}` - Obtener un producto por ID
- **POST** `/api/productos` - Crear un nuevo producto
- **PUT** `/api/productos/{id}` - Actualizar un producto
- **DELETE** `/api/productos/{id}` - Eliminar un producto

### Nosotros (Información de la Empresa)

- **GET** `/api/nosotros` - Obtener información de la empresa
- **GET** `/api/nosotros/{id}` - Obtener por ID
- **POST** `/api/nosotros` - Crear información
- **PUT** `/api/nosotros/{id}` - Actualizar información
- **DELETE** `/api/nosotros/{id}` - Eliminar información

## Estructura del Proyecto

```
src/main/java/com/techstore/
├── TechStoreApplication.java
├── config/
│   └── JacksonConfig.java
├── controller/
│   ├── ProductoController.java
│   └── NosotrosController.java
├── service/
│   ├── ProductoService.java
│   └── NosotrosService.java
├── repository/
│   ├── ProductoRepository.java
│   └── NosotrosRepository.java
├── model/
│   ├── Producto.java
│   └── Nosotros.java
└── dto/
    ├── ProductoDTO.java
    ├── NosotrosDTO.java
    └── TituloDescripcionDTO.java
```

## Configuración de Base de Datos

El archivo `application.properties` contiene la configuración de PostgreSQL:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/techstore
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
```

## CORS

Los endpoints de API permiten CORS desde:
- `http://localhost:4200` (Angular dev server)
- `http://localhost:4201`

## Notas Importantes

- Las contraseñas de PostgreSQL se encuentran en `application.properties`. En producción, usar variables de entorno.
- Hibernate genera automáticamente las tablas al iniciar la aplicación.
- Los datos de Nosotros (títulos y descripciones) se almacenan como JSON string en la base de datos.
