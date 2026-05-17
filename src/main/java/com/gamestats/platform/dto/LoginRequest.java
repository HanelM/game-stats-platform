package com.gamestats.platform.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoginRequest {

    @Schema(
            example = "gamingUser",
            description = "Username of the account"
    )
    @NotBlank(message = "Username is required")
    @Size(min = 5, max = 20,
            message = "Username must be between 5 and 20 characters")
    private String username;

    @Schema(
            example = "securePassword123",
            description = "Account password"
    )
    @NotBlank(message = "Password is required")
    @Size(min = 4, max = 100,
            message = "Password must be at least 4 characters")
    private String password;
}