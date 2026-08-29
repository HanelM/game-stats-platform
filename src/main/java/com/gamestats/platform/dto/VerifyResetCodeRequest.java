package com.gamestats.platform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class VerifyResetCodeRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Verification code is required")
    @Pattern(
            regexp = "\\d{6}",
            message = "Verification code must contain exactly 6 digits"
    )
    private String code;
}