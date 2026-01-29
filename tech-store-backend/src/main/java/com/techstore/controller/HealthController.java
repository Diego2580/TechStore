package com.techstore.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@Tag(name = "Health Check", description = "Endpoints para monitoreo del sistema")
public class HealthController {

    @GetMapping
    @Operation(summary = "Verificar estado del sistema", description = "Retorna el estado de salud del backend")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Sistema operativo correctamente"),
        @ApiResponse(responseCode = "503", description = "Servicio no disponible")
    })
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", LocalDateTime.now());
        health.put("service", "Tech Store Backend");
        health.put("version", "1.0.0");
        
        return ResponseEntity.ok(health);
    }
}
