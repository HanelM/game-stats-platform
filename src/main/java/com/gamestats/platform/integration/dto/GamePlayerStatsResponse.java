package com.gamestats.platform.integration.dto;

import lombok.Data;

@Data
public class GamePlayerStatsResponse {

    private String game;

    private String playerName;

    private double kd;

    private int wins;

    private int kills;

    private int matches;

    private String rank;
    private double averageDamage;
    private double averageSurvivalTime;
}