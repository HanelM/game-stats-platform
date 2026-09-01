package com.gamestats.platform.integration.tft.dto;

import lombok.Data;

@Data
public class TftRankedResponse {

    private String queueType;

    private String tier;

    private String rank;

    private int leaguePoints;

    private int wins;

    private int losses;

    private boolean veteran;

    private boolean inactive;

    private boolean freshBlood;

    private boolean hotStreak;
}