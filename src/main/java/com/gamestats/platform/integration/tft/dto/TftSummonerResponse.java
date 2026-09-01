package com.gamestats.platform.integration.tft.dto;

import lombok.Data;

@Data
public class TftSummonerResponse {

    private String id;

    private String accountId;

    private String puuid;

    private int profileIconId;

    private long revisionDate;

    private long summonerLevel;
}