package com.gamestats.platform.controller;

import com.gamestats.platform.dto.GameMatchRequest;
import com.gamestats.platform.dto.MatchStatsResponse;
import com.gamestats.platform.dto.AnalyticsResponse;
import com.gamestats.platform.model.GameMatch;
import com.gamestats.platform.service.GameMatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;

import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import com.gamestats.platform.dto.GameMatchResponse;

import java.time.LocalDate;
import java.util.List;

@Tag(
        name = "Match Controller",
        description = "Game match management and player match history endpoints"
)
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class GameMatchController {
    private final GameMatchService gameMatchService;

    // =========================
    // SAVE MATCH
    // =========================
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

    // =========================
    // PAGINATION
    // =========================
    @Operation(
            summary = "Get player matches",
            description = "Returns all matches played by the authenticated player."
    )
    @GetMapping("/my")
    public Page<GameMatch> getMyMatches(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "5")
            int size,

            @RequestParam(defaultValue = "playedAt")
            String sortBy,

            Authentication authentication
    ) {

        return gameMatchService.getPlayerMatches(

                authentication.getName(),

                page,

                size,

                sortBy
        );
    }
    // =========================
    // STATS
    // =========================

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

    // =========================
    // SEARCH
    // =========================
    @Operation(
            summary = "Search player matches",
            description = "Filter matches by game name, win status, minimum score and sorting."
    )
    @GetMapping("/search")
    public List<GameMatchResponse> searchMatches(

            @RequestParam(required = false)
            String gameName,

            @RequestParam(required = false)
            Boolean win,

            @RequestParam(required = false)
            Integer minScore,

            @RequestParam(defaultValue = "playedAt")
            String sortBy,

            Authentication authentication
    ) {

        return gameMatchService.searchMatches(
                authentication.getName(),
                gameName,
                win,
                minScore,
                sortBy
        );
    }
    // =========================
    // ANALYTICS
    // =========================
    @Operation(
            summary = "Get player analytics",
            description = "Returns advanced analytics for authenticated player."
    )
    @GetMapping("/analytics")
    public AnalyticsResponse getAnalytics(
            Authentication authentication
    ) {

        return gameMatchService.getAnalytics(
                authentication.getName()
        );
    }
    @Operation(
            summary = "Filter matches",
            description = "Filter matches by game name, win status, minimum score and sorting."
    )
    @GetMapping("/filter")
    public List<GameMatchResponse>  filterMatches(

            @RequestParam(required = false)
            String gameName,

            @RequestParam(required = false)
            Boolean win,

            @RequestParam(required = false)
            Integer minScore,

            @RequestParam(required = false)
            String sortBy,

            Authentication authentication
    ) {

        return gameMatchService.searchMatches(

                authentication.getName(),

                gameName,

                win,

                minScore,

                sortBy
        );
    }


    // =========================
    // DATE FILTER (FIXED SWAGGER)
    // =========================
    @Operation(
            summary = "Get matches between dates",
            description = "Returns matches between selected date range."
    )
    @GetMapping("/filter/date")
    public List<GameMatchResponse> filter(

            @Parameter(
                    description = "Start date (format: yyyy-MM-dd)",
                    example = "2026-05-17",
                    required = true,
                    schema = @Schema(type = "string", format = "date")
            )
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate from,

            @Parameter(
                    description = "End date (format: yyyy-MM-dd)",
                    example = "2026-05-17",
                    required = true,
                    schema = @Schema(type = "string", format = "date")
            )
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate to,

            Authentication authentication
    ) {
        return gameMatchService.getMatchesBetweenDates(
                authentication.getName(),
                from,
                to
        );
    }
}