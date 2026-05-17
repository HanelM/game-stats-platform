package com.gamestats.platform.controller;

import com.gamestats.platform.dto.GameMatchRequest;
import com.gamestats.platform.dto.MatchStatsResponse;
import com.gamestats.platform.model.GameMatch;
import com.gamestats.platform.service.GameMatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(
        name = "Match Controller",
        description = "Game match management and player match history endpoints"
)
@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class GameMatchController {
    private final GameMatchService gameMatchService;

    @Operation(
            summary = "Save new match",
            description = "Creates and stores a new game match for the authenticated player."
    )
    @PostMapping
    public GameMatch saveMatch(
            @Valid @RequestBody GameMatchRequest request,
            Authentication authentication
    ) {

        return gameMatchService.saveMatch(
                request,
                authentication.getName()
        );
    }

    @Operation(
            summary = "Get player matches",
            description = "Returns all matches played by the authenticated player."
    )
    @GetMapping("/my")
    public List<GameMatch> getMyMatches(
            Authentication authentication
    ) {

        return gameMatchService.getPlayerMatches(
                authentication.getName()
        );
    }

    @Operation(
            summary = "Get player statistics",
            description = "Returns total matches, wins, losses, win rate, average kills and K/D ratio for authenticated player."
    )
    @GetMapping("/stats")
    public MatchStatsResponse getMyStats(
            Authentication authentication
    ) {

        return gameMatchService.getPlayerStats(
                authentication.getName()
        );
    }
}