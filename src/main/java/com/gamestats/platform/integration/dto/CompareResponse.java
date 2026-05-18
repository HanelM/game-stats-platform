package com.gamestats.platform.integration.dto;

import lombok.Data;

@Data
public class CompareResponse {

    private GamePlayerStatsResponse player1;

    private GamePlayerStatsResponse player2;

    private String betterPlayer;
}