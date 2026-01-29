package com.techstore.security;

import com.techstore.service.UsuarioService;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * Filtro de autenticación JWT para proteger endpoints
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter implements Filter {

    private final UsuarioService usuarioService;

    // Endpoints que no requieren autenticación
    private static final List<String> PUBLIC_ENDPOINTS = Arrays.asList(
            "/api/auth/register",
            "/api/auth/login",
            "/api/health",
            "/swagger-ui",
            "/v3/api-docs",
            "/swagger-resources"
    );

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        String path = httpRequest.getRequestURI();
        
        // Verificar si es un endpoint público
        if (isPublicEndpoint(path)) {
            chain.doFilter(request, response);
            return;
        }
        
        // Para endpoints protegidos, validar token
        String authHeader = httpRequest.getHeader("Authorization");
        
        if (authHeader == null || authHeader.isEmpty()) {
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpResponse.getWriter().write("{\"error\": \"Token no proporcionado\"}");
            return;
        }
        
        // El token debería venir en formato: "Bearer <token>"
        if (!authHeader.startsWith("Bearer ")) {
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpResponse.getWriter().write("{\"error\": \"Formato de token inválido\"}");
            return;
        }
        
        String token = authHeader.substring(7);
        
        // Validar que el token sea válido (en este caso, solo verificamos que no esté vacío)
        // En producción, validarías contra la base de datos o con firma JWT
        if (token.isEmpty()) {
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpResponse.getWriter().write("{\"error\": \"Token inválido\"}");
            return;
        }
        
        // Token válido, continuar
        chain.doFilter(request, response);
    }
    
    private boolean isPublicEndpoint(String path) {
        return PUBLIC_ENDPOINTS.stream().anyMatch(path::contains);
    }
}
