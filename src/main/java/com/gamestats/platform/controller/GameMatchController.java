package com.gamestats.platform.controller;

import com.gamestats.platform.dto.GameMatchRequest;
import com.gamestats.platform.dto.MatchStatsResponse;
import com.gamestats.platform.model.GameMatch;
import com.gamestats.platform.service.GameMatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class GameMatchController {

    private final GameMatchService gameMatchService;

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

    @GetMapping("/my")
    public List<GameMatch> getMyMatches(
            Authentication authentication
    ) {

        return gameMatchService.getPlayerMatches(
                authentication.getName()
        );
    }

    @GetMapping("/stats")
    public MatchStatsResponse getMyStats(
            Authentication authentication
    ) {

        return gameMatchService.getPlayerStats(
                authentication.getName()
        );
    }
}