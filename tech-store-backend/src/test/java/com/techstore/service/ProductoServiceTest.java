package com.techstore.service;

import com.techstore.dto.ProductoDTO;
import com.techstore.model.Producto;
import com.techstore.repository.ProductoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Pruebas unitarias para ProductoService
 * Framework: JUnit 5 + Mockito
 */
@DisplayName("ProductoService - Pruebas Unitarias")
class ProductoServiceTest {

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private ProductoService productoService;

    private Producto producto1;
    private Producto producto2;
    private ProductoDTO productoDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Datos de prueba
        producto1 = new Producto(1L, "Laptop HP", 850.00, "Laptop de alta gama", "laptop.jpg");
        producto2 = new Producto(2L, "Mouse Logitech", 25.99, "Mouse inalámbrico", "mouse.jpg");
        
        productoDTO = new ProductoDTO(null, "Teclado Mecánico", 120.00, "Teclado RGB", "teclado.jpg");
    }

    @Test
    @DisplayName("Debería retornar todos los productos")
    void testGetAll() {
        // Arrange
        List<Producto> productos = Arrays.asList(producto1, producto2);
        when(productoRepository.findAll()).thenReturn(productos);

        // Act
        List<ProductoDTO> resultado = productoService.getAll();

        // Assert
        assertNotNull(resultado, "El resultado no debería ser null");
        assertEquals(2, resultado.size(), "Debería retornar 2 productos");
        assertEquals("Laptop HP", resultado.get(0).getNombre());
        assertEquals("Mouse Logitech", resultado.get(1).getNombre());
        
        verify(productoRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Debería retornar producto por ID cuando existe")
    void testGetByIdWhenExists() {
        // Arrange
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto1));

        // Act
        Optional<ProductoDTO> resultado = productoService.getById(1L);

        // Assert
        assertTrue(resultado.isPresent(), "El producto debería existir");
        assertEquals("Laptop HP", resultado.get().getNombre());
        assertEquals(850.00, resultado.get().getPrecio());
        
        verify(productoRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Debería retornar Optional vacío cuando el producto no existe")
    void testGetByIdWhenNotExists() {
        // Arrange
        when(productoRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        Optional<ProductoDTO> resultado = productoService.getById(999L);

        // Assert
        assertFalse(resultado.isPresent(), "El producto no debería existir");
        
        verify(productoRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("Debería guardar un nuevo producto correctamente")
    void testSave() {
        // Arrange
        Producto productoGuardado = new Producto(3L, "Teclado Mecánico", 120.00, "Teclado RGB", "teclado.jpg");
        when(productoRepository.save(any(Producto.class))).thenReturn(productoGuardado);

        // Act
        ProductoDTO resultado = productoService.save(productoDTO);

        // Assert
        assertNotNull(resultado, "El resultado no debería ser null");
        assertEquals(3L, resultado.getId());
        assertEquals("Teclado Mecánico", resultado.getNombre());
        assertEquals(120.00, resultado.getPrecio());
        
        verify(productoRepository, times(1)).save(any(Producto.class));
    }

    @Test
    @DisplayName("Debería actualizar un producto existente")
    void testUpdateWhenExists() {
        // Arrange
        ProductoDTO actualizacionDTO = new ProductoDTO(1L, "Laptop HP Actualizada", 900.00, "Nueva descripción", "nueva.jpg");
        Producto productoActualizado = new Producto(1L, "Laptop HP Actualizada", 900.00, "Nueva descripción", "nueva.jpg");
        
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto1));
        when(productoRepository.save(any(Producto.class))).thenReturn(productoActualizado);

        // Act
        ProductoDTO resultado = productoService.update(1L, actualizacionDTO);

        // Assert
        assertNotNull(resultado, "El resultado no debería ser null");
        assertEquals("Laptop HP Actualizada", resultado.getNombre());
        assertEquals(900.00, resultado.getPrecio());
        assertEquals("Nueva descripción", resultado.getDescripcion());
        
        verify(productoRepository, times(1)).findById(1L);
        verify(productoRepository, times(1)).save(any(Producto.class));
    }

    @Test
    @DisplayName("Debería retornar null al actualizar producto inexistente")
    void testUpdateWhenNotExists() {
        // Arrange
        ProductoDTO actualizacionDTO = new ProductoDTO(999L, "Producto Falso", 100.00, "No existe", "fake.jpg");
        when(productoRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        ProductoDTO resultado = productoService.update(999L, actualizacionDTO);

        // Assert
        assertNull(resultado, "El resultado debería ser null");
        
        verify(productoRepository, times(1)).findById(999L);
        verify(productoRepository, never()).save(any(Producto.class));
    }

    @Test
    @DisplayName("Debería eliminar un producto por ID")
    void testDelete() {
        // Arrange
        doNothing().when(productoRepository).deleteById(1L);

        // Act
        productoService.delete(1L);

        // Assert
        verify(productoRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Debería manejar lista vacía de productos")
    void testGetAllEmptyList() {
        // Arrange
        when(productoRepository.findAll()).thenReturn(Arrays.asList());

        // Act
        List<ProductoDTO> resultado = productoService.getAll();

        // Assert
        assertNotNull(resultado, "El resultado no debería ser null");
        assertTrue(resultado.isEmpty(), "La lista debería estar vacía");
        
        verify(productoRepository, times(1)).findAll();
    }
}
