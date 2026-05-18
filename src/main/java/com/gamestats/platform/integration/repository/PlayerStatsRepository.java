package com.gamestats.platform.integration.repository;

import com.gamestats.platform.integration.entity.PlayerStats;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
import java.util.List;

public interface PlayerStatsRepository
        extends MongoRepository<PlayerStats, String> {
    Optional<PlayerStats>
    findTopByPlayerNameIgnoreCaseAndGameOrderByCreatedAtDesc(
            String playerName,
            String game
    );
    List<PlayerStats>
    findTop10ByGameOrderByKdDesc(
            String game
    );
}