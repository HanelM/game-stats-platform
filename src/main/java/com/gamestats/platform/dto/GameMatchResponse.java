package com.gamestats.platform.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class GameMatchResponse {

    private String id;

    private String playerUsername;

    private String gameName;

    private int score;

    private int kills;

    private int deaths;

    private boolean win;

    private LocalDateTime playedAt;

    /* PUBG */

    private Integer placement;

    private Integer damage;

    private String survivalTime;

    /* CS2 / VALORANT */

    private Integer assists;

    private Integer headshots;

    /* VALORANT */

    private Integer combatScore;

    /* LEAGUE OFLEGENDS */

    private Integer cs;

    private Integer gold;
}