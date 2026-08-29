package com.gamestats.platform.service;

import com.gamestats.platform.dto.AuthResponse;
import com.gamestats.platform.dto.ForgotPasswordRequest;
import com.gamestats.platform.dto.LoginRequest;
import com.gamestats.platform.dto.MessageResponse;
import com.gamestats.platform.dto.RegisterRequest;
import com.gamestats.platform.dto.ResetPasswordRequest;
import com.gamestats.platform.dto.VerifyResetCodeRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    MessageResponse forgotPassword(ForgotPasswordRequest request);

    MessageResponse verifyResetCode(VerifyResetCodeRequest request);

    MessageResponse resetPassword(ResetPasswordRequest request);
}