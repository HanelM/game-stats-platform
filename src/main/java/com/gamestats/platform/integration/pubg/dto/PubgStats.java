package com.gamestats.platform.integration.pubg.dto;

import lombok.Data;

@Data
public class PubgStats {

    private Integer kills;

    private Double damageDealt;

    private Integer winPlace;

    private Double timeSurvived;
    private String name;
}