package com.gamestats.platform.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "password_reset_tokens")
public class PasswordResetToken {

    @Id
    private String id;

    /**
     * SHA-256 hash of the 6-digit verification code.
     *
     * We never store the actual code in MongoDB.
     */
    @Indexed(unique = true)
    private String codeHash;

    /**
     * ID of the user requesting the password reset.
     */
    @Indexed
    private String userId;

    /**
     * Time after which the verification code can no longer be used.
     */
    @Indexed
    private LocalDateTime expiresAt;

    /**
     * Prevents a verification code from being reused.
     */
    private boolean used;

    /**
     * Time when the verification code was created.
     */
    private LocalDateTime createdAt;
}