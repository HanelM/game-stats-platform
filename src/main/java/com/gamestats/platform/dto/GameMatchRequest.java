package com.gamestats.platform.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GameMatchRequest {

    @NotBlank(message = "Game name is required")
    private String gameName;

    @NotNull(message = "Score is required")
    @Min(value = 0, message = "Score cannot be negative")
    private Integer score;

    @NotNull(message = "Kills is required")
    @Min(value = 0, message = "Kills cannot be negative")
    private Integer kills;

    @NotNull(message = "Deaths is required")
    @Min(value = 0, message = "Deaths cannot be negative")
    private Integer deaths;

    @NotNull(message = "Win status is required")
    private Boolean win;
}