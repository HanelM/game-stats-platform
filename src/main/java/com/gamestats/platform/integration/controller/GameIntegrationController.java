package com.gamestats.platform.integration.controller;

import com.gamestats.platform.integration.dto.GamePlayerStatsResponse;
import com.gamestats.platform.integration.service.GameIntegrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.gamestats.platform.integration.dto.CompareResponse;


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
    @GetMapping("/compare/{game}/{player1}/{player2}")
    public CompareResponse comparePlayers(
            @PathVariable String game,
            @PathVariable String player1,
            @PathVariable String player2
    ){

        return gameIntegrationService.comparePlayers(
                game,
                player1,
                player2
        );
    }
}