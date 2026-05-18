package com.gamestats.platform.integration.dto;

import lombok.Data;

@Data
public class ComparisonHistoryRequest {

    private String game;
    private String player1Name;
    private String player2Name;
    private String betterPlayer;
}