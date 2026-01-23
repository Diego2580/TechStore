package com.techstore.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techstore.dto.NosotrosDTO;
import com.techstore.dto.TituloDescripcionDTO;
import com.techstore.model.Nosotros;
import com.techstore.repository.NosotrosRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NosotrosService {

    private final NosotrosRepository nosotrosRepository;
    private final ObjectMapper objectMapper;

    public NosotrosDTO getAll() {
        List<Nosotros> nosotrosList = nosotrosRepository.findAll();
        if (nosotrosList.isEmpty()) {
            return new NosotrosDTO();
        }
        return convertToDTO(nosotrosList.get(0));
    }

    public Optional<NosotrosDTO> getById(Long id) {
        return nosotrosRepository.findById(id).map(this::convertToDTO);
    }

    public NosotrosDTO save(NosotrosDTO dto) {
        Nosotros nosotros = convertToEntity(dto);
        Nosotros saved = nosotrosRepository.save(nosotros);
        return convertToDTO(saved);
    }

    public NosotrosDTO update(Long id, NosotrosDTO dto) {
        Optional<Nosotros> existingNosotros = nosotrosRepository.findById(id);
        if (existingNosotros.isPresent()) {
            Nosotros nosotros = existingNosotros.get();
            nosotros.setImagen(dto.getImagen());
            nosotros.setTitulosDescripciones(convertListToJson(dto.getTitulos_descripciones()));
            Nosotros updated = nosotrosRepository.save(nosotros);
            return convertToDTO(updated);
        }
        return null;
    }

    public void delete(Long id) {
        nosotrosRepository.deleteById(id);
    }

    private NosotrosDTO convertToDTO(Nosotros nosotros) {
        List<TituloDescripcionDTO> titulos = convertJsonToList(nosotros.getTitulosDescripciones());
        return new NosotrosDTO(
            nosotros.getId(),
            nosotros.getImagen(),
            titulos
        );
    }

    private Nosotros convertToEntity(NosotrosDTO dto) {
        return new Nosotros(
            dto.getId(),
            dto.getImagen(),
            convertListToJson(dto.getTitulos_descripciones())
        );
    }

    private String convertListToJson(List<TituloDescripcionDTO> list) {
        try {
            return objectMapper.writeValueAsString(list);
        } catch (Exception e) {
            return "[]";
        }
    }

    private List<TituloDescripcionDTO> convertJsonToList(String json) {
        try {
            if (json == null || json.isEmpty()) {
                return List.of();
            }
            return objectMapper.readValue(json, new TypeReference<List<TituloDescripcionDTO>>() {});
        } catch (Exception e) {
            return List.of();
        }
    }
}
