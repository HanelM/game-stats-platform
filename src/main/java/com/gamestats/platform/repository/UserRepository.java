package com.gamestats.platform.repository;

import com.gamestats.platform.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
    Page<User> findByUsernameContainingIgnoreCase(
            String username,
            Pageable pageable
    );

    Page<User> findByEmailContainingIgnoreCase(
            String email,
            Pageable pageable
    );

}