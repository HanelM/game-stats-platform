package com.gamestats.platform.repository;

import com.gamestats.platform.model.PasswordResetToken;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository
        extends MongoRepository<PasswordResetToken, String> {

    Optional<PasswordResetToken> findByCodeHash(String codeHash);

    void deleteByUserId(String userId);
}