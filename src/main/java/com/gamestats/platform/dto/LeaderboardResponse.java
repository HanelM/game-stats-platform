package com.gamestats.platform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LeaderboardResponse {

    private String username;
    private int kills;
    private int wins;
    private double kdRatio;
}