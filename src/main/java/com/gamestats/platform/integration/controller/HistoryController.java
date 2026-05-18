package com.gamestats.platform.integration.controller;

import com.gamestats.platform.integration.entity.PlayerStats;
import com.gamestats.platform.integration.repository.PlayerStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {

    private final PlayerStatsRepository
            playerStatsRepository;

    @GetMapping("/{playerName}")
    public List<PlayerStats> getPlayerHistory(
            @PathVariable String playerName
    ){

        return playerStatsRepository
                .findByPlayerNameOrderByCreatedAtDesc(
                        playerName
                );
    }

    @GetMapping("/recent")
    public List<PlayerStats> getRecentSearches(){

        return playerStatsRepository
                .findTop20ByOrderByCreatedAtDesc();
    }
}