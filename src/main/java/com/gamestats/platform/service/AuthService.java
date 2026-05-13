package com.gamestats.platform.service;

import com.gamestats.platform.dto.AuthResponse;
import com.gamestats.platform.dto.LoginRequest;
import com.gamestats.platform.dto.RegisterRequest;

public interface AuthService {

    String register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}