package com.gamestats.platform.integration.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GamePlayerStatsResponse {

    private String game;

    private String playerName;

    private Double kd;

    private Integer wins;

    private Integer kills;

    private Integer matches;

    private String rank;

    private Double averageDamage;

    private Double averageSurvivalTime;

    private Integer losses;

    private Double winRate;

    private Integer deaths;

    private Integer assists;

    private Double averageKda;

    private Double averagePlacement;

    private Integer firstPlaces;

    private Integer topFour;

    private Double topFourRate;

    private Integer leaguePoints;
}