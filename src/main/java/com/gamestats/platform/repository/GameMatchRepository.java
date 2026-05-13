package com.gamestats.platform.repository;

import com.gamestats.platform.model.GameMatch;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface GameMatchRepository
        extends MongoRepository<GameMatch, String> {

    List<GameMatch> findByPlayerUsername(String username);
}