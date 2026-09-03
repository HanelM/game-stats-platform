package com.gamestats.platform.repository;

import com.gamestats.platform.model.ConnectedAccount;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ConnectedAccountRepository
        extends MongoRepository<ConnectedAccount, String> {

    List<ConnectedAccount> findByUsername(String username);

    Optional<ConnectedAccount> findByUsernameAndGame(
            String username,
            String game
    );

    void deleteByUsernameAndGame(
            String username,
            String game
    );
}