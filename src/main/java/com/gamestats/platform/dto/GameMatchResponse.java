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

    /*
     * MANUAL = manually entered match
     * API    = imported from connected game account
     */
    private String source;

    /*
     * The external account used for online/API matches.
     * Example:
     * PUBG -> shroud
     * LoL  -> PlayerName#EUW
     * TFT  -> PlayerName#EUW
     */
    private String connectedAccount;

    private Integer score;

    private Integer kills;

    private Integer deaths;

    private Boolean win;

    private LocalDateTime playedAt;


    /* =========================
       PUBG
    ========================= */

    private Integer placement;

    private Integer damage;

    private String survivalTime;


    /* =========================
       CS2 / VALORANT
    ========================= */

    private Integer assists;

    private Integer headshots;


    /* =========================
       VALORANT
    ========================= */

    private Integer combatScore;


    /* =========================
       LEAGUE OF LEGENDS
    ========================= */

    private Integer cs;

    private Integer gold;
}