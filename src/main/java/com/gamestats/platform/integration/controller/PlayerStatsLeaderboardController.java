package com.gamestats.platform.integration.controller;

import com.gamestats.platform.integration.entity.PlayerStats;
import com.gamestats.platform.integration.repository.PlayerStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class PlayerStatsLeaderboardController {

    private final PlayerStatsRepository
            playerStatsRepository;

    @GetMapping("/{game}")
    public List<PlayerStats> getLeaderboard(
            @PathVariable String game
    ){

        return playerStatsRepository
                .findTop10ByGameOrderByKdDesc(
                        game.toUpperCase()
                );
    }
}