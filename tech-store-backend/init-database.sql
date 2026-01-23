-- Script para inicializar la Base de Datos Tech Store
-- Ejecutar en PostgreSQL como admin

-- Crear la base de datos
CREATE DATABASE techstore;

-- Conectarse a la base de datos
\c techstore

-- Las tablas serán creadas automáticamente por Hibernate cuando ejecutes la aplicación Spring Boot
-- Pero aquí hay un ejemplo de cómo lucirían:

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    precio DOUBLE PRECISION NOT NULL,
    descripcion TEXT,
    imagen LONGTEXT
);

CREATE TABLE nosotros (
    id SERIAL PRIMARY KEY,
    imagen LONGTEXT,
    titulos_descripciones LONGTEXT
);

-- Insertar datos de ejemplo
INSERT INTO productos (nombre, precio, descripcion, imagen) VALUES
('Laptop Gaming', 1299.99, 'Laptop de alta performance para gaming', 'https://via.placeholder.com/300x300?text=Laptop'),
('Mouse Inalámbrico', 49.99, 'Mouse inalámbrico con precisión de 16000 DPI', 'https://via.placeholder.com/300x300?text=Mouse'),
('Teclado Mecánico', 189.99, 'Teclado mecánico RGB con switches azules', 'https://via.placeholder.com/300x300?text=Teclado');

INSERT INTO nosotros (imagen, titulos_descripciones) VALUES
('https://via.placeholder.com/600x400?text=About+Us',
'[
    {"titulo": "Misión", "descripcion": "Proporcionar tecnología de calidad al mejor precio"},
    {"titulo": "Visión", "descripcion": "Ser la tienda tecnológica líder en la región"},
    {"titulo": "Valores", "descripcion": "Calidad, honestidad e innovación"}
]');
