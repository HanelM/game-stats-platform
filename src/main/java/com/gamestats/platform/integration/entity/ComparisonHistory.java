package com.gamestats.platform.integration.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "comparison_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComparisonHistory {

    @Id
    private String id;

    private String username;

    private String game;

    private String player1Name;

    private String player2Name;

    private String betterPlayer;

    private LocalDateTime comparedAt;
}