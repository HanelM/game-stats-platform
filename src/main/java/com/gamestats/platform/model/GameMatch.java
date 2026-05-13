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

    private Integer score;

    private Integer kills;

    private Integer deaths;

    private Boolean win;

    private LocalDateTime playedAt;
}