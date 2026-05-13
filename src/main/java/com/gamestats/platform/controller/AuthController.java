package com.gamestats.platform.controller;

import com.gamestats.platform.dto.RegisterRequest;
import com.gamestats.platform.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.gamestats.platform.dto.AuthResponse;
import com.gamestats.platform.dto.LoginRequest;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public String registerUser(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }
    @PostMapping("/login")
    public AuthResponse loginUser(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}