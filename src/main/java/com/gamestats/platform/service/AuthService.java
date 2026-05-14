package com.gamestats.platform.service;

import com.gamestats.platform.dto.AuthResponse;
import com.gamestats.platform.dto.LoginRequest;
import com.gamestats.platform.dto.RegisterRequest;
import com.gamestats.platform.dto.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}