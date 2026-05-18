package com.gamestats.platform.integration.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "player_stats")
@Data
public class PlayerStats {

    @Id
    private String id;

    private String game;

    private String playerName;

    private double kd;

    private int wins;

    private int kills;

    private int matches;

    private String rank;

    private double averageDamage;

    private double averageSurvivalTime;

    private LocalDateTime createdAt;
}