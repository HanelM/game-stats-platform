package com.gamestats.platform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MatchStatsResponse {

    private int totalMatches;
    private int totalWins;
    private int totalLosses;
    private double winRate;
}