package com.gamestats.platform.integration.controller;

import com.gamestats.platform.integration.dto.CompareResponse;
import com.gamestats.platform.integration.dto.ConnectGameRequest;
import com.gamestats.platform.integration.dto.ConnectResponse;
import com.gamestats.platform.integration.dto.GamePlayerStatsResponse;
import com.gamestats.platform.integration.service.GameIntegrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.gamestats.platform.model.ConnectedAccount;

import java.util.List;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
public class GameIntegrationController {

    private final GameIntegrationService gameIntegrationService;

    /* =========================
      GET CONNECTED GAMES
   ========================= */
    @GetMapping("/connected")
    public List<ConnectedAccount> getConnectedGames(
            Authentication authentication
    ) {

        String username = authentication.getName();

        return gameIntegrationService.getConnectedGames(
                username
        );
    }


    // =========================================================
    // PLAYER STATS
    // =========================================================

    @GetMapping("/{game}/player/{playerName}")
    public GamePlayerStatsResponse getPlayerStats(
            @PathVariable String game,
            @PathVariable String playerName) {

        return gameIntegrationService.getPlayerStats(
                game,
                playerName
        );
    }


    // =========================================================
    // COMPARE PLAYERS
    // =========================================================

    @GetMapping("/compare/{game}/{player1}/{player2}")
    public CompareResponse comparePlayers(
            @PathVariable String game,
            @PathVariable String player1,
            @PathVariable String player2) {

        return gameIntegrationService.comparePlayers(
                game,
                player1,
                player2
        );
    }


    // =========================================================
    // CONNECT GAME
    // =========================================================

    @PostMapping("/{game}/connect")
    public ResponseEntity<ConnectResponse> connectGame(
            @PathVariable String game,
            @RequestBody ConnectGameRequest request,
            Authentication authentication) {

        String username = authentication.getName();

        ConnectResponse response =
                gameIntegrationService.connectGame(
                        username,
                        game,
                        request.getPlayerName()
                );

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // DISCONNECT GAME
    // =========================================================

    @DeleteMapping("/{game}/disconnect")
    public ResponseEntity<Void> disconnectGame(
            @PathVariable String game,
            Authentication authentication) {

        String username = authentication.getName();

        gameIntegrationService.disconnectGame(
                username,
                game
        );

        return ResponseEntity.ok().build();
    }
}