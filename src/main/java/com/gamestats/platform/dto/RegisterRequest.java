package com.gamestats.platform.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

public class RegisterRequest {

    @Schema(
            example = "gamingUser",
            description = "Unique username"
    )
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20,
            message = "Username must be between 3 and 20 characters")
    @Pattern(
            regexp = "^(?!gamingUser$).*$",
            message = "Please choose a real username"
    )
    private String username;

    @Schema(
            example = "user@example.com",
            description = "Valid email address"
    )
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @Pattern(
            regexp = "^(?!user@example.com$).*$",
            message = "Please enter your real email"
    )
    private String email;

    @Schema(
            example = "securePassword123",
            description = "Account password"
    )
    @NotBlank(message = "Password is required")
    @Size(min = 4, max = 100,
            message = "Password must be at least 4 characters")
    @Pattern(
            regexp = "^(?!securePassword123$).*$",
            message = "Please choose your own password"
    )
    private String password;

    // GETTERS

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    // SETTERS

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}