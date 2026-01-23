package com.techstore.service;

import com.techstore.dto.ProductoDTO;
import com.techstore.model.Producto;
import com.techstore.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    public List<ProductoDTO> getAll() {
        return productoRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<ProductoDTO> getById(Long id) {
        return productoRepository.findById(id).map(this::convertToDTO);
    }

    public ProductoDTO save(ProductoDTO dto) {
        Producto producto = convertToEntity(dto);
        Producto saved = productoRepository.save(producto);
        return convertToDTO(saved);
    }

    public ProductoDTO update(Long id, ProductoDTO dto) {
        Optional<Producto> existingProducto = productoRepository.findById(id);
        if (existingProducto.isPresent()) {
            Producto producto = existingProducto.get();
            producto.setNombre(dto.getNombre());
            producto.setPrecio(dto.getPrecio());
            producto.setDescripcion(dto.getDescripcion());
            producto.setImagen(dto.getImagen());
            Producto updated = productoRepository.save(producto);
            return convertToDTO(updated);
        }
        return null;
    }

    public void delete(Long id) {
        productoRepository.deleteById(id);
    }

    private ProductoDTO convertToDTO(Producto producto) {
        return new ProductoDTO(
            producto.getId(),
            producto.getNombre(),
            producto.getPrecio(),
            producto.getDescripcion(),
            producto.getImagen()
        );
    }

    private Producto convertToEntity(ProductoDTO dto) {
        return new Producto(
            dto.getId(),
            dto.getNombre(),
            dto.getPrecio(),
            dto.getDescripcion(),
            dto.getImagen()
        );
    }
}
