package com.techstore.service;

import com.techstore.dto.AuthDtos;
import com.techstore.model.Usuario;
import com.techstore.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthDtos.UserDTO register(AuthDtos.RegisterRequest req) {
        if (usuarioRepository.existsByUsername(req.username())) {
            throw new IllegalArgumentException("El usuario ya existe");
        }
        Usuario nuevo = Usuario.builder()
                .username(req.username())
                .passwordHash(passwordEncoder.encode(req.password()))
                .creadoEn(Instant.now())
                .build();
        Usuario guardado = usuarioRepository.save(nuevo);
        return new AuthDtos.UserDTO(guardado.getId(), guardado.getUsername());
    }

    public Optional<AuthDtos.LoginResponse> login(AuthDtos.LoginRequest req) {
        return usuarioRepository.findByUsername(req.username())
                .filter(u -> passwordEncoder.matches(req.password(), u.getPasswordHash()))
                .map(u -> new AuthDtos.LoginResponse(generarToken(), new AuthDtos.UserDTO(u.getId(), u.getUsername())));
    }

    private String generarToken() {
        // Token simple para demo (no JWT). Para producción, usar JWT.
        return UUID.randomUUID().toString();
    }
}
