package com.gamestats.platform.controller;

import com.gamestats.platform.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.Map;

@Tag(
        name = "Leaderboard Controller",
        description = "Global player rankings and leaderboard system"
)
@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @Operation(
            summary = "Get leaderboard",
            description = "Returns top players ranked by wins, score or statistics."
    )
    @GetMapping
    public List<Map<String, Object>> getLeaderboard() {
        return leaderboardService.getLeaderboard();
    }
}