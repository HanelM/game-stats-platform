package com.gamestats.platform.integration.controller;

import com.gamestats.platform.integration.entity.ComparisonHistory;
import com.gamestats.platform.integration.service.ComparisonHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import com.gamestats.platform.integration.dto.ComparisonHistoryResponse;
import com.gamestats.platform.integration.dto.ComparisonHistoryRequest;


import java.util.List;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class ComparisonHistoryController {

    private final ComparisonHistoryService comparisonHistoryService;

    @PostMapping
    public ComparisonHistoryResponse saveComparison(
            @RequestBody ComparisonHistoryRequest request,
            Authentication authentication
    ) {

        ComparisonHistory history = ComparisonHistory.builder()
                .username(authentication.getName())
                .game(request.getGame())
                .player1Name(request.getPlayer1Name())
                .player2Name(request.getPlayer2Name())
                .betterPlayer(request.getBetterPlayer())
                .comparedAt(java.time.LocalDateTime.now())
                .build();

        ComparisonHistory saved =
                comparisonHistoryService.saveComparison(history);

        return ComparisonHistoryResponse.builder()
                .game(history.getGame())
                .player1Name(history.getPlayer1Name())
                .player2Name(history.getPlayer2Name())
                .betterPlayer(history.getBetterPlayer())
                .comparedAt(history.getComparedAt())
                .build();

    }

    @GetMapping("/history")
    public Page<ComparisonHistoryResponse> getHistory(
            Authentication authentication,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "5")
            int size
    ) {

        return comparisonHistoryService
                .getUserHistory(
                        authentication.getName(),
                        page,
                        size
                );
    }
}