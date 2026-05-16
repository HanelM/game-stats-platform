package com.gamestats.platform.service.impl;

import com.gamestats.platform.dto.RegisterRequest;
import com.gamestats.platform.model.User;
import com.gamestats.platform.model.UserRole;
import com.gamestats.platform.repository.UserRepository;
import com.gamestats.platform.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.gamestats.platform.dto.AuthResponse;
import com.gamestats.platform.dto.LoginRequest;
import com.gamestats.platform.security.JwtService;


@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            return new AuthResponse(
                    "Username already exists!",
                    null
            );
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse(
                    "Email already exists!",
                    null
            );
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.USER)
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                "User registered successfully!",
                token
        );
    }
    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!passwordMatches) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                "Login successful!",
                token
        );


    }
}