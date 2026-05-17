package com.gamestats.platform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {

    private long totalMatches;

    private long wins;

    private long losses;

    private double winRate;

    private int totalKills;

    private int totalDeaths;

    private double kdRatio;

    private int bestScore;

    private double averageScore;
}