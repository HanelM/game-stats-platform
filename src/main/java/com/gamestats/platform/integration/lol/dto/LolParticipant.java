package com.gamestats.platform.integration.lol.dto;

import lombok.Data;

@Data
public class LolParticipant {

    private String puuid;

    private String summonerName;

    private Integer kills;

    private Integer deaths;

    private Integer assists;

    private Integer totalDamageDealtToChampions;

    private Boolean win;

    private Integer championLevel;

    private Integer timePlayed;
}