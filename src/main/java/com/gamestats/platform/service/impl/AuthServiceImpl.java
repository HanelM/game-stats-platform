package com.gamestats.platform.service.impl;

import com.gamestats.platform.dto.AuthResponse;
import com.gamestats.platform.dto.ForgotPasswordRequest;
import com.gamestats.platform.dto.LoginRequest;
import com.gamestats.platform.dto.MessageResponse;
import com.gamestats.platform.dto.RegisterRequest;
import com.gamestats.platform.dto.ResetPasswordRequest;
import com.gamestats.platform.exception.ResourceAlreadyExistsException;
import com.gamestats.platform.exception.ResourceNotFoundException;
import com.gamestats.platform.model.PasswordResetToken;
import com.gamestats.platform.model.User;
import com.gamestats.platform.model.UserRole;
import com.gamestats.platform.repository.PasswordResetTokenRepository;
import com.gamestats.platform.repository.UserRepository;
import com.gamestats.platform.security.JwtService;
import com.gamestats.platform.service.AuthService;
import com.gamestats.platform.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import com.gamestats.platform.dto.VerifyResetCodeRequest;


@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;



    @Value("${app.password-reset.expiration-minutes}")
    private long resetTokenExpirationMinutes;

    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResourceAlreadyExistsException(
                    "Username already exists"
            );
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException(
                    "Email already exists"
            );
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.USER)
                .createdAt(LocalDateTime.now())
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
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

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

    @Override
    public MessageResponse forgotPassword(
            ForgotPasswordRequest request
    ) {

        String username = request.getUsername().trim();

        userRepository.findByUsername(username)
                .ifPresent(user -> {

                    // Remove previously generated verification codes.
                    passwordResetTokenRepository
                            .deleteByUserId(user.getId());

                    // Generate a 6-digit verification code.
                    String code = generateVerificationCode();

                    // Store only the SHA-256 hash of the code.
                    String codeHash = hashToken(code);

                    PasswordResetToken resetToken =
                            PasswordResetToken.builder()
                                    .codeHash(codeHash)
                                    .userId(user.getId())
                                    .expiresAt(
                                            LocalDateTime.now()
                                                    .plusMinutes(
                                                            resetTokenExpirationMinutes
                                                    )
                                    )
                                    .used(false)
                                    .createdAt(LocalDateTime.now())
                                    .build();

                    passwordResetTokenRepository.save(resetToken);

                    // Send the verification code to the
                    // email stored in the user's account.
                    emailService.sendPasswordResetEmail(
                            user.getEmail(),
                            code
                    );
                });

        return new MessageResponse(
                "If an account exists for this username, " +
                        "a password reset code has been sent."
        );
    }

    @Override
    public MessageResponse verifyResetCode(
            VerifyResetCodeRequest request
    ) {

        String codeHash = hashToken(request.getCode());

        PasswordResetToken resetToken =
                passwordResetTokenRepository
                        .findByCodeHash(codeHash)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Invalid or expired verification code"
                                )
                        );

        if (resetToken.isUsed()) {

            throw new IllegalArgumentException(
                    "This verification code has already been used"
            );
        }

        if (resetToken.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            passwordResetTokenRepository.delete(resetToken);

            throw new IllegalArgumentException(
                    "This verification code has expired"
            );
        }

        return new MessageResponse(
                "Verification code is valid."
        );
    }

    @Override
    public MessageResponse resetPassword(
            ResetPasswordRequest request
    ) {

        String codeHash = hashToken(request.getCode());

        PasswordResetToken resetToken =
                passwordResetTokenRepository
                        .findByCodeHash(codeHash)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Invalid or expired verification code"
                                )
                        );

        if (resetToken.isUsed()) {

            throw new IllegalArgumentException(
                    "This verification code has already been used"
            );
        }

        if (resetToken.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            passwordResetTokenRepository.delete(resetToken);

            throw new IllegalArgumentException(
                    "This verification code has expired"
            );
        }

        User user = userRepository
                .findById(resetToken.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);

        /*
         * Mark the verification code as used.
         */
        resetToken.setUsed(true);

        passwordResetTokenRepository.save(resetToken);

        /*
         * Remove all reset codes belonging to this user.
         */
        passwordResetTokenRepository.deleteByUserId(
                user.getId()
        );

        return new MessageResponse(
                "Password has been reset successfully."
        );
    }

    private String generateVerificationCode() {

        return String.format(
                "%06d",
                secureRandom.nextInt(1_000_000)
        );
    }

    private String hashToken(String token) {

        try {

            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash =
                    digest.digest(
                            token.getBytes(StandardCharsets.UTF_8)
                    );

            StringBuilder hexString =
                    new StringBuilder();

            for (byte b : hash) {

                String hex =
                        Integer.toHexString(
                                0xff & b
                        );

                if (hex.length() == 1) {
                    hexString.append('0');
                }

                hexString.append(hex);
            }

            return hexString.toString();

        } catch (NoSuchAlgorithmException e) {

            throw new IllegalStateException(
                    "SHA-256 algorithm is not available",
                    e
            );
        }
    }
}