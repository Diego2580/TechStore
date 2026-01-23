package com.techstore.dto;

public class AuthDtos {
    public record RegisterRequest(String username, String password) {}
    public record LoginRequest(String username, String password) {}
    public record UserDTO(Long id, String username) {}
    public record LoginResponse(String token, UserDTO user) {}
}
