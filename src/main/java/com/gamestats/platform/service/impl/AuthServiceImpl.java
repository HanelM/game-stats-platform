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
import com.gamestats.platform.exception.ResourceAlreadyExistsException;
import com.gamestats.platform.exception.ResourceNotFoundException;


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
        if(userRepository.existsByUsername(
                request.getUsername()
        )){
            throw new ResourceAlreadyExistsException(
                    "Username already exists"
            );
        }

        if(userRepository.existsByEmail(
                request.getEmail()
        )){
            throw new ResourceAlreadyExistsException(
                    "Email already exists"
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
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!passwordMatches) {
            throw new RuntimeException(
                    "Invalid username or password"
            );
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                "Login successful!",
                token
        );


    }
}