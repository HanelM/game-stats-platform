package com.gamestats.platform.service;

public interface EmailService {

    void sendPasswordResetEmail(
            String recipientEmail,
            String resetLink
    );
}