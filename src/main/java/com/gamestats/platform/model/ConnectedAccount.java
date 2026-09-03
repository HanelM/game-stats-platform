package com.gamestats.platform.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "connected_accounts")
public class ConnectedAccount {

    @Id
    private String id;

    private String username;

    private String game;

    private String accountName;

    private String riotId;

    private String puuid;

    private String platform;

    private String region;

    private boolean connected;

    private LocalDateTime connectedAt;
}