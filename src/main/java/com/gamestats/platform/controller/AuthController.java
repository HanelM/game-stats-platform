package com.gamestats.platform.controller;

import com.gamestats.platform.dto.AuthResponse;
import com.gamestats.platform.dto.ForgotPasswordRequest;
import com.gamestats.platform.dto.LoginRequest;
import com.gamestats.platform.dto.MessageResponse;
import com.gamestats.platform.dto.RegisterRequest;
import com.gamestats.platform.dto.ResetPasswordRequest;
import com.gamestats.platform.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.gamestats.platform.dto.VerifyResetCodeRequest;

@Tag(
        name = "Authentication Controller",
        description = "Authentication and JWT token management endpoints"
)
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(
            summary = "Register new user",
            description = "Creates a new account"
    )
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(
                authService.register(request)
        );
    }

    @Operation(
            summary = "Login user",
            description = "Authenticates user and returns JWT token"
    )
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    @Operation(
            summary = "Request password reset",
            description = "Sends a password reset link to the user's email"
    )
    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request
    ) {

        return ResponseEntity.ok(
                authService.forgotPassword(request)
        );
    }

    @Operation(
            summary = "Verify password reset code",
            description = "Verifies the 6-digit password reset code"
    )
    @PostMapping("/verify-reset-code")
    public ResponseEntity<MessageResponse> verifyResetCode(
            @Valid @RequestBody VerifyResetCodeRequest request
    ) {

        return ResponseEntity.ok(
                authService.verifyResetCode(request)
        );
    }

    @Operation(
            summary = "Reset password",
            description = "Resets the user's password using a valid reset token"
    )
    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request
    ) {

        return ResponseEntity.ok(
                authService.resetPassword(request)
        );
    }
}