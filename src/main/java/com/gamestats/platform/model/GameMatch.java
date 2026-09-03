package com.gamestats.platform.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "game_matches")
public class GameMatch {

    @Id
    private String id;

    private String playerUsername;

    private String gameName;

    private String source;
    private String connectedAccount;
    private String externalMatchId;
    private String platform;

    /* =========================
       COMMON
    ========================= */

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