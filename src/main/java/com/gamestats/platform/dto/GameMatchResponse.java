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
}