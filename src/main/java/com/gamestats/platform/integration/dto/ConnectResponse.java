package com.gamestats.platform.integration.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ConnectResponse {

    private String game;

    private String playerName;

    private int importedMatches;

    private boolean connected;

    private String message;
}