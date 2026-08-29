package com.gamestats.platform.service.impl;

import com.gamestats.platform.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Value("${app.password-reset.expiration-minutes}")
    private long expirationMinutes;



    @Override
    public void sendPasswordResetEmail(
            String recipientEmail,
            String verificationCode
    ) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(senderEmail);
        message.setTo(recipientEmail);

        message.setSubject(
                "Game Stats Platform - Password Reset"
        );

        message.setText(
                """
                        Hello,

                        We received a request to reset your Game Stats Platform password.

                                Your password reset verification code is:
                                                
                                %s
                                                
                                This code will expire in %d minutes.

                        If you did not request a password reset, you can safely ignore this email.

                        For security reasons, please do not share this link with anyone.

                        Game Stats Platform
                        """.formatted(
                        verificationCode,
                        expirationMinutes
                )
        );

        mailSender.send(message);
    }
}