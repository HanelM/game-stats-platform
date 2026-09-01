package com.gamestats.platform.integration.lol.dto;

import lombok.Data;

@Data
public class LeagueSummonerResponse {

    private String id;

    private String accountId;

    private String puuid;

    private Integer profileIconId;

    private Long revisionDate;

    private Integer summonerLevel;
}