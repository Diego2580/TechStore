package com.techstore.service;

import com.techstore.dto.AuthDtos;
import com.techstore.model.Usuario;
import com.techstore.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Pruebas unitarias para UsuarioService
 * Framework: JUnit 5 + Mockito
 */
@DisplayName("UsuarioService - Pruebas Unitarias")
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuarioMock;
    private BCryptPasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        passwordEncoder = new BCryptPasswordEncoder();
        
        // Usuario de prueba
        usuarioMock = Usuario.builder()
                .id(1L)
                .username("testuser")
                .passwordHash(passwordEncoder.encode("password123"))
                .creadoEn(Instant.now())
                .build();
    }

    @Test
    @DisplayName("Debería registrar un nuevo usuario exitosamente")
    void testRegisterSuccess() {
        // Arrange
        AuthDtos.RegisterRequest request = new AuthDtos.RegisterRequest("newuser", "newpass123");
        Usuario nuevoUsuario = Usuario.builder()
                .id(2L)
                .username("newuser")
                .passwordHash(passwordEncoder.encode("newpass123"))
                .creadoEn(Instant.now())
                .build();
        
        when(usuarioRepository.existsByUsername("newuser")).thenReturn(false);
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(nuevoUsuario);

        // Act
        AuthDtos.UserDTO resultado = usuarioService.register(request);

        // Assert
        assertNotNull(resultado, "El resultado no debería ser null");
        assertEquals(2L, resultado.id());
        assertEquals("newuser", resultado.username());
        
        verify(usuarioRepository, times(1)).existsByUsername("newuser");
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    @DisplayName("Debería lanzar excepción al registrar usuario existente")
    void testRegisterWhenUserExists() {
        // Arrange
        AuthDtos.RegisterRequest request = new AuthDtos.RegisterRequest("existinguser", "pass123");
        when(usuarioRepository.existsByUsername("existinguser")).thenReturn(true);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> usuarioService.register(request),
            "Debería lanzar IllegalArgumentException"
        );
        
        assertEquals("El usuario ya existe", exception.getMessage());
        
        verify(usuarioRepository, times(1)).existsByUsername("existinguser");
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    @DisplayName("Debería realizar login exitoso con credenciales correctas")
    void testLoginSuccess() {
        // Arrange
        AuthDtos.LoginRequest request = new AuthDtos.LoginRequest("testuser", "password123");
        when(usuarioRepository.findByUsername("testuser")).thenReturn(Optional.of(usuarioMock));

        // Act
        Optional<AuthDtos.LoginResponse> resultado = usuarioService.login(request);

        // Assert
        assertTrue(resultado.isPresent(), "El login debería ser exitoso");
        assertNotNull(resultado.get().token(), "El token no debería ser null");
        assertEquals(1L, resultado.get().user().id());
        assertEquals("testuser", resultado.get().user().username());
        
        verify(usuarioRepository, times(1)).findByUsername("testuser");
    }

    @Test
    @DisplayName("Debería fallar login con contraseña incorrecta")
    void testLoginWithWrongPassword() {
        // Arrange
        AuthDtos.LoginRequest request = new AuthDtos.LoginRequest("testuser", "wrongpassword");
        when(usuarioRepository.findByUsername("testuser")).thenReturn(Optional.of(usuarioMock));

        // Act
        Optional<AuthDtos.LoginResponse> resultado = usuarioService.login(request);

        // Assert
        assertFalse(resultado.isPresent(), "El login debería fallar");
        
        verify(usuarioRepository, times(1)).findByUsername("testuser");
    }

    @Test
    @DisplayName("Debería fallar login con usuario inexistente")
    void testLoginWithNonExistentUser() {
        // Arrange
        AuthDtos.LoginRequest request = new AuthDtos.LoginRequest("nonexistent", "password123");
        when(usuarioRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        // Act
        Optional<AuthDtos.LoginResponse> resultado = usuarioService.login(request);

        // Assert
        assertFalse(resultado.isPresent(), "El login debería fallar");
        
        verify(usuarioRepository, times(1)).findByUsername("nonexistent");
    }

    @Test
    @DisplayName("Debería generar token único en cada login")
    void testLoginGeneratesDifferentTokens() {
        // Arrange
        AuthDtos.LoginRequest request = new AuthDtos.LoginRequest("testuser", "password123");
        when(usuarioRepository.findByUsername("testuser")).thenReturn(Optional.of(usuarioMock));

        // Act
        Optional<AuthDtos.LoginResponse> resultado1 = usuarioService.login(request);
        Optional<AuthDtos.LoginResponse> resultado2 = usuarioService.login(request);

        // Assert
        assertTrue(resultado1.isPresent(), "Primer login debería ser exitoso");
        assertTrue(resultado2.isPresent(), "Segundo login debería ser exitoso");
        assertNotEquals(
            resultado1.get().token(), 
            resultado2.get().token(),
            "Los tokens deberían ser diferentes"
        );
        
        verify(usuarioRepository, times(2)).findByUsername("testuser");
    }

    @Test
    @DisplayName("Debería encriptar la contraseña al registrar usuario")
    void testPasswordEncryptionOnRegister() {
        // Arrange
        AuthDtos.RegisterRequest request = new AuthDtos.RegisterRequest("secureuser", "plainpassword");
        
        when(usuarioRepository.existsByUsername("secureuser")).thenReturn(false);
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> {
            Usuario usuario = invocation.getArgument(0);
            // Verificar que la contraseña NO es texto plano
            assertNotEquals("plainpassword", usuario.getPasswordHash(), 
                "La contraseña debería estar encriptada");
            // Verificar que es un hash BCrypt válido (comienza con $2a$ o similar)
            assertTrue(usuario.getPasswordHash().startsWith("$2"), 
                "Debería ser un hash BCrypt válido");
            return usuario;
        });

        // Act
        usuarioService.register(request);

        // Assert
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }
}
