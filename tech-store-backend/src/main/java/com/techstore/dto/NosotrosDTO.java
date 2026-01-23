package com.techstore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NosotrosDTO {
    private Long id;
    private String imagen;
    private List<TituloDescripcionDTO> titulos_descripciones;
}
