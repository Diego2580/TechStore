package com.techstore.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "nosotros")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Nosotros {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(columnDefinition = "TEXT")
    private String imagen;
    
    @Column(columnDefinition = "TEXT")
    private String titulosDescripciones; // JSON string
}
