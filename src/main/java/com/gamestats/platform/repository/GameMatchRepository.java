package com.gamestats.platform.repository;

import com.gamestats.platform.model.GameMatch;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;

import java.util.List;

public interface GameMatchRepository
        extends MongoRepository<GameMatch, String> {

    List<GameMatch> findByPlayerUsername(
            String username,
            Sort sort
    );

    List<GameMatch> findByPlayerUsername(
            String username
    );

    Page<GameMatch> findByPlayerUsername(
            String username,
            Pageable pageable
    );

    List<GameMatch> findByPlayerUsernameAndGameNameContainingIgnoreCase(
            String username,
            String gameName,
            Sort sort
    );

    List<GameMatch> findByPlayerUsernameAndWin(
            String username,
            Boolean win,
            Sort sort
    );

    List<GameMatch> findByPlayerUsernameAndScoreGreaterThanEqual(
            String username,
            Integer score,
            Sort sort
    );

    List<GameMatch> findByPlayerUsernameAndPlayedAtBetween(
            String username,
            LocalDateTime from,
            LocalDateTime to,
            Sort sort
    );
}