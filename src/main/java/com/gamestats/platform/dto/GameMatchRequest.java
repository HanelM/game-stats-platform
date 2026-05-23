package com.gamestats.platform.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Schema(description = "Request object for creating a game match")
public class GameMatchRequest {

    @NotBlank(message = "Game name is required")
    private String gameName;


    @Min(value = 0)
    private Integer score;

    @NotNull(message = "Kills is required")
    @Min(value = 0)
    private Integer kills;

    @NotNull(message = "Deaths is required")
    @Min(value = 0)
    private Integer deaths;

    @NotNull(message = "Win status is required")
    private Boolean win;

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