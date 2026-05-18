package com.gamestats.platform.integration.controller;

import com.gamestats.platform.integration.dto.GamePlayerStatsResponse;
import com.gamestats.platform.integration.service.GameIntegrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
public class GameIntegrationController {

    private final GameIntegrationService
            gameIntegrationService;

    @GetMapping("/{game}/player/{playerName}")
    public GamePlayerStatsResponse getPlayerStats(

            @PathVariable String game,

            @PathVariable String playerName
    ) {

        return gameIntegrationService
                .getPlayerStats(
                        game,
                        playerName
                );
    }
}