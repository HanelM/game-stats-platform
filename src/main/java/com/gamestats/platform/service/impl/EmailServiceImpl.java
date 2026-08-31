package com.gamestats.platform.service.impl;

import com.gamestats.platform.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class EmailServiceImpl implements EmailService {

    private final WebClient webClient;

    @Value("${resend.api-key}")
    private String resendApiKey;

    @Value("${resend.from-email}")
    private String senderEmail;

    @Value("${app.password-reset.expiration-minutes}")
    private long expirationMinutes;

    public EmailServiceImpl(WebClient.Builder webClientBuilder) {

        this.webClient = webClientBuilder
                .baseUrl("https://api.resend.com")
                .build();
    }

    @Override
    public void sendPasswordResetEmail(
            String recipientEmail,
            String verificationCode
    ) {

        String text = """
                Hello,

                We received a request to reset your Game Stats Platform password.

                Your password reset verification code is:

                %s

                This code will expire in %d minutes.

                If you did not request a password reset, you can safely ignore this email.

                For security reasons, please do not share this code with anyone.

                Game Stats Platform
                """.formatted(
                verificationCode,
                expirationMinutes
        );

        webClient.post()
                .uri("/emails")
                .contentType(MediaType.APPLICATION_JSON)
                .header(
                        "Authorization",
                        "Bearer " + resendApiKey
                )
                .bodyValue(
                        Map.of(
                                "from", senderEmail,
                                "to", new String[]{recipientEmail},
                                "subject",
                                "Game Stats Platform - Password Reset",
                                "text", text
                        )
                )
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}