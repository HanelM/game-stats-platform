package com.gamestats.platform.integration.lol.dto;

import lombok.Data;

@Data
public class LolLeagueEntryResponse {

    private String leagueId;
    private String summonerId;
    private String queueType;
    private String tier;
    private String rank;
    private int leaguePoints;
    private int wins;
    private int losses;
}