package com.gamestats.platform.integration.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComparisonHistoryResponse {

    private String game;
    private String player1Name;
    private String player2Name;
    private String betterPlayer;
    private LocalDateTime comparedAt;
}