package com.gamestats.platform.integration.lol.dto;

import lombok.Data;

@Data
public class LolLeagueEntryResponse {

    private String leagueId;

    private String summonerId;

    private String summonerName;

    private String queueType;

    private String tier;

    private String rank;

    private Integer leaguePoints;

    private Integer wins;

    private Integer losses;

    private Boolean veteran;

    private Boolean inactive;

    private Boolean freshBlood;

    private Boolean hotStreak;
}